import React from 'react';
import { TitleConfig } from './PropertyPanel';

interface TitleContainerProps {
  id: string;
  config: TitleConfig;
  onTitleClick: (id: string) => void;
  onRemoveTitle: (id: string) => void;
}

const TitleContainer: React.FC<TitleContainerProps> = ({
  id,
  config,
  onTitleClick,
  onRemoveTitle
}) => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onTitleClick(id);
      }}
      style={{
        position: 'relative',
        cursor: 'pointer',
        padding: '8px',
      }}
    >
      <h1
        style={{
          fontSize: config.fontSize,
          color: config.color,
          textAlign: config.align,
          margin: 0,
        }}
      >
        {config.text}
      </h1>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemoveTitle(id);
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
        }}
      >
        ×
      </button>
    </div>
  );
};

export default TitleContainer;
export type { TitleConfig };
