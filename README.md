# React native animated drawer

Usage:
```javascript 
import * as React from "react";
import Sidebar from "../components/Sidebar";
import {Text, View} from 'react-native';

interface State {
    isOpen: boolean,
}

class HomeScreen extends React.Component<{}, State> {

    constructor(props: any) {
        super(props);
        this.state = {isOpen: false};
    }

    renderContent() {
        return <View style={{backgroundColor: 'green', flex: 1}}>
            {new Array(10).fill(0).map((o, i) => <Text key={i}>Content</Text>)}
        </View>
    }

    renderSidebar() {
        return <View style={{backgroundColor: 'red', flex: 1}}>
            <Text>Sidebar content</Text>
        </View>
    }

    render() {
        return <Sidebar
            shouldOpen={() => this.setState({isOpen: true})}
            shouldClose={() => this.setState({isOpen: false})}
            isOpen={this.state.isOpen}
            content={this.renderContent()}
            sidebarContent={this.renderSidebar()}
        />
    }

}

export default HomeScreen;
```