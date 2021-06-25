import { v4 as uuidv4 } from 'uuid';
import getDate from '../utils/date';
import clone from '../utils/clone';
import { IUser, Role, UserID } from '../@types/trms/index.d';

export default class User implements IUser {
  constructor(
    public username: string,
    public password: string,
    public employeeRoles: Role[],
    public email: string = '',
    public firstName: string = '',
    public lastName: string = '',
    public address: string = '',
    public phoneNumber: string = '',
    public consumedAt: string = getDate('1/1/1970'),
    public id: UserID = uuidv4(),
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
