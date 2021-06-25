import React, { ChangeEvent, useEffect, useState } from 'react';
import { useAppSelector } from '../../../hooks';
import GradeFormat from '../../../models/grade-format';
import { selectUser, UserState } from '../../../slices/user.slice';
import { getAllGradeFormats, addGradeFormat } from '../../../remote/trms-backend/trms.grade-formats.api';
import InputField from '../edit-reimbursement/InputFeild';
import { v4 as uuid } from 'uuid';
import { useHistory } from 'react-router-dom';

const GradeFormatsPage: React.FC<unknown> = (props): JSX.Element => {
  const user = useAppSelector<UserState>(selectUser);
  const history  = useHistory();
  if (!(user?.employeeRoles.includes('Benefits Coordinator')
      || user?.employeeRoles.includes('Department Head')
      || user?.employeeRoles.includes('Director Supervisor'))) {
        history.push('/?not-authorized');
  }

  const [gradeFormats, setGradeFormats] = useState<GradeFormat[]>([]);
  const [status, setStatus] = useState<string | undefined>(undefined);

  const [gradeFormat, setGradeFormat] = useState<string>('');
  const [passingGrade, setPassingGrade] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const handleOnGradeFormatChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGradeFormat(e.target.value);
  };

  const handleOnPassingGradeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassingGrade(e.target.value);
  };

  const handleOnDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };


  const setData = () => {
    setStatus('Loading...');
    getAllGradeFormats().then(setGradeFormats).catch(err => {
      setStatus('An error occurred! ' + err.message);
    })
  };
  
  useEffect(() => {
    setData();
  }, []);

  const displayReimbursemnt = (r: GradeFormat, idx: number) => {    
    return (
      <tr key={r.id}>
        <td>{idx + 1}</td>
        <td>{r.id}</td>
        <td>{r.gradeFormat}</td>
        <td>{r.passingGrade}</td>
        <td>{r.description}</td>
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
        <div className="col-4">
          {user ? (
        <>
          <p>Hello, <span className="text-capitalize">{user.firstName.trim()}</span>!</p>
          <p>These are the available grade formats:</p>
        </>
    ) : 'not logged in'}

        </div>
        <div className="col-8">

          <InputField
            displayName="Grade Format"
            name="gradeFormat"
            placeholder="The grade format"
            value={gradeFormat}
            type="text"
            uid="gradeFormatInput"
            onChange={handleOnGradeFormatChange}
          />

          <InputField
            displayName="The Passing grde"
            name="passingGrade"
            placeholder="Grade needed to pass"
            value={passingGrade}
            type="text"
            uid="passingGradeInput"
            onChange={handleOnPassingGradeChange}
          />

          <InputField
            displayName="Description of format"
            name="description"
            placeholder="Give any details about the grade format"
            value={description}
            type="text"
            uid="descriptionInput"
            onChange={handleOnDescriptionChange}
          />
          
          <button
            id="create-grade-format-btn"
            className="btn btn-primary"
            onClick={async () => {
              if (user && (user.employeeRoles.includes('Benefits Coordinator')
              || user.employeeRoles.includes('Department Head')
              || user.employeeRoles.includes('Director Supervisor'))) {
                const btn = document.getElementById('create-grade-format-btn') as HTMLButtonElement;
                btn.disabled = true;
                const created = await addGradeFormat({
                  passingGrade,
                  gradeFormat,
                  description,
                  id: uuid()
                });
                if (created) {
                  const gfs = await getAllGradeFormats();
                  setGradeFormats(gfs);
                } else {
                  setStatus('Failed to add grade format');
                }

                btn.disabled = false;
                
              }
              
            }}
          >
            <i className="bi bi-file-plus"></i> Add {gradeFormat || 'Grade Format'}
          </button>
        </div>
      </div>
    </div>
    <hr />

      <table className="table table-bordered table-hover">
        <thead>
          <tr id="reimbursements-table-head">
            <th>#</th>
            <th>ID</th>
            <th>Grade Fomat</th>
            <th>Passign Grade</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {gradeFormats.length > 0 ? gradeFormats.map((r, idx) => (
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

export default GradeFormatsPage;
