import React, {useEffect, useState} from 'react';
import "./ContainersForm.css";
import config from '../../../config';

function ContainersForm({addContainer}) {
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
            const userName = "zim95";
            const containerName = userName + "_" + formData["container-name"];
            const containerNetwork = userName + "_network";
            const postData = {
                "image_name": formData["image-name"],
                "container_name": containerName,
                "container_network": containerNetwork,
                "environment": {
                    "SSH_PASSWORD": formData["container-password"],
                }
            }
            const postHeaders = config.containerAPI.headers;
            const postUrl = config.containerAPI.urls.baseURL + config.containerAPI.urls.createContainerOffset;
            const response = await fetchCreateContainer(postUrl, postData, postHeaders);
            addContainer(response.response);
        } catch (error) {
            console.error("Error create container", error);
        }
    };

    const fetchCreateContainer = async (postContainerUrl, postContainerData, postContainerHeaders) => {
        try {
            const response = await fetch(
                postContainerUrl,
                {
                    method: "POST",
                    headers: postContainerHeaders,
                    body: JSON.stringify(postContainerData),
                }
            );
            if (response.status !== 200) {
                const error_message = await response.text();
                throw new Error(`HTTP Error! ${error_message }`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error(error);
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
            setImageOptions(data.response);
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