import React, {Suspense} from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import "./App.css";

// Lazy load all Routes.
const Navbar = React.lazy(() => import('./components/navigation/Navbar'));
const Home = React.lazy(() => import('./components/home/Home'));
const Profile = React.lazy(() => import('./components/profile/Profile'));
const Containers = React.lazy(() => import('./components/containers/Containers'));
const Subscribe = React.lazy(() => import('./components/subscribe/Subscribe'));
const SignIn = React.lazy(() => import('./components/signin/SignIn'));
const Terminal = React.lazy(() => import('./components/terminal/Terminal'));

function App() {
    return (
        <Router>
            <div className="wrapper">
                <Navbar/>
                <div className="app-content">
                    <Suspense fallback={<div>Loading....</div>}>
                        <Routes>
                            <Route path="/" element={<Home/>}/>
                            <Route path="/profile" element={<Profile/>}/>
                            <Route path="/containers" element={<Containers/>}/>
                            <Route path="/subscribe" element={<Subscribe/>}/>
                            <Route path="/signin" element={<SignIn/>}/>
                            <Route path="/terminal/:termhash" element={<Terminal/>}/>
                        </Routes>
                    </Suspense>
                </div>
            </div>
        </Router>
    );
}

export {App};
