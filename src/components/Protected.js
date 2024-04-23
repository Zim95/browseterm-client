import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Authorizer } from "../lib/authUtils";
import config from "../config";
import uslWorkerScript from "../usl.worker";


function Protected({children}) {
    const [accessible, setAccessible] = useState(null);

    useEffect(() => {
        const checkAccess = async () => {
            const authorizer = new Authorizer(config);
            const isLoggedIn = await authorizer.isLoggedIn();
            setAccessible(isLoggedIn);
        };
        checkAccess();
    }, []);

    switch(accessible) {
        case true:
            const uslStarted = localStorage.getItem("uslStarted") || false;
            if(!uslStarted) {
                const uslWorker = new Worker(uslWorkerScript);
                uslWorker.postMessage("start");
                localStorage.setItem("uslStarted", true);
            }
            return children;
        case false:
            localStorage.setItem("redirectPath", window.location.pathname);
            return <Navigate to="/signin"/>;
        case null:
            return <div className="expanded-centered"> Loading... </div>
    }
}

export default Protected;
