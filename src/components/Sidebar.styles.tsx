import styled from 'styled-components';

export const SidebarContainer = styled.div`
  width: 150px;
  height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const MenuButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 6px;
  background-color: transparent;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  svg {
    font-size: 18px;
  }

  span {
    font-size: 14px;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.8);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;