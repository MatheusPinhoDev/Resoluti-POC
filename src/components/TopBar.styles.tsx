import styled from 'styled-components';

interface NavButtonProps {
  active?: boolean;
}

export const TopBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;

  > div {
    display: flex;
    gap: 10px;
  }
`;

export const NavButton = styled.button<NavButtonProps>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  background-color: ${props => props.active ? '#e0e0e0' : 'transparent'};
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #e0e0e0;
  }

  svg {
    font-size: 16px;
  }
`;
