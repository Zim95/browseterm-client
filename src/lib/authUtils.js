/*
    Authorization related code.

    Author: Namah Shrestha
*/

// Module imports
import { RequestMaker } from "./appUtils";


export class Authorizer {

    constructor(config) {
        this.baseURL = config.dataApi.urls.baseURL;
        this.meURL = this.baseURL + config.dataApi.urls.me
        this.headers = config.dataApi.headers;
    }

    isLoggedIn = async () => {
        const requestMaker = new RequestMaker(
            "GET", this.meURL, null, this.headers
        );
        try {
            const response = await requestMaker.callOnce();
            localStorage.setItem("userData", JSON.stringify(response));
            return true;
        } catch(err) {
            console.error("Is logged in error", err);
            return false;
        }
    }

    getUser = () => {
        /*
            Get the user info logic goes in here.
        */
        const userData = JSON.parse(localStorage.getItem("userData"));
        return {
            "userName": userData["name"]
        };
    };
}


// export class Authorizer {
//     constructor(config) {
//         this.authServerBaseURL = config.authAPI.authServerBaseURL;
//         this.authEndpoint = this.authServerBaseURL + config.authAPI.authEndpointOffset;
//         this.tokenEndpoint = this.authServerBaseURL + config.authAPI.tokenEndpointOffset;
//         this.clientId = config.clientInformation.clientId;
//         this.clientSecret = config.clientInformation.clientSecret;
//         this.redirectURIs = config.clientInformation.redirectURIs;
//         this.accessToken = localStorage.getItem("accessToken") || null;
//     }

// }
