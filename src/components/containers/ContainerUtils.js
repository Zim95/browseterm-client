import config from "../../config";


class MakeRequest {
    makeRequest = async(method, url, body) => {
        const headers = config.containerAPI.headers;
        const payload = JSON.stringify(body);

        const response = await fetch(
            url,
            {
                method: method,
                headers: headers,
                body: payload,
            }
        );
        return response;
    };

    parseResponse = async(response) => {
        if(response.status !== 200) {
            const error = await response.text();
            throw new Error("Make Request Error", error);
        }

        const data = await response.json();
        return data;
    };

    callOnce = async(method, url, body) => {

    };

    callUntilSuccess = async(method, url, body) => {
        
    };
}


class ContainerManager {
    /*
        Create, Start, Stop, Delete Containers.

        Author: Namah Shrestha
    */
    constructor() {
        // urls
        this.baseUrl = config.containerAPI.urls.baseURL;
        this.createUrl = this.baseUrl + config.containerAPI.urls.createContainerOffset;
        this.startUrl = this.baseUrl + config.containerAPI.urls.startContainerOffset;
        this.stopUrl = this.baseUrl + config.containerAPI.urls.stopContainerOffset;
        this.deleteUrl = this.baseUrl + config.containerAPI.urls.deleteContainerOffset;
        this.beaconUrl = this.baseUrl + config.containerAPI.urls.beaconOffset;

        // methods
        this.method = "POST";

        // request maker
        this.requestMaker = new MakeRequest();
    }

    createContainer = async() => {

    };
}


export const containerManager = new ContainerManager();
