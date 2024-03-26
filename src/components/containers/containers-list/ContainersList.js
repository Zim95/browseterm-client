import React from 'react';
import ContainerListButtons from './container-list-buttons/ContainerListButtons';
import './ContainersList.css';

function ContainersList(
    {
        containerManager,
        containerData,
        setContainerData,
        socketSSHContainer,
        containerUserInfoMapping,
        setContainerUserInfoMapping
    }
) {
    return (
        <div className="container-list">
            <table className="container-list-table">
                <thead>
                    <tr>
                        <th>Container ID</th>
                        <th>Container Name</th>
                        <th>Image Name</th>
                        <th>IP Address</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Object.entries(containerData).map(([key, value]) => {
                            return (
                                <tr key={key}>
                                    <td>{value.ids.join(",")}</td>
                                    <td>{value.name}</td>
                                    <td>{value.image}</td>
                                    <td>{value.ips.join(",")}</td>
                                    <ContainerListButtons
                                        containerManager={containerManager}
                                        containerValue={value}
                                        setContainerData={setContainerData}
                                        socketSSHContainer={socketSSHContainer}
                                        containerUserInfoMapping={containerUserInfoMapping}
                                        setContainerUserInfoMapping={setContainerUserInfoMapping}
                                    />
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
        </div>
    );
}

export default ContainersList;