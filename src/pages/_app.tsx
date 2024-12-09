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
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  min-height: 100%;
`;

const DesignerArea = styled.div`
  flex: 1;
  height: 100%;
  padding: 20px;
`;

const PreviewDiv = styled.div<{ config: DivConfig; isChild?: boolean }>`
  width: ${props => props.isChild 
    ? `${(props.config.cols / 12) * 100}%`
    : `${(props.config.cols / 12) * 100}%`};
  height: ${props => props.config.height};
  background-color: ${props => props.config.backgroundColor};
  border-style: ${props => props.config.borderStyle};
  border-color: ${props => props.config.borderColor};
  border-width: ${props => props.config.borderWidth};
  border-radius: ${props => props.config.borderRadius};
  padding: ${props => props.config.padding || '0'};
  margin: ${props => props.config.margin || '0'};
  display: ${props => props.config.display || 'block'};
  position: relative;
  box-sizing: border-box;
  min-height: 50px;
`;

const PropertyPanelContainer = styled.div`
  width: 300px;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  background-color: #f5f5f5;
  z-index: 10;
`;

const renderPreviewComponent = (component: DivComponent) => {
  return (
    <PreviewDiv key={component.id} config={component.config}>
      {component.children?.map(child => renderPreviewComponent(child))}
    </PreviewDiv>
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

function App() {
  const [activeView, setActiveView] = useState('designer');
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [divConfigs, setDivConfigs] = useState<DivConfig>({
    cols: 6,
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
    shadowOffsetY: '0'
  });
  const [components, setComponents] = useState<DivComponent[]>([]);
  const [selectedDivId, setSelectedDivId] = useState<string | null>(null);
  const [history, setHistory] = useState<DivComponent[][]>([[]]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setIsClient(true);
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

  const handleDrop = (e: React.DragEvent, parentId?: string) => {
    e.preventDefault();
    const componentType = e.dataTransfer.getData('componentType');
    
    if (componentType === 'div' && selectedComponent === 'div') {
      // Converte a altura de px para % no novo div
      const newDivConfig = {
        ...divConfigs,
        height: divConfigs.height.includes('px') 
          ? `${parseFloat(divConfigs.height)}%` 
          : divConfigs.height
      };

      const newDiv: DivComponent = {
        id: `div-${Date.now()}`,
        config: newDivConfig,
        children: []
      };
      
      if (parentId) {
        const findParentDiv = (components: DivComponent[]): DivComponent | null => {
          for (const comp of components) {
            if (comp.id === parentId) return comp;
            if (comp.children) {
              const found = findParentDiv(comp.children);
              if (found) return found;
            }
          }
          return null;
        };

        const parentDiv = findParentDiv(components);

        if (parentDiv) {
          setComponents(prev => {
            const updateChildren = (components: DivComponent[]): DivComponent[] => {
              return components.map(comp => {
                if (comp.id === parentId) {
                  const newChildren = [...(comp.children || []), newDiv];
                  const { requiredHeight, requiredCols } = calculateRequiredSpace(newChildren);

                  // Atualiza as dimensões do pai usando porcentagem
                  return {
                    ...comp,
                    config: {
                      ...comp.config,
                      height: `${requiredHeight}%`,
                      cols: Math.min(12, requiredCols)
                    },
                    children: newChildren
                  };
                }
                if (comp.children) {
                  return {
                    ...comp,
                    children: updateChildren(comp.children)
                  };
                }
                return comp;
              });
            };
            const newComponents = updateChildren(prev);
            addToHistory(newComponents);
            return newComponents;
          });
        }
      } else {
        setComponents(prev => {
          const newComponents = [...prev, newDiv];
          addToHistory(newComponents);
          return newComponents;
        });
      }
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
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
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
      />
      <MainContent>
        <SidebarWrapper>
          <Sidebar 
            onSelectComponent={handleComponentSelect} 
            setComponents={setComponents}
          />
        </SidebarWrapper>
        <ContentArea>
          {renderContent()}
        </ContentArea>
        {selectedComponent && (
          <PropertyPanelContainer>
            <PropertyPanel 
              selectedComponent={selectedComponent}
              divConfig={divConfigs}
              onConfigUpdate={setDivConfigs}
            />
          </PropertyPanelContainer>
        )}
      </MainContent>
    </AppContainer>
  );
}

export default App;