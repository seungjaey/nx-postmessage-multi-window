import Link from 'next/link';
import styled from '@emotion/styled';

const Container = styled.main`
  width: 600px;
  margin: 0 auto;
  padding: 16px;
  > section {
    > ul {
      list-style: none;
      li {
        margin-bottom: 16px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
`;

export default function HomePage() {
  return (
    <Container>
      <section>
        <ul>
          <li>
            <Link href="/postMessage/parent" prefetch={false}>
              PostMessage
            </Link>
            <Link href="/channel/parent" prefetch={false}>
              MessageChannel
            </Link>
          </li>
        </ul>
      </section>
    </Container>
  );
}
