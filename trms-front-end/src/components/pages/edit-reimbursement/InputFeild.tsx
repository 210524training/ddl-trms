
import React, { ChangeEvent } from 'react';

interface Props {
  displayName: string,
  name: string,
  placeholder: string,
  uid: string,
  type: string,
  value: string,
  onChange: (e: ChangeEvent<HTMLInputElement>) => void,
}

const InputField: React.FC<Props> = ({ displayName, placeholder, value, name, uid, type, onChange }): JSX.Element => {
  return (
    <div className="form-group row">
      <label htmlFor={uid} className="col-sm-2 col-form-label">{displayName}</label>
      <div className="col-sm-10">
        <input
          type={type}
          className="form-control"
          id={uid}
          placeholder={placeholder}
          name={name}
          onChange={onChange}
          value={value}
        />
      </div>
    </div>
  );
};

export default InputField;