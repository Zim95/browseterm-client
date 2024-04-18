import React, { useEffect } from "react";
import { Authorizer, googleLoginRedirectHandler, githubLoginRedirectHandler } from '../../lib/authUtils';
import config from "../../config";


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


const executeSignInRedirect = async (redirectHandler, authorizer) => {
    const {code, state} = extractSearchParams(window.location.href);
    if(!validateState(state)){
        // state is invalid, redirect to login.
        window.location.assign("http://localhost:8001/signin");
    } else {
        // call the redirectHandler and wait for response.
        return await redirectHandler.call(authorizer, code);
    }
};



export function GoogleSignInRedirect() {
    useEffect(() => {
        const getRedirectResponse = async () => {
            try {
                const authorizer = new Authorizer(config);
                const response = await executeSignInRedirect(googleLoginRedirectHandler, authorizer);
                console.log("Final Response", response);
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
        const getRedirectResponse = async () => {
            try {
                const authorizer = new Authorizer(config);
                const response = await executeSignInRedirect(githubLoginRedirectHandler, authorizer);
                console.log("Final Response", response);
            } catch (error) {
                return {"error": error};
            }
        }
        getRedirectResponse();
    }, []);
    return <div>GithubSignInRedirect</div>;
};
