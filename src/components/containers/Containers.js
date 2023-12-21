import React, {useEffect, useState} from 'react';
import ContainersForm from './containers-form/ContainersForm';
import ContainersList from './containers-list/ContainersList';
import "./Containers.css";
import { config } from '@fortawesome/fontawesome-svg-core';

function Containers() {
  const [containerData, setContainerData] = useState({});
  const [socketSSHContainer, setSocketSSHContainer] = useState(null);

  const startSocketSSH = async (container) => {
    try {
      const startHeaders = config.containerAPI.headers;
      const startUrl = config.containerAPI.urs.baseURL + config.containerAPI.urls.startContainerOffset;
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
        const error_message = await response.text();
        throw new Error(`HTTP Error! ${error_message }`);
      }
      const data = await response.json();
      setSocketSSHContainer(data.response[0]);
    } catch (error) {
      throw new Error("Error while starting container", error);
    }
  };

  const createSocketSSH = async () => {
    try {
        const userName = "zim95";
        const containerName = userName + "_socket_ssh_container";
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
        throw new Error("Error create socket ssh", error);
    }
  };

  const removeSocketSSH = async () => {
    try {
      console.log("Removing", socketSSHContainer);
    } catch(error) {
      throw new Error(error)
    }
  };

  useEffect(async () => {
    try {
      await createSocketSSH();
      window.addEventListener('beforeunload', unloadContainer);
      return () => {
          window.removeEventListener('beforeunload', unloadContainer);
      };
    } catch (error) {
      console.error(error);
    }
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
        removeContainer={removeContainer}
        setContainerIps={setContainerIps}
        unsetContainerIps={unsetContainerIps}
      />
    </div>
  );
}

export default Containers;