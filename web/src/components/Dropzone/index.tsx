import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';

import './styles.css';

interface IDropzoneProps {
  onFileUploaded: (file: File) => void;
}

const DropZone: React.FC<IDropzoneProps> = ({ onFileUploaded }) => {
  const [selectedFileUrl, setSelectedFileUrl] = useState('');

  const onDrop = useCallback(([file]) => {
    const fileUrl = URL.createObjectURL(file);
    setSelectedFileUrl(fileUrl);

    onFileUploaded(file);
  }, [onFileUploaded]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
  });

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />

      { selectedFileUrl
        ? <img src={selectedFileUrl} alt="Point thumbnail"/>
        : (
          <p>
            <FiUpload />
            Imagem do estabelecimento
          </p>
        )
      }
    </div>
  );
}

export default DropZone;
