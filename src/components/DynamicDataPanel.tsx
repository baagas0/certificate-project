'use client';

import React from 'react';
import { useCertificateStore } from '@/store/certificateStore';

export default function DynamicDataPanel() {
  const dynamicData = useCertificateStore((state) => state.dynamicData);
  const updateDynamicData = useCertificateStore((state) => state.updateDynamicData);

  return (
    <div className="p-4 bg-white border-r border-gray-300 h-full overflow-y-auto">
      <h3 className="font-bold text-lg mb-4">Data Dinamis</h3>
      <div className="space-y-4">
        {Object.entries(dynamicData).map(([key, value]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <input
              type="text"
              value={String(value)}
              onChange={(e) => updateDynamicData(key, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-300">
        <p className="text-xs text-gray-600">
          Data yang diisi di sini akan secara otomatis menggantikan placeholder di komponen yang memiliki Data Key yang sesuai.
        </p>
      </div>
    </div>
  );
}
