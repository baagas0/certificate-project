'use client';

import React, { useState } from 'react';
import { useCertificateStore } from '@/store/certificateStore';
import CertificateCanvas from '@/components/CertificateCanvas';
import ComponentLibrary from '@/components/ComponentLibrary';
import ComponentPropertiesPanel from '@/components/ComponentPropertiesPanel';
import DynamicDataPanel from '@/components/DynamicDataPanel';

export default function Home() {
  const template = useCertificateStore((state) => state.template);
  const currentPage = useCertificateStore((state) => state.currentPage);
  const setCurrentPage = useCertificateStore((state) => state.setCurrentPage);
  const addPage = useCertificateStore((state) => state.addPage);
  const removePage = useCertificateStore((state) => state.removePage);
  const dynamicData = useCertificateStore((state) => state.dynamicData);

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'data'>('edit');

  const handleGeneratePDF = async () => {
    if (!template) return;

    setIsGeneratingPDF(true);
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template, dynamicData }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${template.templateName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Gagal membuat PDF. Silakan coba lagi.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (!template) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{template.templateName}</h1>
            <p className="text-blue-100 text-sm">Editor Sertifikat Dinamis</p>
          </div>
          <button
            onClick={handleGeneratePDF}
            disabled={isGeneratingPDF}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold rounded-lg transition flex items-center gap-2"
          >
            {isGeneratingPDF ? (
              <>
                <span className="animate-spin">⏳</span>
                Membuat PDF...
              </>
            ) : (
              <>
                <span>📄</span>
                Generate PDF
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Component Library or Data Panel */}
        <div className="w-64 bg-white shadow-md overflow-hidden flex flex-col">
          <div className="flex border-b border-gray-300">
            <button
              onClick={() => setActiveTab('edit')}
              className={`flex-1 px-4 py-2 font-medium transition ${
                activeTab === 'edit'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Komponen
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`flex-1 px-4 py-2 font-medium transition ${
                activeTab === 'data'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Data
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            {activeTab === 'edit' ? (
              <ComponentLibrary pageNumber={currentPage} />
            ) : (
              <DynamicDataPanel />
            )}
          </div>
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Page Tabs */}
          <div className="bg-white border-b border-gray-300 px-4 py-2 flex items-center gap-2 overflow-x-auto">
            {template.pages.map((page) => (
              <div key={page.pageNumber} className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(page.pageNumber)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    currentPage === page.pageNumber
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Halaman {page.pageNumber}
                </button>
                {template.pages.length > 1 && (
                  <button
                    onClick={() => removePage(page.pageNumber)}
                    className="px-2 py-2 text-red-500 hover:bg-red-100 rounded transition"
                    title="Hapus halaman"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addPage}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
            >
              + Halaman Baru
            </button>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 overflow-auto p-4 bg-gray-200 flex justify-center items-start">
            <CertificateCanvas pageNumber={currentPage} isEditing={true} />
          </div>
        </div>

        {/* Right Sidebar - Properties Panel */}
        <div className="w-64 bg-white shadow-md overflow-hidden">
          <ComponentPropertiesPanel pageNumber={currentPage} />
        </div>
      </div>
    </div>
  );
}
