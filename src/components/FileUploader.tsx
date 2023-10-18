// FileUploader.tsx

import React, { useCallback } from 'react';
import { CompleteTableData } from './types'; // Adjust the import according to your file structure

interface FileUploaderProps {
    onLoadFile: (file: File) => Promise<CompleteTableData>;
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

export default FileUploader;
