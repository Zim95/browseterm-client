import React, {useEffect, useState} from 'react';
import ContainersForm from './containers-form/ContainersForm';
import ContainersList from './containers-list/ContainersList';
import "./Containers.css";

function Containers() {
  const [containerData, setContainerData] = useState({});
  const [sshSocketCount, setSshSocketCount] = useState(0);

  const addContainer = (containerResponse) => {
    let containerDataMap = {};
    containerResponse.map((container) => {
        if(containerDataMap.hasOwnProperty(container.container_name)) {
          containerDataMap[container.container_name]['ids'].push(container.container_id.slice(0, 4));
          containerDataMap[container.container_name]['full_ids'].push(container.container_id);
        } else {
          containerDataMap[container.container_name] = {
              'name': container.container_name,
              'image': container.container_image,
              'ips': [],
              'ids': [container.container_id.slice(0, 4)],
              'full_ids': [container.container_id],
              'network': container.container_network
          }
        }
    });
    setContainerData({...containerData, ...containerDataMap});
  };

  const removeContainer = (container) => {
    let updatedContainerData = { ...containerData };
    if (updatedContainerData.hasOwnProperty(container.name)) {
      delete updatedContainerData[container.name];
    }
    setContainerData(updatedContainerData);
  };

  const setContainerIps = (containers) => {
    let updatedContainerData = { ...containerData };
    containers.forEach((container) => {
      if (updatedContainerData.hasOwnProperty(container.container_name)) {
        updatedContainerData[container.container_name]['ips'].push(container.container_ip);
      }
    });
    setContainerData(updatedContainerData);
  };

  const unsetContainerIps = (containers) => {
    let updatedContainerData = { ...containerData };
    containers.forEach((container) => {
      if (updatedContainerData.hasOwnProperty(container.container_name)) {
        updatedContainerData[container.container_name]['ips'] = [];
      }
    });
    setContainerData(updatedContainerData);
  };

  return (
    <div>
      <ContainersForm addContainer={addContainer}/>
      <ContainersList
        containerData={containerData}
        removeContainer={removeContainer}
        setContainerIps={setContainerIps}
        unsetContainerIps={unsetContainerIps}
      />
    </div>
  );
}

export default Containers;