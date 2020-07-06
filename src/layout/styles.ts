import styled from 'styled-components/macro';

export const CardBackground = styled.div`
  background: #fff;
  box-shadow: 0px 0px 16px 0px rgba(160, 160, 160, 0.5);
  margin-top: 15px;
  overflow: hidden;
  flex: 0.6;
  border-top-left-radius: 50px;
  border-top-right-radius: 50px;

  @media print {
    display: none;
  }
`;
