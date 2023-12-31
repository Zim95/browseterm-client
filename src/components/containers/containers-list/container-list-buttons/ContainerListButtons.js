import React, {useEffect, useState} from 'react';
import "./ContainerListButtons.css";
import config from '../../../../config';

function ContainerListButtons(
    {
        socketSSHContainer,
        socketSSHUserMapping,
        removeContainer,
        setContainerIps,
        unsetContainerIps,
        containerValue,
        removeSocketSSHUserMapping,
    }
) {
    const [containerState, setContainerState] = useState("stopped");

    const baseURL = config.containerAPI.urls.baseURL;
    const headers = config.containerAPI.headers;
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

    const saveData = (data) => {
        const hash = Math.floor(Math.random() * 10000).toString();
        localStorage.setItem(hash, JSON.stringify(data));
        return hash;
    };

    const redirectWithData = () => {
        const data = {
            "socketSSHContainer": socketSSHContainer,
            "socketSSHUserMapping": socketSSHUserMapping,
            "containerValue": containerValue
        }
        const hash = saveData(data);
        const path = window.location.origin + "/terminal/" + hash;
        window.open(path, "_blank");
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
        const offset = config.containerAPI.urls.stopContainerOffset;
        await makeRequest(offset, successCallback);
    };

    const startContainer = async () => {
        console.log("Starting Container...");
        const successCallback = (response) => {
            setContainerIps(response.response);
            setContainerState("started");
        };
        const offset = config.containerAPI.urls.startContainerOffset;
        await makeRequest(offset, successCallback);
    };

    const deleteContainer = async () => {
        console.log("Deleting Container...");
        const successCallback = (response) => {
            removeContainer(containerValue);
            removeSocketSSHUserMapping(containerValue);
            if (containerState != "stopped") {
                // This part will never occur because, delete will only happen when container is stopped.
                // Therefore, there will never be a delete if containerState != 'stopped'
                unsetContainerIps(response.response);
            }
            setContainerState("deleted");
        };
        const offset = config.containerAPI.urls.deleteContainerOffset;
        await makeRequest(offset, successCallback);
    };

    const saveContainer = () => {
        console.log("Saving Container");
    };

    const unloadContainer = async () => {
        let beaconBody = [];
        if (containerState != "stopped") {
            const stopOffset = config.containerAPI.urls.stopContainerOffset;
            const stopUrl = baseURL + stopOffset;
            const stopBeaconBody = {
                "method": "POST",
                "url": stopUrl,
                "headers": headers,
                "body": body,
            }
            beaconBody.push(stopBeaconBody);   
        };
        const deleteOffset = config.containerAPI.urls.deleteContainerOffset;
        const deleteUrl = baseURL + deleteOffset;
        const deleteBeaconBody = {
            "method": "POST",
            "url": deleteUrl,
            "headers": headers,
            "body": body,
        };
        beaconBody.push(deleteBeaconBody);

        const beaconOffset = config.containerAPI.urls.beaconOffset;
        const beaconUrl = baseURL + beaconOffset;
        beaconBody = JSON.stringify(beaconBody);
        navigator.sendBeacon(beaconUrl, new Blob([beaconBody]));
    };

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
                onClick={redirectWithData}
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
