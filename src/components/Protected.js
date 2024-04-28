import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Authorizer } from "../lib/authUtils";
import config from "../config";
import { startUslWorker } from "../lib/authUtils";


function Protected({children, setIsLoading}) {
    const [accessible, setAccessible] = useState(null);

    useEffect(() => {
        const checkAccess = async () => {
            const authorizer = new Authorizer(config);
            const isLoggedIn = await authorizer.isLoggedIn();
            setAccessible(isLoggedIn);
        };
        checkAccess();
    }, [window.location.pathname]);

    switch(accessible) {
        case true:
            const uslStarted = localStorage.getItem("uslStarted") || false;
            if(!uslStarted) {
                startUslWorker();
            }
            setIsLoading(false);
            return children;
        case false:
            localStorage.setItem("redirectPath", window.location.pathname);
            return <Navigate to="/signin"/>;
        case null:
            setIsLoading(true);
            return (
                <div className="expanded-centered">
                    Loading...
                </div>
            );
    }
}

export default Protected;
