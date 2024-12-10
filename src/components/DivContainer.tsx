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

  const containerStyle: React.CSSProperties = {
    width: `calc(${(config.cols / 12) * 100}% - 10px)`,
    height: config.height,
    backgroundColor: config.backgroundColor,
    borderStyle: config.borderStyle,
    borderColor: config.borderColor,
    borderWidth: config.borderWidth,
    borderRadius: config.borderRadius,
    padding: config.padding,
    margin: config.margin,
    display: 'inline-block',
    position: 'relative',
    cursor: 'pointer',
    minHeight: '50px',
    outline: isSelected ? '2px solid #2196F3' : 'none',
    boxShadow: config.boxShadow === 'custom' 
      ? `${config.shadowOffsetX}px ${config.shadowOffsetY}px ${config.shadowBlur}px ${config.shadowSpread}px ${config.shadowColor}`
      : isSelected ? '0 0 10px rgba(33, 150, 243, 0.3)' : 'none',
    transition: 'all 0.2s ease',
    verticalAlign: 'top',
    boxSizing: 'border-box',
    overflow: children?.length ? 'auto' : 'visible',
  };

  const childrenContainerStyle: React.CSSProperties = {
    width: '100%',
    minHeight: '100%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: '10px',
    alignItems: 'stretch',
  };

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
      style={containerStyle}
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

