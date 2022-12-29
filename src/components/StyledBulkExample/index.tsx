import styled from '@emotion/styled';

const CompBluk = styled.div`
  background-color: red;
  > .a {
    background-color: red;
  }
  > .b {
    background-color: orange;
  }
  > .c {
    background-color: yellow;
  }
  > .d {
    background-color: green;
  }
  > .e {
    background-color: blue;
  }
`;

export const StyledBulkExample = ({}) => {
  return (
    <CompBluk>
      <div className="a">A</div>
      <div className="b">B</div>
      <div className="c">C</div>
      <div className="d">D</div>
      <div className="e">E</div>
    </CompBluk>
  );
};
