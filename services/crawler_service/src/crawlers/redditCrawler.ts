import axios from 'axios';
import { RawContentItem } from '../types';
import { logger, withErrorHandling } from '../utils/logger';

/**
 * Reddit Crawler
 * Crawls Reddit posts from specified subreddits
 */
export class RedditCrawler {
  private subreddits: string[];

  constructor(subreddits: string[]) {
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
  private async crawlSubreddit(subreddit: string): Promise<RawContentItem[]> {
    // Use Reddit JSON API (no auth needed for public posts)
    const url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=25`;
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Veris-Crawler/1.0',
      },
      timeout: 15000,
    });

    const posts = response.data.data.children;
    const items: RawContentItem[] = [];

    for (const post of posts) {
      const data = post.data;

      // Skip removed/deleted posts
      if (data.removed_by_category || data.author === '[deleted]') {
        continue;
      }

      // Combine title and selftext for text posts
      const content = data.selftext 
        ? `${data.title}\n\n${data.selftext}`
        : data.title;

      // Skip if too short
      if (content.length < 50) {
        continue;
      }

      const item: RawContentItem = {
        source: `Reddit - r/${subreddit}`,
        url: `https://www.reddit.com${data.permalink}`,
        contentType: 'text',
        rawText: content,
        metadata: {
          title: data.title,
          author: data.author,
          publishedAt: new Date(data.created_utc * 1000),
          tags: [subreddit, `score:${data.score}`],
        },
      };

      items.push(item);
    }

    logger.info(`Crawled r/${subreddit}`, { postsFound: items.length });
    return items;
  }
}
