/**
 * Raw content item from RSS feed
 */
export interface RawContentItem {
  source: string;
  url: string;
  contentType: 'text' | 'image' | 'video';
  rawText?: string;
  images?: string[];
  videos?: string[];
  metadata: ContentMetadata;
}

/**
 * Content metadata
 */
export interface ContentMetadata {
  title?: string;
  author?: string;
  publishedAt?: Date;
  tags?: string[];
}
