import styled from 'styled-components/macro';

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
    width: 13px;
    height: 1em;
    text-align: center;

    .big {
      font-size: 0.8em;
    }
  }

  &:hover,
  &:focus {
    background: red;
    cursor: pointer;
  }
`;
