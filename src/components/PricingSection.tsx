@@ .. @@
 import { motion } from 'framer-motion';
 import { Check, Crown } from 'lucide-react';
 import { Link } from 'react-router-dom';
+import { trackPricingInteraction } from '../lib/analytics';
 
 const PRICING_PLANS = [
   {
@@ .. @@
               <Link
                 to="/auth/sign-up"
                 className={`block w-full py-3 text-center rounded-lg transition-colors ${
                   plan.popular
                     ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90'
                     : 'bg-white border-2 border-purple-500 text-purple-500 hover:bg-purple-50'
                 }`}
+                onClick={() => trackPricingInteraction(
+                  'click',
+                  plan.popular ? 'PREMIUM' : 'FREE',
+                  { plan_name: plan.name }
+                )}
               >
                 {plan.popular ? (
                   <span className="flex items-center justify-center">
@@ .. @@