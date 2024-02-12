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

            Author: Namah Shrestha
        */
        this.method = method;
        this.url = url;
        this.body = body;
        this.headers = headers;
    }

    makeRequest = async() => {
        /*
            This is the make request method which makes the request based on parameters.

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
        const response = await fetch(this.url, requestOptions);
        return response;
    };

    parseResponse = async(response) => {
        /*
            Parses the successful response and returns data.

            Author: Namah Shrestha
        */
        const data = await response.json();
        return data.response;
    };

    callOnce = async() => {
        /*
            CallOnce
        */
        const response = this.makeRequest();
        if (response.status !== 200) {
            const error = await response.text();
            throw new Error("Make Request Error", error);
        }
        const data = await this.parseResponse(response);
        return data;
    };

    callUntilSuccess = async() => {
        const response = this.makeRequest();
        if (response.status !== 200) {
            this.callUntilSuccess();
        } else {
            const data = await this.parseResponse(response);
            return data;
        } 
    };
}