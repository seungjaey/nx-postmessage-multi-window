import { useEffect, useRef, useState } from 'react';

import styled from '@emotion/styled';

import { DOMAIN } from 'configs';

import { usePageId } from 'hooks/usePageId';
import { checkClientSide } from 'utils/checkClientSide';

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

export default function PostMessageParentPage() {
  const pageId = usePageId();
  const childRef = useRef<Window | null>(null);
  const [childWindowOpened, setChildWindowOpened] = useState(false);
  const messageChannelRef = useRef<MessageChannel | null>(null);

  const handleClickOpenWindow = () => {
    if (!checkClientSide() || !pageId || childWindowOpened) {
      console.log('skip 1');
      return;
    }
    const childWindow = window.open(`${DOMAIN}/channel/child`, pageId, 'popup=1,width=500,height=500');
    if (!childWindow) {
      console.log('skip 2');
      return;
    }
    console.log('DEBUG : childWindow');
    childWindow.addEventListener('load', () => {
      if (!messageChannelRef.current) {
        console.log('skip 3');
        return;
      }
      console.log('child window onload');
      childRef.current = childWindow;
      childRef.current.postMessage('Initialize', '*', [messageChannelRef.current.port2]);
      setChildWindowOpened(true);
    });
    console.log(childWindow);
  };

  const handleSendMessageToChild = () => {
    if (!childRef.current || !messageChannelRef.current) {
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
      '*',
      [messageChannelRef.current.port2],
    );
  };

  const handleReceiveMessage = (e: MessageEvent<MessageChannel>) => {
    console.log('[parent] receive message');
    console.log(e);
  };

  useEffect(() => {
    console.log('effect');
    const channel = new MessageChannel();
    messageChannelRef.current = channel;
    messageChannelRef.current.port1.onmessage = handleReceiveMessage;
  }, []);

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
    </Container>
  );
}
