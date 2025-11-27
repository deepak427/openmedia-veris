import axios from 'axios';
import type { RawContentItem } from '../types';
import { logger, withErrorHandling } from '../utils/logger';

/**
 * ADK Agent Client
 * Sends content to deployed Veris ADK agent for processing
 */
export class ADKAgentClient {
  private agentUrl: string;
  private userId: string;
  private sessionId: string | null = null;

  constructor(agentUrl: string = process.env.ADK_AGENT_URL || '') {
    this.agentUrl = agentUrl;
    this.userId = 'crawler_service';
  }

  /**
   * Create a session with the ADK agent
   */
  private async createSession(): Promise<string> {
    const response = await axios.post(
      `${this.agentUrl}/apps/veris_agent/users/${this.userId}/sessions`,
      {},
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000,
      }
    );
    return response.data.id;
  }

  /**
   * Ensure we have a valid session
   */
  private async ensureSession(): Promise<string> {
    if (!this.sessionId) {
      this.sessionId = await this.createSession();
      logger.info('Created ADK session', { sessionId: this.sessionId });
    }
    return this.sessionId;
  }

  /**
   * Send article to ADK agent for claim extraction, verification, and storage
   */
  async processArticle(rawContent: RawContentItem): Promise<boolean> {
    if (!this.agentUrl) {
      logger.error('ADK_AGENT_URL not configured');
      return false;
    }

    logger.info('Sending to ADK agent', { 
      source: rawContent.source, 
      url: rawContent.url 
    });

    const result = await withErrorHandling(
      () => this.sendToAgent(rawContent),
      `ADK agent: ${rawContent.url}`
    );

    return result || false;
  }

  private async sendToAgent(rawContent: RawContentItem): Promise<boolean> {
    const sessionId = await this.ensureSession();
    const message = this.formatMessage(rawContent);

    try {
      // Send request and wait for initial acceptance (not full processing)
      const response = await axios.post(
        `${this.agentUrl}/run_sse`,
        {
          app_name: 'veris_agent',
          user_id: this.userId,
          session_id: sessionId,
          newMessage: {
            role: 'user',
            parts: [{ text: message }],
          },
        },
        {
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
          },
          timeout: 15000, // 15 seconds to get initial response
          validateStatus: (status) => status < 500, // Accept 4xx as valid responses
        }
      );

      // Check if request was accepted
      if (response.status === 200 || response.status === 202) {
        logger.info('✅ ADK agent accepted request', { 
          url: rawContent.url,
          status: response.status,
        });
        // Session used successfully, create new one for next request
        this.sessionId = null;
        return true;
      }

      // Handle session errors - reset and retry
      if (response.status === 404 || response.status === 401) {
        logger.warn('⚠️ Session invalid, creating new session', {
          url: rawContent.url,
          status: response.status,
        });
        this.sessionId = null;
        throw new Error('Session invalid, will retry with new session');
      }

      // Handle quota/rate limit errors
      if (response.status === 429) {
        throw new Error('Rate limit exceeded (429)');
      }

      logger.warn('⚠️ ADK agent rejected request', {
        url: rawContent.url,
        status: response.status,
      });
      return false;

    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Session might be invalid, reset it
        if (error.response?.status === 404 || error.response?.status === 401) {
          this.sessionId = null;
          throw new Error('Session invalid, will retry with new session');
        }

        // Quota/rate limit error
        if (error.response?.status === 429 || error.message.includes('quota')) {
          throw new Error('Quota limit hit, will retry with backoff');
        }

        // Timeout is OK - agent is processing in background
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          logger.info('⏱️ Request timeout (agent processing in background)', {
            url: rawContent.url,
          });
          // Session likely consumed, create new one for next request
          this.sessionId = null;
          return true;
        }
        
        logger.error('❌ ADK agent error', {
          url: rawContent.url,
          status: error.response?.status,
          error: error.message,
        });
      }
      throw error;
    }
  }

  /**
   * Format article content as message for ADK agent
   */
  private formatMessage(rawContent: RawContentItem): string {
    const title = rawContent.metadata.title || 'Untitled';
    const author = rawContent.metadata.author || 'Unknown';
    const publishedAt = rawContent.metadata.publishedAt 
      ? new Date(rawContent.metadata.publishedAt).toLocaleDateString()
      : 'Unknown date';
    
    const content = rawContent.rawText || '';
    
    return `Article from ${rawContent.source}

Title: ${title}
Author: ${author}
Published: ${publishedAt}
URL: ${rawContent.url}

Content:
${content}

Please extract and verify all claims from this article.`;
  }

  /**
   * Process multiple articles with exponential backoff on quota limits
   */
  async processArticleBatch(rawContents: RawContentItem[]): Promise<number> {
    let successCount = 0;
    let retryDelay = 5000; // Start with 5 seconds
    const maxRetryDelay = 300000; // Max 5 minutes

    for (let i = 0; i < rawContents.length; i++) {
      const content = rawContents[i];
      const remaining = rawContents.length - i;
      
      logger.info(`Processing article ${i + 1}/${rawContents.length}`, {
        source: content.source,
        remaining,
      });

      let success = false;
      let attempts = 0;
      const maxAttempts = 5;

      // Retry with exponential backoff
      while (!success && attempts < maxAttempts) {
        attempts++;
        
        try {
          success = await this.processArticle(content);
          
          if (success) {
            successCount++;
            retryDelay = 5000; // Reset delay on success
            logger.info(`✅ Article processed (${successCount}/${rawContents.length})`);
            
            // Wait 3 seconds before next article
            await new Promise(resolve => setTimeout(resolve, 3000));
            break;
          }
        } catch (error: any) {
          const isQuotaError = error?.message?.includes('quota') || 
                              error?.message?.includes('429') ||
                              error?.message?.includes('rate limit');
          
          if (isQuotaError) {
            logger.warn(`⚠️ Quota limit hit, waiting ${retryDelay / 1000}s before retry`, {
              attempt: attempts,
              maxAttempts,
            });
            
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            
            // Exponential backoff: double the delay
            retryDelay = Math.min(retryDelay * 2, maxRetryDelay);
          } else {
            // Other error, skip this article
            logger.error(`❌ Failed to process article, skipping`, {
              url: content.url,
              error: error?.message,
            });
            break;
          }
        }
      }

      if (!success) {
        logger.warn(`⏭️ Skipping article after ${attempts} attempts`, {
          url: content.url,
        });
      }
    }

    logger.info('Batch processing complete', { 
      total: rawContents.length,
      successful: successCount,
      failed: rawContents.length - successCount,
    });

    return successCount;
  }
}
