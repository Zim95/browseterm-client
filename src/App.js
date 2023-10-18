import React, {Suspense} from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import "./App.css";

// Lazy load all Routes.
const Home = React.lazy(() => import('./components/Home'));
const Containers = React.lazy(() => import('./components/Containers'));
const List = React.lazy(() => import('./components/List'));
const Terminal = React.lazy(() => import('./components/Terminal'));
const Navbar = React.lazy(() => import('./components/navigation/Navbar'));

function App() {
    return (
        <Router>
            <div className="wrapper">
                <Navbar/>
                <div className="app-content">
                    <Suspense fallback={<div>Loading....</div>}>
                        <Routes>
                            <Route path="/" element={<Home/>}/>
                            <Route path="/create" element={<Containers/>}/>
                            <Route path="/list" element={<List/>}/>
                            <Route path="/terminal/:terminalhash" element={<Terminal/>}/>
                        </Routes>
                    </Suspense>
                </div>
            </div>
        </Router>
    );
}

export {App};
