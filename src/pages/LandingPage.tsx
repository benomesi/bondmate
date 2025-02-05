import { Link} from 'react-router-dom';
import { ArrowRight, Crown } from 'lucide-react';
import { Footer } from '../components/Footer';
import { StatsSection } from '../components/landing/StatsSection';
import { DemoSection } from '../components/landing/DemoSection';
import { PricingSection } from '../components/landing/PricingSection';
import { HeroSection } from '../components/landing/HeroSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { ScenariosSection } from '../components/landing/ScenariosSection';
import { TestimonialsSection } from '../components/landing/TestimonialsSection';
import { TrustSection } from '../components/landing/TrustSection';
import { BlogSection } from '../components/landing/BlogSection';

export function LandingPage() {
  return (
    <>
      <div className="min-h-screen">
        <HeroSection />
        <DemoSection />
        <HowItWorksSection />
        <FeaturesSection />
        <StatsSection />
        <ScenariosSection />
        <PricingSection />
        <TrustSection />
        <TestimonialsSection />
        <BlogSection />

        {/* Final CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Start Your Journey Today
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Join thousands of others who have transformed their relationships with BondMate's AI-powered guidance.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                to="/auth/sign-up"
                className="px-8 py-3 text-lg font-medium bg-white text-gray-900 rounded-full hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/pricing"
                className="px-8 py-3 text-lg font-medium border-2 border-white/20 rounded-full hover:bg-white/10 transition-all duration-200 flex items-center"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View Pricing
                <Crown className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}