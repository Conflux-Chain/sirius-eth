import React from 'react';
import { usePortal } from 'utils/hooks/usePortal';

export const Balance = () => {
  const { useBalance } = usePortal();
  const balance = useBalance();

  return (
    <span className="balance">{balance?.toDecimalStandardUnit() ?? 0} CFX</span>
  );
};
