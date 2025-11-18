import axios from 'axios';
import type { RawContentItem, ProcessedContentItem } from '../types';
import { logger, withErrorHandling } from '../utils/logger';

/**
 * Claim Extractor Agent
 * Extracts claims, metadata, and categories from content
 */
export class ClaimExtractorAgent {
  private apiKey: string;
  private model: string;
  private apiEndpoint: string;

  constructor(
    apiKey: string = process.env.AI_API_KEY || '',
    model: string = process.env.AI_MODEL || 'gpt-4o-mini'
  ) {
    this.apiKey = apiKey;
    this.model = model;
    this.apiEndpoint = 'https://api.openai.com/v1/chat/completions';
  }

  async extractClaims(rawContent: RawContentItem): Promise<ProcessedContentItem[]> {
    logger.info('Extracting claims', { source: rawContent.source, url: rawContent.url });

    const result = await withErrorHandling(
      () => this.processContent(rawContent),
      `Claim extraction: ${rawContent.url}`
    );

    return result || [];
  }

  private async processContent(rawContent: RawContentItem): Promise<ProcessedContentItem[]> {
    if (!this.apiKey || this.apiKey.length < 20) {
      logger.warn('Invalid or missing API key, skipping AI extraction');
      return [];
    }

    const prompt = this.buildPrompt(rawContent);
    
    if (!prompt || prompt.length < 50) {
      logger.warn('Content too short, skipping AI extraction', { url: rawContent.url });
      return [];
    }

    try {
      const response = await axios.post(
        this.apiEndpoint,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'Extract key factual claims from news content. Return JSON with claims array: {"claims": [{"claim": "statement", "category": "politics"}]}. Categories: politics, health, science, economy, social, technology, other.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.2,
          max_tokens: 500,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
          timeout: 30000,
        }
      );

      const aiResponse = response.data.choices[0].message.content;
      const parsed = JSON.parse(aiResponse);

      if (!parsed.claims || !Array.isArray(parsed.claims)) {
        logger.warn('Invalid AI response format', { url: rawContent.url });
        return [];
      }

      const claims: ProcessedContentItem[] = parsed.claims.map((claim: any) => ({
        claim: claim.claim || '',
        category: claim.category || 'other',
        confidence: 0.8,
        extractedFrom: {
          contentType: rawContent.contentType,
          sourceUrl: rawContent.url,
        },
      }));

      logger.info('Claims extracted', { count: claims.length, url: rawContent.url });
      return claims;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        logger.error('OpenAI API error', {
          status: error.response.status,
          data: error.response.data,
          url: rawContent.url,
        });
      }
      throw error;
    }
  }

  private buildPrompt(rawContent: RawContentItem): string {
    const title = rawContent.metadata.title || '';
    const content = rawContent.rawText || '';
    
    // Limit content to ~3000 chars to avoid token limits
    const truncatedContent = content.substring(0, 3000);
    
    return `Title: ${title}\n\nContent: ${truncatedContent}\n\nExtract all key factual claims.`;
  }

  async extractClaimsBatch(
    rawContents: RawContentItem[]
  ): Promise<Map<string, ProcessedContentItem[]>> {
    const results = new Map<string, ProcessedContentItem[]>();

    for (const content of rawContents) {
      const claims = await this.extractClaims(content);
      results.set(content.url, claims);
      
      // Rate limiting: wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return results;
  }
}
