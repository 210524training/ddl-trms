import React from 'react';
import './HomePage.css';
import { useAppSelector } from '../../../hooks';
import { selectUser, UserState } from '../../../slices/user.slice';

type Props = {
}

const HomePage: React.FC<Props> = (props) => {
  const user = useAppSelector<UserState>(selectUser);

  return (
    <>
    <br />
    <br />
      <br />
   <br />

      <h1 style={{color: 'black'}}>{user ? `Hello, ${user.firstName}!` : 'Please log in'}</h1>
    </>
  );
};

export default HomePage;
