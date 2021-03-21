import React from 'react';
import { StyleSheet, Text, View, SafeAreaView} from 'react-native'
import Login from './Login'
import Signup from './Signup'

class Auth extends React.Component {
    state = { mode: 0  }

    handleModeChange = (mode) => {
            this.setState({ mode: mode})
    }
    renderAuthMode(mode)
    {
        switch (mode) {
            case 0:
                return (<Login handleModeChange={this.handleModeChange} handleAuthModeChange={this.props.handleModeChange} user_detailsFunction={this.props.user_detailsFunction} setStateFunction={this.props.setStateFunction}/>)
            case 1:
                return (<Signup handleModeChange={this.handleModeChange} handleAuthModeChange={this.props.handleModeChange} user_detailsFunction={this.props.user_detailsFunction} setStateFunction={this.props.setStateFunction}/>)
        }
    }
    render() {
        return (
        this.renderAuthMode(this.state.mode)
        );
    }
}

export default Auth;