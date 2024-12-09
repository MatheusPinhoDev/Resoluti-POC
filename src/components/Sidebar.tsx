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
}

const Sidebar: FC<SidebarProps> = ({ onSelectComponent, setComponents }) => {
  const handleDragStart = (e: React.DragEvent, componentType: string) => {
    e.dataTransfer.setData('componentType', componentType);
  };

  return (
    <SidebarContainer>
      <MenuButton 
        draggable
        onDragStart={(e) => handleDragStart(e, 'div')}
        onClick={() => onSelectComponent('div')}
      >
        <FaAlignLeft />
        <span>Div</span>
      </MenuButton>

      <MenuButton 
        draggable
        onDragStart={(e) => handleDragStart(e, 'title')}
        onClick={() => onSelectComponent('title')}
      >
        <FaFont />
        <span>Título</span>
      </MenuButton>

      <MenuButton onClick={() => onSelectComponent('paragraph')}>
        <FaParagraph />
        <span>Parágrafo</span>
      </MenuButton>

      <MenuButton onClick={() => onSelectComponent('input')}>
        <FaKeyboard />
        <span>Input</span>
      </MenuButton>

      <MenuButton onClick={() => onSelectComponent('select')}>
        <FaListUl />
        <span>Select</span>
      </MenuButton>
    </SidebarContainer>
  );
};

export default Sidebar; 