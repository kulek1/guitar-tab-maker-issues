import styled, { css } from 'styled-components/macro';

export const TabColumns = styled.div`
  display: flex;
  margin-bottom: 20px;
  flex-wrap: nowrap;
  font-family: 'Source Code Pro', sans-serif;
  font-weight: 600;
`;

export const TabColumnsWrapper = styled.div`
  padding: 0 1em;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;

  > span,
  div {
    width: 16px;
    height: 1em;
    text-align: center;

    .big {
      font-size: 0.8em;
    }
  }

  &:hover,
  &:focus {
    &:not(.static) {
      background: #aabee3;
      cursor: pointer;
    }
  }

  ${({ active }) =>
    active &&
    css`
      background: #e2ecfe;
    `}
`;
