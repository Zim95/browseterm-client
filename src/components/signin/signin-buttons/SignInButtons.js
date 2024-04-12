import React from "react";
import "./SignInButtons.css";


function SignInButton({buttonImage, buttonText, buttonSubmit, authorizer}) {
    const submitHandle = async function() {
        await buttonSubmit.call(authorizer);
    }

    return (
        <button className="auth-button" onClick={submitHandle}>
            <img src={buttonImage} className="auth-button-icon"/><span className="auth-button-span">{buttonText}</span>
        </button>
    );
}

export default SignInButton;