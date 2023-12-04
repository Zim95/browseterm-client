import React from 'react';
import ContainerListButtons from './container-list-buttons/ContainerListButtons';
import './ContainersList.css';

function ContainersList() {
    return (
        <div className="container-list">
            <table className="container-list-table">
                <tr>
                    <th>Container Name</th>
                    <th>Image Name</th>
                    <th>IP Address</th>
                    <th></th>
                </tr>
                <tr>
                    <td>test_container_ssh</td>
                    <td>ubuntu</td>
                    <td>172.10.0.1</td>
                    <ContainerListButtons/>
                </tr>
            </table>
        </div>
    );
}

export default ContainersList;