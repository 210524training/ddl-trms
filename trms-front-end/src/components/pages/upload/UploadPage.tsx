import React, { useRef, useState } from 'react';
import { Attachment } from '../../../@types';
import client from '../../../remote/trms-backend/trms.client'

interface Props {
    rid: string,
    onChange: (a: Attachment) => void
}

const FileUpload: React.FC<Props> = ({ rid, onChange }) => {
    const [file, setFile] = useState<Blob | string>('');
    const [progress, setProgess] = useState<string>('0%');
    const el = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setProgess('0%')
            const file = e.target.files[0];
            console.log(file);
            setFile(file);
        } else {
            setProgess('Please provide a file.')
        }
    }

    const uploadFile = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        const formData = new FormData();        
        formData.append('file', file);
        client.post('/upload/' + rid + '', formData, {
            onUploadProgress: (ProgressEvent) => {
                const progress = Math.round(ProgressEvent.loaded / ProgressEvent.total * 100) + '%';
                setProgess(progress);
            }
        }).then(res => {
            console.log(res);
            if (res.status === 200) {
                onChange(res.data);
            } 
        }).catch(err => {
            console.error(err);
            if (err.message.includes('400')) {
                setProgess('Bad Request (400): Missing File?')
            }
        })}

    return (
        <div>
            <div className="file-upload">
                <input type="file" ref={el} onChange={handleChange} className="form-control" /> 
                <div className="progress" style={{marginTop: 10, marginBottom: 10}}>
                    <div className="progress-bar" style={{width: progress}}>{progress}</div>
                </div>
                <div>
                    <button onClick={uploadFile} className="btn btn-secondary">Upload</button>
                </div>
            <hr />
            </div>
        </div>
    );
}

export default FileUpload;