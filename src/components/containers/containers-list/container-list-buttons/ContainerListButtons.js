import React, {useState} from 'react';
import "./ContainerListButtons.css";

function ContainerListButtons({removeContainer, containerValue}) {
    const [containerState, setContainerState] = useState("stopped");

    const stopContainer = () => {
        console.log("Stopping Container...");
        setContainerState("stopped");
    };

    const startContainer = () => {
        console.log("Starting Container...");
        setContainerState("started");
    };

    const deleteContainer = () => {
        console.log("Deleting Container...");
        removeContainer(containerValue);
        setContainerState("deleted");
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