'use client';

import React, { useCallback } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import { useCertificateStore, CertificateComponent, ComponentLayout } from '@/store/certificateStore';
import CertificateComponentRenderer from './CertificateComponentRenderer';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

interface CertificateCanvasProps {
  pageNumber: number;
  isEditing?: boolean;
}

export default function CertificateCanvas({ pageNumber, isEditing = true }: CertificateCanvasProps) {
  const template = useCertificateStore((state) => state.template);
  const dynamicData = useCertificateStore((state) => state.dynamicData);
  const selectedComponentId = useCertificateStore((state) => state.selectedComponentId);
  const updateComponentLayout = useCertificateStore((state) => state.updateComponentLayout);
  const setSelectedComponent = useCertificateStore((state) => state.setSelectedComponent);

  if (!template) return <div>No template loaded</div>;

  const currentPage = template.pages.find((p) => p.pageNumber === pageNumber);
  if (!currentPage) return <div>Page {pageNumber} not found</div>;

  const gridCols = template.gridCols || 12;
  const gridRows = template.gridRows || 12;

  // Convert components to GridLayout format
  const layouts: Layout[] = currentPage.components.map((comp) => ({
    i: comp.id,
    x: comp.layout.x,
    y: comp.layout.y,
    w: comp.layout.w,
    h: comp.layout.h,
    static: !isEditing,
  }));

  const handleLayoutChange = (newLayout: Layout[]) => {
    newLayout.forEach((item) => {
      const component = currentPage.components.find((c) => c.id === item.i);
      if (component) {
        const newLayout: ComponentLayout = {
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h,
        };
        updateComponentLayout(pageNumber, item.i, newLayout);
      }
    });
  };

  return (
    <div className="w-full bg-white border-2 border-gray-300 rounded-lg overflow-hidden" style={{ aspectRatio: '8.5/11' }}>
      <div className="p-4 h-full overflow-auto bg-gray-50">
        <GridLayout
          className="layout bg-white"
          layout={layouts}
          onLayoutChange={handleLayoutChange}
          cols={gridCols}
          rowHeight={30}
          width={750}
          isDraggable={isEditing}
          isResizable={isEditing}
          compactType="vertical"
          preventCollision={false}
          useCSSTransforms={true}
        >
          {currentPage.components.map((component) => (
            <div
              key={component.id}
              className={`bg-white border-2 cursor-pointer transition-all ${
                selectedComponentId === component.id ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-400'
              }`}
              onClick={() => setSelectedComponent(component.id)}
            >
              <CertificateComponentRenderer
                component={component}
                dynamicData={dynamicData}
                isSelected={selectedComponentId === component.id}
              />
            </div>
          ))}
        </GridLayout>
      </div>
    </div>
  );
}
