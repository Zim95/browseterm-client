import React from "react";
import "./SignInButtons.css";


function SignInButton({buttonImage, buttonText}) {
    return (
        <button className="auth-button">
            <img src={buttonImage} className="auth-button-icon"/><span className="auth-button-span">{buttonText}</span>
        </button>
    );
}

export default SignInButton;