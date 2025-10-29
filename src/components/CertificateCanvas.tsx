'use client';

import React, { useState, useEffect } from 'react';
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
  const [backgroundImageLoaded, setBackgroundImageLoaded] = useState(false);
  const [backgroundImageError, setBackgroundImageError] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  const currentPage = template?.pages.find((p) => p.pageNumber === pageNumber);
  const backgroundImage = currentPage?.backgroundImage;

  // Reset background image states when page changes
  useEffect(() => {
    setBackgroundImageLoaded(false);
    setBackgroundImageError(false);
    setImageDimensions({ width: 0, height: 0 });
  }, [backgroundImage]);

  const handleBackgroundImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    setBackgroundImageLoaded(true);
    setBackgroundImageError(false);
  };

  const handleBackgroundImageError = () => {
    setBackgroundImageLoaded(false);
    setBackgroundImageError(true);
    setImageDimensions({ width: 0, height: 0 });
  };

  // Calculate canvas dimensions based on image or default aspect ratio
  const getCanvasStyle = () => {
    if (backgroundImageLoaded && imageDimensions.width > 0 && imageDimensions.height > 0) {
      const aspectRatio = imageDimensions.width / imageDimensions.height;
      return { aspectRatio: `${aspectRatio}` };
    }
    return { aspectRatio: '8.5/11' }; // Default certificate aspect ratio
  };

  if (!template) return <div>No template loaded</div>;
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
    <div className="w-full bg-white border-2 border-gray-300 rounded-lg overflow-hidden" style={getCanvasStyle()}>
      <div className="p-4 h-full overflow-auto bg-gray-50 relative">
        {backgroundImage && (
          <>
            <img
              src={backgroundImage}
              alt="Certificate background"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              onLoad={handleBackgroundImageLoad}
              onError={handleBackgroundImageError}
              style={{ zIndex: 0 }}
            />
            {backgroundImageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-50 text-red-500 text-sm" style={{ zIndex: 1 }}>
                Failed to load background image
              </div>
            )}
          </>
        )}
        <GridLayout
          className={`layout ${backgroundImage && backgroundImageLoaded ? 'bg-transparent' : 'bg-white'}`}
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
          style={{ zIndex: 1, position: 'relative' }}
        >
          {currentPage.components.map((component) => (
            <div
              key={component.id}
              className={`border-2 cursor-pointer transition-all ${
                backgroundImage && backgroundImageLoaded
                  ? 'bg-white bg-opacity-90'
                  : 'bg-white'
              } ${
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
