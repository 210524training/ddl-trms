
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useHistory } from 'react-router-dom';
import { EventType, Item } from '../../../@types';
import GradeFormat from '../../../models/grade-format';
import Reimbursement, { CReimbursement } from '../../../models/reimbursement';
import User from '../../../models/user';
import { createReimbursement } from '../../../remote/trms-backend/trms.reimbusements.api';
import { generate as shortid } from 'shortid';
import { validDate } from '../user-page/utils';
import { myReimbursements } from '../../../remote/trms-backend/trms.users.api';
import InputField from '../edit-reimbursement/InputFeild';
import CostsInput from '../edit-reimbursement/CostsInput';
import RadioField, { RadioFieldOption } from '../edit-reimbursement/RadioField';

interface Props {
  gradeFormats: GradeFormat[],
  requestedBy: User,
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
const CreateReimbursementPage: React.FC<Props> = ({ gradeFormats, requestedBy }): JSX.Element => {

  const costTypes = ['Event Cost', 'Course Material', 'Other']
  const id = uuid();
  const history = useHistory();
  const eventTypes: EventType[] = ['University Courses', 'Seminars', 'Certification Preparation Classes', 'Certification', 'Technical Training', 'Other'];
  const [title, setTitle] = useState<string>('');
  const [eventType, setEventType] = useState<EventType>('Other');
  const [gradingFormatId, setGradingFormatId] = useState<string>(gradeFormats[0].id);
  const [startDate, setStartDate] = useState<string>(validDate(new Date()));
  const [endDate, setEndDate] = useState<string>(validDate(new Date()));
  const [locationOfEvent, setLocationOfEvent] = useState<string>('');
  const [descriptionOfEvent, setDescriptionOfEvent] = useState<string>('');
  const [costs, setCosts] = useState<Item[]>([]);
  const [grade, setGrade] = useState<string>('');
  const [workRelatedJustification, setWorkRelatedJustification] = useState<string>('');
  const [workTimeMissed, setWorkTimeMissed] = useState<string>('0');


  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [reses, setReses] = useState<Reimbursement[]>([]);

  const [initialOptionsEventType, setInitialOptionsEventType] = useState<RadioFieldOption[]>([]);
  const [initialOptionsCostItems, setInitialOptionsCostItems] = useState<RadioFieldOption[]>([]);
  const [initialOptionsGradeFormats, setInitialOptionsGradeFormats] = useState<RadioFieldOption[]>([]);
  
  useEffect(() => {
    getAmountToBePaid(requestedBy, costs, eventType, reses, setAmountPaid);
  }, [costs, eventType, requestedBy, reses]);

  useEffect(() => {
    myReimbursements(requestedBy.id).then(e => {
      setReses(e);
    });

    const gfops = gradeFormats.map((gf) => ({
        displayName: `${gf.gradeFormat} (passing: ${gf.passingGrade})`,
        uid: gf.id + '-radio-input',
        defaultValue: gf.id,
        disabled: false,
        defaultChecked: true,
      } as RadioFieldOption)
    );

    const etops = eventTypes.map((e) => ({
        displayName: e,
        uid: shortid(),
        defaultValue: e,
        disabled: false,
        defaultChecked: true,
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

    getAmountToBePaid(requestedBy, costs, eventType, reses, setAmountPaid);
    setInitialOptionsEventType([...etops]);
    setInitialOptionsCostItems([...ciops]);
    setInitialOptionsGradeFormats([...gfops]);
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
    console.log(e.target.value);
    setWorkRelatedJustification(e.target.value);
  };
  const handleWorkTimeMissedChange = (e: ChangeEvent<HTMLInputElement>) => {
    setWorkTimeMissed(parseInt(e.target.value) + '');
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await createReimbursement(new CReimbursement(
      requestedBy.id,
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
      true,
      amountPaid,
      [],
      parseInt(workTimeMissed) || 0,
      'Submitted',
      [],
      id,
      new Date().toLocaleString(),
      new Date().toLocaleString(),
      false,
    ));

    history.push('/me?created=' + !!response)
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
            onChange={() => getAmountToBePaid(requestedBy, costs, eventType, reses, setAmountPaid)}
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

          <div className="col-auto">
                <label className="sr-only" htmlFor="inlineFormInputGroup">Amount to Pay</label>
                <div className="input-group mb-2">
                  <div className="input-group-prepend">
                    <div className="input-group-text">$</div>
                  </div>
                  <input type="number" className="form-control" id="amountPaidImmutable" placeholder="Amount" readOnly value={amountPaid} />
                </div>
              </div>
          <hr />
          <div className="form-row align-items-center">
            <div className="col-sm-10">
              <button type="submit" className="btn btn-primary">Modify {title}</button>
            </div>
          </div>
        </form>
          <hr />

      </div>
    </>
  );
};

export default CreateReimbursementPage;

