import React from 'react';
import Dropzone from 'react-dropzone';

interface UploadViewProps {
  onDrop: (acceptedFiles: File[]) => void;
  error?: string;
}

const UploadView: React.FC<UploadViewProps> = ({ onDrop, error }) => {
  return (
    <div className="upload-wrap">
      <div className="upload-shell">
        <Dropzone
          onDrop={onDrop}
          accept={{ 'application/pdf': ['.pdf'] }}
          maxFiles={1}
          multiple={false}
        >
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div
              {...getRootProps()}
              className={`upload-card ${isDragActive ? 'drag' : ''}`}
            >
              <input {...getInputProps()} />
              <div className="upload-icon">
                <i className="fas fa-cloud-upload-alt" aria-hidden="true"></i>
              </div>
              <h3 id="upload-title">拖拽PDF文件到此处或点击选择</h3>
              <span style={{position:'absolute',width:0,height:0,overflow:'hidden',clip:'rect(0 0 0 0)'}}>Drop your PDF file here!</span>
              <p>支持单个文件上传</p>
              <div className="upload-actions">
                <button className="btn-upload">
                  <i className="fas fa-folder-open"></i>
                  <span>选择文件</span>
                </button>
              </div>
              {error && <div style={{ color: 'var(--error-color)', marginTop: 12 }}>{error}</div>}
            </div>
          )}
        </Dropzone>
      </div>
    </div>
  );
};

export default UploadView; 