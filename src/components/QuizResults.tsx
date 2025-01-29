import React from 'react';
import { Brain, Heart, Users } from 'lucide-react';
import type { QuizResults as QuizResultsType } from '../types';

interface QuizResultsProps {
  results: QuizResultsType;
  minimal?: boolean;
}

export function QuizResults({ results, minimal = false }: QuizResultsProps) {
  const getAttachmentStyleDescription = (type?: string) => {
    switch (type) {
      case 'secure':
        return "You're comfortable with intimacy and independence, maintaining healthy boundaries while forming strong connections.";
      case 'anxious':
        return "You seek close relationships but may worry about abandonment or rejection.";
      case 'avoidant':
        return "You value independence and may find it challenging to fully open up to others.";
      case 'disorganized':
        return "You experience conflicting desires for closeness and distance in relationships.";
      default:
        return "Your attachment style helps determine how you form and maintain emotional bonds.";
    }
  };

  const getLoveLanguageScores = () => {
    if (!results.loveLanguages) return null;
    
    const total = Object.values(results.loveLanguages).reduce((a, b) => a + b, 0);
    return {
      wordsOfAffirmation: Math.round((results.loveLanguages.wordsOfAffirmation / total) * 100),
      actsOfService: Math.round((results.loveLanguages.actsOfService / total) * 100),
      receivingGifts: Math.round((results.loveLanguages.receivingGifts / total) * 100),
      qualityTime: Math.round((results.loveLanguages.qualityTime / total) * 100),
      physicalTouch: Math.round((results.loveLanguages.physicalTouch / total) * 100)
    };
  };

  if (minimal) {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">Your Results</h3>
        <div className="space-y-2">
          {results.attachmentStyle && (
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">
                {results.attachmentStyle.type.charAt(0).toUpperCase() + results.attachmentStyle.type.slice(1)} Attachment
              </span>
            </div>
          )}
          {results.loveLanguages && (
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">Love Languages Analysis</span>
            </div>
          )}
          {results.personalityAlignment && (
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">Personality Profile</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {results.attachmentStyle && (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Brain className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Attachment Style
            </h3>
          </div>
          <p className="text-gray-600 mb-4">
            {getAttachmentStyleDescription(results.attachmentStyle.type)}
          </p>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
              style={{ width: `${results.attachmentStyle.score}%` }}
            />
          </div>
        </div>
      )}

      {results.loveLanguages && (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Heart className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Love Languages
            </h3>
          </div>
          <div className="space-y-3">
            {Object.entries(getLoveLanguageScores() || {}).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">
                    {key.split(/(?=[A-Z])/).join(' ')}
                  </span>
                  <span className="text-gray-900 font-medium">{value}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.personalityAlignment && (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Personality Profile
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(results.personalityAlignment).map(([key, value]) => (
              <div key={key} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  {key.split(/(?=[A-Z])/).join(' ')}
                </h4>
                <p className="text-gray-900">
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}