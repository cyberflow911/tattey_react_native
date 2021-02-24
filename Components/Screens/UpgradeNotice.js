import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Linking,ScrollView, Platform, StatusBar, Image,Modal,TouchableOpacity,TouchableWithoutFeedback,TextInput, Button, ActivityIndicator, Dimensions,Alert } from 'react-native';

import Toast from 'react-native-simple-toast';
import Clipboard from '@react-native-community/clipboard';  

const LOGO = require('../../assets/img/logo.png');

class UpgradeNotice extends React.Component {
    state = {code: ''}
    render() {
        return (
            <View style={{flex:1,flexDirection:"column",backgroundColor:"#111" }}>
                <View style={{flex:0.25,flexDirection:"column",alignItems:"center"}}>
                    <Image source={LOGO} style={{height:120,width:300}}/>
                </View>
                
                <View style={{flex:1,flexDirection:"column",alignItems:"center",margin:10,backgroundColor:"#000"}}>
                     <Text style={{fontWeight:"bold",color: 'white',fontSize:20,marginTop:10}}>Visit Profile Section TO Upgrade </Text>
                     {this.props.error?(
                                            <View style={{color: "#721c24",
                                                backgroundColor:"#f8d7da",
                                                borderColor: "#f5c6cb",
                                                borderWidth:2,fontSize:15,flex:0.1,flexDirection:"column",paddingLeft:10,paddingRight:10,marginTop:10,paddingTop:5,justifyContent:"center"}}>
                                                <Text style={{fontSize:15}}>{this.props.error}</Text>
                                            </View> 
                                        ):(null)}
                     {/* <View style={{flex:1,flexDirection:"column",justifyContent:"center"}}>
                         <Text style={{color:"white",fontSize:20}}>Enter Activation Code :  </Text>
                          <TextInput style={{backgroundColor:"#fff",color:"#000",  borderColor: this.props.error?("red"):("white"),  borderWidth:2, fontSize:20}}  placeHolder="Enter Activation Code" onChangeText={(text)=>this.setState({code:text})}/>
                        <TouchableOpacity
                            style={{backgroundColor:"#fff",color:"white",padding:10,borderRadius:5,marginTop:40}}
                            onPress={() =>  this.props.upgradeToPro(this.state.code)}>
                                <Text style={{color:"white",margin:5,color:"black",textAlign:"center",fontWeight:"bold",fontSize:20}}>Activate</Text>
                        </TouchableOpacity>
                     </View> */}
                     <Text style={{fontWeight:"bold",color: 'white',fontSize:15,marginTop:10}}>For More Information Visit :</Text>
                     <TouchableWithoutFeedback style={{marginBottom:20}} onPress={() =>{ 
                                Clipboard.setString("https://www.tattbooking.com/")
                                Linking.openURL("https://www.tattbooking.com/");
                                Toast.show('Copied to Clipboard', Toast.LONG);}}> 
                                <Text style={{color:"red",marginBottom:20}}>https://www.tattbooking.com/</Text>
                            </TouchableWithoutFeedback>
                </View> 
                

            </View>
        );
    }
}

export default UpgradeNotice;