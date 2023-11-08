import React, { ReactNode } from 'react';
import { Button } from '@mui/material';
import { AiOutlineClose } from 'react-icons/ai';

import Modal from 'react-modal';

Modal.defaultStyles = {
  content: {
    ...Modal.defaultStyles.content,
    padding: '0px',
    width: '50%',
    height: 'fit-content',
    margin: '2rem auto',
  },
  overlay: { ...Modal.defaultStyles.overlay, zIndex: '1' },
};

function ModalBase(props: {
  title?: string;
  children: ReactNode;
  isOpen: boolean;
  onRequestClose: () => void;
  style?: Modal.Styles;
  portalClassName?: string;
}): JSX.Element {
  return (
    <Modal
      isOpen={props.isOpen}
      onRequestClose={props.onRequestClose}
      appElement={document.getElementById('root') || undefined}
      style={{ ...Modal.defaultStyles.content, ...props.style } as Modal.Styles}
      portalClassName={props.portalClassName}
    >
      <div className='modal-header'>
        {(props.title && (
          <span className='center modal-title'>{props.title}</span>
        )) || <span className='modal-title'></span>}
        <div className='close-modal-x'>
          <Button style={{ color: 'white' }} onClick={props.onRequestClose}>
            <AiOutlineClose />
          </Button>
        </div>
      </div>
      <div className='modal-content-container'>{props.children}</div>
    </Modal>
  );
}

export default ModalBase;
