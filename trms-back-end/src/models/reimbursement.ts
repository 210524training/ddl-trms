import { v4 as uuid } from 'uuid';
import userService from '../services/user.service';
import reimbursementService from '../services/reimbursement.service';
import getDate, { diffInYears, diffInWeeks } from '../utils/date';
import User from './user';
import {
  Approvals, Attachment, EventType, GradingFormatID, Item, ReimbursmentID, Status, Comment, UserID,
  IReimbursement,
} from '../@types/trms/index.d';

export default class Reimbursement implements IReimbursement {
  public toUpdate: boolean = false;

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
    public reimbusementStatus: Status,
    public adminComments: Comment[] = [],
    public id: ReimbursmentID = uuid(),
    public createdAt: string = getDate(),
    public updatedAt: string = getDate(),
    public startedApprovalProcess: boolean = false,
    public approvals: Approvals = {
      directorSupervisor: false,
      departmentHead: false,
      benefitsCoordinator: false,
      startDate: getDate(),
      endDate: null,
    },
    public sentEmail: boolean = false,
  ) {
    this.escalateIfNeeded();
    this.approveIfNeeded();
  }

  set setToUpdate(toUpdate: boolean) {
    this.toUpdate = toUpdate;
  }

  public updateTime(): void {
    this.updatedAt = getDate();
    this.toUpdate = true;
  }

  public async approveIfNeeded() {
    if (this.startedApprovalProcess) {
      const awaitingBenCo = this.approvals.directorSupervisor && this.approvals.departmentHead;
      const exceededApprovalTime = diffInWeeks(new Date(this.approvals.startDate)) > 2;
      if (!this.sentEmail && awaitingBenCo) {
        this.sentEmail = await userService.sendMailToDirectorSupervisors(this);
        this.updateTime();
        await reimbursementService.update(this);
      } else if (exceededApprovalTime) {
        this.reimbusementStatus = 'Approved';
        await reimbursementService.update(this);
      }
    }
  }

  public async approve(amount?: number, comment: string = 'No comment.', by: string = 'unknown') {
    if (amount) {
      this.amountPaid = amount;
      this.adminComments.push({ comment, by });
    } else {
      const employee = await userService.getById(this.employeeId);

      if (employee) {
        const reimbursmets = await reimbursementService.getAllByEmployeeId(this.employeeId);
        this.amountPaid = Reimbursement.availableReimbursment(employee, this, reimbursmets);
        this.adminComments.push({
          comment: 'Automatically approved by the system.',
          by: 'system',
        });
      } else {
        throw Error('Employee was not found');
      }
    }

    this.completed = true;
    this.approvals.endDate = getDate();
    this.updateTime();
  }

  public escalateIfNeeded(): void {
    const accpetedOrRejected = this.reimbusementStatus === 'Approved' || this.reimbusementStatus === 'Rejected';
    if (
      !accpetedOrRejected
      && (diffInWeeks(new Date(this.startDate)) < 2 || diffInWeeks(new Date(this.endDate)) < 2)
    ) {
      this.reimbusementStatus = 'Urgent';
      this.updateTime();
    }
  }

  public escalate(): void {
    this.reimbusementStatus = 'Urgent';
    this.updateTime();
  }

  public static totalReimburstment = 1_000.00;

  public static availableReimbursment(
    employee: User,
    reimbursment: Reimbursement,
    employeePastReimburs: Reimbursement[],
    totalReimburstment = Reimbursement.totalReimburstment,
  ): number {
    const accepted = employeePastReimburs.filter((r) => r.reimbusementStatus === 'Approved');
    const awarded = accepted.reduce((acc, cur) => {
      const moreThanAYear = diffInYears(new Date(cur.approvals.startDate)) >= 1;
      return moreThanAYear ? acc : acc + cur.amountPaid;
    }, 0);
    const pending = reimbursment.calculatePaid();
    const remaining = totalReimburstment - awarded;
    const available = (pending <= remaining) ? pending : remaining;
    const hasOneYearPassed = diffInYears(new Date(employee.consumedAt)) >= 1;
    return hasOneYearPassed ? available : 0;
  }

  public calculatePaid(): number {
    const accepted = this.costs.filter((c) => c.type !== 'Course Material');
    const total = accepted.reduce((acc, cur) => acc + cur.cost, 0);
    const coverage = this.getCoverage();
    return total * coverage;
  }

  public getCoverage(): number {
    switch (this.eventType) {
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
