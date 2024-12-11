import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/Topbar';
import styled from 'styled-components';
import PropertyPanel from '@/components/PropertyPanel';
import { DivConfig } from '@/components/PropertyPanel';
import DivContainer, { DivComponent } from '@/components/DivContainer';

interface SidebarProps {
  onSelectComponent: (component: string) => void;
  setComponents: React.Dispatch<React.SetStateAction<DivComponent[]>>;
}

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  min-height: 0;
  overflow: hidden;
`;

const SidebarWrapper = styled.div`
  width: 250px;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  background-color: #f5f5f5;
  z-index: 10;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  > * {
    overflow-y: auto;
    overflow-x: hidden;
    flex: 1;
  }
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 4px;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 20px;
  overflow-x: auto;
  overflow-y: auto;
  min-height: 100%;
  width: 100%;
`;

const DesignerArea = styled.div`
  flex: 1;
  height: 100%;
  padding: 20px;
  text-align: left;
  font-size: 0;
  & > * {
    font-size: 1rem;
  }
`;

const StrictPreviewDiv = styled.div<{ config: DivConfig }>`
  width: ${props => `calc(${(props.config.cols / 12) * 100}% - 10px)`};
  height: ${props => props.config.height};
  background-color: ${props => props.config.backgroundColor};
  border-style: ${props => props.config.borderStyle};
  border-color: ${props => props.config.borderColor};
  border-width: ${props => props.config.borderWidth};
  border-radius: ${props => props.config.borderRadius};
  padding: ${props => props.config.padding};
  margin: ${props => props.config.margin};
  display: inline-block;
  position: relative;
  min-height: 50px;
  vertical-align: top;
  box-sizing: border-box;
  overflow: ${props => props.children ? 'auto' : 'visible'};
  box-shadow: ${props => 
    props.config.boxShadow === 'custom' 
      ? `${props.config.shadowOffsetX}px ${props.config.shadowOffsetY}px ${props.config.shadowBlur}px ${props.config.shadowSpread}px ${props.config.shadowColor}`
      : 'none'
  };
`;

const PropertyPanelContainer = styled.div`
  width: 300px;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  background-color: #f5f5f5;
  z-index: 10;
  box-sizing: border-box;
  
  > * {
    height: auto;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
  }
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 4px;
  }
`;

const renderPreviewComponent = (component: DivComponent) => {
  return (
    <StrictPreviewDiv 
      key={component.id} 
      config={component.config}
    >
      {component.children?.map(child => renderPreviewComponent(child))}
    </StrictPreviewDiv>
  );
};

const calculateRequiredSpace = (children: DivComponent[]) => {
  let maxHeight = 0;
  let totalWidth = 0;
  let maxRowWidth = 0;
  const padding = 0.06; // 6% total padding (3% each side)

  children.forEach(child => {
    const childHeight = parseFloat(child.config.height.replace('%', ''));
    const childWidth = (child.config.cols / 12) * 100;
    
    // Adiciona o padding ao tamanho do filho
    const childHeightWithPadding = childHeight * (1 + padding);
    const childWidthWithPadding = childWidth * (1 + padding);

    // Atualiza a altura máxima
    maxHeight = Math.max(maxHeight, childHeightWithPadding);

    // Soma a largura total
    totalWidth += childWidthWithPadding;

    // Se a largura total ultrapassar 100%, começa uma nova linha
    if (totalWidth > 100) {
      maxRowWidth = Math.max(maxRowWidth, totalWidth - childWidthWithPadding);
      totalWidth = childWidthWithPadding;
      maxHeight += childHeightWithPadding; // Adiciona altura para nova linha
    }
  });

  // Pega a maior largura entre a última linha e as anteriores
  maxRowWidth = Math.max(maxRowWidth, totalWidth);

  return {
    requiredHeight: Math.ceil(maxHeight),
    requiredCols: Math.ceil((maxRowWidth / 100) * 12)
  };
};

const generateUniqueId = () => `div-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

function App() {
  const [activeView, setActiveView] = useState('designer');
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [divConfigs, setDivConfigs] = useState<DivConfig>({
    cols: 12,
    height: '30%',
    backgroundColor: '#d1d1d1',
    borderStyle: 'none',
    borderColor: '#000000',
    borderWidth: '1px',
    borderRadius: '0px',
    padding: '10px',
    margin: '0px',
    display: 'block',
    boxShadow: 'none',
    shadowColor: '#000000',
    shadowBlur: '0',
    shadowSpread: '0',
    shadowOffsetX: '0',
    shadowOffsetY: '0',
    dropPosition: 'beside'
  });
  const [components, setComponents] = useState<DivComponent[]>([]);
  const [selectedDivId, setSelectedDivId] = useState<string | null>(null);
  const [history, setHistory] = useState<DivComponent[][]>([[]]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [defaultDivConfig, setDefaultDivConfig] = useState<DivConfig>(divConfigs);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const savedConfig = localStorage.getItem('defaultDivConfig');
    if (savedConfig) {
      setDefaultDivConfig(JSON.parse(savedConfig));
    }
  }, []);

  const handleComponentSelect = (component: string) => {
    setSelectedComponent(component);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const addToHistory = (newComponents: DivComponent[]) => {
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push([...newComponents]);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };

  const handleDuplicate = () => {
    if (selectedDivId) {
      const duplicateComponent = (components: DivComponent[]): DivComponent[] => {
        return components.map(comp => {
          if (comp.id === selectedDivId) {
            const deepDuplicate = (component: DivComponent): DivComponent => ({
              ...component,
              id: generateUniqueId(),
              config: { ...component.config },
              children: component.children?.map(child => deepDuplicate(child)) || []
            });
            return [comp, deepDuplicate(comp)];
          }
          if (comp.children) {
            const newChildren = duplicateComponent(comp.children);
            if (Array.isArray(newChildren[0])) {
              return { ...comp, children: newChildren.flat() };
            }
          }
          return comp;
        }).flat();
      };

      setComponents(prev => {
        const newComponents = duplicateComponent(prev);
        addToHistory(newComponents);
        return newComponents;
      });
    }
  };

  const handleDrop = (e: React.DragEvent, parentId?: string) => {
    e.preventDefault();
    const componentType = e.dataTransfer.getData('componentType');
    
    if (componentType === 'div' && selectedComponent === 'div') {
      const mouseX = e.clientX;
      
      const newDiv: DivComponent = {
        id: `div-${Date.now()}`,
        config: {
          ...defaultDivConfig,
          cols: 12,
          height: '30%',
        },
        children: []
      };

      setComponents(prev => {
        if (!parentId) {
          let insertIndex = prev.length;
          const containers = document.querySelectorAll(`#designer-area > [id^="div-"]`);
          
          for (let i = 0; i < containers.length; i++) {
            const rect = containers[i].getBoundingClientRect();
            if (mouseX < rect.right) {
              insertIndex = i;
              break;
            }
          }
          
          const newComponents = [...prev];
          newComponents.splice(insertIndex, 0, newDiv);
          addToHistory(newComponents);
          return newComponents;
        }

        const updateComponents = (components: DivComponent[]): DivComponent[] => {
          return components.map(comp => {
            if (comp.id === parentId) {
              const children = comp.children || [];
              let insertIndex = children.length;
              
              const childContainers = document.querySelectorAll(`#${parentId} > div > [id^="div-"]`);
              for (let i = 0; i < childContainers.length; i++) {
                const rect = childContainers[i].getBoundingClientRect();
                if (mouseX < rect.right) {
                  insertIndex = i;
                  break;
                }
              }

              const totalChildren = children.length + 1;
              const colsPerChild = Math.floor(12 / totalChildren);
              
              const updatedChildren = children.map(child => ({
                ...child,
                config: {
                  ...child.config,
                  cols: colsPerChild
                }
              }));
              
              const newChildDiv = {
                ...newDiv,
                config: {
                  ...newDiv.config,
                  cols: colsPerChild,
                  height: '30%',
                }
              };

              updatedChildren.splice(insertIndex, 0, newChildDiv);
              
              return {
                ...comp,
                children: updatedChildren
              };
            }
            
            if (comp.children) {
              return {
                ...comp,
                children: updateComponents(comp.children)
              };
            }
            
            return comp;
          });
        };

        const newComponents = updateComponents(prev);
        addToHistory(newComponents);
        return newComponents;
      });
    }
  };

  const handleRemoveDiv = (id: string) => {
    setComponents(prev => {
      const removeFromChildren = (components: DivComponent[]): DivComponent[] => {
        return components.filter(comp => {
          if (comp.id === id) return false;
          if (comp.children) {
            comp.children = removeFromChildren(comp.children);
          }
          return true;
        });
      };
      const newComponents = removeFromChildren(prev);
      addToHistory(newComponents);
      return newComponents;
    });
    
    if (selectedDivId === id) {
      setSelectedDivId(null);
    }
  };

  const handleDivClick = (id: string) => {
    setSelectedDivId(id);
    setSelectedComponent('div');
    
    const findDiv = (components: DivComponent[]): DivComponent | undefined => {
      for (const comp of components) {
        if (comp.id === id) return comp;
        if (comp.children) {
          const found = findDiv(comp.children);
          if (found) return found;
        }
      }
    };
    
    const selectedDiv = findDiv(components);
    if (selectedDiv) {
      setDivConfigs(selectedDiv.config);
    }
  };

  useEffect(() => {
    if (selectedDivId) {
      const updateDivConfig = (components: DivComponent[]): DivComponent[] => {
        return components.map(comp => {
          if (comp.id === selectedDivId) {
            return { ...comp, config: divConfigs };
          }
          if (comp.children) {
            return {
              ...comp,
              children: updateDivConfig(comp.children)
            };
          }
          return comp;
        });
      };

      setComponents(prev => {
        const newComponents = updateDivConfig(prev);
        addToHistory(newComponents);
        return newComponents;
      });
    }
  }, [divConfigs, selectedDivId]);

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setComponents(history[currentIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setComponents(history[currentIndex + 1]);
    }
  };

  const handleClear = () => {
    const newComponents: DivComponent[] = [];
    addToHistory(newComponents);
    setComponents(newComponents);
  };

  const handleDesignerClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedDivId(null);
      setSelectedComponent(null);
    }
  };

  const handleSetDefaultConfig = (config: DivConfig) => {
    setDefaultDivConfig(config);
    localStorage.setItem('defaultDivConfig', JSON.stringify(config));
  };

  const renderContent = () => {
    switch (activeView) {
      case 'designer':
        return (
          <DesignerArea
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e)}
            onClick={handleDesignerClick}
          >
            {components.map(comp => (
              <DivContainer
                key={comp.id}
                {...comp}
                selectedDivId={selectedDivId}
                onDivClick={handleDivClick}
                onRemoveDiv={handleRemoveDiv}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
            ))}
          </DesignerArea>
        );
      case 'preview':
        return (
          <div style={{ 
            padding: '20px',
            width: '100%',
            height: '100%',
            textAlign: 'left',
            fontSize: 0,
          }}>
            {components.map(comp => renderPreviewComponent(comp))}
          </div>
        );
      case 'json':
        return (
          <pre style={{ padding: '20px' }}>
            {JSON.stringify(components, null, 2)}
          </pre>
        );
      default:
        return null;
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <AppContainer>
      <TopBar 
        activeView={activeView}
        onViewChange={setActiveView}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
        onDuplicate={handleDuplicate}
        selectedDivId={selectedDivId}
      />
      <MainContent>
        {activeView !== 'preview' && (
          <SidebarWrapper>
            <Sidebar 
              onSelectComponent={handleComponentSelect} 
              setComponents={setComponents}
              setSelectedDivId={setSelectedDivId}
            />
          </SidebarWrapper>
        )}
        
        <ContentArea>
          {renderContent()}
        </ContentArea>
  
        {selectedComponent && activeView !== 'preview' && (
          <PropertyPanelContainer>
            <PropertyPanel 
              selectedComponent={selectedComponent}
              divConfig={divConfigs}
              onConfigUpdate={setDivConfigs}
              onSetDefaultConfig={handleSetDefaultConfig}
            />
          </PropertyPanelContainer>
        )}
      </MainContent>
    </AppContainer>
  );
}

export default App;