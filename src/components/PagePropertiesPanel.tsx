'use client';

import React, { useState } from 'react';
import { useCertificateStore } from '@/store/certificateStore';

interface PagePropertiesPanelProps {
  pageNumber: number;
}

export default function PagePropertiesPanel({ pageNumber }: PagePropertiesPanelProps) {
  const template = useCertificateStore((state) => state.template);
  const updatePageBackgroundImage = useCertificateStore((state) => state.updatePageBackgroundImage);
  const [imageUrl, setImageUrl] = useState('');

  if (!template) {
    return (
      <div className="p-4 bg-gray-50 border-l border-gray-300 h-full">
        <p className="text-gray-500 text-sm">No template loaded</p>
      </div>
    );
  }

  const currentPage = template.pages.find((p) => p.pageNumber === pageNumber);

  if (!currentPage) {
    return (
      <div className="p-4 bg-gray-50 border-l border-gray-300 h-full">
        <p className="text-gray-500 text-sm">Page {pageNumber} not found</p>
      </div>
    );
  }

  const handleBackgroundImageChange = (url: string) => {
    setImageUrl(url);
    updatePageBackgroundImage(pageNumber, url || undefined);
  };

  const handleRemoveBackground = () => {
    setImageUrl('');
    updatePageBackgroundImage(pageNumber, undefined);
  };

  return (
    <div className="p-4 bg-gray-50 border-l border-gray-300 h-full overflow-y-auto">
      <h3 className="font-bold text-lg mb-4">Page Properties</h3>

      <div className="space-y-4">
        {/* Background Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Background Image URL
          </label>
          <div className="space-y-2">
            <input
              type="url"
              value={imageUrl || currentPage.backgroundImage || ''}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex space-x-2">
              <button
                onClick={() => handleBackgroundImageChange(imageUrl)}
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
              >
                Apply Background
              </button>
              {currentPage.backgroundImage && (
                <button
                  onClick={handleRemoveBackground}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                >
                  Remove Background
                </button>
              )}
            </div>
          </div>
          {currentPage.backgroundImage && (
            <div className="mt-2">
              <p className="text-xs text-green-600">Background image is set</p>
              <div className="mt-1 border border-gray-200 rounded p-1 bg-white">
                <img
                  src={currentPage.backgroundImage}
                  alt="Background preview"
                  className="w-full h-20 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Page Info */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Page Information</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <p>Page Number: {currentPage.pageNumber}</p>
            <p>Components: {currentPage.components.length}</p>
            <p>Grid Columns: {template.gridCols || 12}</p>
            <p>Grid Rows: {template.gridRows || 12}</p>
          </div>
        </div>
      </div>
    </div>
  );
}