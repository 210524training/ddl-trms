
import React from 'react';
import User from '../../../models/user';
import Reimbursement from '../../../models/reimbursement';
import GradeFormat from '../../../models/grade-format';
import FileListView from './FileList';
import { v4 as uuid } from 'uuid';
interface Props {
  sid: string,
  user: User,
  gradeFormat: GradeFormat,
  r: Reimbursement,
}

const ViewReimbursement: React.FC<Props> = ({r, user, gradeFormat, sid = uuid()}) => {
  return (
    <>
      <button 
        className="btn btn-sm"
        data-bs-toggle="modal"
        data-bs-target={`#${sid}`}
        onClick={(e) => {
          e.preventDefault();
          const element: any = document.getElementById(sid);
          if (element) {
            try {
              element.modal('show')
            } catch (e) {}
          }
        }}
        title={`View ${r.title}`}
      >
        <i data-target={`${sid}`} className="bi bi-eye text-primary"></i>
      </button>

      <div className="modal fade bd-example-modal-xl" id={sid} data-bs-keyboard="false" tabIndex={-1} aria-labelledby={sid + '-label'} aria-hidden="true">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={sid + '-label'}>{r.title}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id={sid + '-close-btn'}></button>
            </div>
            <div className="modal-body">
              <div className="container-fluid">
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
                    <th>Grade</th>
                    <td>{r.grade}</td>
                  </tr>
                  <tr>
                    <th>Start Date</th>
                    <td>{r.startDate}</td>
                  </tr>
                  <tr>
                    <th>End Date</th>
                    <td>{r.endDate}</td>
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
                    <th>attachments</th>
                    <td>
                      {r.attachments.length === 0 ? (<tr><td colSpan={5}>No Attachments.</td></tr>) : undefined}
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

              </div>
             
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewReimbursement;