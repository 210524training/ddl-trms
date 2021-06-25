import React from 'react';
import { deleteReimbursement } from '../../../remote/trms-backend/trms.reimbusements.api';

interface Props {
  title: string,
  sid: string,
  id: string,
  update: () => void,
}

const DeleteReimbursement: React.FC<Props> = ({sid, id, title, update}): JSX.Element => {
  const action = 'Delete';
  const color = 'danger';
    return (
    <>
      <button 
        className="btn btn-sm"
        data-bs-toggle="modal"
        data-bs-target={"#" + sid}
        title={`${action} ${title}`}
      >
        <i className="bi bi-trash text-danger"></i>
      </button>

      <div className="modal fade" id={sid} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby={sid + '-label'} aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={sid + '-label'}>{action} {title}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id={sid + '-close-btn'}></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to {action} {title}?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button 
                type="button"
                className={`btn btn-${color}`}
                onClick={() => {
                  deleteReimbursement(id);
                  document.getElementById(sid + '-close-btn')?.click();
                  update();
                }}
              >
                {action} "{title}"
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteReimbursement;