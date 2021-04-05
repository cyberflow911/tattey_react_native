import React from 'react';
import { StyleSheet,View,Image,Text,TouchableOpacity,ActivityIndicator ,TextInput} from 'react-native';
import { Hoshi } from 'react-native-textinput-effects';
import DefaultPreference from 'react-native-default-preference'; 
import Toast from 'react-native-simple-toast'; 
import DeviceInfo from 'react-native-device-info';

const LOGO = require('../../assets/img/logo.png');

class Login extends React.Component {
    state = {email:'',password:'',errors:[],isLoading:false,macAddr:''  }

    isFormValid = () => {
        let errors = [];
        let error;
  
        if (!this.state.email.length||!this.state.password.length) {
            if(!this.state.email.length)
            {
               error = { message: "Enter Email" };    
            }
            if(!this.state.password.length)
            {
                 error = { message: "Enter Password" };
            }
            if (!this.state.email.length&&!this.state.password.length)
            {
                error = { message: "Enter Email and Password" };

            }
          this.setState({ errors: errors.concat(error) });
          
          return false;
        } else {
          return true;
        }
      };
      
      displayErrors = errors =>
      errors.map((error, i) => <Text key={i} style={{fontSize:15,color:"white"}}>{error.message}</Text>);
     

      handleInputError = (errors, inputName) => { 
        return  errors.some(error => error.message.toLowerCase().includes(inputName))
          ? "#000"
          : "#000";
 
          
      };

      componentDidMount() {
        DeviceInfo.getMacAddress().then((mac) => {
          // "E5:12:D8:E5:69:97" 
          this.setState({macAddr:mac})
        })
      }
      fetch_user=()=>{
          if(!this.state.isLoading)
          {
                this.setState({isLoading:true,errors:[]}); 
                fetch('https://www.tattbooking.com/tattey_app/appapis/appointment.php', {
                            method: 'POST',
                            headers: {
                            Accept: 'application/json',
                            'Content-Type':'application/json' 
                            },
                            body: JSON.stringify({
                                email: this.state.email,
                                password: this.state.password, 
                                macAddr:this.state.macAddr, 
                                login:"true"
                            })
                        })
                        .then((response) => response.json())
                        .then(result=>{  
                            var arr = Object.values(result);
                            console.log(result);
                            if(arr[0]===("success"))
                            {
                                DefaultPreference.set('user_id',result.user_id);
                                this.props.setStateFunction(result.user_id)
                                this.props.user_detailsFunction(); 
                            }else
                            {
                                if(result.error.toLowerCase().includes('device limit'))
                                {
                                    this.setState({ errors: [{message:"Max device Login limit Reached"}] });
                                }
                                this.setState({ errors: [{message:"Wrong Email or Password"}] });
                            }
                          this.setState({isLoading:false});
                        })
                        .catch((error) => {
                            console.error(error);
                        });
          }
       
         }


         handleForgotClick = () => { 
             
             if(this.state.email=='')
             {
                 
                this.setState({errors:[{message:"Enter your registered Email"}]})
             }
             else
             {
                 this.setState({errors:[],isLoading:true});
                fetch('https://www.tattbooking.com/tattey_app/appapis/appointment.php', {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type':'application/json' 
                    },
                    body: JSON.stringify({
                        email: this.state.email,
                        forgotPass: "true",
                    })
                  })
                  .then((response) => response.json())
                  .then(result=>{  
                      var arr = Object.values(result);
                      console.log(result)
                     if(arr[0]===("success"))
                     {                          
                        this.setState({ errors: [{message:"Reset Link sent on Your Email Address"}],isLoading: false});
                     }else
                     {
                        this.setState({ errors: [{message:"Email Not Registered"}],isLoading: false});
                     }
                  
                  })
                  .catch((error) => {
                     console.error(error);
                  }); 
             }
         }
   
    render() {
        return (
             <View style={styles.main}>
                 <View style={styles.header}>
                    <Image source={LOGO} style={{height:145,width:300}}/>
                    <Text style={styles.headerText}>Login</Text>
                 </View>
                 {this.state.errors.length > 0 && (
                                                <View style={{color: "white",
                                                    backgroundColor:"#000",
                                                    borderColor: "#000",
                                                    borderWidth:2,
                                                    fontSize:15,
                                                    flex:0.3,
                                                    justifyContent: 'center',
                                                    flexDirection:"column",
                                                    paddingLeft:10,
                                                    paddingRight:10}}>
                                                    {this.displayErrors(this.state.errors)}
                                                </View>
                                            )}
                 <View style={styles.form}> 
                    <TextInput
                            placeholder={'Email'} 
                            
                            // active border height
                            style={{borderColor:"#000",borderWidth:1,marginBottom:15,
        marginTop:15,
        padding:10,
        paddingLeft:15,borderRadius:5}}
                            onChangeText={(text)=>this.setState({email:text})}
                            
                        />
                    <TextInput
                            placeholder={'Password'}
                            // this is used as active border color
                            
                            secureTextEntry={true}
                            onChangeText={(text)=>this.setState({password:text})}
                            // this is used to set backgroundColor of label mask.
                            // please pass the backgroundColor of your TextInput container.
                            style={{borderColor:"#000",borderWidth:1,marginBottom:15,
        marginTop:15,
        padding:10,
        paddingLeft:15,borderRadius:5}}
                        />
                        <TouchableOpacity style={styles.loginBtn} onPress={() =>this.isFormValid()?this.fetch_user():null}>
                            <View style={styles.loginBtnView}>
                                <Text style={styles.loginBtnText}>Login</Text>
                                {this.state.isLoading?(
                                <ActivityIndicator
                                style={{flex: 0.2, flexDirection: 'column'}}
                                size="large"
                                color="white"
                                    />
                                ):(null)}

                            </View>
                            
                       
                        </TouchableOpacity> 
                </View>
                 <View style={styles.loginMessage}>
                    <Text style={styles.loginMessageText}>Not a member? </Text>
                    <TouchableOpacity onPress={() =>this.props.handleModeChange(1)}>
                            <Text style={styles.loginRedirectText}>Signup</Text>
                    </TouchableOpacity> 
                 </View>
                 <View style={styles.loginMessage}> 
                    <TouchableOpacity onPress={() =>this.handleForgotClick()}>
                            <Text style={styles.loginRedirectText}>Forgot Password</Text>
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
        margin:10,
        marginTop:30
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
                loginBtnView:
                {
                    flexDirection:'row', 
                    alignItems: 'center',
                    justifyContent: 'center'
                },
                    loginBtnText:
                    {
                        color: '#fff', 
                        textAlign: 'center',
                        fontSize: 20,
                    },
        loginMessage:{
                flex:0.25,
                flexDirection:"row",
                alignContent: 'center',
                textAlign: 'center',
                justifyContent: 'center',
                
        },
                loginMessageText:
                {
                    fontSize:15,
                    // flex:1, 
                    // textAlign: 'right'
                },
                loginRedirectText:
                {
                    color: 'blue',  
                    // flex:1,
                    fontSize:15,
                    // textAlign: 'left',
                }
})
export default Login;
