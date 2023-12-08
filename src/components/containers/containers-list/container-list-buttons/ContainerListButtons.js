import React, {useEffect, useState} from 'react';
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

    const printContainerState = () => {
        const currentState = containerState;
        console.log("Container State", currentState);
    };

    const makeRequest = async (offset, successCallback) => {
        const url = baseURL + offset;
        const response = await fetch(url, fetchJson);
        if (response.status == 200) {
            const json_response = await response.json();
            successCallback(json_response);
        } else {
            const error_message = await response.text();
            console.error(error_message);
        }
    };

    const stopContainer = async () => {
        console.log("Stopping Container...");
        const successCallback = (response) => {
            unsetContainerIps(response.response);
            setContainerState("stopped");
        };
        const offset = config.DevAPIRequestsConfig.containerAPI.urls.stopContainerOffset;
        await makeRequest(offset, successCallback);
    };

    const startContainer = async () => {
        console.log("Starting Container...");
        const successCallback = (response) => {
            setContainerIps(response.response);
            setContainerState("started");
        };
        const offset = config.DevAPIRequestsConfig.containerAPI.urls.startContainerOffset;
        await makeRequest(offset, successCallback);
    };

    const deleteContainer = async () => {
        console.log("Deleting Container...");
        const successCallback = (response) => {
            removeContainer(containerValue);
            if (containerState != "stopped") {
                // This part will never occur because, delete will only happen when container is stopped.
                // Therefore, there will never be a delete if containerState != 'stopped'
                unsetContainerIps(response.response);
            }
            setContainerState("deleted");
        };
        const offset = config.DevAPIRequestsConfig.containerAPI.urls.deleteContainerOffset;
        await makeRequest(offset, successCallback);
    };

    const saveContainer = () => {
        console.log("Saving Container");
    };

    const unloadContainer = async () => {
        printContainerState();
        if (containerState != "stopped") {
            stopContainer().then(() => deleteContainer());
        } else {
            await deleteContainer();
        }
    };

    // useEffect(() => {
    //     printContainerState();
    // }, [containerState]);

    useEffect(() => {
        window.addEventListener('beforeunload', unloadContainer);
        return () => {
            window.removeEventListener('beforeunload', unloadContainer);
        };
    }, [containerState]);

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
                disabled={(containerState == "stopped" ? false: true)}
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
