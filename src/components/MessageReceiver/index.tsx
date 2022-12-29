import styled from '@emotion/styled';

import { useEffect, useState } from 'react';
import { checkClientSide } from 'utils/checkClientSide';

const MessageReceiverContainer = styled.section`
  margin-top: 8px;
  padding: 8px;
  border: 1px solid #d3d3d3;
  border-radius: 5px;
  > ul {
    list-style: none;
    > li {
      margin-bottom: 8px;
      border-bottom: 1px solid #d3d3d3;
      line-height: 26px;
      &:last-child {
        margin-bottom: 0;
        border-bottom-color: transparent;
      }
    }
  }
`;

interface Props {
  pageId: string;
  onConnectionClosed?(): void;
}
export const MessageReceiver = ({ pageId, onConnectionClosed }: Props) => {
  const [historyList, setHistoryList] = useState<string[]>([]);
  const isHistoryEmpty = historyList.length === 0;

  useEffect(() => {
    if (!checkClientSide() || !pageId) {
      return;
    }
    const handleMessage = (e: MessageEvent) => {
      const { data, origin } = e;
      console.log(e);
      const history = `[${origin}] : ${JSON.stringify(data || '')}`;
      setHistoryList((prev) => [...prev, history]);
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [pageId]);

  return (
    <MessageReceiverContainer>
      <ul>
        {isHistoryEmpty ? (
          <li>메세지 수신 대기중 입니다.</li>
        ) : (
          historyList.map((history, i) => {
            return <li key={`history-${i}`}>{`${i} : ${history}`}</li>;
          })
        )}
      </ul>
    </MessageReceiverContainer>
  );
};
