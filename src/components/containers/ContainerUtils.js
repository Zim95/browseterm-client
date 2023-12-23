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

        if(response.status !== 200) {
            const error = await response.text();
            throw new Error("Make Request Error", error);
        }

        const data = await response.json();
        return data;
    };
}


class ContainerManager extends MakeRequest{
    constructor() {
        this.method = "POST";
    }

    makeContainerRequest = async (url, body) => {
        try {
            response = await this.makeRequest(this.method, url, body);
            return response;
        } catch(error) {
            throw new Error("Container Request Error", error);
        }
    };
}

export const containerManager = new ContainerManager();
