import React, {useState} from 'react';
import "./ContainerListButtons.css";
import config from '../../../../config';

function ContainerListButtons({removeContainer, containerValue}) {
    const [containerState, setContainerState] = useState("stopped");

    const baseURL = config.DevAPIRequestsConfig.containerAPI.urls.baseURL;
    const headers = config.DevAPIRequestsConfig.containerAPI.headers;
    const body = JSON.stringify(
        {
            container_ids: containerValue.full_ids,
            container_network: containerValue.network,
        }
    );
    const fetchJson = {
        method: 'POST',
        headers: headers,
        body: body
    }

    const makeRequest = async (offset, success) => {
        const url = baseURL + offset;
        const response = await fetch(url, fetchJson);
        if (response.status == 200) {
            success();
        } else {
            const error_message = await response.text();
            console.error(error_message);
        }
    }

    const stopContainer = async () => {
        console.log("Stopping Container...");
        const success = () => {
            setContainerState("stopped");
        };
        const offset = config.DevAPIRequestsConfig.containerAPI.urls.stopContainerOffset;
        makeRequest(offset, success);
    };

    const startContainer = () => {
        console.log("Starting Container...");
        const success = () => {
            setContainerState("started");
        };
        const offset = config.DevAPIRequestsConfig.containerAPI.urls.startContainerOffset;
        makeRequest(offset, success);
    };

    const deleteContainer = () => {
        console.log("Deleting Container...");
        const success = () => {
            removeContainer(containerValue);
            setContainerState("deleted");
        };
        const offset = config.DevAPIRequestsConfig.containerAPI.urls.deleteContainerOffset;
        makeRequest(offset, success);
    };

    const saveContainer = () => {
        console.log("Saving Container");
    };

    return (
        <td className="button-container">
            <button
                className="button-container-button button-container-visit"
                disabled={(containerState == "started" ? false: true)}
            >
                <i className="fas fa-share"></i>
            </button>
            <button
                className="button-container-button button-container-start"
                disabled={(containerState == "stopped" ? false: true)}
                onClick={startContainer}
            >
                <i className="fas fa-play"></i>
            </button>
            <button
                className="button-container-button button-container-stop"
                disabled={(containerState == "started" ? false: true)}
                onClick={stopContainer}
            >
                <i className="fas fa-stop"></i>
            </button>
            <button
                className="button-container-button button-container-delete"
                onClick={deleteContainer}
            >
                <i className="fas fa-trash"></i>
            </button>
            <button
                className="button-container-button button-container-save"
                onClick={saveContainer}
            >
                <i className="fas fa-save"></i>
            </button>
        </td>
    );
}

export default ContainerListButtons;