import React, { ChangeEvent } from 'react';

export interface RadioFieldOption {
  defaultValue: string,
  uid: string,
  displayName: string,
  disabled?: boolean,
  defaultChecked?: boolean,
}

interface Props {
  displayName: string,
  name: string,
  onChange: (e: ChangeEvent<HTMLInputElement>) => void,
  options: RadioFieldOption[],
  uid?: string,
}

const RadioField: React.FC<Props> = ({uid, displayName, name, options, onChange}) => {
  return (
    <fieldset className="form-group" id={uid}>
      <div className="row">
        <legend className="col-form-label col-sm-2 pt-0">{displayName}</legend>
        <div className="col-sm-10">
          {
            options.map(option => (
              <div className="form-check" key={option.uid + '-radio-form-check'}>
                <input 
                  className="form-check-input" 
                  type="radio" 
                  name={name}
                  id={option.uid} 
                  defaultValue={option.defaultValue} 
                  defaultChecked={!!option.defaultChecked}
                  disabled={!!option.disabled}
                  onChange={onChange}
                  
                />
                <label className="form-check-label" htmlFor={option.uid}>
                  {option.displayName}
                </label>
              </div>
            ))
          }
        </div>
      </div>
    </fieldset>
  );
};

export default RadioField;