import { useRef, useState } from 'react';

import styled from '@emotion/styled';

import { DOMAIN } from 'configs';

import { usePageId } from 'hooks/usePageId';
import { checkClientSide } from 'utils/checkClientSide';
import { MessageReceiver } from 'components/MessageReceiver';

const Container = styled.main`
  width: 600px;
  margin: 0 auto;
  padding: 16px;
  > .actions-wrap {
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: flex-start;
    > .btn {
      padding: 16px;
      border: 1px solid #d3d3d3;
      border-radius: 5px;
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-right: 16px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
`;

export default function HomePage() {
  const pageId = usePageId();
  const childRef = useRef<Window | null>(null);
  const [childWindowOpened, setChildWindowOpened] = useState(false);

  const handleClickOpenWindow = () => {
    if (!checkClientSide() || !pageId || childWindowOpened) {
      return;
    }
    const childWindow = window.open(`${DOMAIN}/child`, pageId, 'popup=1,width=500,height=500');
    childRef.current = childWindow;
    setChildWindowOpened(true);
  };

  const handleConnectionClosed = () => {
    if (!childWindowOpened) {
      return;
    }
    setChildWindowOpened(false);
  };

  const handleSendMessageToChild = () => {
    if (!childRef.current) {
      return;
    }
    childRef.current.postMessage(
      {
        source: pageId,
        target: 'unknown',
        type: 'PARENT_PING',
        payload: {
          message: 'ping',
        },
      },
      DOMAIN,
    );
  };

  return (
    <Container>
      <h1>{`Page ID : ${pageId}`}</h1>
      <section className="actions-wrap">
        <button className="btn" type="button" onClick={handleClickOpenWindow}>
          새창열기
        </button>
        {childWindowOpened ? (
          <button className="btn" type="button" onClick={handleSendMessageToChild}>
            메세지 전송
          </button>
        ) : null}
      </section>

      <MessageReceiver pageId={pageId} onConnectionClosed={handleConnectionClosed} />
    </Container>
  );
}
