import styled from 'styled-components';

interface PropertyGroupProps {
  isCollapsed?: boolean;
}

export const PanelContainer = styled.div<{ isCollapsed: boolean }>`
  position: relative;
  width: ${props => props.isCollapsed ? '50px' : '350px'};
  height: 100vh;
  background-color: #f5f5f5;
  padding: ${props => props.isCollapsed ? '20px 10px' : '20px'};
  border-left: 1px solid #e0e0e0;
  overflow-y: auto;
  transition: all 0.3s ease;
`;

export const CollapseButton = styled.button<{ isCollapsed: boolean }>`
  position: absolute;
  top: 20px;
  right: ${props => props.isCollapsed ? '10px' : '20px'};
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: #f0f0f0;
  }
`;

export const Section = styled.div`
  margin-bottom: 24px;
`;

export const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  cursor: pointer;
  user-select: none;

  svg {
    font-size: 16px;
  }

  .collapse-icon {
    margin-left: auto;
    transition: transform 0.3s ease;
    
    &.collapsed {
      transform: rotate(-90deg);
    }
  }
`;

export const PropertyGroup = styled.div<PropertyGroupProps>`
  display: ${props => props.isCollapsed ? 'none' : 'flex'};
  flex-direction: column;
  gap: 8px;
  padding: 0 8px;
  transition: all 0.3s ease;
`;

export const PropertyLabel = styled.label`
  font-size: 12px;
  color: #666;
  margin-top: 8px;
`;

export const PropertyInput = styled.input`
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  background-color: white;
  width: 100%;
  max-width: 160px;

  &[type="color"] {
    height: 32px;
    padding: 2px;
    width: 80px;
  }

  &[type="range"] {
    padding: 0;
  }
`;

export const PropertySelect = styled.select`
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  background-color: white;
  width: 100%;
  max-width: 160px;
`;
