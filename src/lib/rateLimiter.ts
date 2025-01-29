import { ChatServiceError } from '../services/chat';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  totalLimit?: number; // Maximum total requests allowed
}

interface UserTierLimits {
  free: RateLimitConfig;
  premium: RateLimitConfig;
  demo: RateLimitConfig;
}

const TIER_LIMITS: UserTierLimits = {
  free: {
    maxRequests: 10, // 10 requests per minute
    windowMs: 60000 // 1 minute window
  },
  premium: {
    maxRequests: 60, // 60 requests
    windowMs: 60000 // per minute
  },
  demo: {
    maxRequests: 5, // 5 requests per minute
    windowMs: 60000, // per minute
    totalLimit: 10 // Maximum 10 total requests for demo users
  }
};

class RateLimiter {
  private requests: { [key: string]: number[] } = {};
  private totalRequests: { [key: string]: number } = {}; // Track total requests per user

  private cleanOldRequests(userId: string) {
    const now = Date.now();
    this.requests[userId] = this.requests[userId]?.filter(
      timestamp => now - timestamp < 60000 // Always clean based on 1 minute
    ) || [];
  }

  async checkLimit(userId: string, tier: keyof UserTierLimits = 'free'): Promise<void> {
    this.cleanOldRequests(userId);

    if (!this.requests[userId]) {
      this.requests[userId] = [];
    }

    // Initialize total requests counter if not exists
    if (!this.totalRequests[userId]) {
      this.totalRequests[userId] = 0;
    }

    const config = TIER_LIMITS[tier];

    // Check total limit for demo and free users
    if ((tier === 'demo' || tier === 'free') && config.totalLimit && this.totalRequests[userId] >= config.totalLimit) {
      throw new ChatServiceError(
        tier === 'demo' 
          ? 'You have reached the maximum number of demo requests. Please sign up to continue.'
          : 'You have reached your free message limit. Please sign up to continue chatting!',
        'total_limit_exceeded'
      );
    }

    // Check rate limit
    if (this.requests[userId].length >= config.maxRequests) {
      const oldestRequest = Math.min(...this.requests[userId]);
      const waitTime = Math.ceil((config.windowMs - (Date.now() - oldestRequest)) / 1000);
      
      throw new ChatServiceError(
        `Rate limit reached. Please wait ${waitTime} seconds before trying again.`,
        'rate_limit_exceeded'
      );
    }

    // Add request timestamp
    this.requests[userId].push(Date.now());
    this.totalRequests[userId]++;
  }

  getCurrentUsage(userId: string, tier: keyof UserTierLimits = 'free') {
    this.cleanOldRequests(userId);
    const config = TIER_LIMITS[tier];
    const used = this.requests[userId]?.length || 0;
    const oldestRequest = Math.min(...(this.requests[userId] || [Date.now()]));
    const resetIn = Math.max(0, config.windowMs - (Date.now() - oldestRequest));
    const totalUsed = this.totalRequests[userId] || 0;

    return {
      used,
      limit: config.maxRequests,
      remaining: config.maxRequests - used,
      resetIn,
      totalUsed,
      totalLimit: config.totalLimit,
      totalRemaining: config.totalLimit ? config.totalLimit - totalUsed : undefined
    };
  }

  resetTotalRequests(userId: string): void {
    delete this.totalRequests[userId];
  }
}

export const rateLimiter = new RateLimiter();