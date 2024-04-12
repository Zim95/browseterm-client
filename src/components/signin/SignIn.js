import React, {useEffect} from 'react';
import "./SignIn.css";
import terminalgif from "./images/terminal.gif";
import googleicon from "./images/google_icon.png";
import githubicon from "./images/github_icon.png";

import SignInButton from "./signin-buttons/SignInButtons";

function SignIn({toggleNavbarRetraction}) {
  useEffect(() => {
    toggleNavbarRetraction();
  }, []);

  return (
    <div className='signin-container'>
      <div className='signin-container-info'>
        <div className="signin-container-info-gif">
          <img src={terminalgif} className="signin-container-info-gif-img" alt="Signin GIF"/>
        </div>
        <div className="signin-container-userdata">
          <div className="signin-container-logo">
            <h1 className="signin-header">BrowseTerm</h1>
            <p className="tagline">Run Linux on the web for FREE!</p>
          </div>
          <div className="signin-container-form">
            <div className="signin-container-form-auth-buttons">
              <SignInButton
                buttonImage={googleicon}
                buttonText="Sign In with Google"
              />
              <SignInButton
                buttonImage={githubicon}
                buttonText="Sign In with Github"
              />
            </div> 
          </div>  
        </div>
      </div>
    </div>
  );
}

export default SignIn;