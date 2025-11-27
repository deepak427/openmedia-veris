import dotenv from 'dotenv';
import { RSSCrawler } from './crawlers/rssCrawler';
import { RedditCrawler } from './crawlers/redditCrawler';
import { ADKAgentClient } from './agents/claimExtractorAgent';
import { logger } from './utils/logger';

dotenv.config();

/**
 * Main Crawler Service Application
 * Crawls RSS feeds and Reddit, sends content to ADK agent for processing
 */
class CrawlerService {
  private rssCrawler: RSSCrawler;
  private redditCrawler: RedditCrawler;
  private adkClient: ADKAgentClient;
  private intervalMs: number;
  private processedUrls: Set<string>;

  constructor() {
    const rssFeeds = process.env.RSS_FEEDS?.split(',') || [
      'https://feeds.bbci.co.uk/news/rss.xml',
      'https://timesofindia.indiatimes.com/rssfeedstopstories.cms',
      'https://www.theguardian.com/world/rss',
    ];

    const subreddits = process.env.REDDIT_SUBREDDITS?.split(',') || [
      'worldnews',
      'news',
      'india',
    ];

    this.rssCrawler = new RSSCrawler(rssFeeds);
    this.redditCrawler = new RedditCrawler(subreddits);
    this.adkClient = new ADKAgentClient();
    this.intervalMs = parseInt(process.env.CRAWL_INTERVAL_MS || '300000', 10);
    this.processedUrls = new Set<string>();
  }

  async initialize(): Promise<void> {
    logger.info('Initializing Crawler Service');
    
    const adkUrl = process.env.ADK_AGENT_URL;
    if (!adkUrl) {
      throw new Error('ADK_AGENT_URL environment variable is required');
    }
    
    logger.info('Crawler Service initialized', { adkUrl });
  }

  async runCrawlCycle(): Promise<void> {
    logger.info('Starting crawl cycle');

    // TEST MODE: Send only one dummy article
    const testMode = process.env.TEST_MODE === 'true';
    
    if (testMode) {
      logger.info('🧪 TEST MODE: Sending single dummy article');
      
      const dummyArticle = {
        source: 'Test Source',
        url: 'https://test.com/article',
        contentType: 'text' as const,
        rawText: 'Sanjay Dutt passed away on November 27, 2025. The Bollywood actor was 65 years old.',
        metadata: {
          title: 'Test Article: Sanjay Dutt News',
          author: 'Test Author',
          publishedAt: new Date(),
        },
      };

      const success = await this.adkClient.processArticle(dummyArticle);
      
      logger.info('🧪 TEST MODE: Result', { success });
      logger.info('🧪 TEST MODE: Check your database for the claim about Sanjay Dutt');
      return;
    }

    // NORMAL MODE: Crawl RSS feeds and Reddit
    const rssItems = await this.rssCrawler.crawl();
    const redditItems = await this.redditCrawler.crawl();
    
    const allItems = [...rssItems, ...redditItems];
    logger.info('Crawl completed', { 
      rssItems: rssItems.length,
      redditItems: redditItems.length,
      totalItems: allItems.length 
    });

    // Filter out already processed URLs
    const newItems = allItems.filter(item => !this.processedUrls.has(item.url));
    logger.info('New items to process', { count: newItems.length });

    if (newItems.length === 0) {
      logger.info('No new items to process');
      return;
    }

    // Send to ADK agent for processing
    const successCount = await this.adkClient.processArticleBatch(newItems);

    // Mark as processed
    newItems.forEach(item => this.processedUrls.add(item.url));

    logger.info('Crawl cycle completed', {
      total: newItems.length,
      successful: successCount,
      failed: newItems.length - successCount,
    });
  }

  async start(): Promise<void> {
    await this.initialize();

    logger.info('Starting crawler service', { intervalMs: this.intervalMs });

    // Run initial cycle
    await this.runCrawlCycle();

    // Schedule periodic crawls
    setInterval(async () => {
      try {
        await this.runCrawlCycle();
      } catch (error) {
        logger.error('Error in crawl cycle', { error });
      }
    }, this.intervalMs);
  }

  async shutdown(): Promise<void> {
    logger.info('Shutting down Crawler Service');
    logger.info('Crawler Service shut down successfully');
  }
}

// Main entry point
const service = new CrawlerService();

process.on('SIGINT', async () => {
  await service.shutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await service.shutdown();
  process.exit(0);
});

service.start().catch((error) => {
  logger.error('Fatal error starting service', { error });
  process.exit(1);
});
