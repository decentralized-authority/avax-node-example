import { CreateNodeForm } from './components/create-node-form';
import { Heading } from './components/heading';
import { useEffect, useState } from 'react';
import { NodeDashboard } from './components/node-dashboard';
import swal from 'sweetalert';

const App = () => {

  const [ nodeData, setNodeData ] = useState();
  const [ nodeStatus, setNodeStatus ] = useState('STOPPED');
  const [ nodeVersion, setNodeVersion ] = useState('');
  const [ nodeUpgrade, setNodeUpgrade ] = useState();

  useEffect(() => {
    const origNodeData = localStorage.getItem('NODE_DATA');
    if(origNodeData) {
      const parsed = JSON.parse(origNodeData);
      console.log(parsed);
      setNodeData(parsed);
    }
    ipcRendererOn('NODE_STATUS', (e, status) => {
      setNodeStatus(status);
    });
    ipcRendererOn('NODE_VERSION', (e, version) => {
      setNodeVersion(version);
    });
    ipcRendererOn('NODE_UPDATED', (e, data) => {
      setNodeUpgrade();
      localStorage.setItem('NODE_DATA', JSON.stringify(data));
    });
    ipcRendererOn('NODE_UPGRADE', async (e, upgrade) => {
      setNodeUpgrade(upgrade);
    });
    setInterval(() => {
      ipcRenderer.send('GET_NODE_VERSION');
      ipcRenderer.send('GET_NODE_STATUS');
    }, 10000);
  }, []);

  useEffect(() => {
    const upgradeInterval = setInterval(() => {
      ipcRenderer.send('GET_NODE_UPGRADE', nodeData);
    }, 30000);
    return () => {
      clearInterval(upgradeInterval);
    };
  }, [nodeData]);

  return (
    <div className={'container-fluid'}>
      <Heading />
      {nodeData ?
        <NodeDashboard nodeData={nodeData} nodeStatus={nodeStatus} nodeVersion={nodeVersion} nodeUpgrade={nodeUpgrade} />
        :
        <CreateNodeForm setNodeData={setNodeData} />
      }
    </div>
  );
}

export default App;
