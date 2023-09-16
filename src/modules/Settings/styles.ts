import styled from 'styled-components';

export const ModalContainer = styled.div`
  width: 100%;
  text-align: center;

  @media screen and (min-width: 300px) {
    width: 250px;
  }
  @media screen and (min-width: 600px) {
    width: 400px;
  }
  @media screen and (min-width: 900px) {
    width: 600px;
  }
`;
