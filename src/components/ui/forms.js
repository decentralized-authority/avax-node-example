/* global ipcRenderer */
import { useState } from 'react';

export const TextInput = ({ label, onChange, value }) => {
  return (
    <div className={'form-group'}>
      <label>{label}</label>
      <input type={'text'} className={'form-control'} value={value} onChange={onChange} required={true} />
    </div>
  );
};

export const FileInput = ({ label, onChange, value }) => {

  const [ disabled, setDisabled ] = useState(false);

  const styles = {
    input: {
      cursor: 'pointer',
    }
  };

  const onClick = async e => {
    e.preventDefault();
    if(disabled)
      return;
    else
      setDisabled(true);
    const [ filePath ] = await ipcRenderer.invoke('OPEN_FILE_DIALOG', {
      title: 'Select data directory',
      properties: ['openDirectory', 'createDirectory'],
    });
    setDisabled(false);
    if(filePath)
      onChange(filePath);
  };

  return (
    <div className={'form-group'}>
      <label>{label}</label>
      <input type={'text'} style={styles.input} className={'form-control'} value={value} required={true} onClick={onClick} readOnly={true} />
    </div>
    );
};
