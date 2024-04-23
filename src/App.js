import React, {useEffect, Suspense, useState} from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Protected from './components/Protected';
import {SignInRedirectHandler} from "./components/signin/SignInRedirect";

import "./App.css";

import uslWorkerScript from "./usl.worker";


// Lazy load all Routes.
const Navbar = React.lazy(() => import('./components/navigation/Navbar'));
const Home = React.lazy(() => import('./components/home/Home'));
const Profile = React.lazy(() => import('./components/profile/Profile'));
const Containers = React.lazy(() => import('./components/containers/Containers'));
const Subscribe = React.lazy(() => import('./components/subscribe/Subscribe'));
const SignIn = React.lazy(() => import('./components/signin/SignIn'));
const Terminal = React.lazy(() => import('./components/terminal/ContainerTerminal'));


function App() {
    const [isNavbarRetracted, setIsNavbarRetracted] = useState(false);

    const toggleNavbarRetraction = () => {
        setIsNavbarRetracted(!isNavbarRetracted);
    };

    const isNavbarRequired = () => {
        const notNeededRoutes = [
            "/terminal",
            "/signin"
        ];

        const path = window.location.href;
        return !notNeededRoutes.some(route => path.includes(route));
    };

    useEffect(() => {
        const stopUslWorker = () => {
            console.log("StopUSLWorker called");
            const uslWorker = new Worker(uslWorkerScript);
            uslWorker.postMessage("stop");
            localStorage.removeItem("uslStarted");
        };
        window.addEventListener('beforeunload', stopUslWorker);
        return () => {
            window.removeEventListener('beforeunload', stopUslWorker);
        };
    }, []);

    return (
        <Router>
            <div className={`wrapper ${isNavbarRequired() ? (isNavbarRetracted ? 'retracted' : '') : 'retracted'}`}>
                {isNavbarRequired() && <Navbar onToggleRetraction={toggleNavbarRetraction}/>}
                <div className="app-content">
                    <Suspense fallback={<div>Loading....</div>}>
                        <Routes>
                            <Route path="/" element={
                                <Protected>
                                    <Home/>
                                </Protected>
                            }/>
                            <Route path="/profile" element={<Profile/>}/>
                            <Route path="/containers" element={
                                <Protected>
                                    <Containers/>
                                </Protected>
                            }/>
                            <Route path="/subscribe" element={<Subscribe/>}/>
                            <Route path="/signin" element={<SignIn toggleNavbarRetraction={toggleNavbarRetraction}/>}/>
                            <Route path="/terminal/:termhash" element={<Terminal/>}/>
                            <Route path="signin-redirect" element={<SignInRedirectHandler/>}/>
                        </Routes>
                    </Suspense>
                </div>
            </div>
        </Router>
    );
}

export {App};
