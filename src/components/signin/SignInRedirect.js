import React from "react";
import { Authorizer, googleLoginRedirectHandler, githubLoginRedirectHandler } from '../../lib/authUtils';
import config from "../../config";


const authorizer = new Authorizer(config);


const extractSearchParams = (windowUrl) => {
    const url = new URL(windowUrl);
    const searchParams = new URLSearchParams(url.search);
    return {
        "code": searchParams.get("code"),
        "state": searchParams.get("state")
    }
};


const validateState = (state) => {
    const localStorageState = localStorage.getItem("CSRFState", state);
    console.log("LocalStorageState", localStorageState);
    localStorage.removeItem("CSRFState");
    if(localStorageState !== state) {
        console.error("State Mismatch!");
        return false;
    }
    return true;
};


const executeSignInRedirect = async (redirectHandler) => {
    const {code, state} = extractSearchParams(window.location.href);
    console.log("code and state", code, state);
    if(!validateState(state)){
        // window.location.assign("http://localhost:8001/signin");
        console.log("mismatch");
    }
    await redirectHandler.call(authorizer, code);
};


export async function GoogleSignInRedirect() {
    await executeSignInRedirect(googleLoginRedirectHandler);
    return <div>GoogleSignInRedirect</div>;
};


export async function GithubSignInRedirect() {
    await executeSignInRedirect(githubLoginRedirectHandler);
    return <div>GithubSignInRedirect</div>
};