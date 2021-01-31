import React from 'react';
import { StyleSheet, Text, View,SafeAreaView, TouchableWithoutFeedback,ScrollView,Platform,StatusBar,Modal,TextInput,Image,ActivityIndicator,Dimensions,FlatList,Alert } from 'react-native';
import ImagePicker from 'react-native-image-picker/lib/commonjs'
import RNFetchBlob from 'rn-fetch-blob'; 
const IMG = require('../../assets/img/add.png');

class Gallery extends React.Component {
    state ={ 
        
        ImageSource: null, 
        user_id: this.props.name,
        data:null
      }
      renderItem = (image)=> {

          if(image.id =="add")
          {
            return  (   
            <TouchableWithoutFeedback onPress={this.selectPhotoTapped.bind(this)} style={{ height: 90, flex:1/3,margin:3}} key={image.id} >
              <Image source={IMG} style={{ height: 90, flex:1/3,margin:3,backgroundColor:"white"}} />
            </TouchableWithoutFeedback>);
          }

          return  (    
              <Image source={{uri:image.image}} key={image.id} style={{ height: 90, flex:1/3,margin:3}}/> 
          );
        
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
        console.log('Uploading')
        RNFetchBlob.fetch('POST', 'https://www.tattey.com/tattey_app/appapis/appointment.php', {
          Authorization: "Bearer access-token",
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        }, [
            { name: 'image', filename: 'image.png', type: 'image/png', data: this.state.data},     
            { name: 'galleryImage',data:this.state.user_id}
          ]).then((resp) => { 
            var tempMSG = JSON.parse(resp.data); 
            if(tempMSG.msg ==="success")
            {
              Alert.alert("Image Uploaded Successfully");
              this.props.user_func();
            }else
            {
              Alert.alert(tempMSG.msg);
            }
    
           

    
          }).catch((err) => {
            console.log(err)
          })
    
      }



    render() { 
        return (
            <FlatList data={this.props.imgs} renderItem={({item})=>this.renderItem(item)}  keyExtractor={item => item.id} numColumns={3}/> 
        );
    }
}

export default Gallery;