import React from 'react';
import { DivConfig } from './PropertyPanel';

interface DivContainerProps {
  id: string;
  config: DivConfig;
  children?: DivComponent[];
  onDivClick: (id: string) => void;
  onRemoveDiv: (id: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, parentId: string) => void;
  selectedDivId: string | null;
}

interface DivComponent {
  id: string;
  config: DivConfig;
  children?: DivComponent[];
}

const DivContainer: React.FC<DivContainerProps> = ({
  id,
  config,
  children,
  onDivClick,
  onRemoveDiv,
  onDragOver,
  onDrop,
  selectedDivId
}) => {
  const isSelected = id === selectedDivId;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onDivClick(id);
      }}
      onDragOver={onDragOver}
      onDrop={(e) => {
        e.stopPropagation();
        onDrop(e, id);
      }}
      style={{
        width: `${(config.cols / 12) * 100}%`,
        height: config.height,
        backgroundColor: config.backgroundColor,
        borderStyle: config.borderStyle,
        borderColor: config.borderColor,
        borderWidth: config.borderWidth,
        borderRadius: config.borderRadius,
        padding: config.padding || '0',
        margin: config.margin || '0',
        display: config.display || 'block',
        position: 'relative',
        cursor: 'pointer',
        minHeight: '50px',
        outline: isSelected ? '2px solid #2196F3' : 'none',
        boxShadow: config.boxShadow === 'custom' 
          ? `${config.shadowOffsetX}px ${config.shadowOffsetY}px ${config.shadowBlur}px ${config.shadowSpread}px ${config.shadowColor}`
          : isSelected ? '0 0 10px rgba(33, 150, 243, 0.3)' : 'none',
        transition: 'outline 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemoveDiv(id);
          }}
          style={{
            position: 'absolute',
            top: '5px',
            right: '5px',
            background: 'red',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            cursor: 'pointer',
            zIndex: 1,
          }}
        >
          ×
        </button>
      )}
      {children?.map((child) => (
        <DivContainer
          key={child.id}
          {...child}
          onDivClick={onDivClick}
          onRemoveDiv={onRemoveDiv}
          onDragOver={onDragOver}
          onDrop={onDrop}
          selectedDivId={selectedDivId}
        />
      ))}
    </div>
  );
};

export default DivContainer;
export type { DivComponent };