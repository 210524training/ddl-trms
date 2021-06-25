import { IUser, Role, UserID } from "../@types";
import clone from './utils/clone'
export default interface User extends IUser {
    username: string,
    password: string,
    employeeRoles: Role[],
    email: string,
    firstName: string,
    lastName: string,
    address: string,
    phoneNumber: string,
    consumedAt: string,
    id: UserID,
}

export default class CUser implements User {
  constructor(
    public username: string,
    public password: string,
    public employeeRoles: Role[],
    public email: string = '',
    public firstName: string = '',
    public lastName: string = '',
    public address: string = '',
    public phoneNumber: string = '',
    public consumedAt: string,
    public id: UserID,
  ) {}

  cloned(): User {
    return clone<User>(this);
  }

  censored(): User {
    const censored = this.cloned();
    censored.email = '<email>';
    censored.address = '<address>';
    censored.password = '<password>';
    censored.lastName = '<last-name>';
    censored.phoneNumber = '<phone-number>';
    return censored;
  }

  isSuperUser(): boolean {
    return this.employeeRoles.includes('Director Supervisor') || this.employeeRoles.includes('Department Head') || this.employeeRoles.includes('Benefits Coordinator');
  }
}
