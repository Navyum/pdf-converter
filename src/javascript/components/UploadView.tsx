import React, { useState, useCallback } from 'react';
import Dropzone, { DropzoneProps } from 'react-dropzone';

// 定义组件的 Props 类型
interface UploadViewProps {
  uploadPdfFunction: (fileBuffer: Uint8Array) => void;
}

const UploadView: React.FC<UploadViewProps> = ({ uploadPdfFunction }) => {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((files: File[]) => {
    if (files.length > 1) {
      setError(`Maximum one file allowed to upload, but not ${files.length}!`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const fileBuffer = evt.target?.result;
      if (fileBuffer instanceof ArrayBuffer) {
        uploadPdfFunction(new Uint8Array(fileBuffer));
      }
    };
    reader.readAsArrayBuffer(files[0]);
  }, [uploadPdfFunction]);

  return (
    <div>
      <Dropzone
        onDrop={onDrop}
        multiple={false}
      >
        {({ getRootProps, getInputProps, isDragActive }: any) => (
          <div
            {...getRootProps()}
            style={{
              width: 400,
              height: 500,
              borderWidth: 2,
              borderColor: isDragActive ? '#4CAF50' : '#666',
              borderStyle: 'dashed',
              borderRadius: 5,
              display: 'table-cell',
              textAlign: 'center',
              verticalAlign: 'middle',
              backgroundColor: isDragActive ? '#f0f8f0' : 'transparent'
            }}
          >
            <input {...getInputProps()} />
            <div className="container">
              <h2>Drop your PDF file here!</h2>
            </div>
            <h1>📁</h1>
            <br/>
            <div style={{ 
              backgroundColor: '#fcf8e3', 
              border: '1px solid #faebcc', 
              color: '#8a6d3b',
              padding: '15px',
              borderRadius: '4px',
              margin: '10px'
            }}>
              <i>
                This tool converts a PDF file into a Markdown text format! Simply drag &amp; drop your PDF file on the upload area and go from there.
                Don&apos;t expect wonders, there are a lot of variances in generated PDF&apos;s from different tools and different ages.
                No matter how good the parser works for your PDF, you will have to invest a good amount of manual work to complete it.
                Though this tool aims to be general purpose, it has been tested on a certain set of PDF&apos;s only.
              </i>
            </div>
          </div>
        )}
      </Dropzone>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <br/><br/><br/><br/><br/><br/>
    </div>
  );
};

export default UploadView; 