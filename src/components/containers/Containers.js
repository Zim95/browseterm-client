import React, {useEffect, useState} from 'react';
import ContainersForm from './containers-form/ContainersForm';
import ContainersList from './containers-list/ContainersList';
import "./Containers.css";
import config from '../../config';

import { ContainerManager, addSocketSSHContainer } from '../../lib/containerUtils';

/*
  Add the containerManager here and pass it around to all components.

*/

function Containers() {
  // Container Manager object
  const containerManager = new ContainerManager(config);

  // State
  const [containerData, setContainerData] = useState({});
  const [socketSSHContainer, setSocketSSHContainer] = useState(null);
  const [containerUserInfoMapping, setContainerUserInfoMapping] = useState({});


  const unloadContainer = async () => {
    const unloadContainerBody = JSON.stringify(
      {
          container_ids: [socketSSHContainer.container_id],
          container_network: socketSSHContainer.container_network,
          container_name: socketSSHContainer.container_name,
      }
    );
    const unloadContainerHeaders = config.containerAPI.headers;
    const stopOffset = config.containerAPI.urls.stopContainerOffset;
    const stopUrl = config.containerAPI.urls.baseURL + stopOffset;
    const stopBeaconBody = {
        "method": "POST",
        "url": stopUrl,
        "headers": unloadContainerHeaders,
        "body": unloadContainerBody,
    }
    const deleteOffset = config.containerAPI.urls.deleteContainerOffset;
    const deleteUrl = config.containerAPI.urls.baseURL + deleteOffset;
    const deleteBeaconBody = {
        "method": "POST",
        "url": deleteUrl,
        "headers": unloadContainerHeaders,
        "body": unloadContainerBody,
    };
    const beaconBody = JSON.stringify([stopBeaconBody, deleteBeaconBody]);
    const beaconOffset = config.containerAPI.urls.beaconOffset;
    const beaconUrl = config.containerAPI.urls.baseURL + beaconOffset;
    navigator.sendBeacon(beaconUrl, new Blob([beaconBody]));
  };

  useEffect(() => {
    const initializeCreateContainer = async() => {
      try {
        await addSocketSSHContainer.call(containerManager);
        setSocketSSHContainer(containerManager.socketSSHContainer);
      } catch (error) {
        console.error(error);
      }
    };
    initializeCreateContainer();
  }, []);

  useEffect(() => {
    window.addEventListener('unload', unloadContainer);
    return () => {
        window.removeEventListener('unload', unloadContainer);
    };
  }, [socketSSHContainer]);

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

  const removeSocketSSHUserMapping = (container) => {
    let updatedSocketSSHUserMapping = {...socketSSHUserMapping};
    if(updatedSocketSSHUserMapping.hasOwnProperty(container.name)) {
      delete updatedSocketSSHUserMapping[container.name];
    }
    setSocketSSHUserMapping(updatedSocketSSHUserMapping);
  };

  return (
    <div>
      <ContainersForm
        containerManager={containerManager}
        setContainerData={setContainerData}
        setContainerUserInfoMapping={setContainerUserInfoMapping}
      />
      <ContainersList
        containerData={containerData}
        socketSSHContainer={socketSSHContainer}
        containerUserInfoMapping={containerUserInfoMapping}
        removeContainer={removeContainer}
        setContainerIps={setContainerIps}
        unsetContainerIps={unsetContainerIps}
        removeSocketSSHUserMapping={removeSocketSSHUserMapping}
      />
    </div>
  );
}

export default Containers;