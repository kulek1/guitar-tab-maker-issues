import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  padding: 1em;

  hr {
    border-color: #eaeff7;
    border-top: 1px;
    margin: 1em;
  }
`;
export const IconButton = styled.button<{ $secondary?: boolean }>`
  background: transparent;
  padding: 0.5rem;

  div {
    transition: all ease 0.2s;
    margin: 0 auto;
    margin-bottom: 10px;
    background: #eaeff7;
    width: 32px;
    height: 32px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;

    ${({ $secondary }) =>
      $secondary &&
      css`
        color: #6f8fc1;
        margin-bottom: 0;
      `}
  }

  p {
    display: inline-block;
  }

  svg {
    max-width: 16px;
    path,
    line {
      stroke: var(--primary);
    }
  }

  &:hover,
  &:focus {
    div {
      color: #fff;
      background: var(--primary);
    }

    svg {
      path,
      line {
        stroke: #fff;
      }
    }
  }
`;

export const SectionWrapper = styled.section`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(2, 1fr);

  @media screen and (min-width: 350px) {
    grid-gap: 15px;
    grid-template-columns: repeat(3, 1fr);
  }
  @media screen and (min-width: 410px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const SmallSectionWrapper = styled.section`
  display: grid;
  grid-gap: 5px;
  grid-template-columns: repeat(5, 1fr);

  @media screen and (min-width: 350px) {
    grid-gap: 10px;
    grid-template-columns: repeat(6, 1fr);
  }
  @media screen and (min-width: 410px) {
    grid-template-columns: repeat(7, 1fr);
  }
`;
