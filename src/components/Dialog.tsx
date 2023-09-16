import { NextPage } from 'next';
import { PropsWithChildren } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


const modalStyle = {
  backgroundColor:"#4F4C38", 
  border:"1px solid black", 
  borderRadius:"5px", 
  color:"white"
};
export interface DialogProps {
    showModal:boolean
    cancelModal:()=>void
    confirm?: {
      confirmModal:()=>void
      confirmModalButtonText?:string
    }
    heading:string
    content:string
    cancelModalButtonText:string
}

const Dialog:NextPage<PropsWithChildren<DialogProps>> = (props: PropsWithChildren<DialogProps>) => {
  const {
    showModal,
    heading,
    content,
    cancelModal,
    confirm,
    cancelModalButtonText,
  } = props
  return (
    <Modal
      show={showModal}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <div style={modalStyle}>
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            {heading}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {content}
          </p>
        </Modal.Body>
        <Modal.Footer>
          {confirm && <Button onClick={confirm.confirmModal} variant="secondary">{confirm.confirmModalButtonText}</Button>}
          <Button variant="secondary" onClick={cancelModal}>{cancelModalButtonText}</Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
}

export default Dialog;