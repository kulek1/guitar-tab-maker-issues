import styled, { css } from 'styled-components/macro';

export const TabColumns = styled.div`
  display: flex;
  margin-bottom: 20px;
  flex-wrap: nowrap;
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
      background: #914b57;
      cursor: pointer;
    }
  }

  ${({ active }) =>
    active &&
    css`
      background: #553238;
    `}
`;
