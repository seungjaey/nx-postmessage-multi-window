export const checkClientSide = () => {
  try {
    if (typeof window === 'undefined') {
      throw new Error('[checkClientSide] : "window" is not defined');
    }
    return true;
  } catch (err) {
    return false;
  }
};
