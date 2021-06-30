import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { logout, selectUser, UserState } from '../../slices/user.slice';

type Props = {
}

const Navbar: React.FC<Props> = (props) => {

  const history = useHistory();
  const dispatch = useAppDispatch();
  // We "Select" the User data from the state
  const user = useAppSelector<UserState>(selectUser);
  const handleLogout = () => {
    dispatch(logout());
    history.push('/');
  }

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-light fixed-top">
      <div id="nav" className="container-fluid">
        <NavLink className="navbar-brand" to="/"><code>TRMS++</code></NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <ul className="navbar-nav">
            {
              user
              ? ( 
              <li className="nav-item">
                <NavLink className="nav-link" to="/reimbursements/create">Submit a Reimbursement</NavLink>
                {/* <a href="http://localhost:4000/files/e10da005-130b-427b-861d-f5d40c046497/cea5ac77fe6ec5f4ab30df9e0d620f15" target="_blank" rel="noreferrer">hey</a> */}
              </li>) : (
                <li className="nav-item"></li>
              )
            }

            {
              user?.employeeRoles.includes('Benefits Coordinator')
              || user?.employeeRoles.includes('Department Head')
              || user?.employeeRoles.includes('Director Supervisor')
              ? (
                <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/users">Employees</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/grade-formats">Grade Formats</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/reimbursements">Review Reimbursements</NavLink>
                </li>
                </>
              ) : (<></>)
            }
          </ul>
          <ul className="navbar-nav ms-auto">
            { !user ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">
                    <span className=""><i className="bi bi-door-open"></i> Sign in</span>
                  </NavLink>
                </li>
                {/* <li className="nav-item ">
                  <NavLink className="nav-link" to="/register">Register</NavLink>
                </li> */}
              </>
              ) : (
                <>
                 <li className="nav-item dropdown">
                   <NavLink className="nav-link" to="/me">
                     <span className="text-dark"><i className="bi bi-person-circle"></i>  My Account</span>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                  <button type='submit' onClick={handleLogout} className='btn'>
                    <span className="text-danger"><i className="bi bi-door-closed"></i> Sign out</span>
                  </button>
                </li>
              </>
              )
            }
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;