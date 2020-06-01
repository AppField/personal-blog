import React, { useContext } from 'react';
import ThemeContext from '../theme/themeContext';
import { Theme } from '../theme';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

const StyledIcon = styled.span`
  position: absolute;
  top: 0;
  right: 0.5rem;
  font-size: 1.75rem;
  :hover {
    cursor: pointer;
  }
`;

const ThemeToggle = () => {
  const { colorMode, setColorMode } = useContext(ThemeContext);

  if (!colorMode) {
    return null;
  }

  const themeIcon = colorMode === Theme.Dark ? faMoon : faSun;

  return (
    <StyledIcon
      onClick={() =>
        setColorMode(colorMode === Theme.Dark ? Theme.Light : Theme.Dark)
      }
    >
      <FontAwesomeIcon icon={themeIcon} />
    </StyledIcon>
  );
};

export default ThemeToggle;
