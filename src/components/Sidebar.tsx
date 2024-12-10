import { FC } from 'react';
import { 
  FaAlignLeft, 
  FaFont, 
  FaParagraph, 
  FaKeyboard, 
  FaListUl 
} from 'react-icons/fa';
import { SidebarContainer, MenuButton } from './Sidebar.styles';
import { DivComponent } from './DivContainer';

interface SidebarProps {
  onSelectComponent: (component: string) => void;
  setComponents: React.Dispatch<React.SetStateAction<DivComponent[]>>;
  setSelectedDivId: (id: string | null) => void;
}

const Sidebar: FC<SidebarProps> = ({ 
  onSelectComponent, 
  setComponents, 
  setSelectedDivId 
}) => {
  const handleDragStart = (e: React.DragEvent, componentType: string) => {
    e.dataTransfer.setData('componentType', componentType);
  };

  const handleComponentClick = (componentType: string) => {
    setSelectedDivId(null);
    onSelectComponent(componentType);
  };

  return (
    <SidebarContainer>
      <MenuButton 
        draggable
        onDragStart={(e) => handleDragStart(e, 'div')}
        onClick={() => handleComponentClick('div')}
      >
        <FaAlignLeft />
        <span>Div</span>
      </MenuButton>

      <MenuButton 
        draggable
        onDragStart={(e) => handleDragStart(e, 'title')}
        onClick={() => handleComponentClick('title')}
      >
        <FaFont />
        <span>Título</span>
      </MenuButton>

      <MenuButton onClick={() => handleComponentClick('paragraph')}>
        <FaParagraph />
        <span>Parágrafo</span>
      </MenuButton>

      <MenuButton onClick={() => handleComponentClick('input')}>
        <FaKeyboard />
        <span>Input</span>
      </MenuButton>

      <MenuButton onClick={() => handleComponentClick('select')}>
        <FaListUl />
        <span>Select</span>
      </MenuButton>
    </SidebarContainer>
  );
};

export default Sidebar; 