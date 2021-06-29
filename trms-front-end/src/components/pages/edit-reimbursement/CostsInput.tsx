import React, { useState } from 'react';
import { Item } from '../../../@types';
import { generate as shortid } from 'shortid';
import RadioField, { RadioFieldOption } from './RadioField';
import InputField from './InputFeild';

type CostType = 'Event Cost' | 'Course Material' | 'Other';
interface Props {
  items: Item[],
  setItems: React.Dispatch<React.SetStateAction<Item[]>>,
  onChange: () => void,
  initialOptions: RadioFieldOption[],
}

const CostsInput: React.FC<Props> = ({ items, setItems, onChange, initialOptions }): JSX.Element => {
  const [title, setTitle] = useState<string>('');
  const [cost, setCost] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [type, setType] = useState<CostType>('Other');
  return (
    <>
    <label htmlFor="costsInput" className="col-sm-2 col-form-label">Costs</label>
    
    <div className="">
      
      <CostsList items={items} setItems={setItems} onChange={onChange} initialOptions={initialOptions} />
      <div id="costsField">
        <InputField
          displayName="Title"
          name="title"
          placeholder="Title for Cost"
          type="text"
          uid="titleOfCost"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            onChange();
          }}
        />
        <InputField
          displayName="Cost"
          name="costOfItem"
          placeholder="42.96"
          type="text"
          uid="costOfItem"
          value={cost}
          onChange={(e) => {
            const v = parseInt(e.target.value) + '';
            setCost(v);
            onChange();
          }}
        />

        <InputField
          displayName="Description"
          name="decription"
          placeholder="Describe the cost"
          type="text"
          uid="descriptionOfCost"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            onChange();
          }}
        />

        <RadioField 
          displayName="Cost Type"
          name="costType"
          options={initialOptions}
          onChange={(e) => {
            setType(e.currentTarget.value as CostType);
            onChange();
          }}
        />

        <button className="btn btn-secondary"
        onClick={(e) => {
          e.preventDefault();
          if (title.trim() && cost && !Number.isNaN(cost)) {
            setItems([
              ...items,
              {title: title.trim(), cost: Number(cost), description, type: type || 'Other'}
            ]);
          }          
          onChange();
        }}
        >Add Cost</button>
      </div>
    </div>
    </>
  );
};

const CostsList: React.FC<Props> = ({items, setItems, onChange}): JSX.Element => {
  return (
    <table className="table table-hover table-striped">
      <thead>
        <tr>
          <th>Title</th>
          <th>Cost</th>
          <th>Description</th>
          <th>Type</th>
          <th style={{textAlign: 'center'}}>Remove</th>
        </tr>
      </thead>
      <tbody>
        {
          items.filter(i => !!i.title.trim() && !!i.cost).map((i, idx) => (
            <tr key={i.type + idx}>
              <td>{i.title}</td>
              <td>${i.cost}</td>
              <td>{i.description}</td>
              <td>{i.type}</td>
              <td style={{textAlign: 'center'}}>
                <button className="btn" title={`Delete ${i.title}`}
                  onClick={(e) => {
                    e.preventDefault();
                    items.splice(idx, 1);
                    setItems([
                      ...items
                    ]);
                    onChange();
                  }}
                >
                  <i className="bi bi-x-lg text-danger"></i>
                </button>
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  );
}

export default CostsInput;