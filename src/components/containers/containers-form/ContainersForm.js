import React, {useEffect, useState} from 'react';
import "./ContainersForm.css";
import config from '../../../config';
import {
    createContainerBasedOnFormData,
} from "../../../lib/containerUtils";

function ContainersForm(
    {
        containerManager,
        setContainerData,
        setContainerUserInfoMapping
    }
) {
    const [formData, setFormData] = useState(
        {
            "image-name": "",
            "container-name": "",
            "container-password": ""
        }
    );
    const [imageOptions, setImageOptions] = useState([]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData(
            {
                ...formData,
                [name]: value,
            }
        );
    };

    const createContainer = async (event) => {
        try {
            event.preventDefault();
            await createContainerBasedOnFormData.call(containerManager.current, formData);
            setContainerData({...containerManager.current.containerDataMap});
            setContainerUserInfoMapping({...containerManager.current.containerUserInfoMapping});
        } catch (error) {
            console.error("Create container error", error);
        }
    };

    const fetchImageOptions = async (imageOptionsUrl, imageOptionsHeaders) => {
        try {
            const response = await fetch(
                imageOptionsUrl,
                {
                    method: "GET",
                    headers: imageOptionsHeaders,
                }
            );
            if (!response.ok) {
                throw new Error("Network response error");
            }
            const data = await response.json();
            const imageLabels = data.response;
            setImageOptions(imageLabels);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        const imageOptionsUrl = config.dataApi.urls.baseURL + config.dataApi.urls.imageOptions;
        const imageOptionsHeaders = config.dataApi.headers;
        fetchImageOptions(imageOptionsUrl, imageOptionsHeaders);
    }, []);

    return (
        <form className="container-form">
            <div className="container-form-header">
                <h1 className="container-form-header-heading">Create a Container</h1>
            </div>
            <div className="container-form-inputs">
                <label className="container-label" htmlFor="image-name">Choose Image:</label>
                <select
                    name="image-name"
                    id="image-name"
                    className="container-input image-name"
                    required
                    onChange={handleInputChange}
                    value={formData["image-name"]}
                >
                    <option value="" disabled>Select an image</option>
                    {imageOptions.map(option => (
                        <option key={option.id} value={option.value}>{option.label}</option>
                    ))}
                </select>
                <label className="container-label" htmlFor="container-name">Container Name:</label>
                <input
                    type="text"
                    name="container-name"
                    id="container-name"
                    className="container-input container-name"
                    required
                    onChange={handleInputChange}
                />
                <label className="container-label" htmlFor="container-password">Container Password:</label>
                <input
                    type="password"
                    name="container-password"
                    id="container-password"
                    className="container-input container-password"
                    required
                    onChange={handleInputChange}
                />
                <input
                    type="submit" 
                    id="container-form-submit"
                    className="container-submit container-form-submit"
                    onClick={createContainer}
                />
            </div>
        </form>
    );
}

export default ContainersForm;