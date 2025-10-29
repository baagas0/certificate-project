'use client';

import React from 'react';
import { useCertificateStore } from '@/store/certificateStore';
import CertificateCanvas from '@/components/CertificateCanvas';
import PagePropertiesPanel from '@/components/PagePropertiesPanel';

export default function PreviewPage() {
  const template = useCertificateStore((state) => state.template);

  if (!template) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">{template.templateName} - Preview</h1>
            <div className="space-y-8">
              {template.pages.map((page) => (
                <div key={page.pageNumber}>
                  <h2 className="text-xl font-semibold mb-4">Halaman {page.pageNumber}</h2>
                  <CertificateCanvas pageNumber={page.pageNumber} isEditing={false} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar for Page Properties */}
        <div className="w-80 bg-white border-l border-gray-200 h-screen overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Page Settings</h2>
            {template.pages.map((page) => (
              <div key={page.pageNumber} className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Page {page.pageNumber}</h3>
                <PagePropertiesPanel pageNumber={page.pageNumber} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
