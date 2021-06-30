import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAppSelector } from '../../../hooks';
import Reimbursement, { CReimbursement } from '../../../models/reimbursement';
import GradeFormat from '../../../models/grade-format';
import User from '../../../models/user';
import { myReimbursements } from '../../../remote/trms-backend/trms.users.api';
import { selectUser, UserState } from '../../../slices/user.slice';
import { generate as shortid } from 'shortid';
import { v4 as uuid } from 'uuid';
import { addReimbursement } from '../../../remote/trms-backend/trms.reimbusements.api';
import ViewReimbursement from './ViewReimbursement';
import DeleteReimbursement from './DeleteReimbursement';
import { translateStatusToColor } from './utils';
import { getAllGradeFormats } from '../../../remote/trms-backend/trms.grade-formats.api';

const UserPage: React.FC<unknown> = (props): JSX.Element => {
  const user = useAppSelector<UserState>(selectUser);
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
  const [gradeFormats, setGradeFormats] = useState<GradeFormat[]>([]);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [popUp, setPopUp] = useState<boolean>(false);
  const history = useHistory();

  if (!user) history.push('/login');

  const setData = (user: User) => {
    setStatus('Loading...');
    myReimbursements(user.id).then((rs) => {
      setReimbursements(rs);
      setStatus(reimbursements.length === 0 ? 'No content.' : undefined);
    }).catch((err) => {
      setStatus('An error occurred! ' + err.message);
    });
    getAllGradeFormats().then(setGradeFormats).catch(err => {
      setStatus('An error occurred! ' + err.message);
    });

    reimbursements.forEach(r => {
      if (r.reimbusementStatus === 'More Information Needed') {
        setPopUp(true);
      }
    })
  };
  
  useEffect(() => {
    if (user) {
      setData(user);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayReimbursemnt = (r: Reimbursement, idx: number) => {
    const color = translateStatusToColor(r.reimbusementStatus);
    const deletedSID = shortid();
    const mutable = r.reimbusementStatus !== 'Approved' &&   r.reimbusementStatus !== 'Rejected' && r.reimbusementStatus !== 'Started Approval Process';
    return (
      
      <tr key={r.id} className={`table-${color}`}>
        <td>{idx + 1}</td>
        <td>{r.id}</td>
        <td>{r.title}</td>
        <td>{r.reimbusementStatus}</td>
        <td>{r.updatedAt}</td>
        <td className="text-center">
          {
          user
            ? <ViewReimbursement 
              r={r}
              user={user}
              gradeFormat={gradeFormats.find(g => g.id === r.gradingFormatId) || new GradeFormat()}
              sid={uuid()}
              
              /> 
            : undefined
          }
        </td>
        <td className="text-center">
          {
            mutable
            ? (
              <Link to={`/reimbursements/edit/${r.id}`}>
                <i className="bi bi-pencil text-warning" title={`Edit ${r.title}`}></i>
              </Link>
            ) : <i className="bi bi-x-octagon"></i>
          }
        </td>
        <td className="text-center">
          {
          user &&  !(r.reimbusementStatus === 'Approved')
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
          <p>You are: {user.employeeRoles.join(', ')}</p>
          <p>These are your reimbursement requests:</p>
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
                const btn = document.getElementById('create-reimbursement-btn') as HTMLButtonElement;
                btn.disabled = true;
                const created = await addReimbursement(reimbursement(user));
                if (created) {
                  const reimbursements = await myReimbursements(user.id);
                  setReimbursements(reimbursements);
                } else {
                  setStatus('Failed to add reimbursement');
                }

                btn.disabled = false;
                
              }
              
            }}
          >
            <i className="bi bi-file-plus"></i> Add Test Reimbursement
          </button>
          
        </div>
      </div>
    </div>
      {
        popUp 
        ? 
          <div className="alert alert-warning" role="alert">
            One or more of your claims requires more information.
          </div> 
        : 
          undefined
      }
      <table className="table table-bordered table-hover">
        <thead>
          <tr id="reimbursements-table-head">
            <th>#</th>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Last Update</th>
            <th>View</th>
            <th>Modify</th>
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

export default UserPage;

const reimbursement = (user: User) => new CReimbursement(
    user.id, // employee id
    'AWS Certification ' + shortid(), // title
    'Certification', // type of event
    '46f82c3a-461b-4db0-a60b-8a5ed33507c7', // grading format id
    new Date('5/1/2021').toLocaleString(), // start date
    new Date('5/18/2021').toLocaleString(), // end date
    'Remote', // location
    'AWS Certficaiton', // description
    [
      {
        title: 'AWS Certificate', cost: 250, description: 'None.', type: 'Event Cost',
      },
      {
        title: 'Pencils', cost: 1.50, description: 'None.', type: 'Course Material',
      },
    ], // costs
    'passed', // grade
    'None.', // work releated justification
    true, // completed
    0, // amount paid to employee
    [], // attchements
    5, // work time missed
    'Submitted', // status
    [], // comments
    uuid(), // id
    new Date('4/1/2021').toLocaleString(), // created date
    new Date('5/18/2021').toLocaleString(), // updated date
  );