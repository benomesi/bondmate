@@ .. @@
                   <div className="mt-4 space-y-2">
                     {message.suggestions.map((suggestion, index) => (
                       <button
                         key={index}
                         onClick={() => handleSubmit(suggestion.text)}
                         className="block w-full text-left text-sm p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700 border border-gray-100"
                       >
                         {suggestion.text}
                       </button>
                     ))}
                   </div>
                 )}
               </div>
             </motion.div>
           ))}