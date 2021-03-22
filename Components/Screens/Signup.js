import React from 'react';
import { StyleSheet,View,Image,Text,TouchableOpacity,ActivityIndicator } from 'react-native';
import { Hoshi } from 'react-native-textinput-effects';
import DefaultPreference from 'react-native-default-preference';  

import DeviceInfo from 'react-native-device-info';

const LOGO = require('../../assets/img/logo.png');

class Signup extends React.Component {
    state = { user_id: null,userStatus:'',isLoading: false,errors:[],email:'',password:'',macAddr:null} 
     
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
              error = { message: "Enter Email,Password" };

          }
        this.setState({ errors: errors.concat(error) });
        
        return false;
      } else {
        return true;
      }
    };
    
    // handleInputError = (errors, inputName) => { 
    //   return  errors.some(error => error.message.toLowerCase().includes(inputName))
    //     ? "#000"
    //     : "#000";

        
    // };
    componentDidMount() {
      DeviceInfo.getMacAddress().then((mac) => {
        // "E5:12:D8:E5:69:97" 
        this.setState({macAddr:mac})
      })
    }
      getUser=()=>{ 
        if(!this.state.isLoading)
        {
          this.setState({isLoading:true})
          DefaultPreference.get('user_id').then((value)=>{
            if(value==null)
            {
              this.makeUser();
              this.setState({userStatus:'new'})
            }else
            {
              this.setState({user_id:value,userStatus:'old',errors:[{message:'Attach An Email to Your Account'}]});    
              this.saveUserTodb();
              
            }
            
        })
      }
      }
      makeUser=()=>{
        fetch('https://www.tattbooking.com/tattey_app/appapis/appointment.php', {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type':'application/json' 
                  },
                  body: JSON.stringify({
                      userCount: true,     
                  })
                })
                .then((response) => response.json())
                .then(result=>{  
                   var arr = Object.values(result);
                   if(arr[0]===("sucesss"))
                   {  
                        var user_id = (parseInt(arr[1])+1)+""+new Date().getTime(); 
                        DefaultPreference.set('user_id',user_id); 
                        DefaultPreference.set('isFirstTime',"false");
                        this.setState({user_id:user_id}); 
                        this.saveUserTodb(); 
                   } 
                })
                .catch((error) => {
                   console.error(error);
                });
      }
 saveUserTodb=()=>{ 
        fetch('https://www.tattbooking.com/tattey_app/appapis/appointment.php', {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type':'application/json' 
                  },
                  body: JSON.stringify({
                      email: this.state.email,
                      password: this.state.password,
                      user_id: this.state.user_id, 
                      mode:this.state.userStatus, 
                      macAddr:this.state.macAddr,
                      signup:"true" 
                  })
                })
                .then((response) => response.json())
                .then(result=>{
                  console.log(result);
                   if(result.msg==="success")
                   {  
                       
                        this.props.setStateFunction(this.state.user_id)
                        this.props.user_detailsFunction();
                   }
                   else
                   {
                       if(result.error.toLowerCase().includes("duplicate"))
                       {
                         this.setState({errors:[{message:"Email already registered"}]})
                       }
                       else
                       {
                        this.setState({errors:[{message:"Unable to register at the moment! Please try again later"}]})
                       }
                   }
                   
                this.setState({isLoading:false})
                })
                .catch((error) => {
                   console.error(error);
                });
      }

      displayErrors = errors =>
      errors.map((error, i) => <Text key={i} style={{fontSize:15,color:'white'}}>{error.message}</Text>);
     
    render() {
    
        return (
             <View style={styles.main}>
                 <View style={styles.header}>
                    <Image source={LOGO} style={{height:120,width:300}}/>
                    <Text style={styles.headerText}>Signup </Text>
                 </View>
                 {this.state.errors.length > 0 && (
                                                <View style={{color: "white",
                                                    backgroundColor:"#000",
                                                    borderColor: "#000",
                                                    borderWidth:2,
                                                    fontSize:15,
                                                    flex:0.2,
                                                    justifyContent: 'center',
                                                    flexDirection:"column",
                                                    paddingLeft:10,
                                                    paddingRight:10}}>
                                                {this.displayErrors(this.state.errors)}
                                                </View>
                                            )}
                 <View style={styles.form}> 
                    <Hoshi
                            label={'Email'} 
                            borderColor="#000" 
                            borderHeight={3}
                            labelStyle={{color:"#000"}}
                            inputPadding={16} 
                            onChangeText={(text)=>this.setState({email:text})}
                            backgroundColor={'#F9F7F6'}
                        />
                    <Hoshi
                            label={'Password'} 
                            borderColor="#000" 
                            borderHeight={3}
                            secureTextEntry={true}
                            labelStyle={{color:"#000"}}
                            inputPadding={16} 
                            onChangeText={(text)=>this.setState({password:text})}
                            backgroundColor={'#F9F7F6'}
                        />
                        <TouchableOpacity style={styles.signupBtn} onPress={() =>this.isFormValid()?this.getUser():null}>
                        <View style={styles.signupBtnView}>
                                <Text style={styles.signupBtnText}>Signup</Text>
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
                    <Text style={styles.loginMessageText}>Already a member? </Text>
                    <TouchableOpacity onPress={() =>this.props.handleModeChange(0)}>
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
                signupBtnView:
                {
                    flexDirection:'row', 
                    alignItems: 'center',
                    justifyContent: 'center'
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