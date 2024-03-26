import React from "react";
import { Navigate } from "react-router-dom";
import { BaseAuthService } from "../lib/authUtils";


function Protected({children}) {
    if (BaseAuthService.isLoggedIn()) {
        return children;
    }
    return <Navigate to="/signin"/>
}

export default Protected;
