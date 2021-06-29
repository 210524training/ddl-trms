import React from 'react';
import { Attachment } from '../../../@types';

interface Props {
  items: Attachment[],
  rid: string,
  onDelete?: (idx: number) => void,
}

const FileListView: React.FC<Props> = ({ items, rid, onDelete }): JSX.Element => {
  return (
    <table className="table table-striped table-hover">
      <thead>
        <tr>
          <th>#</th>
          <th>File Name</th>
          <th>File Type</th>
          <th>File Size</th>
          <th style={{textAlign: 'center'}}>Download</th>
          {!!onDelete ? <th style={{textAlign: 'center'}}>Delete</th> : undefined}
        </tr>
      </thead>
        <tbody>
          {items.length === 0 ? (<tr><td colSpan={5 + (!!onDelete ? 1 : 0)} style={{textAlign: 'center'}}>No Attachments.</td></tr>) : undefined}
          {
            items.map((a, idx) => (
              <tr key={`view-file-item-${rid}-${a.key}-${a.size}`}>
                <td>{idx + 1}</td>
                <td>{a.name}</td>
                <td>{a.mimetype}</td>
                <td>{a.size} bytes</td>
                <td style={{textAlign: 'center'}}>
                  <a 
                  target="_blank"
                  rel="noreferrer"
                  href={`http://localhost:4000/files/${rid}/${a.key}`}
                  download={a.name}
                  >
                    <i className="bi bi-download" title={`Download ${a.name} in a new tab`}></i>
                  </a>
                </td>
                {!!onDelete ? (
                  <td style={{textAlign: 'center'}}>
                    <button className="btn" onClick={(e) => {
                      e.preventDefault();
                      onDelete(idx);
                    }}>
                      <i className="bi bi-x-lg text-danger" title={`Delete file '${a.name}'`}></i>
                    </button>
                  </td>
                ) : undefined}
              </tr>
            ))
          }  
        </tbody>
    </table>
  );
};

export default FileListView;