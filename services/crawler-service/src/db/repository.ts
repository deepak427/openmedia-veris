import { dbClient } from '@veris/shared';
import type { RawContentItem, ProcessedContentItem, StoredRecord } from '../types';
import { logger, withErrorHandling } from '../utils/logger';

/**
 * Database Repository
 * Handles all database operations for storing crawled and processed content
 */
export class Repository {
  private initialized = false;

  /**
   * Initialize database connection and schema
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    logger.info('Initializing database connection');

    const projectId = process.env.NEON_PROJECT_ID || '';
    const databaseName = process.env.NEON_DATABASE_NAME || 'neondb';

    if (!projectId) {
      throw new Error('NEON_PROJECT_ID environment variable is required');
    }

    await dbClient.connect(projectId, databaseName);
    await this.createSchema();

    this.initialized = true;
    logger.info('Database initialized successfully', { projectId, databaseName });
  }

  /**
   * Create database schema (PostgreSQL)
   */
  private async createSchema(): Promise<void> {
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS crawled_content (
        id TEXT PRIMARY KEY,
        source TEXT NOT NULL,
        url TEXT NOT NULL UNIQUE,
        content_type TEXT NOT NULL,
        raw_text TEXT,
        images JSONB,
        videos JSONB,
        metadata JSONB,
        claim TEXT,
        category TEXT,
        confidence REAL,
        extracted_from JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createIndexes = [
      'CREATE INDEX IF NOT EXISTS idx_source ON crawled_content(source)',
      'CREATE INDEX IF NOT EXISTS idx_category ON crawled_content(category)',
      'CREATE INDEX IF NOT EXISTS idx_created_at ON crawled_content(created_at)',
    ];

    // Create table
    await withErrorHandling(
      () => dbClient.query(createTableSql),
      'Database table creation'
    );

    // Create indexes
    for (const indexSql of createIndexes) {
      await withErrorHandling(
        () => dbClient.query(indexSql),
        'Database index creation'
      );
    }
  }

  /**
   * Save processed content to database
   */
  async save(
    rawContent: RawContentItem,
    processedContent: ProcessedContentItem
  ): Promise<void> {
    const id = this.generateId(rawContent.url);

    const record: StoredRecord = {
      ...rawContent,
      ...processedContent,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const escapeSql = (value: string): string => value.replace(/'/g, "''");

    const sql = `
      INSERT INTO crawled_content (
        id, source, url, content_type, raw_text, images, videos, metadata,
        claim, category, confidence, extracted_from, created_at, updated_at
      ) VALUES (
        '${escapeSql(id)}',
        '${escapeSql(record.source)}',
        '${escapeSql(record.url)}',
        '${escapeSql(record.contentType)}',
        ${record.rawText ? `'${escapeSql(record.rawText)}'` : 'NULL'},
        ${record.images ? `'${JSON.stringify(record.images)}'::jsonb` : 'NULL'},
        ${record.videos ? `'${JSON.stringify(record.videos)}'::jsonb` : 'NULL'},
        '${JSON.stringify(record.metadata)}'::jsonb,
        '${escapeSql(record.claim)}',
        '${escapeSql(record.category)}',
        ${record.confidence},
        '${JSON.stringify(record.extractedFrom)}'::jsonb,
        '${record.createdAt.toISOString()}',
        '${record.updatedAt.toISOString()}'
      )
      ON CONFLICT (url) DO UPDATE SET
        raw_text = EXCLUDED.raw_text,
        images = EXCLUDED.images,
        videos = EXCLUDED.videos,
        metadata = EXCLUDED.metadata,
        claim = EXCLUDED.claim,
        category = EXCLUDED.category,
        confidence = EXCLUDED.confidence,
        extracted_from = EXCLUDED.extracted_from,
        updated_at = EXCLUDED.updated_at
    `;

    await withErrorHandling(
      () => dbClient.query(sql),
      `Save record: ${record.url}`
    );

    logger.info('Record saved', { id: record.id, url: record.url });
  }

  /**
   * Batch save multiple records
   */
  async saveBatch(
    rawContents: RawContentItem[],
    processedMap: Map<string, ProcessedContentItem[]>
  ): Promise<void> {
    for (const rawContent of rawContents) {
      const processedItems = processedMap.get(rawContent.url) || [];

      for (const processedItem of processedItems) {
        await this.save(rawContent, processedItem);
      }
    }
  }

  /**
   * Check if URL already exists
   */
  async exists(url: string): Promise<boolean> {
    const escapeSql = (value: string): string => value.replace(/'/g, "''");
    const sql = `SELECT COUNT(*) as count FROM crawled_content WHERE url = '${escapeSql(url)}'`;
    const result = await dbClient.query(sql);
    return (result?.rows?.[0]?.count as number) > 0;
  }

  /**
   * Generate unique ID from URL
   */
  private generateId(url: string): string {
    return Buffer.from(url).toString('base64').substring(0, 32);
  }

  /**
   * Close database connection
   */
  async close(): Promise<void> {
    await dbClient.disconnect();
    this.initialized = false;
    logger.info('Database connection closed');
  }
}
