import React from 'react';
import { StyleSheet,View,Image,Text,TouchableOpacity } from 'react-native';
import { Hoshi } from 'react-native-textinput-effects'; 
const LOGO = require('../../assets/img/logo.png');

class Signup extends React.Component {
    state = {  } 
     
      isFormValid = () => {
        let errors = [];
        let error;
    
        if (this.isFormEmpty(this.state)) {
          error = { message: "Fill in all fields" };
          this.setState({ errors: errors.concat(error) });
          return false;
        } else {
          return true;
        }
      };
      isFormEmpty = ({ email,password }) => {
        return (
          !email.length ||
          !password.length 
        );
      };
      displayErrors = errors =>
      errors.map((error, i) => <Text key={i} style={{fontSize:15}}>{error.message}</Text>);
    
    render() {
        return (
             <View style={styles.main}>
                 <View style={styles.header}>
                    <Image source={LOGO} style={{height:120,width:300}}/>
                    <Text style={styles.headerText}>Signup </Text>
                 </View>
                 <View style={styles.form}> 
                    <Hoshi
                            label={'Email'} 
                            borderColor={'#000'} 
                            borderHeight={3}
                            inputPadding={16} 
                            onChangeText={(text)=>this.setState({email:text})}
                            backgroundColor={'#F9F7F6'}
                        />
                    <Hoshi
                            label={'Password'} 
                            borderColor={'#000'} 
                            borderHeight={3}
                            inputPadding={16} 
                            onChangeText={(text)=>this.setState({password:text})}
                            backgroundColor={'#F9F7F6'}
                        />
                        <TouchableOpacity style={styles.signupBtn}>
                            <Text style={styles.signupBtnText}>Signup</Text>
                        </TouchableOpacity> 
                </View>
                 <View style={styles.loginMessage}>
                    <Text style={styles.loginMessageText}>Already a member? </Text>
                    <TouchableOpacity>
                            <Text style={styles.loginRedirectText}>Login</Text>
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
            signupBtn:
            {
                backgroundColor: '#000',
                borderRadius:10,
                margin:10,
                padding: 10,
                marginTop:30
            },
                signupBtnText:
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
export default Signup;