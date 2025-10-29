'use client';

import React from 'react';
import { useCertificateStore, CertificateComponent } from '@/store/certificateStore';

interface ComponentLibraryProps {
  pageNumber: number;
}

export default function ComponentLibrary({ pageNumber }: ComponentLibraryProps) {
  const addComponent = useCertificateStore((state) => state.addComponent);

  const componentTemplates = [
    {
      type: 'text' as const,
      label: 'Teks',
      icon: '📝',
      defaultComponent: {
        id: `text-${Date.now()}`,
        type: 'text' as const,
        label: 'Teks Baru',
        content: 'Teks Baru',
        layout: {
          x: 0, y: 0, w: 4, h: 1,
          left: 50, top: 50, width: 200, height: 40,
          positionMode: 'free' as const
        },
        fontSize: 16,
        fontFamily: 'Arial',
        color: '#000000',
        alignment: 'left' as const,
      },
    },
    {
      type: 'signature' as const,
      label: 'Tanda Tangan',
      icon: '✍️',
      defaultComponent: {
        id: `signature-${Date.now()}`,
        type: 'signature' as const,
        label: 'Tanda Tangan',
        content: 'Penandatangan',
        layout: {
          x: 0, y: 0, w: 3, h: 2,
          left: 50, top: 100, width: 150, height: 80,
          positionMode: 'free' as const
        },
      },
    },
    {
      type: 'date' as const,
      label: 'Tanggal',
      icon: '📅',
      defaultComponent: {
        id: `date-${Date.now()}`,
        type: 'date' as const,
        label: 'Tanggal',
        content: new Date().toLocaleDateString('id-ID'),
        layout: {
          x: 0, y: 0, w: 3, h: 1,
          left: 50, top: 150, width: 150, height: 40,
          positionMode: 'free' as const
        },
        fontSize: 12,
        alignment: 'center' as const,
      },
    },
    {
      type: 'image' as const,
      label: 'Gambar',
      icon: '🖼️',
      defaultComponent: {
        id: `image-${Date.now()}`,
        type: 'image' as const,
        label: 'Gambar',
        content: 'https://via.placeholder.com/150',
        layout: {
          x: 0, y: 0, w: 3, h: 3,
          left: 50, top: 200, width: 150, height: 150,
          positionMode: 'free' as const
        },
      },
    },
    {
      type: 'qrcode' as const,
      label: 'QR Code',
      icon: '📱',
      defaultComponent: {
        id: `qrcode-${Date.now()}`,
        type: 'qrcode' as const,
        label: 'QR Code',
        content: 'https://example.com',
        layout: {
          x: 0, y: 0, w: 2, h: 2,
          left: 50, top: 250, width: 100, height: 100,
          positionMode: 'free' as const
        },
      },
    },
  ];

  const handleAddComponent = (defaultComponent: CertificateComponent) => {
    addComponent(pageNumber, defaultComponent);
  };

  return (
    <div className="p-4 bg-white border-r border-gray-300 h-full overflow-y-auto">
      <h3 className="font-bold text-lg mb-4">Komponen</h3>
      <div className="space-y-2">
        {componentTemplates.map((template) => (
          <button
            key={template.type}
            onClick={() => handleAddComponent(template.defaultComponent)}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition font-medium text-sm flex items-center gap-2"
          >
            <span>{template.icon}</span>
            <span>Tambah {template.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-300">
        <h4 className="font-semibold text-sm text-gray-700 mb-2">Tips:</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Drag komponen untuk memindahkan</li>
          <li>• Resize untuk mengubah ukuran</li>
          <li>• Klik untuk memilih dan edit</li>
          <li>• Gunakan Data Key untuk data dinamis</li>
        </ul>
      </div>
    </div>
  );
}
