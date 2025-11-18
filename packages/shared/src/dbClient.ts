import { Pool, QueryResult as PgQueryResult } from 'pg';

/**
 * Database Client using Neon PostgreSQL
 * Production-ready PostgreSQL implementation
 */

interface QueryResult {
  rows?: Array<Record<string, unknown>>;
  rowCount?: number;
  error?: string;
}

export class NeonDatabaseClient {
  private pool: Pool | null = null;
  private projectId = '';
  private databaseName = '';
  private connected = false;

  /**
   * Connect to Neon database
   * @param projectId - Neon project ID
   * @param databaseName - Database name (optional, defaults to 'neondb')
   */
  async connect(projectId: string, databaseName = 'neondb'): Promise<void> {
    this.projectId = projectId;
    this.databaseName = databaseName;

    // Get connection string from environment or construct it
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is required');
    }

    this.pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    this.connected = true;
  }

  /**
   * Execute SQL query
   * @param sql - SQL query string
   * @param params - Query parameters (not used with string interpolation)
   */
  async query(sql: string, _params?: unknown[]): Promise<QueryResult> {
    if (!this.connected || !this.pool) {
      throw new Error('Database client not connected');
    }

    try {
      const result: PgQueryResult = await this.pool.query(sql);
      return {
        rows: result.rows as Array<Record<string, unknown>>,
        rowCount: result.rowCount || 0,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Execute multiple SQL statements in a transaction
   */
  async transaction(sqlStatements: string[]): Promise<QueryResult> {
    if (!this.connected || !this.pool) {
      throw new Error('Database client not connected');
    }

    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      
      let lastResult: PgQueryResult | null = null;
      for (const sql of sqlStatements) {
        lastResult = await client.query(sql);
      }
      
      await client.query('COMMIT');
      
      return {
        rows: lastResult?.rows as Array<Record<string, unknown>> || [],
        rowCount: lastResult?.rowCount || 0,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      return {
        error: error instanceof Error ? error.message : String(error),
      };
    } finally {
      client.release();
    }
  }

  /**
   * Close database connection
   */
  async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
    this.connected = false;
  }

  /**
   * Get project ID
   */
  getProjectId(): string {
    return this.projectId;
  }

  /**
   * Get database name
   */
  getDatabaseName(): string {
    return this.databaseName;
  }
}

export const dbClient = new NeonDatabaseClient();
