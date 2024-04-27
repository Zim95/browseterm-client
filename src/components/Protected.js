import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Authorizer } from "../lib/authUtils";
import config from "../config";
import uslWorkerScript from "../usl.worker";


function Protected({children, setIsLoading}) {
    const [accessible, setAccessible] = useState(null);

    useEffect(() => {
        const checkAccess = async () => {
            const authorizer = new Authorizer(config);
            console.log("Making the auth request check, accessible is", accessible);
            const isLoggedIn = await authorizer.isLoggedIn();
            setAccessible(isLoggedIn);
        };
        checkAccess();
    }, [window.location.pathname]);

    switch(accessible) {
        case true:
            const uslStarted = localStorage.getItem("uslStarted") || false;
            if(!uslStarted) {
                const uslWorker = new Worker(uslWorkerScript);
                uslWorker.postMessage("start");
                localStorage.setItem("uslStarted", true);
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
