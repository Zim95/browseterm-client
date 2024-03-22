import React, {useEffect, useState} from "react";
import "./ContainerListButtons.css";
import config from "../../../../config";
import {
    startContainer,
    stopContainer,
    deleteContainer
} from "../../../../lib/containerUtils";

function ContainerListButtons(
    {
        containerManager,
        containerValue,
        setContainerData,
        socketSSHContainer,
        setSocketSSHContainer,
        containerUserInfoMapping,
        setContainerUserInfoMapping
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

    const startContainerHandler = async function(containerValue) {
        try {
            await startContainer.call(
                containerManager.current,
                containerValue["full_ids"],
                containerValue["network"],
                containerValue["name"]
            );
            setContainerData(containerManager.current.containerDataMap);
            setContainerState("started");
        } catch(error) {
            console.error("Start Container Button Error", error);
        }
    };

    const stopContainerHandler = async function(containerValue) {
        try {
            await stopContainer.call(
                containerManager.current,
                containerValue["full_ids"],
                containerValue["network"],
                containerValue["name"]
            );
            setContainerData(containerManager.current.containerDataMap);
            setContainerState("stopped");
        } catch (error) {
            console.error("Stop Container Button Error", error);
        }
    };

    const deleteContainerHandler = async function(containerValue) {
        try {
            await deleteContainer.call(
                containerManager.current,
                containerValue["full_ids"],
                containerValue["network"],
                containerValue["name"]
            );
            setContainerData(containerManager.current.containerDataMap);
            setContainerUserInfoMapping(containerManager.current.containerUserInfoMapping);
            setContainerState("deleted");
        } catch (error) {
            
        }
    };

    const saveData = (data) => {
        const hash = Math.floor(Math.random() * 10000).toString();
        localStorage.setItem(hash, JSON.stringify(data));
        return hash;
    };

    const redirectWithData = () => {
        const data = {
            "socketSSHContainer": socketSSHContainer,
            "containerUserInfoMapping": containerUserInfoMapping,
            "containerValue": containerValue
        }
        const hash = saveData(data);
        const path = window.location.origin + "/terminal/" + hash;
        window.open(path, "_blank");
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
        window.addEventListener("beforeunload", unloadContainer);
        return () => {
            window.removeEventListener("beforeunload", unloadContainer);
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
                onClick={() => {startContainerHandler(containerValue)}}
            >
                <i className="fas fa-play"></i>
            </button>
            <button
                className="button-container-button button-container-stop"
                disabled={(containerState == "started" ? false: true)}
                onClick={() => {stopContainerHandler(containerValue)}}
            >
                <i className="fas fa-stop"></i>
            </button>
            <button
                className="button-container-button button-container-delete"
                disabled={(containerState == "stopped" ? false: true)}
                onClick={() => {deleteContainerHandler(containerValue)}}
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
