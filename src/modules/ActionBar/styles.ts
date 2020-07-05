import styled, { css } from 'styled-components/macro';
import { ReactComponent as PauseIcon } from 'assets/icons/pause-outline.svg';

export const Sticky = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding-bottom: 10px;
  padding-top: 10px;
`;

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 1em;
  align-items: center;
  width: 85%;
  margin: 0 auto;
  padding: 0.5em 1em;
  box-shadow: 0px 0px 16px 0px rgba(160, 160, 160, 0.5);
  border-radius: 25px;
  background: #fff;
`;

export const Btn = styled.button<{ rotate?: boolean; active?: boolean }>`
  width: 32px;
  height: 32px;
  background: transparent;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  ${({ rotate }) =>
    rotate &&
    css`
      transform: rotate(180deg);
    `}

  svg path {
    stroke: #000000;
  }

  ${({ active }) =>
    active &&
    css`
      svg {
        path,
        line,
        rect {
          stroke: var(--primary);
        }
      }
    `}

  &:hover,
  &:focus {
    svg {
      path,
      line,
      rect {
        stroke: var(--primary);
      }
    }
  }
`;

export const MainBtn = styled(Btn)`
  background: var(--primary);
  border-radius: 4px;
  display: flex;
  transition: 0.2s ease all;
  justify-content: center;
  align-items: center;

  svg {
    width: 12px;
    height: 12px;
  }

  &:hover,
  &:focus {
    transform: scale(1.05);
    box-shadow: 0px 0px 12px 0px rgba(160, 160, 160, 0.3);
    &:hover,
    &:focus {
      svg line {
        stroke: #fff;
      }
    }
  }
`;

export const Pause = styled(PauseIcon)`
  width: 20px;
`;
