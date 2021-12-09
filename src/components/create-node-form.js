import { Row } from './ui/row';
import { Card } from './ui/card';
import { FileInput, TextInput } from './ui/forms';
import { Button } from './ui/buttons';
import { useState } from 'react';

export const CreateNodeForm = ({ setNodeData }) => {

  const [ peerPort, setPeerPort ] = useState('9651');
  const [ rpcPort, setRPCPort ] = useState('9650');
  const [ rootDir, setRootDir ] = useState('');

  const onPeerPortChange = e => {
    e.preventDefault();
    setPeerPort(e.target.value.trim());
  };
  const onRPCPortChange = e => {
    e.preventDefault();
    setRPCPort(e.target.value.trim());
  };

  const onSubmit = async e => {
    e.preventDefault();
    if(!rootDir)
      return;
    const nodeData = await ipcRenderer.invoke('CREATE_NODE', {
      id: 'avax-node',
      peerPort,
      rpcPort,
      rootDir,
    });
    setNodeData(nodeData);
    localStorage.setItem('NODE_DATA', JSON.stringify(nodeData));
  };

  return (
    <Row>
      <form onSubmit={onSubmit}>
        <Card>
          <TextInput label={'Peer Port:'} onChange={onPeerPortChange} value={peerPort} />
          <TextInput label={'RPC Port:'} onChange={onRPCPortChange} value={rpcPort} />
          <FileInput label={'Data Directory:'} onChange={setRootDir} value={rootDir} />
          <Button type={'submit'}>Create Local Node</Button>
        </Card>
      </form>
    </Row>
  );
};
