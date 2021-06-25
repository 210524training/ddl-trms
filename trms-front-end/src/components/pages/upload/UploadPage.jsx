import React, { useRef, useState } from 'react';
import client from '../../../remote/trms-backend/trms.client'

const FileUpload = ({ rid }) => {
    const [files, setFiles] = useState([]);
    const [file, setFile] = useState('');
    const [progress, setProgess] = useState(0);
    const el = useRef();

    const handleChange = (e) => {
        setProgess(0)
        const file = e.target.files[0];
        console.log(file);
        setFile(file);
    }

    const uploadFile = (e) => {
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
        }).catch(err => console.log(err))}

    return (
        <div>
            <div className="file-upload">
                <input type="file" ref={el} onChange={handleChange} className="form-control" /> 
                <div>
                   {progress + '\n'}
                   {progress === '100%' ? 'The file was uploaded!' : undefined}
                </div>
                <div className="progress-bar" style={{width: progress}}></div>
                <button onClick={uploadFile} className="btn btn-secondary">Upload</button>
            <hr />
            </div>
        </div>
    );
}

export default FileUpload;