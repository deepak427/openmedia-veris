import dotenv from 'dotenv';
import { RSSCrawler } from './crawlers/rssCrawler';
import { RedditCrawler } from './crawlers/redditCrawler';
import { ClaimExtractorAgent } from './agents/claimExtractorAgent';
import { Repository } from './db/repository';
import { logger } from './utils/logger';

dotenv.config();

/**
 * Main Crawler Service Application
 * Orchestrates crawling, claim extraction, and storage
 */
class CrawlerService {
  private rssCrawler: RSSCrawler;
  private redditCrawler: RedditCrawler;
  private claimExtractor: ClaimExtractorAgent;
  private repository: Repository;
  private intervalMs: number;

  constructor() {
    const rssFeeds = process.env.RSS_FEEDS?.split(',') || [
      'https://feeds.bbci.co.uk/news/rss.xml',
      'https://timesofindia.indiatimes.com/rssfeedstopstories.cms',
      'https://www.theguardian.com/world/rss',
    ];

    this.rssCrawler = new RSSCrawler(rssFeeds);
    this.redditCrawler = new RedditCrawler(['news']);
    this.claimExtractor = new ClaimExtractorAgent();
    this.repository = new Repository();
    this.intervalMs = parseInt(process.env.CRAWL_INTERVAL_MS || '300000', 10);
  }

  async initialize(): Promise<void> {
    logger.info('Initializing Crawler Service');
    await this.repository.initialize();
    logger.info('Crawler Service initialized successfully');
  }

  async runCrawlCycle(): Promise<void> {
    logger.info('Starting crawl cycle');

    // Crawl RSS feeds only
    const rssItems = await this.rssCrawler.crawl();
    
    const allItems = rssItems;
    logger.info('Crawl completed', { totalItems: allItems.length });

    // Filter out already processed URLs
    const newItems = [];
    for (const item of allItems) {
      const exists = await this.repository.exists(item.url);
      if (!exists) {
        newItems.push(item);
      }
    }

    logger.info('New items to process', { count: newItems.length });

    // Extract claims from new items
    const processedMap = await this.claimExtractor.extractClaimsBatch(newItems);

    // Save to database
    await this.repository.saveBatch(newItems, processedMap);

    logger.info('Crawl cycle completed', {
      processed: newItems.length,
      totalClaims: Array.from(processedMap.values()).flat().length,
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
    await this.repository.close();
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
