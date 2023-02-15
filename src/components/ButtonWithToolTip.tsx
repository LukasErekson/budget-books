import React, { FC } from 'react';

interface buttonWithToolTipProps {
  children?: string | JSX.Element;
  toolTipContent: string | JSX.Element;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

const ButtonWithToolTip: FC<buttonWithToolTipProps> = (props): JSX.Element => {
  function handleMouseEnter(event: any): void {
    let controlText: HTMLSpanElement;

    if (event.target.tagName !== 'BUTTON') {
      controlText = event.target.nextSibling;
    } else {
      controlText = event.target.children[1];
    }

    controlText?.classList.remove('hide');
    controlText?.classList.add('unhide');
    return;
  }

  function handleMouseLeave(event: any): void {
    if (event.target.tagName !== 'BUTTON') {
      return;
    }
    const controlText: HTMLSpanElement = event.target.children[1];
    controlText?.classList.add('hide');
    controlText?.classList.remove('unhide');
    return;
  }

  return (
    <button
      className={`btn-with-tooltip ${props.className}`}
      onClick={props.onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span>{props.children}</span>
      <span className='btn-with-tooltip-tooltip hide'>
        {props.toolTipContent}
      </span>
    </button>
  );
};

export default ButtonWithToolTip;
