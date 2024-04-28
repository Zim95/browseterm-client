import React, { useEffect } from "react";
import { logoutHandler } from "../lib/authUtils";
import { Authorizer } from "../lib/authUtils";
import config from "../config";


function SignOut() {
    useEffect(() => {
        async function signout() {
            const authorizer = new Authorizer(config);
            await logoutHandler.call(authorizer);
            const signinUrl = authorizer.hostBaseURL + "/signin";
            window.location.assign(signinUrl);
        }
        signout();
    }, []);
    return <div>SignOutHandler</div>;
}


export default SignOut;
