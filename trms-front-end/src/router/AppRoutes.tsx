import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import LoginPage from '../components/pages/login-page/LoginPage';
import UserPage from '../components/pages/user-page/UserPage';
import EditReimbursement from '../components/pages/edit-reimbursement/EditReimbursement';
import GradeFormatsPage from '../components/pages/grade-formats-page/GradeFormatsPage';
import UsersPage from '../components/pages/users-page/UsersPage';
import AllReimbursements from '../components/pages/reimbursements-page/ReimbursementsPage';
import CreateReimbursementComponent from '../components/pages/create-reimbursement/CreateReimbursementComponent';

const AppRoutes: React.FC<unknown> = (props) => {

  return (
    <Switch>
      <Route exact path='/reimbursements'>
        <AllReimbursements />
      </Route>
      <Route exact path='/reimbursements/create'>
        <CreateReimbursementComponent />
      </Route>
      <Route exact path='/reimbursements/edit/:id'>
        <EditReimbursement />
      </Route>
      <Route exact path='/reimbursements/approve/:id'>
        <EditReimbursement review={true} />
      </Route>
      <Route path='/me'>
        <UserPage />
      </Route>
      <Route path='/grade-formats'>
        <GradeFormatsPage />
      </Route>
      <Route path='/users'>
        <UsersPage />
      </Route>
      <Route path='/login'>
        <LoginPage />
      </Route>
      <Route path='/'>
        <Redirect to='/me' />
      </Route>
    </Switch>
  );
};

export default AppRoutes;