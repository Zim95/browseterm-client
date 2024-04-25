import React, {useEffect} from "react";
import Spinner from "../spinner/Spinner";
import "./Loading.css";


function Loading() {
    return (
        <div className="loading-page"><Spinner/></div>
    );
}


export default Loading;
