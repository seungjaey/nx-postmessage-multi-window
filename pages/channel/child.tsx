import { DOMAIN } from 'configs';
import { usePageId } from 'hooks/usePageId';
import { checkClientSide } from 'utils/checkClientSide';
import styled from '@emotion/styled';
import { useEffect, useRef } from 'react';

const Container = styled.main`
  width: 600px;
  margin: 0 auto;
  padding: 16px;
  > .actions-wrap {
    > .btn {
      padding: 16px;
      border: 1px solid #d3d3d3;
      border-radius: 5px;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }
`;

const checkDependentScreen = () => {
  if (!checkClientSide() || !window.opener || !window.name) {
    return false;
  }
  return true;
};
export default function PostMessageChildPage() {
  const messagePortRef = useRef<MessagePort | null>(null);
  const pageId = usePageId();
  const handleClickSendMessage = () => {
    if (!checkDependentScreen() || !messagePortRef.current) {
      return;
    }
    const message = {
      source: pageId,
      target: window.name,
      type: 'CHILD_PING',
      payload: {
        message: 'hello world',
      },
    };
    messagePortRef.current.postMessage(message);
    // window.parent.postMessage(message, DOMAIN);
  };

  const handleReceiveMessage = (e: MessageEvent<MessageChannel>) => {
    if (e.ports.length === 0) {
      console.log('[child] ignore event');
      return;
    }
    console.log('[child] receive message');
    console.log(e);
    messagePortRef.current = e.ports[0];
    messagePortRef.current.postMessage({
      source: pageId,
      target: window.name,
      type: 'CHILD_PING',
      payload: {
        message: 'hello world',
      },
    });
  };

  useEffect(() => {
    // TODO: onbeforeunload
    if (!checkDependentScreen()) {
      return;
    }
    window.addEventListener('message', handleReceiveMessage);
    return () => {
      window.removeEventListener('message', handleReceiveMessage);
    };
  }, []);

  return (
    <Container>
      <h1>{`Page ID : ${pageId}`}</h1>
      <section className="actions-wrap">
        <button className="btn" type="button" onClick={handleClickSendMessage}>
          메세지 전송하기
        </button>
      </section>
    </Container>
  );
}
