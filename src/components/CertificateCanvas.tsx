'use client';

import React, { useState, useEffect } from 'react';
import { useCertificateStore, CertificateComponent, ComponentLayout } from '@/store/certificateStore';
import CertificateComponentRenderer from './CertificateComponentRenderer';

interface CertificateCanvasProps {
  pageNumber: number;
  isEditing?: boolean;
}

export default function CertificateCanvas({ pageNumber, isEditing = true }: CertificateCanvasProps) {
  const template = useCertificateStore((state) => state.template);
  const dynamicData = useCertificateStore((state) => state.dynamicData);
  const selectedComponentId = useCertificateStore((state) => state.selectedComponentId);
  const updateComponentLayout = useCertificateStore((state) => state.updateComponentLayout);
  const updateComponentPosition = useCertificateStore((state) => state.updateComponentPosition);
  const toggleComponentPositionMode = useCertificateStore((state) => state.toggleComponentPositionMode);
  const setSelectedComponent = useCertificateStore((state) => state.setSelectedComponent);
  const [backgroundImageLoaded, setBackgroundImageLoaded] = useState(false);
  const [backgroundImageError, setBackgroundImageError] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [draggingComponent, setDraggingComponent] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [componentStart, setComponentStart] = useState({ left: 0, top: 0 });

  const currentPage = template?.pages.find((p) => p.pageNumber === pageNumber);
  const backgroundImage = currentPage?.backgroundImage;

  // Reset background image states when page changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setBackgroundImageLoaded(false);
      setBackgroundImageError(false);
      setImageDimensions({ width: 0, height: 0 });
    }, 0);
    return () => clearTimeout(timer);
  }, [backgroundImage]);

  // Drag and drop handlers for free positioning
  const handleMouseDown = (e: React.MouseEvent, componentId: string) => {
    if (!isEditing) return;

    const component = currentPage?.components.find(c => c.id === componentId);
    if (!component || component.layout.positionMode !== 'free') return;

    e.preventDefault();
    setDraggingComponent(componentId);
    setDragStart({ x: e.clientX, y: e.clientY });
    setComponentStart({
      left: component.layout.left || 0,
      top: component.layout.top || 0
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingComponent || !isEditing) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    const newLeft = Math.max(0, componentStart.left + deltaX);
    const newTop = Math.max(0, componentStart.top + deltaY);

    updateComponentPosition(pageNumber, draggingComponent, {
      left: newLeft,
      top: newTop,
    });
  };

  const handleMouseUp = () => {
    setDraggingComponent(null);
  };

  const togglePositionMode = (componentId: string) => {
    toggleComponentPositionMode(pageNumber, componentId);
    // Force a re-render by updating a dummy state
    setTimeout(() => {
      setSelectedComponent(null);
      setTimeout(() => setSelectedComponent(componentId), 10);
    }, 100);
  };

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

  return (
    <div className="w-full bg-white border-2 border-gray-300 rounded-lg overflow-hidden" style={getCanvasStyle()}>
      <div
        className="p-4 h-full overflow-auto bg-gray-50 relative"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
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

        {/* All components using free positioning */}
        {currentPage.components.map((component) => (
          <div
            key={component.id}
            className={`absolute border-2 cursor-move transition-all ${
              backgroundImage && backgroundImageLoaded
                ? 'bg-white bg-opacity-90'
                : 'bg-white'
            } ${
              selectedComponentId === component.id ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-400'
            } ${
              draggingComponent === component.id ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{
              left: `${component.layout.left || 50}px`,
              top: `${component.layout.top || 50}px`,
              width: `${component.layout.width || 150}px`,
              height: `${component.layout.height || 50}px`,
              zIndex: selectedComponentId === component.id ? 10 : 2,
            }}
            onMouseDown={(e) => handleMouseDown(e, component.id)}
            onClick={() => setSelectedComponent(component.id)}
          >
            <CertificateComponentRenderer
              component={component}
              dynamicData={dynamicData}
              isSelected={selectedComponentId === component.id}
            />
            {isEditing && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePositionMode(component.id);
                }}
                className="absolute top-0 right-0 bg-purple-500 text-white text-xs px-1 py-0.5 rounded-bl hover:bg-purple-600"
                style={{ zIndex: 10 }}
              >
                Free
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
