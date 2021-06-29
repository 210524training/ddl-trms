
import React from 'react';
import User from '../../../models/user';
import Reimbursement from '../../../models/reimbursement';
import GradeFormat from '../../../models/grade-format';
import FileListView from './FileList';
import { v4 as uuid } from 'uuid';
import Modal from './Modal';
import { injectAnchorTags } from '../../../models/utils/remail';
interface Props {
  sid: string,
  user: User,
  gradeFormat: GradeFormat,
  r: Reimbursement,
}

const ViewReimbursement: React.FC<Props> = ({r, user, gradeFormat, sid = uuid()}) => {
  

  return (
    <Modal 
      uid={'view-modal' + sid}
      ClickRender={() => <i className="bi bi-eye text-primary"></i>}
      Body={() => <DisplayTable r={r} user={user} gradeFormat={gradeFormat}/>}
      clickTitle={`View ${r.title}`}
      staticBackdrop={false}
      xl={true}
    />
  );
}

const DisplayTable: React.FC<{ r: Reimbursement, user: User, gradeFormat: GradeFormat }> = ({ 
  r, user, gradeFormat,
}): JSX.Element => {
  return (
    <table className="table table-striped table-hover">
      <tbody>
        <tr>
          <th>Submitted by</th>
          <td>{user.lastName}, {user.firstName}</td>
        </tr>
        <tr>
          <th>Title</th>
          <td>{r.title}</td>
        </tr>
        <tr>
          <th>Event Type</th>
          <td>{r.eventType}</td>
        </tr>
        <tr>
          <th>Grading Format</th>
          <td>{gradeFormat.gradeFormat}</td>
        </tr>
        <tr>
          <th>Needed to pass</th>
          <td>{gradeFormat.passingGrade}</td>
        </tr>
        <tr>
          <th>Grade/Presentation</th>
          <td dangerouslySetInnerHTML={{__html: injectAnchorTags(r.grade)}}></td>
        </tr>
        <tr>
          <th>Start/End Date</th>
          <td>{r.startDate} / {r.endDate}</td>
        </tr>
        <tr>
          <th>Location of the Event</th>
          <td>{r.locationOfEvent}</td>
        </tr>
        <tr>
          <th>Description</th>
          <td>{r.descriptionOfEvent}</td>
        </tr>
        <tr>
          <th>Costs</th>
          <td>
            <table className="table table-hover table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Description</th>
                </tr>
                
              </thead>
              <tbody>
                {r.costs.length === 0 ? (<tr><td colSpan={5}>No Costs.</td></tr>) : undefined}
                {
                  r.costs.map((c, idx) => (
                    <tr key={`cost-${uuid()}`}>
                      <td>{idx + 1}</td>
                      <td>{c.title}</td>
                      <td>{c.type}</td>
                      <td>{c.cost}</td>
                      <td>{c.description || 'None.'}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <th>Work Related Justifications</th>
          <td>{r.workRelatedJustification}</td>
        </tr>
        <tr>
          <th>Amount paid</th>
          <td>{r.amountPaid}</td>
        </tr>
        <tr>
          <th>Attachments</th>
          <td>
            <FileListView items={r.attachments} rid={r.id} />
          </td>
        </tr>
        
        <tr>
          <th>Work Time Missed</th>
          <td>{r.workTimeMissed}</td>
        </tr>
        <tr>
          <th>Status</th>
          <td>{r.reimbusementStatus}</td>
        </tr>
        <tr>
          <th>Comments</th>
          <td>
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Comentator</th>
                  <th>Comment</th>
                </tr>
              </thead>
              <tbody>
                {r.adminComments.length === 0 ? (<tr><td colSpan={3}>No comments.</td></tr>) : undefined}
                {
                  r.adminComments.map((c, idx) => (
                    <tr key={c.by+c.comment}>
                      <th>{idx + 1}</th>
                      <th>{c.by}</th>
                      <td>{c.comment}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <th>id</th>
          <td>{r.id}</td>
        </tr>
        <tr>
          <th>Created at</th>
          <td>{r.createdAt}</td>
        </tr>
        <tr>
          <th>updated at</th>
          <td>{r.updatedAt}</td>
        </tr>
        <tr>
          <th>Started Approval Process</th>
          <td>{r.startedApprovalProcess ? 'yes' : 'no'}</td>
        </tr>
        <tr>
          <th>Approvals</th>
          <td colSpan={2}>
            <table className="table table-hover table-striped">
            <tbody>
              <tr>
                <th>Director Supervisor:</th>
                <td>{r.approvals.directorSupervisor ? 'yes' : 'no'}</td>
              </tr>

              <tr>
                <th>Department Head:</th>
                <td>{r.approvals.departmentHead ? 'yes' : 'no'}</td>
              </tr>

              <tr>
                <th>Benefits Coordinator:</th>
                <td>{r.approvals.benefitsCoordinator ? 'yes' : 'no'}</td>
              </tr>
            </tbody>
          </table>
          </td>
        </tr>
        <tr>
          <th>Notified Supervisor</th>
          <td>{r.sentEmail ? 'yes' : 'no'}</td>
        </tr>
      </tbody>
    </table>
  );
}

export default ViewReimbursement;