import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../../hooks';
import GradeFormat from '../../../models/grade-format';
import Reimbursement from '../../../models/reimbursement';
import User from '../../../models/user';
import { getAllGradeFormats } from '../../../remote/trms-backend/trms.grade-formats.api';
import { getReimbursement } from '../../../remote/trms-backend/trms.reimbusements.api';
import { getUserByID } from '../../../remote/trms-backend/trms.users.api';
import { selectUser, UserState } from '../../../slices/user.slice';
import UpdateReimbursementForm from './UpdateReimbursementForm';


interface Params {
  id: string,
}

interface Props {
  review?: boolean,
}

const EditReimbursement: React.FC<Props> = ({ review }): JSX.Element => {
  const { id } = useParams<Params>();
  const user = useAppSelector<UserState>(selectUser);

  const [createdBy, setCreatedBy] = useState<User>();
  const [gradeFormats, setGradeFormats] = useState<GradeFormat[]>();

  const [reimbursement, setReimbursement] = useState<Reimbursement>();
  const [status, setStatus] = useState<string | undefined>('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [createdByError, setCreatedByError] = useState<string | undefined>(undefined);
  const [gradeFormatsError, setGradeFormatsError] = useState<string | undefined>(undefined);
  useEffect(() => {
    setStatus('Loading...')
    getReimbursement(id).then((r) => {
      setReimbursement(r);
      setError(undefined);
      getUserByID(r.employeeId).then(setCreatedBy).catch((err) => setCreatedByError(err.message));
    }).catch((err) => setError(err.message));

    getAllGradeFormats().then(setGradeFormats).catch((err) => setGradeFormatsError(err.message));
    setStatus(undefined)
  }, [id]);

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
        reimbursement && createdBy && user && gradeFormats
          ? <UpdateReimbursementForm
            r={reimbursement}
            createdBy={createdBy}
            requestedBy={user}
            gradeFormats={gradeFormats}
            review={review}
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