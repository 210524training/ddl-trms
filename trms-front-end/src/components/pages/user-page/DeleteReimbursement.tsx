import React from 'react';
import { deleteReimbursement } from '../../../remote/trms-backend/trms.reimbusements.api';
import Modal from './Modal';

interface Props {
  title: string,
  sid: string,
  id: string,
  update: () => void,
}

const DeleteReimbursement: React.FC<Props> = ({sid, id, title, update}): JSX.Element => {
    return (
      <Modal 
        uid={'delete-modal' + sid}
        ClickRender={() => <i className="bi bi-trash text-danger"></i>}
        Body={() => <p>Are you sure you want to <i>delete</i> <b>{title}</b>?</p>}
        clickTitle={`Delete ${title}`}
        staticBackdrop={false}
        buttonColor="danger"
        buttonTitle={`Delete ${title}`}
        onClick={(e) => {
          deleteReimbursement(id);
          document.getElementById(sid + '-close-btn')?.click();
          update();
        }}
      />
  );
};

export default DeleteReimbursement;