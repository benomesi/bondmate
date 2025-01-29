import React from 'react';
import type { ComparisonFeature } from './index';

interface ComparisonTableProps {
  features: ComparisonFeature[];
}

export function ComparisonTable({ features }: ComparisonTableProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="py-4 px-6 text-left text-gray-500 font-medium">Feature</th>
              <th className="py-4 px-6 text-center text-gray-500 font-medium">Free</th>
              <th className="py-4 px-6 text-center text-gray-500 font-medium">Premium</th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature, index) => (
              <tr
                key={feature.name}
                className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
              >
                <td className="py-4 px-6 text-gray-900 font-medium">{feature.name}</td>
                <td className="py-4 px-6 text-center text-gray-600">{feature.free}</td>
                <td className="py-4 px-6 text-center text-red-600 font-medium">{feature.premium}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}