import { FC } from 'react';
import { FaPaintBrush, FaEye, FaCode, FaUndo, FaRedo, FaEraser } from 'react-icons/fa';
import { TopBarContainer, NavButton } from './TopBar.styles';

interface TopBarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
}

const TopBar: FC<TopBarProps> = ({ activeView, onViewChange, onUndo, onRedo, onClear }) => {
  return (
    <TopBarContainer>
      <div>
        <NavButton 
          active={activeView === 'designer'}
          onClick={() => onViewChange('designer')}
        >
          <FaPaintBrush />
          <span>Designer</span>
        </NavButton>

        <NavButton 
          active={activeView === 'preview'}
          onClick={() => onViewChange('preview')}
        >
          <FaEye />
          <span>Preview</span>
        </NavButton>

        <NavButton 
          active={activeView === 'json'}
          onClick={() => onViewChange('json')}
        >
          <FaCode />
          <span>JSON Editor</span>
        </NavButton>
      </div>

      <div>
        <NavButton onClick={onUndo}>
          <FaUndo />
        </NavButton>
        <NavButton onClick={onRedo}>
          <FaRedo />
        </NavButton>
        <NavButton onClick={onClear}>
          <FaEraser />
        </NavButton>
      </div>
    </TopBarContainer>
  );
};

export default TopBar;
