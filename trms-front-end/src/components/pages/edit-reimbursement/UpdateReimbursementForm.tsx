
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Attachment, Comment, EventType, Item, Status } from '../../../@types';
import GradeFormat from '../../../models/grade-format';
import Reimbursement, { CReimbursement } from '../../../models/reimbursement';
import User from '../../../models/user';
import CUser from '../../../models/user';
import { updateReimbursement } from '../../../remote/trms-backend/trms.reimbusements.api';
import InputField from './InputFeild';
import RadioField, { RadioFieldOption } from './RadioField';
import { generate as shortid } from 'shortid';
import { validDate } from '../user-page/utils';
import CostsInput from './CostsInput';
import CommentsInput, { CommentList } from './CommentsInput';
import { myReimbursements } from '../../../remote/trms-backend/trms.users.api';
import FileUpload from '../upload/UploadPage';
import FileListView from '../user-page/FileList';
interface Props {
  r: Reimbursement,
  gradeFormats: GradeFormat[],
  createdBy: User,
  requestedBy: User,
  review?: boolean
}
const getAmountToBePaid = async (createdBy: User, costs: Item[], eventType: EventType, reses: Reimbursement[], setAmountPaid: any) => {
  try {
    const available = CReimbursement.availableReimbursment(createdBy, {
      costs, eventType
    } as Reimbursement, reses)
    setAmountPaid(available);
  } catch (err) {
    setAmountPaid(0)
  }
  
}
const UpdateReimbursementForm: React.FC<Props> = ({ r, createdBy, review, gradeFormats, requestedBy }): JSX.Element => {
  const history = useHistory();
  if (!(new CUser(
    requestedBy.username,
    requestedBy.password,
    requestedBy.employeeRoles,
    requestedBy.email,
    requestedBy.firstName,
    requestedBy.lastName,
    requestedBy.address,
    requestedBy.phoneNumber,
    requestedBy.consumedAt,
    requestedBy.id,
  ).isSuperUser())) {
    if (r.employeeId !== requestedBy.id) {
      history.push('/?not-authorized');
    }
  }

  const costTypes = ['Event Cost', 'Course Material', 'Other']
  const statusList: Status[] = ['Approved', 'Rejected', 'Urgent', 'Submitted', 'Started Approval Process', 'More Information Needed', ];
  const eventTypes: EventType[] = ['University Courses', 'Seminars', 'Certification Preparation Classes', 'Certification', 'Technical Training', 'Other'];
  const [title, setTitle] = useState<string>(r.title);
  const [eventType, setEventType] = useState<EventType>(r.eventType);
  const [gradingFormatId, setGradingFormatId] = useState<string>(r.gradingFormatId);
  const [startDate, setStartDate] = useState<string>(validDate(new Date(r.startDate)));
  const [endDate, setEndDate] = useState<string>(validDate(new Date(r.endDate)));
  const [locationOfEvent, setLocationOfEvent] = useState<string>(r.locationOfEvent);
  const [descriptionOfEvent, setDescriptionOfEvent] = useState<string>(r.descriptionOfEvent);
  const [costs, setCosts] = useState<Item[]>(r.costs);
  const [grade, setGrade] = useState<string>(r.grade);
  const [workRelatedJustification, setWorkRelatedJustification] = useState<string>(r.workRelatedJustification);
  const [attachments, setAttachements] = useState<Attachment[]>(r.attachments);
  const [workTimeMissed, setWorkTimeMissed] = useState<string>(r.workTimeMissed + '');
  const [reimbursementStatus, setReimbursementStatus] = useState<Status>(r.reimbusementStatus);
  const [adminComments, setAdminComments] = useState<Comment[]>(r.adminComments);

  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [reses, setReses] = useState<Reimbursement[]>([]);

  const [initialOptionsEventType, setInitialOptionsEventType] = useState<RadioFieldOption[]>([]);
  const [initialOptionsCostItems, setInitialOptionsCostItems] = useState<RadioFieldOption[]>([]);
  const [initialOptionsGradeFormats, setInitialOptionsGradeFormats] = useState<RadioFieldOption[]>([]);
  const [initialOptionsStatusList, setInitialOptionsStatusList] = useState<RadioFieldOption[]>([]);

  useEffect(() => {
    myReimbursements(createdBy.id).then(e => {
      setReses(e);
    });

    const gfops = gradeFormats.map((gf) => ({
        displayName: `${gf.gradeFormat} (passing: ${gf.passingGrade})`,
        uid: gf.id + '-radio-input',
        defaultValue: gf.id,
        disabled: false,
        defaultChecked: gf.id === r.gradingFormatId,
      } as RadioFieldOption)
    );

    const etops = eventTypes.map((e) => ({
        displayName: e,
        uid: shortid(),
        defaultValue: e,
        disabled: false,
        defaultChecked: e === r.eventType,
      } as RadioFieldOption)
    );

    const ciops = costTypes.map((e) => ({
        displayName: e,
        uid: shortid(),
        defaultValue: e,
        disabled: false,
        defaultChecked: e === 'Other',
      } as RadioFieldOption)
    );

    const slops = statusList.map((status, idx) => ({
        displayName: status,
        uid: status + '-radio-input-' + idx,
        defaultValue: status,
        disabled: false,
        defaultChecked: status === r.reimbusementStatus,
      } as RadioFieldOption)
    );

    getAmountToBePaid(createdBy, costs, eventType, reses, setAmountPaid);
    setInitialOptionsEventType([...etops]);
    setInitialOptionsCostItems([...ciops]);
    setInitialOptionsGradeFormats([...gfops]);
    setInitialOptionsStatusList([...slops]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  
  const handleGradeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGrade(e.target.value);
  };

  const handleEventTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEventType(e.currentTarget.value as EventType);
  };

  const handleGradingFormatIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGradingFormatId(e.currentTarget.value);
  };

  const handleOnStatusChange = (e: ChangeEvent<HTMLInputElement>) => {
    setReimbursementStatus(e.currentTarget.value as Status);
  };

  const handleStartDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStartDate(validDate(new Date(e.target.value)));
  };

  const handleEndDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEndDate(validDate(new Date(e.target.value)));
  };

  const handleLocationOfEventChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocationOfEvent(e.target.value);
  };

  const handleDescriptionOfEventChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDescriptionOfEvent(e.target.value);
  };

  
  const handleWorkRelatedJustificationChange = (e: ChangeEvent<HTMLInputElement>) => {
    setWorkRelatedJustification(e.target.value);
  };
  const handleWorkTimeMissedChange = (e: ChangeEvent<HTMLInputElement>) => {
    setWorkTimeMissed(parseInt(e.target.value) + '');
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const approvals = r.approvals;
    let startedApprovalProcess = false;
    let rs = reimbursementStatus;
    if (reimbursementStatus === 'Approved' || reimbursementStatus === 'Started Approval Process' || reimbursementStatus === 'More Information Needed') {
      if (requestedBy.employeeRoles.includes('Department Head')) {
        r.approvals.startDate = new Date().toLocaleString();
        startedApprovalProcess = true;
        r.approvals.departmentHead = true;
        rs = reimbursementStatus === 'Approved' ? 'Started Approval Process' : reimbursementStatus;
      }

      if (requestedBy.employeeRoles.includes('Director Supervisor')) {
        startedApprovalProcess = true;
        r.approvals.directorSupervisor = true;
        rs = reimbursementStatus === 'Approved' ? 'Started Approval Process' : reimbursementStatus;
      }

      if (requestedBy.employeeRoles.includes('Benefits Coordinator')) {
        startedApprovalProcess = true;
        r.approvals.benefitsCoordinator = true;
        rs = 'Approved'
      }
    }

    if (reimbursementStatus === 'Rejected') {
      if (requestedBy.employeeRoles.includes('Benefits Coordinator')) {
        startedApprovalProcess = true;
        r.approvals.benefitsCoordinator = true;
        r.approvals.endDate = new Date().toLocaleString();
      }
    }
    console.log(r.approvals);
    const response = await updateReimbursement(new CReimbursement(
      r.employeeId,
      title,
      eventType,
      gradingFormatId,
      startDate.toLocaleString(),
      endDate.toLocaleString(),
      locationOfEvent,
      descriptionOfEvent,
      costs,
      grade,
      workRelatedJustification,
      r.completed,
      amountPaid,
      attachments,
      parseInt(workTimeMissed) || 0,
      rs,
      adminComments,
      r.id,
      r.createdAt,
      new Date().toLocaleString(),
      startedApprovalProcess,
      approvals,
      r.sentEmail,
      true,
    ));

    history.push('/me?updated=' + !!response)
  }

  let statusRadioFiled = undefined;

  const field: JSX.Element = <RadioField 
    displayName="Status"
    name="statusRadio"
    options={initialOptionsStatusList}
    onChange={handleOnStatusChange}
  />;

  if (review) {
    if (requestedBy.employeeRoles.includes('Benefits Coordinator')) {
      if (r.approvals.departmentHead && r.approvals.directorSupervisor) {
        statusRadioFiled = field;
      } else {
        if (!r.approvals.departmentHead && r.approvals.directorSupervisor) {
          statusRadioFiled = <p>Approval needed by the Department Head</p>;
        } else if (r.approvals.departmentHead && !r.approvals.directorSupervisor) {
          statusRadioFiled = <p>Approval needed by the Director Supervisor</p>
        } else {
          statusRadioFiled = <p>Approvals needed to continue</p>
        }
      }
    } else if (requestedBy.employeeRoles.includes('Director Supervisor')) {
      if (!r.approvals.departmentHead && !requestedBy.employeeRoles.includes('Department Head')) {
        statusRadioFiled = <p>Approval needed by the Department Head</p>;
      } else {
        statusRadioFiled = field;
      }
    } else {
      statusRadioFiled = field;
    }
  }

  return (
    <>
      <div className="container">
        <form onSubmit={handleFormSubmit}>
          {/* Title */}
          <InputField
            displayName="Title"
            name="title"
            placeholder="Title"
            value={title}
            type="text"
            uid="titleInput"
            onChange={handleTitleChange}
          />
          <hr />
          {/* Location */}
          <InputField
            displayName="Location"
            name="location"
            placeholder="Location of the event"
            value={locationOfEvent}
            type="text"
            uid="locationInput"
            onChange={handleLocationOfEventChange}
          />

          <hr />

          <CostsInput
            items={costs}
            setItems={setCosts}
            initialOptions={initialOptionsCostItems}
            onChange={() => getAmountToBePaid(createdBy, costs, eventType, reses, setAmountPaid)}
          />

           <hr />
          {/* Event Type */}
          <RadioField 
            displayName="Event Type"
            name="eventType"
            options={initialOptionsEventType}
            onChange={handleEventTypeChange}
          />

          <hr />

          {/* Grade Formats */}
          <RadioField 
            displayName="Grade Formats"
            name="gradeFormat"
            options={initialOptionsGradeFormats}
            onChange={handleGradingFormatIdChange}
          />

          <hr />

          {/* Grade */}
          <InputField 
            displayName="Grade"
            name="grade"
            placeholder="Grade"
            type="text"
            uid="gradeInput"
            value={grade}
            onChange={handleGradeChange}
          />

          {/* Input files */}
          <hr />

          <FileListView items={attachments} rid={r.id} onDelete={(idx: number) => {
            attachments.splice(idx, 1);
            setAttachements([
              ...attachments
            ]);
            console.log(attachments);
          }} />
          <FileUpload 
            rid={r.id}
            onChange={(a: Attachment) => {
              console.log(a);
              console.log(attachments);
              setAttachements([
                ...attachments,
                a
              ]);

              console.log(attachments);
            }}
          />

          <hr />
          {/* Description */}
          <InputField
            displayName="Description"
            name="description"
            placeholder="Describe any details in regards to the event"
            value={descriptionOfEvent}
            type="text"
            uid="descriptionInput"
            onChange={handleDescriptionOfEventChange}
          />

          <hr />
          {/* Work releated justification */}
          <InputField
            displayName="Work Related Justification"
            name="workRelatedJustification"
            placeholder="Benefits of this event in regards to your job"
            value={workRelatedJustification}
            type="text"
            uid="workrelatedjsutification"
            onChange={handleWorkRelatedJustificationChange}
          />

          <hr />

          {/* start date & end datre */}
          <div className="form-row">
            <label htmlFor="startDate" className="col-6 col-form-label" id="pub-date-label">Start Date:</label>
            <label htmlFor="endDate" className="col-6 col-form-label" id="pub-date-label">End Date:</label>
            <div className="col-7 input-group">
              <input type="date" name="startDate" id="startDate" className="form-control " required
                onChange={handleStartDateChange} value={startDate}
              />
              <input type="date" name="endDate" id="endDate" className="form-control " required
                onChange={handleEndDateChange} value={endDate}
              />
            </div>
          </div>

          <hr />
          {/* Work time missed */}
          <InputField
            displayName="Work Time Missed"
            name="workTimeMissed"
            placeholder="Specify the amount work hours missed due to the event"
            value={workTimeMissed}
            type="text"
            uid="descriptionInput"
            onChange={handleWorkTimeMissedChange}
          />

          {
            review
            ? (
              <>
                <hr />

                <CommentsInput
                  items={adminComments}
                  setItems={setAdminComments}
                  by={requestedBy}
                />

                <hr />

                {statusRadioFiled}

                <hr />

                <div className="col-auto">
                <label className="sr-only" htmlFor="inlineFormInputGroup">Amount to Pay</label>
                <div className="input-group mb-2">
                  <div className="input-group-prepend">
                    <div className="input-group-text">$</div>
                  </div>
                  <input 
                  type="number" 
                  className="form-control" 
                  id="amountPaidMutable" 
                  placeholder="Amount"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(parseInt(e.target.value))}
                  />
                </div>
              </div>
              </>
            ) : (
              <>
              <hr />
              <p>Comments by supers:</p>
              <CommentList
                items={adminComments}
                setItems={setAdminComments}
                by={requestedBy}
              />

              <hr />
              <p>Current status: <b>{r.reimbusementStatus}</b></p>

              <div className="col-auto">
                <label className="sr-only" htmlFor="inlineFormInputGroup">Amount to Pay</label>
                <div className="input-group mb-2">
                  <div className="input-group-prepend">
                    <div className="input-group-text">$</div>
                  </div>
                  <input type="number" className="form-control" id="amountPaidImmutable" placeholder="Amount" readOnly value={amountPaid} />
                </div>
              </div>
              </>
            )
          }


          <hr />
          <div className="form-row align-items-center">
            <div className="col-sm-10">
              <button type="submit" className="btn btn-primary">Modify {r.title}</button>
            </div>
          </div>
        </form>
          <hr />

      </div>
    </>
  );
};

export default UpdateReimbursementForm;

