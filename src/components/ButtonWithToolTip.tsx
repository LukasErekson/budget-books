import React, { FC } from 'react';
import { Tooltip } from '@mui/material';

type ButtonWithToolTipProps = {
  children?: string | JSX.Element;
  toolTipContent: string | JSX.Element;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  placement?:
    | 'top'
    | 'bottom-end'
    | 'bottom-start'
    | 'bottom'
    | 'left-end'
    | 'left-start'
    | 'left'
    | 'right-end'
    | 'right-start'
    | 'right'
    | 'top-end'
    | 'top-start'
    | undefined;
};

const ButtonWithToolTip: FC<ButtonWithToolTipProps> = (props): JSX.Element => {
  return (
    <Tooltip
      title={props.toolTipContent}
      placement={props.placement || 'top'}
      arrow
    >
      <button
        className={`btn-with-tooltip ${props.className}`}
        onClick={props.onClick}
      >
        {props.children}
      </button>
    </Tooltip>
  );
};

export default ButtonWithToolTip;
