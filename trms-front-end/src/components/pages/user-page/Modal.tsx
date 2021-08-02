import React, { useState } from 'react';

interface Props {
  uid: string,
  ClickRender: () => JSX.Element,
  Body: () => JSX.Element,
  clickTitle: string,
  xl?: boolean,
  staticBackdrop?: boolean,
  buttonTitle?: string,
  buttonColor?: string,
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
}

const Modal: React.FC<Props> = ({
  clickTitle, buttonColor, xl,
  uid, buttonTitle,
  Body, ClickRender, onClick, 
}): JSX.Element => {
  const [showing, setShowing] = useState<boolean>(false);  
  return (
    <div key={`modal-${uid}`}>
      <button 
        className="btn btn-sm"
        data-bs-toggle="modal"
        data-bs-target={`#${uid}`}
        title={clickTitle}
        onClick={(e) => {
          e.preventDefault();
          const element: any = document.getElementById(uid);
          if (element) {
            try {
              element.modal('show')
            } catch (e) {}
          }
        }}
      >
        <ClickRender />
      </button>

        <div className="modal fade" id={uid} data-bs-keyboard="false" tabIndex={-1} aria-labelledby={uid + '-label'} aria-hidden="true">
        <div className={"modal-dialog" + (xl ? ' modal-xl' : '')}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={uid + '-label'}>{clickTitle}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id={uid + '-close-btn'}></button>
            </div>
            <div className="modal-body">
              <Body />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              {!!onClick ? (
                <button 
                  type="button"
                  className={`btn btn-${buttonColor}`}
                  onClick={onClick}
                >
                  {buttonTitle}
                </button>
              ): undefined}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;