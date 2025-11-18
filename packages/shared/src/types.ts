/**
 * Raw content item from crawlers before processing
 */
export interface RawContentItem {
  source: string;
  url: string;
  contentType: 'text' | 'image' | 'video' | 'mixed';
  rawText?: string;
  images?: string[];
  videos?: string[];
  metadata: ContentMetadata;
}

/**
 * Content metadata structure
 */
export interface ContentMetadata {
  title?: string;
  author?: string;
  publishedAt?: Date;
  tags?: string[];
  [key: string]: unknown;
}

/**
 * Processed content after AI claim extraction
 */
export interface ProcessedContentItem {
  claim: string;
  category: string;
  confidence: number;
  extractedFrom: ExtractedFromInfo;
}

/**
 * Information about where claim was extracted from
 */
export interface ExtractedFromInfo {
  contentType: string;
  sourceUrl: string;
}

/**
 * Final stored record combining raw and processed data
 */
export interface StoredRecord extends RawContentItem, ProcessedContentItem {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
