/*
    Authorization related code.

    Author: Namah Shrestha
*/

// Module imports
import { RequestMaker } from "./appUtils";


export class Authorizer {

    constructor(config) {
        this.baseURL = config.dataApi.urls.baseURL;
        this.meURL = this.baseURL + config.dataApi.urls.me;
        this.clientInformation = config.clientInformation;
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

    getState = () => {
        // Create a unint8 empty array.
        const stateArray = new Uint8Array(16);
        // Fill the values in the stateArray.
        window.crypto.getRandomValues(stateArray);
        // Use the stateArray to get the state.
        const state = Array.from(stateArray, byte => byte.toString(16).padStart(2, '0')).join('');
        return state;
    };

    getClientInformation = (provider) => {
        const clientInformation = this.clientInformation[provider] || null;
        if (clientInformation === null) {
            throw new Error(`Invalid provider: ${provider}`);
        }
        return clientInformation;
    };

    getAuthPageUrl = (provider) => {
        try {
            const clientInformation = this.getClientInformation(provider);
            const redirectUri = clientInformation["redirectUriBase"] + clientInformation["redirectUriOffset"];
            const state = this.getState();
            localStorage.setItem("CSRFState", state); // FIX THIS: Why is it not setting the Item.
            const authPageUrl = encodeURI(
                `${clientInformation["authBaseURL"]}?client_id=${clientInformation["clientId"]}&response_type=code&scope=${clientInformation["scope"]}&redirect_uri=${redirectUri}&state=${state}`
            );
            return authPageUrl;
        } catch(error) {
            console.error(error);
        }
    };

    Login = async (provider) => {
        try {
            const authPageUrl = this.getAuthPageUrl(provider);
            window.location.assign(authPageUrl);
        } catch(err) {
            throw new Error("Error Logging in", err);
        }
    }; 

    LoginRedirect = async(provider, code) => {
        try {
            const clientInformation = this.getClientInformation(provider);
            const apiUrl = clientInformation["tokenExchangeUriBase"] + clientInformation["tokenExchangeUriOffset"];
            const requestMaker = new RequestMaker(
                "POST", apiUrl, {"code": code}, this.headers
            );
            return await requestMaker.callOnce();
        } catch(err) {
            throw new Error("Error Login Redirect", err);
        }
    };

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


export const googleLoginHandler = async function(){
    try {
        await this.Login("google");
    } catch(error) {
        console.error(error);
    }
};


export const githubLoginHandler = async function(){
    try {
        await this.Login("github");
    } catch(error) {
        console.error(error);
    }};


export const googleLoginRedirectHandler = async function(code) {
    try {
        return await this.LoginRedirect("google", code);
    } catch (error) {
        return {"error": error};
    }
};


export const githubLoginRedirectHandler = async function(code) {
    try {
        return await this.LoginRedirect("github", code);
    } catch (error) {
        return {"error": error};
    }
};
