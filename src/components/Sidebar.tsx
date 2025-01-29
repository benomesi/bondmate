@@ .. @@
           </div>
         </div>
       </div>
+      
+      {/* Premium Upgrade Banner */}
+      {!isPremium && (
+        <div className="p-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
+          <div className="flex items-center justify-between">
+            <div className="flex items-center space-x-2">
+              <Crown className="w-5 h-5" />
+              <div>
+                <div className="font-medium">Upgrade to Premium</div>
+                <div className="text-sm text-white/90">Unlock unlimited messages</div>
+              </div>
+            </div>
+            <button
+              onClick={onUpgrade}
+              className="px-3 py-1 bg-white text-yellow-500 rounded-lg hover:bg-yellow-50 transition-colors text-sm font-medium"
+            >
+              Upgrade
+            </button>
+          </div>
+        </div>
+      )}
     </div>
   );
 }