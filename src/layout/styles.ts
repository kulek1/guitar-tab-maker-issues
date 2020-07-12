import styled from 'styled-components/macro';

export const CardBackground = styled.div`
  background: #fff;
  box-shadow: 0px 0px 16px 0px rgba(160, 160, 160, 0.5);
  margin-top: 15px;
  overflow: hidden;
  border-top-left-radius: 50px;
  border-top-right-radius: 50px;
  flex-shrink: 0; /* Prevent Chrome, Opera, and Safari from letting these items shrink to smaller than their content's default minimum size. */

  @media print {
    display: none;
  }
`;
