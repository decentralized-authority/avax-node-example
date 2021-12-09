import { Row } from './ui/row';
import { ButtonDanger, ButtonInfo, ButtonSuccess } from './ui/buttons';
import { useState } from 'react';
import { Card } from './ui/card';
import swal from 'sweetalert';

export const NodeDashboard = ({ nodeData, nodeStatus, nodeVersion, nodeUpgrade }) => {

  const [ disabled, setDisabled ] = useState(false);

  const onStartClick = async e => {
    e.preventDefault();
    if(disabled)
      return;
    setDisabled(true);
    await ipcRenderer.invoke('START_NODE', nodeData);
    setDisabled(false);
  };

  const onStopClick = async e => {
    e.preventDefault();
    if(disabled)
      return;
    setDisabled(true);
    await ipcRenderer.invoke('STOP_NODE');
    setDisabled(false);
  };

  const onUpdateClick = async e => {
    e.preventDefault();
    const confirmed = await swal({
      title: 'Upgrade Available',
      text: `Avalanche v${nodeUpgrade.version} is now available. Would you like to upgrade?`,
      buttons: [
        'Cancel',
        'Ok',
      ],
    });
    if(confirmed)
      ipcRenderer.send('UPGRADE_NODE', nodeUpgrade);
  };

  return (
    <div>
      <Row>
        <Card>
          <ul className={'mb-0'}>
            <li>Node Version: <strong>{nodeVersion || nodeData.version}</strong></li>
            <li>Node Status: <strong className={nodeStatus === 'STOPPED' ? 'text-danger' : 'text-success'}>{nodeStatus}</strong></li>
            <li>RPC Port: <strong>{nodeData.rpcPort}</strong></li>
          </ul>
        </Card>
      </Row>
      <Row>
        {nodeStatus === 'STOPPED' ?
          <ButtonSuccess onClick={onStartClick}>Start Node</ButtonSuccess>
          :
          <ButtonDanger onClick={onStopClick}>Stop Node</ButtonDanger>
        }
      </Row>
      {nodeUpgrade ?
        <Row>
          <ButtonInfo onClick={onUpdateClick}>Update Node</ButtonInfo>
        </Row>
        :
        null
      }
    </div>
  );
};
