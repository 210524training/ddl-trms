import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../hooks';
import Reimbursement from '../../../models/reimbursement';
import GradeFormat from '../../../models/grade-format';
import User from '../../../models/user';
import { selectUser, UserState } from '../../../slices/user.slice';
import { generate as shortid } from 'shortid';
import { getReimbursementsToApprove } from '../../../remote/trms-backend/trms.reimbusements.api';
import { translateStatusToColor } from './utils';
import { getAllGradeFormats } from '../../../remote/trms-backend/trms.grade-formats.api';
import ViewReimbursement from '../user-page/ViewReimbursement';
import DeleteReimbursement from '../user-page/DeleteReimbursement';

const AllReimbursements: React.FC<unknown> = (props): JSX.Element => {
  const user = useAppSelector<UserState>(selectUser);
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
  const [gradeFormats, setGradeFormats] = useState<GradeFormat[]>([]);
  const [status, setStatus] = useState<string | undefined>(undefined);

  const setData = (user: User) => {
    setStatus('Loading...');
    getReimbursementsToApprove().then((rs) => {
      setReimbursements(rs);
      setStatus(reimbursements.length === 0 ? 'No content.' : undefined);
    }).catch((err) => {
      setStatus('An error occurred! ' + err.message);
    });
    getAllGradeFormats().then(setGradeFormats).catch(err => {
      setStatus('An error occurred! ' + err.message);
    })
  };
  
  useEffect(() => {
    if (user) {
      setData(user);
    }
  }, [user]);

  const displayReimbursemnt = (r: Reimbursement, idx: number) => {
    const color = translateStatusToColor(r.reimbusementStatus);
    const deletedSID = shortid();
    const mutable = r.reimbusementStatus !== 'Approved' &&  r.reimbusementStatus !== 'Rejected';

    
    return (
      
      <tr key={r.id} className={`table-${color}`}>
        <td>{idx + 1}</td>
        <td>{r.id}</td>
        <td>{r.title}</td>
        <td>{r.reimbusementStatus}</td>
        <td>{r.createdAt}</td>
        <td>{r.updatedAt}</td>
        <td className="text-center">
          {
            mutable
            ? (
              <Link to={`/reimbursements/approve/${r.id}`}>
                <i className="bi bi-layout-text-window-reverse text-warning" title={`Review ${r.title}`}></i>
              </Link>
            ) : <i className="bi bi-x-octagon"></i>
          }
        </td>
        <td className="text-center">
          {
          user 
            ? <ViewReimbursement r={r} user={user} gradeFormat={gradeFormats.find(g => g.id === r.gradingFormatId) || new GradeFormat()} sid={shortid()} /> 
            : <i className="bi bi-x-octagon"></i>
          }
        </td>
        <td className="text-center">
          {
          user && mutable
            ? <DeleteReimbursement id={r.id} title={r.title} sid={deletedSID} update={() => {
              setReimbursements(reimbursements.filter(re => re.id !== r.id))
            }} /> 
            : <i className="bi bi-x-octagon"></i>
          }
        </td>
      </tr>
    );
  }

  return (
    <>
    <br />
    <br />
    <br />    
    <div className="table-responsive container">
      
    <div className="container-fluid">
      <div className="row">
        <div className="col-8">
          {user ? (
        <>
          <p>Hello, <span className="text-capitalize">{user.firstName.trim()}</span>!</p>
          <p>These are the reuests made by employees:</p>
        </>
    ) : 'not logged in'}

        </div>
        <div className="col-4">
          <button
            id="create-reimbursement-btn"
            className="btn btn-primary"
            style={{width: '100%', height: '90%'}}
            onClick={async () => {
              if (user) {
               
              }
              
            }}
          >
            <i className="bi bi-file-plus"></i> For testing
          </button>
          
        </div>
      </div>
    </div>

      <table className="table table-bordered table-hover">
        <thead>
          <tr id="reimbursements-table-head">
            <th>#</th>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Created</th>
            <th>Last Update</th>
            <th>Review</th>
            <th>View</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {reimbursements.length > 0 ? reimbursements.map((r, idx) => (
            displayReimbursemnt(r, idx)
          )) : (
            <tr className={`table-${status?.startsWith('An error') ? 'danger' : 'warning'}`}>
              <td className='text-center text-bold' colSpan={
                document.getElementById("reimbursements-table-head")?.children.length
              }>
                {status}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    
    </>
  );
}

export default AllReimbursements;
