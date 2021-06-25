import React, { ChangeEvent, useEffect, useState } from 'react';
import { useAppSelector } from '../../../hooks';
import { selectUser, UserState } from '../../../slices/user.slice';
import InputField from '../edit-reimbursement/InputFeild';
import { v4 as uuid } from 'uuid';
import { useHistory } from 'react-router-dom';
import User from '../../../models/user';
import CUser from '../../../models/user';
import { Role } from '../../../@types';
import { addUser, getAllUsers } from '../../../remote/trms-backend/trms.users.api';
import RadioField from '../edit-reimbursement/RadioField';

const UsersPage: React.FC<unknown> = (props): JSX.Element => {
  const user = useAppSelector<UserState>(selectUser);
  const history  = useHistory();
  if (!(user?.employeeRoles.includes('Benefits Coordinator')
      || user?.employeeRoles.includes('Department Head')
      || user?.employeeRoles.includes('Director Supervisor'))) {
        history.push('/?not-authorized');
  }

  const roles = [
    ['Employee'],
    ['Director Supervisor'],
    ['Department Head'],
    ['Director Supervisor', 'Department Head'],
    ['Benefits Coordinator']
  ];

  const [users, setUsers] = useState<User[]>([]);
  const [status, setStatus] = useState<string | undefined>(undefined);

  const [username, setUsername] = useState<string>('');
  const [password, setPassowrd] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [employeeRoles, setEmployeeRoles] = useState<Role[]>(['Employee']);

  const handleOnUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleOnPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassowrd(e.target.value);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleFirstNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };

  const handlePhoneNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const handleLastNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };

  const handleEmployeeRolesChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmployeeRoles(JSON.parse(e.target.value) as Role[]);
  };

  const setData = () => {
    setStatus('Loading...');
    getAllUsers().then(setUsers).catch(err => {
      setStatus('An error occurred! ' + err.message);
    })
  };
  
  useEffect(() => {
    setData();
  }, []);

  const displayReimbursemnt = (r: User, idx: number) => {    
    
    return (
      <tr key={r.id}>
        <td>{idx + 1}</td>
        <td>{r.id}</td>
        <td>{r.username}</td>
        <td>{r.password}</td>
        <td>{JSON.stringify(r.employeeRoles)}</td>
        <td>{r.email}</td>
        <td>{r.firstName}</td>
        <td>{r.lastName}</td>
        <td>{r.address}</td>
        <td>{r.phoneNumber}</td>
        <td>{r.consumedAt}</td>
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
            displayName="Username"
            name="username"
            placeholder="Username"
            value={username}
            type="text"
            uid="usernameInput"
            onChange={handleOnUsernameChange}
          />

          <InputField
            displayName="Password"
            name="password"
            placeholder="Password"
            value={password}
            type="password"
            uid="passwordInput"
            onChange={handleOnPasswordChange}
          />

          <InputField
            displayName="Email"
            name="email"
            placeholder="email"
            value={email}
            type="email"
            uid="emailInput"
            onChange={handleEmailChange}
          />

          <InputField
            displayName="First Name"
            name="firstName"
            placeholder="First Name"
            value={firstName}
            type="text"
            uid="firstNameInput"
            onChange={handleFirstNameChange}
          />

          <InputField
            displayName="Last Name"
            name="lastName"
            placeholder="Last Name"
            value={lastName}
            type="text"
            uid="lastNameInput"
            onChange={handleLastNameChange}
          />

          <InputField
            displayName="Address"
            name="address"
            placeholder="Address"
            value={address}
            type="text"
            uid="addressInput"
            onChange={handleAddressChange}
          />

          <InputField
            displayName="Phone Number"
            name="phoneNumber"
            placeholder="phoneNumber"
            value={phoneNumber}
            type="text"
            uid="phoneNumberInput"
            onChange={handlePhoneNumberChange}
          />

          {/* Grade Formats */}
          <RadioField 
            displayName="Grade Formats"
            name="gradeFormat"
            options={
              roles.map((r: any) => ({
                displayName: r.join(' & '),
                uid: JSON.stringify(r) + '-radio-input',
                defaultValue: JSON.stringify(r),
                disabled: false,
                defaultChecked: JSON.stringify(r).includes('Employee'),
              })
            )
          }
            onChange={handleEmployeeRolesChange}
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
                const date = new Date('1970').toLocaleString();
                const created = await addUser(new CUser(
                  username,
                  password,
                  employeeRoles,
                  email,
                  firstName,
                  lastName,
                  address,
                  phoneNumber,
                  date,
                  uuid()
                ));
                if (created) {
                  const gfs = await getAllUsers();
                  setUsers(gfs);
                } else {
                  setStatus('Failed to add usert');
                }

                btn.disabled = false;
                
              }
              
            }}
          >
            <i className="bi bi-file-plus"></i> Add {username || 'User'}
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
            <th>username</th>
            <th>password</th>
            <th>Employee Roles</th>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Address</th>
            <th>Phone Number</th>
            <th>Consumed Amount At</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? users.map((r, idx) => (
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

export default UsersPage;
