import Parser from 'rss-parser';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { RawContentItem } from '../types';
import { logger, withErrorHandling } from '../utils/logger';

/**
 * RSS Feed Crawler
 * Crawls RSS feeds from trusted news sources and extracts content
 */
export class RSSCrawler {
  private parser: Parser;
  private feedUrls: string[];

  constructor(feedUrls: string[]) {
    this.parser = new Parser({
      customFields: {
        item: ['media:content', 'media:thumbnail', 'enclosure'],
      },
    });
    this.feedUrls = feedUrls;
  }

  /**
   * Crawl all configured RSS feeds
   */
  async crawl(): Promise<RawContentItem[]> {
    logger.info('Starting RSS crawl', { feedCount: this.feedUrls.length });
    const results: RawContentItem[] = [];

    for (const feedUrl of this.feedUrls) {
      const items = await withErrorHandling(
        () => this.crawlFeed(feedUrl),
        `RSS crawl: ${feedUrl}`
      );
      if (items) {
        results.push(...items);
      }
    }

    logger.info('RSS crawl completed', { itemsFound: results.length });
    return results;
  }

  /**
   * Crawl a single RSS feed
   */
  private async crawlFeed(feedUrl: string): Promise<RawContentItem[]> {
    const feed = await this.parser.parseURL(feedUrl);
    const items: RawContentItem[] = [];

    for (const entry of feed.items) {
      if (!entry.link) continue;

      // Extract full article content
      const fullContent = await this.extractArticleContent(entry.link);

      const item: RawContentItem = {
        source: feed.title || feedUrl,
        url: entry.link,
        contentType: 'text',
        rawText: fullContent || entry.contentSnippet || entry.content || '',
        images: this.extractImages(entry),
        metadata: {
          title: entry.title,
          author: entry.creator || entry.author,
          publishedAt: entry.pubDate ? new Date(entry.pubDate) : new Date(),
          tags: entry.categories || [],
        },
      };

      items.push(item);
    }

    return items;
  }

  /**
   * Extract clean article content from URL
   */
  private async extractArticleContent(url: string): Promise<string | null> {
    try {
      const response = await axios.get(url, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Veris/1.0)',
        },
      });

      const $ = cheerio.load(response.data);

      // Remove unwanted elements
      $('script, style, nav, header, footer, aside, iframe, .ad, .advertisement, .social-share, .related-articles, .comments').remove();

      // Try common article selectors in order of specificity
      const selectors = [
        'article',
        '[role="article"]',
        '.article-body',
        '.article-content',
        '.post-content',
        '.entry-content',
        'main article',
        'main',
      ];

      for (const selector of selectors) {
        const element = $(selector);
        if (element.length > 0) {
          // Extract text from paragraphs to maintain structure
          const paragraphs = element.find('p').map((_, el) => $(el).text().trim()).get();
          const content = paragraphs.join('\n\n');
          
          if (content.length > 200) {
            return this.cleanText(content);
          }
        }
      }

      // Fallback: get all paragraphs from body
      const allParagraphs = $('body p').map((_, el) => $(el).text().trim()).get();
      const fallbackContent = allParagraphs.join('\n\n');
      
      return fallbackContent.length > 100 ? this.cleanText(fallbackContent) : null;
    } catch (error) {
      logger.warn('Failed to extract article content', { url, error });
      return null;
    }
  }

  /**
   * Clean extracted text
   */
  private cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ')           // Multiple spaces to single
      .replace(/\n\s*\n/g, '\n\n')    // Multiple newlines to double
      .trim()
      .substring(0, 5000);             // Limit to 5000 chars
  }

  /**
   * Extract image URLs from RSS entry
   */
  private extractImages(entry: any): string[] {
    const images: string[] = [];

    if (entry.enclosure?.url && entry.enclosure.type?.startsWith('image/')) {
      images.push(entry.enclosure.url);
    }

    if (entry['media:content']) {
      const media = Array.isArray(entry['media:content'])
        ? entry['media:content']
        : [entry['media:content']];
      media.forEach((m: any) => {
        if (m.$ && m.$.url) images.push(m.$.url);
      });
    }

    return images;
  }
}
