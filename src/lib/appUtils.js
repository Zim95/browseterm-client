/*
    This is the App Utils file. This file has common utility functions and classes
    that can be used throughout the app files.

    Author: Namah Shrestha
*/


export class RequestMaker {
    /*
        Request Maker for making API Requests.

        Author: Namah Shrestha
    */
    constructor(method, url, body=null, headers=null) {
        /*
            Initialize parameters.
            :params:
                method: String: 'GET/POST/PUT/DELETE...'.
                url: String: URL to make the request to.
                body: JSON | null: Body of the request.
                headers: JSON | null: Headers of the request.
            :returns: null

            Author: Namah Shrestha
        */
        this.method = method;
        this.url = url;
        this.body = body;
        this.headers = headers;
    }

    makeRequest = async(credentials=false) => {
        /*
            This is the make request method which makes the request
            based on parameters.

            Author: Namah Shrestha
        */
        let requestOptions = {
            method: this.method
        }
        if(this.headers !== null) {
            requestOptions.headers = this.headers;
        }
        if (this.body !== null) {
            requestOptions.body = JSON.stringify(this.body);
        }
        if(credentials === true) {
            requestOptions.credentials = 'include';
        }
        const response = await fetch(this.url, requestOptions);
        return response;
    };

    parseJSONResponse = async(response) => {
        /*
            Parses the successful response and returns data.

            Author: Namah Shrestha
        */
        return await response.json();
    };

    callOnce = async(credentials=false) => {
        /*
            CallOnce
        */
        const response = await this.makeRequest(credentials);
        if (response.status !== 200) {
            const error = await response.text();
            throw new Error("Make Request Error", error);
        }
        const data = await this.parseJSONResponse(response);
        return data;
    };

    callUntilSuccess = async (maxAttempts=10, timeout=2000) => {
        const sleep = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            const response = await this.makeRequest();
            if (response.status === 200) {
                return await this.parseJSONResponse(response);
            }
            await sleep(timeout);
        }
        throw new Error("Maximum number of attempts reached without success.");
    };
}


export const getRandomNumberString = () => {
    return Math.floor(Math.random() * 10000).toString();
};
