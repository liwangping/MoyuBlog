import * as React from "react";

interface MainStates{
    hello: string;
    world: string;
}

export default class Main extends React.Component<{},MainStates>{
    state ={
        hello : "hello",
        world: "world"
    }
    render() {
        const {hello, world} = this.state;
        return <div className="search-text">{hello}{world}</div>
    }
}