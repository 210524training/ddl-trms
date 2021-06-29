import React, { useState } from 'react';
import { Comment } from '../../../@types';
import { generate as shortid } from 'shortid';
import InputField from './InputFeild';
import User from '../../../models/user';

interface Props {
  items: Comment[],
  by: User,
  setItems: React.Dispatch<React.SetStateAction<Comment[]>>,
}

const CostsInput: React.FC<Props> = ({ items, by, setItems }): JSX.Element => {
  const [comment, setComment] = useState<string>('');

  return (
    <>
    <label htmlFor="costsInput" className="col-sm-2 col-form-label">Comment</label>
    
    <div className="form-group row">
      
      <div className="col-sm-10">

        <CommentList items={items} setItems={setItems} by={by} />
        <div id="costsField">
          <InputField
            displayName="Comment"
            name="comment"
            placeholder="Comment"
            type="text"
            uid="commentInput"
            value={comment}
            onChange={(e) => {
              console.log(e.target.value);
              setComment(e.target.value);
            }}
          />

          <button className="btn btn-secondary"
          onClick={(e) => {
            e.preventDefault();
            if (comment.trim()) {
              setItems([
                ...items,
                { comment: comment.trim(), by: `${by.lastName}, ${by.firstName} (${by.employeeRoles})` }
              ]);
              setComment('');
            }          
          }}
          >Add Comment</button>
        </div>
      </div>
    </div>
    </>
  );
};

export const CommentList: React.FC<Props> = ({items, by, setItems}): JSX.Element => {
  const isAdmin = (by.employeeRoles.includes('Benefits Coordinator') ||
            by.employeeRoles.includes('Department Head') ||
            by.employeeRoles.includes('Director Supervisor'));
  return (
    <table className="table table-hover table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>Comment</th>
          <th>By</th>
          {
            isAdmin
            ? (
              <th style={{textAlign: 'center'}}>Remove</th>
            ) : (
              undefined
            )
          }
          
        </tr>
      </thead>
      <tbody>
        {items.length === 0 ? <tr><td colSpan={3} style={{textAlign: 'center'}}>No Comments</td></tr> : undefined}
        {
          items.filter(i => !!i.comment.trim()).map((i, idx) => (
            <tr key={i.by + shortid()}>
              <td>{idx + 1}</td>
              <td>{i.comment}</td>
              <td>{i.by}</td>

              {
                isAdmin
                ? (
                  <td style={{textAlign: 'center'}}>
                    <button className="btn" title={`Delete comment by ${i.by}`}
                      onClick={(e) => {
                        e.preventDefault();
                        items.splice(idx, 1);
                        setItems([
                          ...items
                        ]);
                      }}
                    >
                      <i className="bi bi-x-lg text-danger"></i>
                    </button>
                  </td>
                ) : (
                  undefined
                )
              }
              
            </tr>
          ))
        }
      </tbody>
    </table>
  );
}

export default CostsInput;