'use client';

import React from 'react';
import { CertificateComponent, DynamicData } from '@/store/certificateStore';

interface CertificateComponentRendererProps {
  component: CertificateComponent;
  dynamicData: DynamicData;
  isSelected?: boolean;
}

export default function CertificateComponentRenderer({
  component,
  dynamicData,
  isSelected = false,
}: CertificateComponentRendererProps) {
  // Get dynamic content if dataKey is specified
  const getContent = () => {
    if (component.dataKey && dynamicData[component.dataKey]) {
      return String(dynamicData[component.dataKey]);
    }
    return component.content;
  };

  const content = getContent();
  const baseStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: component.alignment === 'center' ? 'center' : component.alignment === 'right' ? 'flex-end' : 'flex-start',
    padding: '8px',
    fontSize: component.fontSize || 14,
    fontFamily: component.fontFamily || 'Arial',
    color: component.color || '#000000',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
  };

  switch (component.type) {
    case 'text':
      return (
        <div style={baseStyle} className="text-left">
          {content}
        </div>
      );

    case 'signature':
      return (
        <div style={baseStyle} className="flex flex-col items-center justify-end border-t-2 border-gray-800">
          <span style={{ fontSize: (component.fontSize || 12) * 0.8 }}>{content}</span>
        </div>
      );

    case 'date':
      return (
        <div style={baseStyle} className="text-center">
          {content}
        </div>
      );

    case 'image':
      return (
        <div style={{ ...baseStyle, justifyContent: 'center' }}>
          <img
            src={content}
            alt="Certificate Image"
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
          />
        </div>
      );

    case 'qrcode':
      return (
        <div style={{ ...baseStyle, justifyContent: 'center' }}>
          <div className="text-xs text-gray-500">QR Code: {content}</div>
        </div>
      );

    default:
      return <div style={baseStyle}>Unknown component type</div>;
  }
}
