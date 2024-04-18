import React, { useEffect } from "react";
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
    const localStorageState = localStorage.getItem("CSRFState");
    if(localStorageState !== state) {
        return false;
    }
    return true;
};


const executeSignInRedirect = async (redirectHandler) => {
    const {code, state} = extractSearchParams(window.location.href);
    if(!validateState(state)){
        // state is invalid, redirect to login.
        window.location.assign("http://localhost:8001/signin");
    } else {
        // call the redirectHandler and wait for response.
        const response = await redirectHandler.call(authorizer, code);
        console.log("Response from executeSignInRedirect", response);
        return response;
    }
};


export function GoogleSignInRedirect() {
    useEffect(() => {
        async function getRedirectResponse() {
            try {
                const response = await executeSignInRedirect(googleLoginRedirectHandler);
                console.log("Response from useEffect", response);
            } catch (error) {
                return {"error": error};
            }
        }
        getRedirectResponse();
    }, []);
    return <div>GoogleSignInRedirect</div>;
};


export function GithubSignInRedirect() {
    useEffect(() => {
        async function getRedirectResponse() {
            try {
                const response = await executeSignInRedirect(githubLoginRedirectHandler);
                console.log(response);
            } catch (error) {
                return {"error": error};
            }
        }
        getRedirectResponse();
    }, []);
    return <div>GithubSignInRedirect</div>;
};
