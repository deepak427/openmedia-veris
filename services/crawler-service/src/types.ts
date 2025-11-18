// Re-export shared types
export type {
  RawContentItem,
  ProcessedContentItem,
  StoredRecord,
  ContentMetadata,
  ExtractedFromInfo,
} from '@veris/shared';

/**
 * Crawler configuration
 */
export interface CrawlerConfig {
  name: string;
  enabled: boolean;
  intervalMs: number;
}

/**
 * Reddit-specific post data
 */
export interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  url: string;
  author: string;
  created_utc: number;
  subreddit: string;
  score: number;
}
