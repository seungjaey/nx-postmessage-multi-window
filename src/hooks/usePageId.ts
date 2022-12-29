import { useState } from 'react';
import { nanoid } from 'nanoid';

export const usePageId = () => {
  const [pageId] = useState(nanoid());
  return pageId;
};
