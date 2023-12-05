import React, {useState} from 'react';
import ContainerListButtons from './container-list-buttons/ContainerListButtons';
import './ContainersList.css';

function ContainersList({containerData, removeContainer}) {
    console.log("containerData", containerData);
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
                                    <ContainerListButtons removeContainer={removeContainer} containerValue={value}/>
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