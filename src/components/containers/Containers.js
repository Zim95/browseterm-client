import React, {useEffect, useRef, useState} from 'react';
import ContainersForm from './containers-form/ContainersForm';
import ContainersList from './containers-list/ContainersList';
import "./Containers.css";
import config from '../../config';

import { ContainerManager, addSocketSSHContainer } from "../../lib/containerUtils";

/*
  Add the containerManager here and pass it around to all components.
*/

function Containers() {
  // Container Manager object
  const containerManager = useRef(new ContainerManager(config));

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
        await addSocketSSHContainer.call(containerManager.current);
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


  return (
    <div>
      <ContainersForm
        containerManager={containerManager}
        setContainerData={setContainerData}
        setContainerUserInfoMapping={setContainerUserInfoMapping}
      />
      <ContainersList
        containerManager={containerManager}
        containerData={containerData}
        setContainerData={setContainerData}
        socketSSHContainer={socketSSHContainer}
        setSocketSSHContainer={setSocketSSHContainer}
        containerUserInfoMapping={containerUserInfoMapping}
        setContainerUserInfoMapping={setContainerUserInfoMapping}
      />
    </div>
  );
}

export default Containers;