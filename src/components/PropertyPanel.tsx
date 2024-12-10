import { FC, useState, useEffect } from 'react';
import { 
  FaFont, 
  FaPalette, 
  FaRuler, 
  FaSquare, 
  FaLayerGroup,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown
} from 'react-icons/fa';
import { 
  PanelContainer, 
  Section, 
  SectionTitle, 
  PropertyGroup,
  PropertyInput,
  PropertyLabel,
  PropertySelect,
  CollapseButton
} from './PropertyPanel.style';

export interface DivConfig {
  cols: number;
  height: string;
  backgroundColor: string;
  borderStyle: string;
  borderColor: string;
  borderWidth: string;
  borderRadius: string;
  padding: string;
  margin: string;
  display: string;
  boxShadow: string;
  shadowColor: string;
  shadowBlur: string;
  shadowSpread: string;
  shadowOffsetX: string;
  shadowOffsetY: string;
  dropPosition: string;
}

export interface TitleConfig {
  text: string;
  fontSize: string;
  color: string;
  align: 'left' | 'center' | 'right';
}

interface PropertyPanelProps {
  selectedComponent: string | null;
  divConfig: DivConfig;
  titleConfig?: TitleConfig;
  onConfigUpdate: (config: DivConfig) => void;
  onTitleConfigUpdate?: (config: TitleConfig) => void;
}

interface SpacingValues {
  top: string;
  right: string;
  bottom: string;
  left: string;
}

interface BorderValues {
  top: string;
  right: string;
  bottom: string;
  left: string;
}

interface PropertyGroupProps {
  isCollapsed?: boolean;
  children: React.ReactNode;
}

const PropertyPanel: FC<PropertyPanelProps> = ({ 
  selectedComponent, 
  divConfig,
  titleConfig,
  onConfigUpdate,
  onTitleConfigUpdate
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    dimensions: false,
    appearance: true,
    border: true,
    spacing: true,
    layout: true
  });
  const [activeSpacing, setActiveSpacing] = useState<'padding' | 'margin'>('padding');
  const [spacingValues, setSpacingValues] = useState({
    padding: {
      top: '0',
      right: '0',
      bottom: '0',
      left: '0'
    },
    margin: {
      top: '0',
      right: '0',
      bottom: '0',
      left: '0'
    }
  });
  const [borderValues, setBorderValues] = useState<BorderValues>({
    top: '0',
    right: '0',
    bottom: '0',
    left: '0'
  });

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    if (selectedComponent) {
      setIsCollapsed(false);
    }
  }, [selectedComponent]);

  useEffect(() => {
    if (divConfig) {
      const paddingMatch = divConfig.padding?.match(/(\d+)px\s+(\d+)px\s+(\d+)px\s+(\d+)px/);
      const marginMatch = divConfig.margin?.match(/(\d+)px\s+(\d+)px\s+(\d+)px\s+(\d+)px/);
      const borderMatch = divConfig.borderWidth?.match(/(\d+)px\s+(\d+)px\s+(\d+)px\s+(\d+)px/);

      setSpacingValues({
        padding: {
          top: paddingMatch?.[1] || '0',
          right: paddingMatch?.[2] || '0',
          bottom: paddingMatch?.[3] || '0',
          left: paddingMatch?.[4] || '0',
        },
        margin: {
          top: marginMatch?.[1] || '0',
          right: marginMatch?.[2] || '0',
          bottom: marginMatch?.[3] || '0',
          left: marginMatch?.[4] || '0',
        }
      });

      setBorderValues({
        top: borderMatch?.[1] || '0',
        right: borderMatch?.[2] || '0',
        bottom: borderMatch?.[3] || '0',
        left: borderMatch?.[4] || '0'
      });
    }
  }, [divConfig]);

  const handleConfigChange = (field: keyof DivConfig, value: string | number) => {
    onConfigUpdate({
      ...divConfig,
      [field]: value
    });
  };

  const handleSpacingChange = (type: 'padding' | 'margin', side: keyof SpacingValues, value: string) => {
    const newValues = {
      ...spacingValues,
      [type]: {
        ...spacingValues[type],
        [side]: value
      }
    };
    setSpacingValues(newValues);

    const spacingString = `${newValues[type].top}px ${newValues[type].right}px ${newValues[type].bottom}px ${newValues[type].left}px`;
    handleConfigChange(type, spacingString);
  };

  const handleBorderChange = (side: keyof BorderValues, value: string) => {
    const newValues = {
      ...borderValues,
      [side]: value
    };
    setBorderValues(newValues);

    const borderString = `${newValues.top}px ${newValues.right}px ${newValues.bottom}px ${newValues.left}px`;
    handleConfigChange('borderWidth', borderString);
  };

  const renderSpacingControl = () => (
    <>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <button
          onClick={() => setActiveSpacing('padding')}
          style={{
            background: activeSpacing === 'padding' ? '#2196F3' : 'white',
            color: activeSpacing === 'padding' ? 'white' : '#666',
            border: '1px solid #ddd',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          Padding
        </button>
        <button
          onClick={() => setActiveSpacing('margin')}
          style={{
            background: activeSpacing === 'margin' ? '#2196F3' : 'white',
            color: activeSpacing === 'margin' ? 'white' : '#666',
            border: '1px solid #ddd',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          Margin
        </button>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '4px',
        width: '120px',
        margin: '0'
      }}>
        {/* Top */}
        <div />
        <PropertyInput
          type="number"
          value={spacingValues[activeSpacing].top}
          onChange={(e) => handleSpacingChange(activeSpacing, 'top', e.target.value)}
          style={{ width: '40px', fontSize: '12px', textAlign: 'center' }}
          min="0"
        />
        <div />

        {/* Left - Box - Right */}
        <PropertyInput
          type="number"
          value={spacingValues[activeSpacing].left}
          onChange={(e) => handleSpacingChange(activeSpacing, 'left', e.target.value)}
          style={{ width: '40px', fontSize: '12px', textAlign: 'center' }}
          min="0"
        />
        <div style={{ 
          border: '1px solid #ddd',
          height: '40px',
          width: '40px',
          margin: '0 auto',
          backgroundColor: '#f5f5f5'
        }} />
        <PropertyInput
          type="number"
          value={spacingValues[activeSpacing].right}
          onChange={(e) => handleSpacingChange(activeSpacing, 'right', e.target.value)}
          style={{ width: '40px', fontSize: '12px', textAlign: 'center' }}
          min="0"
        />

        {/* Bottom */}
        <div />
        <PropertyInput
          type="number"
          value={spacingValues[activeSpacing].bottom}
          onChange={(e) => handleSpacingChange(activeSpacing, 'bottom', e.target.value)}
          style={{ width: '40px', fontSize: '12px', textAlign: 'center' }}
          min="0"
        />
        <div />
      </div>
    </>
  );

  const renderBorderControl = () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '4px',
      width: '120px',
      margin: '0'
    }}>
      <div />
      <PropertyInput
        type="number"
        value={borderValues.top}
        onChange={(e) => handleBorderChange('top', e.target.value)}
        style={{ width: '40px', fontSize: '12px', textAlign: 'center' }}
        min="0"
      />
      <div />

      <PropertyInput
        type="number"
        value={borderValues.left}
        onChange={(e) => handleBorderChange('left', e.target.value)}
        style={{ width: '40px', fontSize: '12px', textAlign: 'center' }}
        min="0"
      />
      <div style={{ 
        border: '1px solid #ddd',
        height: '40px',
        width: '40px',
        margin: '0 auto',
        backgroundColor: '#f5f5f5'
      }} />
      <PropertyInput
        type="number"
        value={borderValues.right}
        onChange={(e) => handleBorderChange('right', e.target.value)}
        style={{ width: '40px', fontSize: '12px', textAlign: 'center' }}
        min="0"
      />

      <div />
      <PropertyInput
        type="number"
        value={borderValues.bottom}
        onChange={(e) => handleBorderChange('bottom', e.target.value)}
        style={{ width: '40px', fontSize: '12px', textAlign: 'center' }}
        min="0"
      />
      <div />
    </div>
  );

  if (!selectedComponent) {
    return (
      <PanelContainer isCollapsed={isCollapsed}>
        <CollapseButton isCollapsed={isCollapsed} onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <FaChevronLeft /> : <FaChevronRight />}
        </CollapseButton>
        {!isCollapsed && <p>Selecione um componente para editar</p>}
      </PanelContainer>
    );
  }

  const renderProperties = () => {
    switch (selectedComponent) {
      case 'div':
        return (
          <>
            <Section>
              <SectionTitle onClick={() => toggleSection('dimensions')}>
                <FaLayerGroup />
                <span>Dimensões</span>
                <FaChevronDown className={`collapse-icon ${collapsedSections.dimensions ? 'collapsed' : ''}`} />
              </SectionTitle>
              <PropertyGroup isCollapsed={collapsedSections.dimensions}>
                <PropertyLabel>Largura (Colunas)</PropertyLabel>
                <PropertySelect
                  value={divConfig.cols}
                  onChange={(e) => handleConfigChange('cols', Number(e.target.value))}
                >
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(col => (
                    <option key={col} value={col}>
                      Col-{col} ({Math.round((col/12) * 100)}%)
                    </option>
                  ))}
                </PropertySelect>
                <PropertyLabel>Altura</PropertyLabel>
                <PropertyInput 
                  type="text" 
                  value={divConfig.height}
                  onChange={(e) => handleConfigChange('height', e.target.value)}
                />
              </PropertyGroup>
            </Section>

            <Section>
              <SectionTitle onClick={() => toggleSection('appearance')}>
                <FaPalette />
                <span>Aparência</span>
                <FaChevronDown className={`collapse-icon ${collapsedSections.appearance ? 'collapsed' : ''}`} />
              </SectionTitle>
              <PropertyGroup isCollapsed={collapsedSections.appearance}>
                <PropertyLabel>Background</PropertyLabel>
                <PropertyInput 
                  type="color" 
                  value={divConfig.backgroundColor}
                  onChange={(e) => handleConfigChange('backgroundColor', e.target.value)}
                />

                <PropertyLabel>Sombra</PropertyLabel>
                <PropertySelect
                  value={divConfig.boxShadow}
                  onChange={(e) => {
                    handleConfigChange('boxShadow', e.target.value);
                    if (e.target.value === 'none') {
                      handleConfigChange('shadowColor', '#000000');
                      handleConfigChange('shadowBlur', '0');
                      handleConfigChange('shadowSpread', '0');
                      handleConfigChange('shadowOffsetX', '0');
                      handleConfigChange('shadowOffsetY', '0');
                    }
                  }}
                >
                  <option value="none">Sem sombra</option>
                  <option value="custom">Personalizada</option>
                </PropertySelect>

                {divConfig.boxShadow === 'custom' && (
                  <>
                    <PropertyLabel>Cor da Sombra</PropertyLabel>
                    <PropertyInput 
                      type="color" 
                      value={divConfig.shadowColor}
                      onChange={(e) => handleConfigChange('shadowColor', e.target.value)}
                    />

                    <PropertyLabel>Desfoque (px)</PropertyLabel>
                    <PropertyInput 
                      type="number" 
                      value={divConfig.shadowBlur}
                      onChange={(e) => handleConfigChange('shadowBlur', e.target.value)}
                      min="0"
                    />

                    <PropertyLabel>Espalhamento (px)</PropertyLabel>
                    <PropertyInput 
                      type="number" 
                      value={divConfig.shadowSpread}
                      onChange={(e) => handleConfigChange('shadowSpread', e.target.value)}
                    />

                    <PropertyLabel>Deslocamento X (px)</PropertyLabel>
                    <PropertyInput 
                      type="number" 
                      value={divConfig.shadowOffsetX}
                      onChange={(e) => handleConfigChange('shadowOffsetX', e.target.value)}
                    />

                    <PropertyLabel>Deslocamento Y (px)</PropertyLabel>
                    <PropertyInput 
                      type="number" 
                      value={divConfig.shadowOffsetY}
                      onChange={(e) => handleConfigChange('shadowOffsetY', e.target.value)}
                    />
                  </>
                )}
              </PropertyGroup>
            </Section>

            <Section>
              <SectionTitle onClick={() => toggleSection('border')}>
                <FaSquare />
                <span>Borda</span>
                <FaChevronDown className={`collapse-icon ${collapsedSections.border ? 'collapsed' : ''}`} />
              </SectionTitle>
              <PropertyGroup isCollapsed={collapsedSections.border}>
                <PropertyLabel>Estilo da Borda</PropertyLabel>
                <PropertySelect
                  value={divConfig.borderStyle}
                  onChange={(e) => handleConfigChange('borderStyle', e.target.value)}
                >
                  <option value="none">Nenhuma</option>
                  <option value="solid">Sólida</option>
                  <option value="dashed">Tracejada</option>
                  <option value="dotted">Pontilhada</option>
                  <option value="double">Dupla</option>
                </PropertySelect>

                <PropertyLabel>Cor da Borda</PropertyLabel>
                <PropertyInput 
                  type="color" 
                  value={divConfig.borderColor}
                  onChange={(e) => handleConfigChange('borderColor', e.target.value)}
                />

                <PropertyLabel>Espessura da Borda</PropertyLabel>
                {renderBorderControl()}

                <PropertyLabel>Arredondamento</PropertyLabel>
                <PropertyInput 
                  type="text" 
                  value={divConfig.borderRadius}
                  onChange={(e) => handleConfigChange('borderRadius', e.target.value)}
                  placeholder="Ex: 8px"
                />
              </PropertyGroup>
            </Section>

            <Section>
              <SectionTitle onClick={() => toggleSection('spacing')}>
                <FaRuler />
                <span>Espaçamento</span>
                <FaChevronDown className={`collapse-icon ${collapsedSections.spacing ? 'collapsed' : ''}`} />
              </SectionTitle>
              <PropertyGroup isCollapsed={collapsedSections.spacing}>
                {renderSpacingControl()}
              </PropertyGroup>
            </Section>

            <Section>
              <SectionTitle onClick={() => toggleSection('layout')}>
                <FaLayerGroup />
                <span>Layout</span>
                <FaChevronDown className={`collapse-icon ${collapsedSections.layout ? 'collapsed' : ''}`} />
              </SectionTitle>
              <PropertyGroup isCollapsed={collapsedSections.layout}>
                <PropertyLabel>Display</PropertyLabel>
                <PropertySelect
                  value={divConfig.display}
                  onChange={(e) => handleConfigChange('display', e.target.value)}
                >
                  <option value="block">Block (Empilhado)</option>
                  <option value="inline-block">Inline Block (Lado a Lado)</option>
                </PropertySelect>
              </PropertyGroup>
            </Section>
          </>
        );

      case 'title':
        return (
          <>
            <Section>
              <SectionTitle>
                <FaFont />
                <span>Texto</span>
              </SectionTitle>
              <PropertyGroup>
                <PropertyLabel>Texto do Título</PropertyLabel>
                <PropertyInput
                  type="text"

                  onChange={(e) => onTitleConfigUpdate?.({
                    ...titleConfig!,
                    text: e.target.value
                  })}
                  placeholder="Digite o texto do título"
                />
                <PropertyLabel>Fonte</PropertyLabel>
                <PropertySelect
                  value={titleConfig?.fontSize || ''}
                  onChange={(e) => onTitleConfigUpdate?.({
                    ...titleConfig!,
                    fontSize: e.target.value
                  })}
                >
                  <option value="24px">24px</option>
                  <option value="32px">32px</option>
                  <option value="48px">48px</option>
                </PropertySelect>
                <PropertyLabel>Cor</PropertyLabel>
                <PropertyInput 
                  type="color"
                  value={titleConfig?.color || '#000000'}
                  onChange={(e) => onTitleConfigUpdate?.({
                    ...titleConfig!,
                    color: e.target.value
                  })}
                />
              </PropertyGroup>
            </Section>
          </>
        );

      case 'paragraph':
        return (
          <>
            <Section>
              <SectionTitle>
                <FaFont />
                <span>Texto</span>
              </SectionTitle>
              <PropertyGroup>
                <PropertyLabel>Fonte</PropertyLabel>
                <PropertySelect>
                  <option>Arial</option>
                  <option>Helvetica</option>
                  <option>Times New Roman</option>
                </PropertySelect>
                <PropertyLabel>Tamanho</PropertyLabel>
                <PropertyInput type="number" min="8" max="72" />
                <PropertyLabel>Cor</PropertyLabel>
                <PropertyInput type="color" />
              </PropertyGroup>
            </Section>
          </>
        );

      case 'input':
      case 'select':
        return (
          <>
            <Section>
              <SectionTitle>
                <FaRuler />
                <span>Dimensões</span>
              </SectionTitle>
              <PropertyGroup>
                <PropertyLabel>Largura</PropertyLabel>
                <PropertySelect>
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(col => (
                    <option key={col} value={col}>Col-{col}</option>
                  ))}
                </PropertySelect>
              </PropertyGroup>
            </Section>

            <Section>
              <SectionTitle>
                <FaSquare />
                <span>Borda</span>
              </SectionTitle>
              <PropertyGroup>
                <PropertyLabel>Estilo</PropertyLabel>
                <PropertySelect>
                  <option>solid</option>
                  <option>dashed</option>
                  <option>dotted</option>
                </PropertySelect>
                <PropertyLabel>Cor</PropertyLabel>
                <PropertyInput type="color" />
              </PropertyGroup>
            </Section>
          </>   
        );

      default:
        return null;
    }
  };

  return (
    <PanelContainer isCollapsed={isCollapsed}>
      <CollapseButton isCollapsed={isCollapsed} onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? <FaChevronLeft /> : <FaChevronRight />}
      </CollapseButton>
      {!isCollapsed && renderProperties()}
    </PanelContainer>
  );
};

export default PropertyPanel;
