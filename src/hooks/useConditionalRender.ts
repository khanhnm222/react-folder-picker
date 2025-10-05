import { useState } from 'react';

/**
 * A helper hook for components that require conditional
 * rendering based on a true/false flag
 * @param initialState - should initial render be true
 * @returns whether the component should render, and functions for showing / hiding the component
 */
export const useConditionalRender = (initialState = true) => {
  const [shouldRender, setShouldRender] = useState(initialState);

  /** Sets the state of `shouldRender` to `true` */
  const show = () => setShouldRender(true);
  /** Sets the state of `shouldRender` to `false` */
  const hide = () => setShouldRender(false);

  return { show, hide, shouldRender };
};
 