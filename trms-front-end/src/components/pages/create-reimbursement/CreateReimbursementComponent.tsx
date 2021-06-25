import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../../hooks';
import GradeFormat from '../../../models/grade-format';
import Reimbursement from '../../../models/reimbursement';
import User from '../../../models/user';
import { getAllGradeFormats } from '../../../remote/trms-backend/trms.grade-formats.api';
import { selectUser, UserState } from '../../../slices/user.slice';
import UpdateReimbursementForm from './CreateReimbursementPage';


interface Params {
  id: string,
}

interface Props {
}

const EditReimbursement: React.FC<Props> = (props): JSX.Element => {
  const user = useAppSelector<UserState>(selectUser);

  const [gradeFormats, setGradeFormats] = useState<GradeFormat[]>();

  const [status, setStatus] = useState<string | undefined>('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [createdByError, setCreatedByError] = useState<string | undefined>(undefined);
  const [gradeFormatsError, setGradeFormatsError] = useState<string | undefined>(undefined);
  useEffect(() => {
    setStatus('Loading...')
    getAllGradeFormats().then(setGradeFormats).catch((err) => setGradeFormatsError(err.message));
    setStatus(undefined)
  }, []);

  return (
    <>
      <br />
      <br />
      <br />
      <p>{
      createdByError 
      ? `Created by: ${createdByError}`
      : undefined
      }</p>
      <p>{
      error 
      ? `Reimbursements: ${error}`
      : undefined
      }</p>
      <p>{
      error 
      ? `Grade formats: ${gradeFormatsError}`
      : undefined
      }</p>
      {
        user && gradeFormats
          ? <UpdateReimbursementForm
            requestedBy={user}
            gradeFormats={gradeFormats}
          />
          : (
          <>
            <p>{status ? status : 'Couldn\'t find an essential value (login?)'}</p>
          </>
          )
      }
      
    </>
  );
}

export default EditReimbursement;