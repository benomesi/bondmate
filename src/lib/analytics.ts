// Analytics Types
interface AnalyticsWindow extends Window {
  startTime?: number;
  messageCount?: number;
  chatStartTime?: number;
  fbq?: Function;
}

declare global {
  interface Window extends AnalyticsWindow {}
}

// Analytics Constants
const PRICING_TIERS = {
  FREE: 'free',
  PREMIUM: 'premium'
} as const;

const CHAT_MILESTONES = {
  FIRST_MESSAGE: 1,
  FIVE_MESSAGES: 5,
  TEN_MESSAGES: 10,
  TWENTY_MESSAGES: 20,
  FIFTY_MESSAGES: 50
} as const;

const SESSION_DURATIONS = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 900, // 15 minutes
  EXTENDED: 1800 // 30 minutes
} as const;

// Standard Events
export const EVENTS = {
  // Page Views
  VIEW_LANDING_PAGE: 'ViewContent',
  VIEW_FEATURES: 'ViewContent',
  VIEW_PRICING: 'ViewContent',
  VIEW_BLOG: 'ViewContent',
  
  // Authentication
  START_REGISTRATION: 'StartRegistration',
  COMPLETE_REGISTRATION: 'CompleteRegistration',
  LOGIN: 'Login',
  
  // Onboarding
  START_ONBOARDING: 'StartTrial',
  COMPLETE_ONBOARDING: 'Subscribe',
  
  // Chat Interactions
  SEND_MESSAGE: 'Contact',
  START_CHAT: 'InitiateCheckout',
  
  // Premium Features
  VIEW_PREMIUM: 'ViewContent',
  START_TRIAL: 'StartTrial',
  PURCHASE_PREMIUM: 'Purchase',
  
  // Engagement
  ADD_RELATIONSHIP: 'AddToCart',
  COMPLETE_QUIZ: 'Subscribe'
} as const;

// Track standard Meta Pixel events
export const trackEvent = (
  eventName: typeof EVENTS[keyof typeof EVENTS],
  params?: Record<string, any>
) => {
  try {
    if (window.fbq) {
      window.fbq('track', eventName, params);
    }
    console.debug('Tracking event:', eventName, params);
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

// Track custom events
export const trackCustomEvent = (
  eventName: string,
  params?: Record<string, any>
) => {
  try {
    if (window.fbq) {
      window.fbq('trackCustom', eventName, params);
    }
    console.debug('Tracking custom event:', eventName, params);
  } catch (error) {
    console.error('Error tracking custom event:', error);
  }
};

// Helper to track page views
export const trackPageView = (pageName: string, params?: Record<string, any>) => {
  trackEvent('ViewContent', {
    content_name: pageName,
    ...params
  });
};

// Helper to track chat interactions
export const trackChatInteraction = (type: string, params?: Record<string, any>) => {
  trackCustomEvent('ChatInteraction', {
    interaction_type: type,
    ...params
  });
};

// Helper to track pricing interactions
export const trackPricingInteraction = (
  action: 'view' | 'click' | 'upgrade',
  tier: keyof typeof PRICING_TIERS,
  params?: Record<string, any>
) => {
  trackCustomEvent('PricingInteraction', {
    action,
    tier,
    ...params
  });
};

// Initialize session tracking
export const initializeAnalytics = () => {
  window.startTime = Date.now();
  window.messageCount = 0;
  
  // Track session duration
  Object.values(SESSION_DURATIONS).forEach(duration => {
    setTimeout(() => {
      trackCustomEvent('SessionDuration', {
        duration_seconds: duration,
        is_premium: isPremiumUser()
      });
    }, duration * 1000);
  });
};

// Track chat session
export const startChatSession = () => {
  window.chatStartTime = Date.now();
  trackCustomEvent('ChatSessionStart', {
    timestamp: new Date().toISOString()
  });
};

export const endChatSession = () => {
  if (window.chatStartTime) {
    const duration = Math.floor((Date.now() - window.chatStartTime) / 1000);
    trackCustomEvent('ChatSessionEnd', {
      duration_seconds: duration,
      messages_sent: window.messageCount || 0
    });
  }
};

// Track message count and milestones
export const trackMessage = () => {
  if (typeof window.messageCount === 'number') {
    window.messageCount++;
    
    // Check milestones
    Object.entries(CHAT_MILESTONES).forEach(([milestone, count]) => {
      if (window.messageCount === count) {
        trackCustomEvent('MessageMilestone', {
          milestone,
          count,
          time_to_milestone: Math.floor((Date.now() - (window.startTime || Date.now())) / 1000)
        });
      }
    });
  }
};

// Helper to check premium status
const isPremiumUser = () => {
  try {
    const state = (window as any).__REDUX_STATE__;
    return state?.app?.isPremium || false;
  } catch {
    return false;
  }
};