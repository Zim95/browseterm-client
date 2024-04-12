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
        this.googleLoginUrl = this.baseURL + config.dataApi.urls.googleLogInUrl;
        this.githubLoginUrl = this.baseURL + config.dataApi.urls.githubLogInUrl;
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

    getLoginUrl = (loginProvider) => {
        const urlChoice = {
            "google": this.googleLoginUrl,
            "github": this.githubLoginUrl
        };
        const url = urlChoice[loginProvider] || null;
        if (url === null) {
            throw new Error("Invalid loginProvider");
        }
        return url;
    };

    Login = async (loginProvider) => {
        try {
            const loginUrl = this.getLoginUrl(loginProvider);

            const requestMaker = new RequestMaker(
                "GET", loginUrl, null, this.headers
            );
            const response = await requestMaker.callToRedirect();
            console.log(response);
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
    await this.Login("google");
};

export const githubLoginHandler = async function(){
    await this.Login("github");
};
