import React, {useState} from 'react';
import ContainersForm from './containers-form/ContainersForm';
import ContainersList from './containers-list/ContainersList';
import "./Containers.css";

function Containers() {
  const [containerData, setContainerData] = useState([]);

  const addContainer = (newContainer) => {
    setContainerData([...containerData, newContainer]);
  };

  return (
    <div>
      <ContainersForm addContainer={addContainer}/>
      <ContainersList containerData={containerData}/>
    </div>
  );
}

export default Containers;