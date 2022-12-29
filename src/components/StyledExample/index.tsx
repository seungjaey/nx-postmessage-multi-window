import styled from '@emotion/styled';

const CompA = styled.div`
  background-color: red;
`;
const CompB = styled.div`
  background-color: orange;
`;
const CompC = styled.div`
  background-color: yellow;
`;
const CompD = styled.div`
  background-color: green;
`;
const CompE = styled.div`
  background-color: blue;
`;

export const StyledExample = () => {
  return (
    <>
      <CompA>A</CompA>
      <CompB>B</CompB>
      <CompC>C</CompC>
      <CompD>D</CompD>
      <CompE>E</CompE>
    </>
  );
};
