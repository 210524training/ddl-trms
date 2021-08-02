import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../../hooks';
import GradeFormat from '../../../models/grade-format';
import { getAllGradeFormats } from '../../../remote/trms-backend/trms.grade-formats.api';
import { selectUser, UserState } from '../../../slices/user.slice';
import CreateReimbursement from './CreateReimbursementPage';

const EditReimbursement: React.FC<unknown> = (): JSX.Element => {
  const user = useAppSelector<UserState>(selectUser);

  const [gradeFormats, setGradeFormats] = useState<GradeFormat[]>();

  const [status, setStatus] = useState<string | undefined>('');
  useEffect(() => {
    setStatus('Loading...')
    getAllGradeFormats().then(setGradeFormats).catch(console.error);
    setStatus(undefined)
  }, []);

  return (
    <>
      <br />
      <br />
      <br />
      {
        user && gradeFormats
          ? <CreateReimbursement
            requestedBy={user}
            gradeFormats={gradeFormats}
          />
          : (<p>{status ? status : 'Couldn\'t find an essential value (login?)'}</p>)
      }
    </>
  );
}

export default EditReimbursement;