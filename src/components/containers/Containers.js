import React, {useEffect, useState} from 'react';
import ContainersForm from './containers-form/ContainersForm';
import ContainersList from './containers-list/ContainersList';
import "./Containers.css";

function Containers() {
  const [containerData, setContainerData] = useState([]);

  const addContainer = (newContainer) => {
    setContainerData([...containerData, newContainer]);
  };

  const removeContainer = (container) => {
    const indexToRemove = containerData.findIndex(c => c.id == container.id);
    if (indexToRemove !== -1) {
      containerData.splice(indexToRemove, 1);
    }
    setContainerData(containerData);
  };

  // if the user is premium, then we will populate container from the database.
  // useEffect(); 
  return (
    <div>
      <ContainersForm addContainer={addContainer}/>
      <ContainersList containerData={containerData} removeContainer={removeContainer}/>
    </div>
  );
}

export default Containers;