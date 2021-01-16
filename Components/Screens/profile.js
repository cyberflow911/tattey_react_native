import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Platform, StatusBar, Image,Modal,TouchableWithoutFeedback,TextInput, Button, ActivityIndicator, Dimensions,Alert } from 'react-native';
import Header from './Header';
import Gallery from './Gallery';
import config from '../../config';
import DetailModel from './detailModel';
import Icon from 'react-native-vector-icons/dist/Feather';
import ImagePicker from 'react-native-image-picker/lib/commonjs'
import RNFetchBlob from 'rn-fetch-blob';    
import Clipboard from '@react-native-community/clipboard';
import Toast from 'react-native-simple-toast';
class profile extends React.Component {
    state = {modalVisible:false,mode:1,ImageSource: null,
        user_id: this.props.user,
        data: null}

    closeModal = ()=>{
        this.setState({modalVisible:false})
    }
    open = ()=>{
        this.setState({modalVisible:true})
    }
    selectPhotoTapped() {
        const options = {
          quality: 1.0,
          maxWidth: 500,
          maxHeight: 500,
          storageOptions: {
            skipBackup: true
          }
        };
    
        ImagePicker.showImagePicker(options, (response) => {
          console.log('Response = ', response);
    
          if (response.didCancel) {
            console.log('User cancelled photo picker');
          }
          else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          }
          else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
          }
          else {
            let source = { uri: response.uri };
    
            this.setState({
    
              ImageSource: source,
              data: response.data
    
            });
            this.uploadImageToServer();
          }
        });
      }
    uploadImageToServer = () => {
        console.log('header')
        RNFetchBlob.fetch('POST', 'https://www.tattey.com/tattey_app/appapis/appointment.php', {
          Authorization: "Bearer access-token",
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        }, [
          { name: 'image', filename: 'image.png', type: 'image/png', data: this.state.data },
          { name: 'userPic', data: this.state.user_id }
        ]).then((resp) => {
          var tempMSG = JSON.parse(resp.data);
          console.log(resp);
          if (tempMSG.msg === "success") {
            Alert.alert("Image Uploaded Successfully");
            this.props.user_func();
          } else {
            Alert.alert(tempMSG.msg);
          }
        }).catch((err) => {
          console.log(err)
        })
      }

    renderinnerTab = (mode)=>
    {
        switch(mode)
        {
            case 1:
                return  (<Gallery user={this.props.user} imgs={this.props.imgs} user_func={this.props.user_func}/>);
            case 2: 
                return (<View style={{flex:1,flexDirection:"row"}}>
                            <View style={{flex:0.9,flexDirection:"column" }}>
                                <Text style={{color: 'white',fontWeight: 'bold',fontSize:15}}>{this.props.detail.about}</Text>
                            </View>
                            <View style={{flex:0.05,flexDirection:"column" }}>
                                   <Icon name="edit" size={20} color="red"  onPress={() =>this.setState({modalVisible:true})} />
                            </View>
                        </View>
                )
        }
    }
    render() {
        return (
           <SafeAreaView style={styles.AndroidSafeArea}>
               <View style={{flex:1,flexDirection:"column",backgroundColor:"#000" }}>
                    <View style={{flex:0.9,flexDirection:"column" }}>
                        <Header user={this.props.user} detail={this.props.detail} user_func={this.props.user_func}/> 
                        {/* <Icon name="edit" size={20} color="red"  style={{textAlign:"center",marginLeft:80,zIndex:1000}} onPress={this.selectPhotoTapped.bind(this)} /> */}
                    </View>
                    <View style={{flex:0.5,flexDirection:"column",justifyContent:"center",alignItems:"center",marginTop:20}}>
                        
                        <View style={{flex:1,flexDirection:"row",}}> 
                            <View style={{flex:0.9,flexDirection:"column",alignItems:"center" }}>
                                <Text style={{color:"white",fontSize:25,marginTop:5}} onPress={this.open}>{this.props.detail.name}   <Icon name="edit" size={20} color="red"  onPress={() =>this.setState({modalVisible:true})} /></Text>   
                            </View> 
                        </View>
                        <View style={{flex:1,flexDirection:"column",color:"white",marginTop:15}}>
                            <Text style={{color:"white",fontSize:20,color:"red"}}>Owner</Text>
                        </View> 
                        <View style={{flex:1,flexDirection:"column",marginTop:10,alignItems:"center"}}>
                            <TouchableWithoutFeedback onPress={() =>{ 
                                Clipboard.setString(this.props.detail.link)
                                Toast.show('Copied to Clipboard', Toast.LONG);
                            
                            }}>
                                <Text style={{color:"red"}}>{this.props.detail.link}</Text>
                            </TouchableWithoutFeedback>
                            
                        </View>
                    </View>
                    <View style={{flex:0.4,flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                        
                        <View style={{flex:1,flexDirection:"column",}}>
                        <TouchableWithoutFeedback onPress={()=>this.setState({mode:2})}  >
                            <View>
                                     <TextInput style={{color:"white",fontSize:20,color:"white",textAlign:"center",borderBottomColor: this.state.mode==2?"red":"grey", borderBottomWidth: 2,marginRight:2}} editable={false}  value={"About"}/>
                            </View>
                           
                        </TouchableWithoutFeedback>
                        </View>
                        <View style={{flex:1,flexDirection:"column",color:"white"}}>
                        <TouchableWithoutFeedback onPress={()=>this.setState({mode:1})}  >
                            <View>
                                    <TextInput style={{color:"white",fontSize:20,color:"white",textAlign:"center",borderBottomColor: this.state.mode==1?"red":"grey", borderBottomWidth: 2,marginRight:2}} editable={false}   value={"Gallery"}/>   
                            </View>
                           
                        </TouchableWithoutFeedback>
                        </View> 
                    </View>
                    
                    <View style={{flex:1,flexDirection:"column"}}>
                       {this.renderinnerTab(this.state.mode)}
                    </View>
                    <DetailModel modalVisible={this.state.modalVisible} closeModal={this.closeModal} user={this.props.user} user_func={this.props.user_func} name={this.props.detail.name} about={this.props.detail.about}/>
               </View>
               
              
           </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
    AndroidSafeArea: {
        flex: 1,
        backgroundColor: config.app.color.primaryColor,
        // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    }});
export default profile;