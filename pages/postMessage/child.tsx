import { DOMAIN } from 'configs';
import { usePageId } from 'hooks/usePageId';
import { checkClientSide } from 'utils/checkClientSide';
import { MessageReceiver } from 'components/MessageReceiver';
import styled from '@emotion/styled';
import { useEffect } from 'react';

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
  const pageId = usePageId();
  const handleClickSendMessage = () => {
    if (!checkDependentScreen()) {
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
    window.opener.postMessage(message, DOMAIN);
    window.parent.postMessage(message, DOMAIN);
  };

  useEffect(() => {
    // TODO: onbeforeunload
    if (!checkDependentScreen()) {
      return;
    }
  }, []);

  return (
    <Container>
      <h1>{`Page ID : ${pageId}`}</h1>
      <section className="actions-wrap">
        <button className="btn" type="button" onClick={handleClickSendMessage}>
          메세지 전송하기
        </button>
      </section>
      <MessageReceiver pageId={pageId} />
    </Container>
  );
}
