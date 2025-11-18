import axios from 'axios';
import { RawContentItem, RedditPost } from '../types';
import { logger, withErrorHandling } from '../utils/logger';

/**
 * Reddit Crawler
 * Crawls Reddit posts from specified subreddits
 */
export class RedditCrawler {
  private subreddits: string[];
  private baseUrl = 'https://www.reddit.com';

  constructor(subreddits: string[] = ['news', 'worldnews', 'politics']) {
    this.subreddits = subreddits;
  }

  /**
   * Crawl all configured subreddits
   */
  async crawl(): Promise<RawContentItem[]> {
    logger.info('Starting Reddit crawl', { subredditCount: this.subreddits.length });
    const results: RawContentItem[] = [];

    for (const subreddit of this.subreddits) {
      const items = await withErrorHandling(
        () => this.crawlSubreddit(subreddit),
        `Reddit crawl: r/${subreddit}`
      );
      if (items) {
        results.push(...items);
      }
    }

    logger.info('Reddit crawl completed', { itemsFound: results.length });
    return results;
  }

  /**
   * Crawl a single subreddit
   */
  private async crawlSubreddit(subreddit: string, limit: number = 25): Promise<RawContentItem[]> {
    const url = `${this.baseUrl}/r/${subreddit}/hot.json?limit=${limit}`;

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Veris/1.0',
      },
    });

    const posts: RedditPost[] = response.data.data.children.map((child: any) => child.data);
    const items: RawContentItem[] = [];

    for (const post of posts) {
      const item = this.convertPostToRawContent(post, subreddit);
      items.push(item);
    }

    return items;
  }

  /**
   * Convert Reddit post to RawContentItem
   */
  private convertPostToRawContent(post: RedditPost, subreddit: string): RawContentItem {
    const contentType = this.determineContentType(post);
    const images = this.extractImages(post);
    const videos = this.extractVideos(post);

    return {
      source: `Reddit - r/${subreddit}`,
      url: `${this.baseUrl}${post.url}`,
      contentType,
      rawText: `${post.title}\n\n${post.selftext}`,
      images: images.length > 0 ? images : undefined,
      videos: videos.length > 0 ? videos : undefined,
      metadata: {
        title: post.title,
        author: post.author,
        publishedAt: new Date(post.created_utc * 1000),
        tags: [subreddit],
        score: post.score,
        postId: post.id,
      },
    };
  }

  /**
   * Determine content type from post
   */
  private determineContentType(post: RedditPost): 'text' | 'image' | 'video' | 'mixed' {
    const hasText = post.selftext && post.selftext.length > 0;
    const hasImage = post.url.match(/\.(jpg|jpeg|png|gif|webp)$/i);
    const hasVideo = post.url.includes('v.redd.it') || post.url.includes('youtube.com');

    if (hasVideo && hasText) return 'mixed';
    if (hasImage && hasText) return 'mixed';
    if (hasVideo) return 'video';
    if (hasImage) return 'image';
    return 'text';
  }

  /**
   * Extract image URLs from post
   */
  private extractImages(post: RedditPost): string[] {
    const images: string[] = [];

    if (post.url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      images.push(post.url);
    }

    return images;
  }

  /**
   * Extract video URLs from post
   */
  private extractVideos(post: RedditPost): string[] {
    const videos: string[] = [];

    if (post.url.includes('v.redd.it') || post.url.includes('youtube.com')) {
      videos.push(post.url);
    }

    return videos;
  }
}
