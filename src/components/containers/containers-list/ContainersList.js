import React, {useState} from 'react';
import ContainerListButtons from './container-list-buttons/ContainerListButtons';
import './ContainersList.css';

function ContainersList({containerData, removeContainer}) {
    
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
                        containerData.map((container) => {
                            return (
                                <tr>
                                    <td>{container.id}</td>
                                    <td>{container.name}</td>
                                    <td>{container.image}</td>
                                    <td>{container.ip}</td>
                                    <ContainerListButtons removeContainer={removeContainer}/>
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