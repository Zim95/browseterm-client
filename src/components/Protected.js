import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { BaseAuthService } from "../lib/authUtils";


function Protected({children}) {
    const [accessible, setAccessible] = useState(null);

    useEffect(() => {
        setAccessible(BaseAuthService.isLoggedIn());
    }, []);

    switch(accessible) {
        case true:
            return children;
        case false:
            return <Navigate to="/signin"/>
        case null:
            return <div className="expanded-centered"> Loading... </div>
    }
}

export default Protected;
