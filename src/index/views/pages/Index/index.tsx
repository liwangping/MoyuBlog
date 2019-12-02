import * as React from "react";
import { Link, Redirect, Route } from "react-router-dom";
import './index.css';
import Home from '../home/index';
import Document from '../document/index';
import About from '../about/index';

interface IndexStates {
    blogHeaderTitle: any;
}


class Index extends React.Component<{}, IndexStates> {
    state = {
            blogHeaderTitle: [
                { title: '首页', pathTo: '/home' , exact: true, component: Home},
                { title: '文档', pathTo: '/document',exact: false, component: Document},
                { title: '关于我', pathTo: '/about',exact: false, component: About  }
            ]
        }
    render() {
        const { blogHeaderTitle } = this.state;
        return (
            <React.Fragment>
                <div className="blog_header">
                    {/* {blogHeaderTitle.map((item, index) => {
                        return (
                            <div key={index} className="blog_header_title">
                                <Link to={item.pathTo}>{item.title}</Link>
                            </div>
                        )
                    })} */}
                    <li>
                        <Link to="/home">Home</Link>
                    </li>
                    <li>
                        <Link to="/about">About</Link>
                    </li>
                    <li>
                        <Link to="/document">Users</Link>
                    </li>
                </div>
                <div className="blog_content">
                    {/* {blogHeaderTitle.map((item, index) => {
                        return <Route path={item.pathTo} component={item.component} />
                    })} */}
                    <Route path="/home" component={Home} />
                    <Route path="/about" component={About} />
                    <Route path="/document" component={Document} />
                </div>
                {/* <ul>
                    {
                        this.state.list.map((item, index) => {
                            return (
                                <li key={index}>
                                    <Link to={'/list/' + item.cid}>{item.title}</Link>
                                </li>
                            )
                        })
                    }
                </ul> */}
                {/* <Redirect to="/home/" />  重定向 */}
            </React.Fragment>
        );
    }
}

export default Index;