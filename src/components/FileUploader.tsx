
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

    return <input type="file" onChange={handleFileChange} />;
};

export default memoize(FileUploader);
