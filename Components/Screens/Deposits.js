import React from 'react';
import { Switch,StyleSheet,View,TouchableOpacity,Text, Platform, StatusBar ,SafeAreaView,Alert} from 'react-native';
import { Isao } from 'react-native-textinput-effects';
import RNFetchBlob from 'rn-fetch-blob'; 
import UpgradeNotice from './UpgradeNotice';

class Deposits extends React.Component {
    state = { 
        isEnabled:this.props.detail.deposits==0?false:true,
        amount:this.props.detail.amount,
        email:this.props.detail.paypal_email,
        pro:this.props.detail.pro,
        errors:[]
     }

     toggleSwitch=()=>
     {

        
          if(this.isFormValid())
          {
           console.log("not empty"); 
           this.setState({ isEnabled: !this.state.isEnabled,errors:[]})
           this.updateDepositsStatus();
          }else
          {
            console.log("empty");
            this.setState({ isEnabled: false})
          }
     
         
     }


     updateDepositsStatus = () => {
      console.log('Uploading')
      RNFetchBlob.fetch('POST', 'https://www.tattey.com/tattey_app/appapis/appointment.php', {
        Authorization: "Bearer access-token",
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      }, [
          { name: 'updateDepositsStatus', data: !this.state.isEnabled?("1"):("0")},     
          { name: 'paypalEmail',data:this.state.email.toLowerCase()},
          { name: 'amount',data:""+this.state.amount},
          { name: 'temp_user',data:""+this.props.user}
        ]).then((resp) => { 
          console.log(resp)
          var tempMSG = JSON.parse(resp.data); 
          if(tempMSG.msg ==="success")
          {
           
            this.props.user_func();
          }else
          {
            Alert.alert(tempMSG.msg);
          } 
        }).catch((err) => {
          console.log(err)
        })
  
    }
    updateDepositsDetail = () => {
    
      RNFetchBlob.fetch('POST', 'https://www.tattey.com/tattey_app/appapis/appointment.php', {
        Authorization: "Bearer access-token",
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      }, [
          { name: 'updateDepositsDetail', data: this.state.isEnabled?("1"):("0")},     
          { name: 'paypalEmail',data:this.state.email.toLowerCase()},
          { name: 'amount',data:""+this.state.amount},
          { name: 'temp_user',data:""+this.props.user}
        ]).then((resp) => { 
          console.log(resp)
          var tempMSG = JSON.parse(resp.data); 
          if(tempMSG.msg ==="success")
          {
            this.setState({errors:[]})
            Alert.alert("Details updated");
            this.props.user_func();
          }else
          {
            Alert.alert(tempMSG.msg);
          } 
        }).catch((err) => {
          console.log(err)
        })
  
    }
     isFormValid = () => {
      let errors = [];
      let error;
  
      if (this.isFormEmpty(this.state)) 
      {
        error = { message: "Fill all fields" };
        this.setState({ errors: errors.concat(error) });
        return false;
      } else {
        return true;
      }
    };
    isFormEmpty = ({ email, amount }) => {
      return (
        !email.length ||
        !amount
      );
    };
    displayErrors = errors =>
    errors.map((error, i) => <Text key={i} style={{fontSize:15}}>{error.message}</Text>);
  
     renderDepositText=status=>status?("Deposits Are Turned ON"):("Deposits Are Turned OFF")
    render() {
        return (
          <SafeAreaView style={styles.AndroidSafeArea}>
            {(this.state.pro=="0" && (this.props.appMode=="0"||Platform.OS=="android"))?( 
                  <UpgradeNotice upgradeToPro={this.upgradeToPro} error={this.state.error}/>
             ):( <View style={styles.container}>
              {this.state.errors.length > 0 && (
                      <View style={{
                          color: "#721c24",
                          backgroundColor:"#f8d7da",
                          borderColor: "#f5c6cb",
                          borderWidth:2,
                          fontSize:15,
                          flex:0.1,
                          flexDirection:"column",
                          paddingLeft:10,
                          paddingRight:10,
                          paddingTop:15,
                          margin:30
                          }}>
                      {this.displayErrors(this.state.errors)}
                      </View>
                          )}
                <View style={{flex:0.2,flexDirection: "row",marginLeft:20,marginRight:20}}>  
                      <View style={{flex:1,flexDirection: "column"}}>
                              <View style={{flex:1,flexDirection: "row"}}>
                                  <View style={{flex:1,flexDirection: "column"}}>
                                        <Text style={{textAlign: "center", fontSize:25,fontWeight: "bold"}}>Deposits</Text>
                                  </View> 
                              </View>    
                      </View>     
                </View>
                <Switch
                  trackColor={{ false: "#767577", true: "black" }}
                  thumbColor={this.state.isEnabled ? "red" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={this.toggleSwitch}
                  value={this.state.isEnabled}
                />
                <Text style={{marginTop:10,marginBottom:20}}>{this.renderDepositText(this.state.isEnabled)}</Text>
                <View style={{flex:0.2,flexDirection: "row",marginLeft:20,marginRight:20}}>  
                      <View style={{flex:1,flexDirection: "column"}}>
                              <View style={{flex:1,flexDirection: "row"}}>
                                  <View style={{flex:1,flexDirection: "column"}}>
                                        <Isao
                                              label={'Paypal Email'} 
                                              activeColor={'#000'} 
                                              borderHeight={2}
                                              inputPadding={16}
                                              onChangeText={(text)=>{this.setState({email: text})}}
                                              labelHeight={24} 
                                              defaultValue={this.state.email}
                                              passiveColor={'#000'}
                                          /> 
                                  </View> 
                              </View>    
                      </View>     
                </View>
                <View style={{flex:0.2,flexDirection: "row",marginLeft:20,marginTop:60,marginRight:20}}>  
                      <View style={{flex:1,flexDirection: "column"}}>
                              <View style={{flex:1,flexDirection: "row"}}>
                                  <View style={{flex:1,flexDirection: "column"}}>
                                        <Isao
                                              label={'Amount'} 
                                              activeColor={'#000'} 
                                              borderHeight={2}
                                              inputPadding={16}
                                              onChangeText={(text)=>{this.setState({amount: text})}}
                                              labelHeight={24} 
                                              defaultValue={this.state.amount}
                                              passiveColor={'#000'}
                                          /> 
                                  </View> 
                              </View>    
                      </View>     
                </View>
                {this.state.isEnabled?(
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#000',
                      color: 'white',
                      padding: 10,
                      borderRadius: 5,
                      marginTop: 70,
                    }}
                    onPress={() =>this.isFormValid()?this.updateDepositsDetail():null}>
                    <Text style={{color: 'white', margin: 5}}>
                            Update Deposits Amount
                    </Text>
                  </TouchableOpacity>
                ):(null)} 
              </View>
)}
             
          </SafeAreaView>
                     );
    }

}


const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1, 
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  
},
    container: {
      flex: 1,
      alignItems: "center",
      marginTop:20
      // justifyContent: "center"
    }
  });

export default Deposits;