import React, { useEffect } from "react";
import { Authorizer } from '../../lib/authUtils';
import config from "../../config";


const redirectToPath = (hostBaseURL) => {
    const redirectPath = localStorage.getItem("redirectPath") || "/";
    const redirectUri = `${hostBaseURL}${redirectPath}`;
    localStorage.removeItem("redirectPath");
    window.location.assign(redirectUri);
};


export function SignInRedirectHandler() {
    useEffect(() => {
        const authorizer = new Authorizer(config);
        redirectToPath(authorizer.hostBaseURL);
    }, []);
    return <div>RedirectHandler</div>;
};
