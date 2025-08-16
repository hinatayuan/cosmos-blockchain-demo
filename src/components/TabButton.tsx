import React from 'react';
import { TabButtonProps } from '../types';
import clsx from 'clsx';

const TabButton: React.FC<TabButtonProps> = ({ 
  active, 
  children, 
  onClick, 
  icon 
}) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'tab-button flex items-center gap-2 justify-center',
        active ? 'tab-button-active' : 'tab-button-inactive'
      )}
    >
      {icon}
      <span className="hidden sm:inline">{children}</span>
    </button>
  );
};

export default TabButton;