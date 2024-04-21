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
        this.hostBaseURL = config.dataApi.urls.hostBaseURL;
        this.authURLs = config.dataApi.urls.authURLs;
        this.clientInformation = config.clientInformation;
        this.headers = config.dataApi.headers;
    }

    isLoggedIn = async () => {
        const requestMaker = new RequestMaker(
            "GET", this.meURL, null, this.headers
        );
        try {
            const response = await requestMaker.callOnce(true);
            localStorage.setItem("userData", JSON.stringify(response));
            return true;
        } catch(err) {
            console.error("Is logged in error", err);
            return false;
        }
    }

    Login = async (provider) => {
        try {
            const authURL = this.authURLs[provider] || null;
            if(authURL === null) {
                throw new Error(`Invalid Auth Provider ${provider}`);
            }
            window.location.assign(`${this.baseURL}${authURL}`);
        } catch(err) {
            throw new Error("Error Logging in", err);
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
    }
};
