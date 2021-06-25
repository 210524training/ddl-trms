declare module './upload';

export type Grade = string;

export interface Item {
  title: string;
  cost: number;
  description: string;
  type: 'Event Cost' | 'Course Material' | 'Other'
}

export type Status = 'Urgent' | 'Submitted' | 'Started Approval Process' | 'More Information Needed' | 'Approved' | 'Rejected';

export interface Approvals {
  directorSupervisor: boolean;
  departmentHead: boolean;
  benefitsCoordinator: boolean;
  startDate: string;
  endDate: string | null;
}

export type ReimbursmentID = string;

export type GradingFormatID = string;

export type EventType = 'University Courses' | 'Seminars' | 'Certification Preparation Classes' | 'Certification' | 'Technical Training' | 'Other';

export type Comment = {
  comment: string;
  by: string;
};

export interface Attachment {
  data: any,
  /** The file name */
  name?: string,
  /** The encoding type of the file */
  encoding?: string,
  /** The mimetype of the file */
  type?: string,
  /** File size in bytes */
  size?: number,
  /** checksum of file */
  md5?: string,
}

export type Role = 'Employee' | 'Director Supervisor' | 'Department Head' | 'Benefits Coordinator';

export type Email = string;

export type UserID = Email;

interface IEntity {
  id: string;
}

export interface IUserEntityInterface extends IEntity {
  isSuperUser: () => boolean;
}

export interface IGradeFormat extends IEntity {
  gradeFormat: string,
  passingGrade: string,
  description: string,
  id: string,
}

export interface IReimbursement extends IEntity {
    employeeId: UserID,
    title: string,
    eventType: EventType,
    gradingFormatId: GradingFormatID,
    startDate: string,
    endDate: string,
    locationOfEvent: string,
    descriptionOfEvent: string,
    costs: Item[],
    grade: string,
    workRelatedJustification: string,
    completed: boolean,
    amountPaid: number,
    attachments: Attachment[],
    workTimeMissed: number,
    reimbusementStatus: Status,
    adminComments: Comment[],
    id: ReimbursmentID,
    createdAt: string,
    updatedAt: string,
    startedApprovalProcess: boolean,
    approvals: Approvals,
    sentEmail: boolean,
    toUpdate: boolean,
}

export interface IUser extends IEntity, IUserEntityInterface {
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
