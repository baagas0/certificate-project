'use client';

import React from 'react';
import { useCertificateStore } from '@/store/certificateStore';
import CertificateCanvas from '@/components/CertificateCanvas';

export default function PreviewPage() {
  const template = useCertificateStore((state) => state.template);

  if (!template) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
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
  );
}
