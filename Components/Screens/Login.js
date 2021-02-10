import React from 'react';
import { StyleSheet,View,Image,Text,TouchableOpacity } from 'react-native';
import { Hoshi } from 'react-native-textinput-effects';
const LOGO = require('../../assets/img/logo.png');

class Login extends React.Component {
    state = {  }
    render() {
        return (
             <View style={styles.main}>
                 <View style={styles.header}>
                    <Image source={LOGO} style={{height:120,width:300}}/>
                    <Text style={styles.headerText}>Login</Text>
                 </View>
                 <View style={styles.form}> 
                    <Hoshi
                            label={'Email'} 
                            borderColor={'#000'}
                            // active border height
                            borderHeight={3}
                            inputPadding={16} 
                            backgroundColor={'#F9F7F6'}
                        />
                    <Hoshi
                            label={'Password'}
                            // this is used as active border color
                            borderColor={'#000'}
                            // active border height
                            borderHeight={3}
                            inputPadding={16}
                            // this is used to set backgroundColor of label mask.
                            // please pass the backgroundColor of your TextInput container.
                            backgroundColor={'#F9F7F6'}
                        />
                        <TouchableOpacity style={styles.loginBtn}>
                            <Text style={styles.loginBtnText}>Login</Text>
                        </TouchableOpacity> 
                </View>
                 <View style={styles.loginMessage}>
                    <Text style={styles.loginMessageText}>Not a member? </Text>
                    <TouchableOpacity>
                            <Text style={styles.loginRedirectText}>Signup</Text>
                    </TouchableOpacity> 
                 </View>
            </View> 
        );
    }
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        flexDirection: 'column',  
        alignItems: 'center',
        margin:10
    },  
        header: {
                

        },
            headerText:
            {
                textAlign: 'center',
                fontSize:30,
                margin:10,
                fontWeight: 'bold'
            },
        form:
        {
            margin:10,
            width: 300,
        },
            loginBtn:
            {
                backgroundColor: '#000',
                borderRadius:10,
                margin:10,
                padding: 10,
                marginTop:30
            },
                loginBtnText:
                {
                    color: '#fff', 
                    textAlign: 'center',
                    fontSize: 20,
                },
        loginMessage:{
            flex:1,
            flexDirection:"row"
        },
                loginMessageText:
                {
                    fontSize:15,
                    flex:0.4, 
                    textAlign: 'right'
                },
                loginRedirectText:
                {
                    color: 'blue',  
                    flex:1,
                    fontSize:15,
                    textAlign: 'left',
                }
})
export default Login;