import React, {useEffect, useState} from 'react';
import ContainersForm from './containers-form/ContainersForm';
import ContainersList from './containers-list/ContainersList';
import "./Containers.css";

function Containers() {
  const [containerData, setContainerData] = useState({});

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
    if (containerData.hasOwnProperty(container.name)) {
      delete updatedContainerData[container.name];
    }
    setContainerData(updatedContainerData);
  };

  // if the user is premium, then we will populate containerData from the database.
  // useEffect(); 
  return (
    <div>
      <ContainersForm addContainer={addContainer}/>
      <ContainersList containerData={containerData} removeContainer={removeContainer}/>
    </div>
  );
}

export default Containers;