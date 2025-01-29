import React from 'react';

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-3 h-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-3 h-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}