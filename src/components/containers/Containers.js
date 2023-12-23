import React, {useEffect, useState} from 'react';
import ContainersForm from './containers-form/ContainersForm';
import ContainersList from './containers-list/ContainersList';
import "./Containers.css";
import config from '../../config';


function Containers() {
  const [containerData, setContainerData] = useState({});
  const [socketSSHContainer, setSocketSSHContainer] = useState(null);

  const getRandomNumberString = () => {
    return Math.floor(Math.random() * 10000).toString();
  };

  const startSocketSSH = async (container) => {
    try {
      const startHeaders = config.containerAPI.headers;
      const startUrl = config.containerAPI.urls.baseURL + config.containerAPI.urls.startContainerOffset;
      const startData = JSON.stringify(
        {
            "container_ids": [container.container_id],
            "container_name": container.container_name,
            "container_network": container.container_network
        }
      );
      const response = await fetch(
          startUrl,
          {
              method: "POST",
              headers: startHeaders,
              body: startData,
          }
      );
      if (response.status !== 200) {
        // const error_message = await response.text();
        // throw new Error(`HTTP Error! ${error_message }`);
        await startSocketSSH(container);
      } else {
        const data = await response.json();
        const ssContainer = {
          ...data.response[0],
          ...{"container_network": container.container_network}
        };
        setSocketSSHContainer(ssContainer);
      }
    } catch (error) {
      console.error("Error while starting container", error);
    }
  };

  const createSocketSSH = async () => {
    try {
        const userName = "zim95";
        const containerName = userName + "_socket_ssh_container" + getRandomNumberString();
        const containerNetwork = userName + "_network";
        const postData = JSON.stringify({
            "image_name": "zim95/socket-ssh:latest",
            "container_name": containerName,
            "container_network": containerNetwork,
            "publish_information": {
              "8000/tcp": 8000
            }
        });
        const postHeaders = config.containerAPI.headers;
        const postUrl = config.containerAPI.urls.baseURL + config.containerAPI.urls.createContainerOffset;
        const response = await fetch(
            postUrl,
            {
                method: "POST",
                headers: postHeaders,
                body: postData,
            }
        );
        if (response.status !== 200) {
            const error_message = await response.text();
            throw new Error(`HTTP Error! ${error_message }`);
        }
        const data = await response.json();
        await startSocketSSH(data.response[0]);
    } catch (error) {
        console.error("Error create socket ssh", error);
    }
  };

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
        await createSocketSSH();
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
        socketSSHContainer={socketSSHContainer}
        removeContainer={removeContainer}
        setContainerIps={setContainerIps}
        unsetContainerIps={unsetContainerIps}
      />
    </div>
  );
}

export default Containers;