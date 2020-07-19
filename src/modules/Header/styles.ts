import styled from 'styled-components/macro';
import { ReactComponent as SettingsIcon } from 'assets/icons/settings.svg';

export const LogoWrapper = styled.div`
  font-family: 'Roboto', sans-serif;
  color: var(--primary);
`;

export const Header = styled.header`
  padding: 1em;
  display: flex;
  justify-content: space-between;

  svg {
    @media print {
      display: none;
    }
  }
`;

export const SettingsIconBtn = styled(SettingsIcon)`
  cursor: pointer;
`;
