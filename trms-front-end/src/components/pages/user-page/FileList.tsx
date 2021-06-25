import React from 'react';
import { Attachment } from '../../../@types';

interface Props {
  items: Attachment[]
}

const FileListView: React.FC<Props> = ({ items }): JSX.Element => {
  return (
    <table className="table table-striped table-hover">
      <thead>
        <tr>
          <th>File Name</th>
          <th>File Type</th>
          <th>File Size</th>
          <th>File Encoding</th>
          <th>Checksum (md5)</th>
          <th>Open in new tab</th>
        </tr>
      </thead>
        <tbody>
          {
            items.map(a => (
              <tr key={a.md5 + a.name + a.size}>
                <td>{a.name}</td>
                <td>{a.mimetype}</td>
                <td>{a.size} bytes</td>
                <td>{a.encoding}</td>
                <td>{a.md5}</td>
                <td style={{textAlign: 'center'}}>
                  <a 
                  target="_blank"
                  rel="noreferrer"
                  href={URL.createObjectURL(new Blob([Buffer.from(a.data.data, 'base64')], {type: a.mimetype}))}>
                    
                    <i className="bi bi-folder-symlink" title={`Open ${a.name} in a new tab`}></i>
                  </a>
                  
                </td>
                {/* <td>{a.data.length} bytes</td> */}
              </tr>
            ))
          }  
        </tbody>
    </table>
  );
};

export default FileListView;