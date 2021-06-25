import {
  Approvals, Attachment, EventType, GradingFormatID,
  IReimbursement, Item, ReimbursmentID, Status, UserID,
  Comment
} from "../@types";
import User from "./user";
import { diffInYears } from "./utils/date";

export default interface Reimbursement extends IReimbursement {
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

export class CReimbursement {
    constructor(
    public employeeId: UserID,
    public title: string,
    public eventType: EventType,
    public gradingFormatId: GradingFormatID,
    public startDate: string,
    public endDate: string,
    public locationOfEvent: string,
    public descriptionOfEvent: string,
    public costs: Item[],
    public grade: string = '',
    public workRelatedJustification: string = 'No work related justification was provided.',
    public completed: boolean = false,
    public amountPaid: number = 0,
    public attachments: Attachment[] = [],
    public workTimeMissed: number = -1,
    public reimbusementStatus: Status = 'Submitted',
    public adminComments: Comment[] = [],
    public id: ReimbursmentID ,
    public createdAt: string ,
    public updatedAt: string ,
    public startedApprovalProcess: boolean = false,
    public approvals: Approvals = {
      directorSupervisor: false,
      departmentHead: false,
      benefitsCoordinator: false,
      startDate,
      endDate: null,
    },
    public sentEmail: boolean = false,
    public toUpdate: boolean = false,
  ) {}

  public static totalReimburstment = 1_000.00;

  public static availableReimbursment(
    employee: User,
    reimbursment: Reimbursement,
    employeePastReimburs: Reimbursement[],
    totalReimburstment = CReimbursement.totalReimburstment,
  ): number {
    const accepted = employeePastReimburs.filter((r) => r.reimbusementStatus === 'Approved');
    const awarded = accepted.reduce((acc, cur) => {
      const moreThanAYear = diffInYears(new Date(cur.approvals.startDate)) >= 1;
      return moreThanAYear ? acc : acc + cur.amountPaid;
    }, 0);
    const pending = CReimbursement.calculatePaid(reimbursment);
    const remaining = totalReimburstment - awarded;
    const available = (pending <= remaining) ? pending : remaining;
    const hasOneYearPassed = diffInYears(new Date(employee.consumedAt)) >= 1;
    return hasOneYearPassed ? available : 0;
  }

  public static calculatePaid(r: Reimbursement): number {
    const accepted = r.costs.filter((c) => c.type !== 'Course Material');
    const total = accepted.reduce((acc, cur) => acc + cur.cost, 0);
    const coverage = CReimbursement.getCoverage(r.eventType);
    return total * coverage;
  }

  public static getCoverage(eventType: EventType): number {
    switch (eventType) {
    case 'University Courses':
      return 0.80;
    case 'Seminars':
      return 0.60;
    case 'Certification Preparation Classes':
      return 0.75;
    case 'Certification':
      return 1;
    case 'Technical Training':
      return 0.90;
    default:
      return 0.30;
    }
  }
}