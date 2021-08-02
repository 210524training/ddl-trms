import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getReimbursement } from '../../../remote/trms-backend/trms.reimbusements.api';

type Params = {
    rid: string,
    key: string,
}

const DownloadFile: React.FC<unknown> = (props) => {
    const {rid, key} = useParams<Params>();
    const [title, setTitle] = useState<string>('File View');
    useEffect(() => {
        getReimbursement(rid).then(r => {
            for (const a of r.attachments) {
                if (a.key === key) {
                    setTitle(a.name);
                    break;
                }
            }
        }).catch(console.error)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    return (
        <div>
            <br />
            <br />
            <br />
            
            <iframe 
                title={title} 
                src={`http://localhost:4000/files/${rid}/${key}`}
                style={{
                    width: '100%', 
                    height: window.innerHeight - 90,
                }}
            />
        </div>
    );
};

export default DownloadFile;