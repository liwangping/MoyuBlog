import * as React from "react";
import  HomeStore  from "./store";

const homeStore = new HomeStore();

class Home extends React.Component<{},{}> {
    state={
    }

    addSome = () => {
        return homeStore.title;
    }

    render() { 
        return ( <h2>我是Home页面{this.addSome()}</h2> );
    }
}
export default Home;