import React from 'react';

function ButtonWithToolTip(props: {
  buttonContent: string | JSX.Element;
  toolTipContent: string | JSX.Element;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
}): JSX.Element {
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

  function handleMoustLeave(event: any): void {
    if (event.target.tagName !== 'BUTTON') {
      return;
    }
    let controlText: HTMLSpanElement = event.target.children[1];
    controlText?.classList.add('hide');
    controlText?.classList.remove('unhide');
    return;
  }

  return (
    <button
      className={`btn-with-tooltip ${props.className}`}
      onClick={props.onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMoustLeave}
    >
      <span>{props.buttonContent}</span>
      <span className='btn-with-tooltip-tooltip hide'>
        {props.toolTipContent}
      </span>
    </button>
  );
}

export default ButtonWithToolTip;
