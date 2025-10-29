'use client';

import React from 'react';
import { useCertificateStore } from '@/store/certificateStore';

interface ComponentPropertiesPanelProps {
  pageNumber: number;
}

export default function ComponentPropertiesPanel({ pageNumber }: ComponentPropertiesPanelProps) {
  const template = useCertificateStore((state) => state.template);
  const selectedComponentId = useCertificateStore((state) => state.selectedComponentId);
  const updateComponent = useCertificateStore((state) => state.updateComponent);
  const removeComponent = useCertificateStore((state) => state.removeComponent);

  if (!template || !selectedComponentId) {
    return (
      <div className="p-4 bg-gray-50 border-l border-gray-300 h-full">
        <p className="text-gray-500 text-sm">Pilih komponen untuk mengedit propertinya</p>
      </div>
    );
  }

  const currentPage = template.pages.find((p) => p.pageNumber === pageNumber);
  const component = currentPage?.components.find((c) => c.id === selectedComponentId);

  if (!component) {
    return (
      <div className="p-4 bg-gray-50 border-l border-gray-300 h-full">
        <p className="text-gray-500 text-sm">Komponen tidak ditemukan</p>
      </div>
    );
  }

  const handleChange = (key: string, value: any) => {
    updateComponent(pageNumber, selectedComponentId, { [key]: value });
  };

  return (
    <div className="p-4 bg-gray-50 border-l border-gray-300 h-full overflow-y-auto">
      <h3 className="font-bold text-lg mb-4">Properti Komponen</h3>

      <div className="space-y-4">
        {/* Label */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
          <input
            type="text"
            value={component.label}
            onChange={(e) => handleChange('label', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Konten</label>
          <textarea
            value={component.content}
            onChange={(e) => handleChange('content', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-20"
          />
        </div>

        {/* Data Key */}
        {component.type === 'text' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Key (Opsional)</label>
            <input
              type="text"
              value={component.dataKey || ''}
              onChange={(e) => handleChange('dataKey', e.target.value || undefined)}
              placeholder="e.g., participantName"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Gunakan untuk menghubungkan dengan data dinamis</p>
          </div>
        )}

        {/* Font Size */}
        {(component.type === 'text' || component.type === 'date') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ukuran Font</label>
            <input
              type="number"
              value={component.fontSize || 14}
              onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
              min="8"
              max="72"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        )}

        {/* Font Family */}
        {(component.type === 'text' || component.type === 'date') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Font</label>
            <select
              value={component.fontFamily || 'Arial'}
              onChange={(e) => handleChange('fontFamily', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
            </select>
          </div>
        )}

        {/* Color */}
        {(component.type === 'text' || component.type === 'date') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Warna</label>
            <input
              type="color"
              value={component.color || '#000000'}
              onChange={(e) => handleChange('color', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
            />
          </div>
        )}

        {/* Alignment */}
        {(component.type === 'text' || component.type === 'date') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alignment</label>
            <select
              value={component.alignment || 'left'}
              onChange={(e) => handleChange('alignment', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="left">Kiri</option>
              <option value="center">Tengah</option>
              <option value="right">Kanan</option>
            </select>
          </div>
        )}

        {/* Delete Button */}
        <button
          onClick={() => removeComponent(pageNumber, selectedComponentId)}
          className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm font-medium"
        >
          Hapus Komponen
        </button>
      </div>
    </div>
  );
}
