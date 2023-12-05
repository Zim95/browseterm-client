import React, {useState} from 'react';
import "./ContainerListButtons.css";
import config from '../../../../config';

function ContainerListButtons({removeContainer, setContainerIps, unsetContainerIps, containerValue}) {
    const [containerState, setContainerState] = useState("stopped");

    const baseURL = config.DevAPIRequestsConfig.containerAPI.urls.baseURL;
    const headers = config.DevAPIRequestsConfig.containerAPI.headers;
    const body = JSON.stringify(
        {
            container_ids: containerValue.full_ids,
            container_network: containerValue.network,
            container_name: containerValue.name
        }
    );
    const fetchJson = {
        method: 'POST',
        headers: headers,
        body: body
    }

    const stopContainer = async () => {
        console.log("Stopping Container...");
        const offset = config.DevAPIRequestsConfig.containerAPI.urls.stopContainerOffset;
        const url = baseURL + offset;
        const response = await fetch(url, fetchJson);
        if (response.status == 200) {
            const json_response = await response.json();
            unsetContainerIps(json_response.response);
            setContainerState("stopped");
        } else {
            const error_message = await response.text();
            console.error(error_message);
        }
    };

    const startContainer = async () => {
        console.log("Starting Container...");
        const offset = config.DevAPIRequestsConfig.containerAPI.urls.startContainerOffset;
        const url = baseURL + offset;
        const response = await fetch(url, fetchJson);
        if (response.status == 200) {
            const json_response = await response.json();
            setContainerIps(json_response.response);
            setContainerState("started");
        } else {
            const error_message = await response.text();
            console.error(error_message);
        }
    };

    const deleteContainer = async () => {
        console.log("Deleting Container...");
        const offset = config.DevAPIRequestsConfig.containerAPI.urls.deleteContainerOffset;
        const url = baseURL + offset;
        const response = await fetch(url, fetchJson);
        if (response.status == 200) {
            const json_response = await response.json();
            removeContainer(containerValue);
            if (containerState != "stopped") {
                unsetContainerIps(json_response.response);
            }
            setContainerState("deleted");
        } else {
            const error_message = await response.text();
            console.error(error_message);
        }
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
