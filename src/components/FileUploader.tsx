
import React, { useCallback } from 'react';
import {memoize} from "lodash";

interface FileUploaderProps {
    onLoadFile: (file: File) => Promise<void>;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onLoadFile }) => {
    const handleFileChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
                onLoadFile(file);
            }
        },
        [onLoadFile]
    );

    return <div>
            Load a file:
            <input className={"file-uploader"} type="file" onChange={handleFileChange} />
            </div>;
};

export default memoize(FileUploader);
