import React, {useEffect, useRef, useState} from 'react';
import ContainersForm from './containers-form/ContainersForm';
import ContainersList from './containers-list/ContainersList';
import "./Containers.css";
import config from '../../config';

import {
  ContainerManager,
  addSocketSSHContainer,
  unloadContainer
} from "../../lib/containerUtils";

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


  useEffect(() => {
    const initializeCreateContainer = async() => {
      try {
        await addSocketSSHContainer.call(containerManager.current);
        setSocketSSHContainer({...containerManager.current.socketSSHContainer});
      } catch (error) {
        console.error(error);
      }
    };
    initializeCreateContainer();
  }, []);

  useEffect(() => {
    /* Remove socketSSHContainer on unload*/
    const unloadContainerHandler = async () => {
      await unloadContainer.call(
        containerManager.current,
        [socketSSHContainer["container_id"]],
        socketSSHContainer["container_name"],
        socketSSHContainer["container_network"]
      );
    };
    window.addEventListener('unload', unloadContainerHandler);
    return () => {
        window.removeEventListener('unload', unloadContainerHandler);
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
        containerUserInfoMapping={containerUserInfoMapping}
        setContainerUserInfoMapping={setContainerUserInfoMapping}
      />
    </div>
  );
}

export default Containers;