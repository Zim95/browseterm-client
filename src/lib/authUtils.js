/*
    Authorization related code.

    Author: Namah Shrestha
*/

// Module imports
import config from "../config";
import { RequestMaker } from "./appUtils";


export class BaseAuthService {
    static logIn() {
        console.log("Login");
    }

    static logOut() {
        console.log("Logout");
    }

    static isLoggedIn() {
        return false;  
    }
}


export class GoogleAuthService extends BaseAuthService {
    static logIn() {

    }

    static logOut() {

    }
}


export class Authorizer {
    constructor(config) {
        this.authServerBaseURL = config.authAPI.authServerBaseURL;
        this.authEndpoint = this.authServerBaseURL + config.authAPI.authEndpointOffset;
        this.tokenEndpoint = this.authServerBaseURL + config.authAPI.tokenEndpointOffset;
        this.clientId = config.clientInformation.clientId;
        this.clientSecret = config.clientInformation.clientSecret;
        this.redirectURIs = config.clientInformation.redirectURIs;
        this.accessToken = localStorage.getItem("accessToken") || null;
    }

    getUser = () => {
        /*
            Get the user info logic goes in here.
        */
        return {
            "userName": "Zim95"
        }; 
    };

    isLoggedIn = () => {
        return false;
    };

    isTokenValid = () => {
        /* Checks if the access token exists and is still valid*/
        if (this.accessToken !== null) {
            // verify if the access token is still valid.
            return true;
        }
        return false;
    };

    buildUrl = (base, options, hash) => {
        // Parse the base URL
        const baseUrl = new URL(base);

        // Remove search parameters
        baseUrl.search = '';

        // Loop through options and append them as query parameters
        for (const key in options) {
            if (options.hasOwnProperty(key)) {
                baseUrl.searchParams.set(key, options[key]);
            }
        }
        // Append hash if provided
        if (hash) {
            baseUrl.hash = hash;
        }
        // Return the formatted URL
        return baseUrl.toString();
    };

    redirectToAuthorizePage = () => {
        const authPageUrl = this.buildUrl(
            this.authEndpoint,
            {
                response_type: 'code',
                client_id: this.clientId,
                redirect_uri: this.redirectURIs[0],
                state: Math.floor(Math.random() * 100000000).toString()
            }
        )
        // redirect
        window.location.href = authPageUrl;
    };

    setToken = (accessToken) => {
        try {
            localStorage.setItem("accessToken", accessToken);
            this.accessToken = accessToken;
        } catch (error) {
            console.error(error);
        }
    };

    getToken = () => {
        if (this.isTokenValid()) {
            return this.accessToken;
        }
    };
}
