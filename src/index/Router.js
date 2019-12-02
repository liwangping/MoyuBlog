import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
// import Index from './views/pages/Index/index.tsx';
import Home from './views/pages/home/index';
import About from './views/pages/about/index';
import Document from './views/pages/document/index';
import './index.css';

const RouterConfig = [
    { title: '首页', pathTo: '/home' , exact: true, component: Home},
    { title: '文档', pathTo: '/document',exact: false, component: Document},
    { title: '关于我', pathTo: '/about',exact: false, component: About  }
];

function AppRouter() {
    return (
        <Router>
            <React.Fragment>
                <div className="blog_header">
                    {RouterConfig.map((item, index) => {
                        return <div key={index} className="blog_header_title">
                                <Link to={item.pathTo}>{item.title}</Link>
                        </div>
                    })}
                </div>
                <div className="blog_content">
                    {RouterConfig.map((item, index) => {
                        return  <Route path={item.pathTo} component={item.component} />     // 忘记加return 
                    })}
                </div>
            </React.Fragment>
        </Router>
    );
}

export default AppRouter;