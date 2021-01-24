import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Platform, StatusBar, TouchableWithoutFeedback, Image, Modal, TouchableOpacity, TextInput, Button, ActivityIndicator, Dimensions, Alert } from 'react-native';
import ImagePicker from 'react-native-image-picker/lib/commonjs'
import RNFetchBlob from 'rn-fetch-blob';

import Icon from 'react-native-vector-icons/dist/Feather';

class Header extends React.Component {

  state = {
    ImageSource: null,
    user_id: this.props.user,
    data: null,
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

  selectPhotoTapped1() {
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
        this.uploadImageToServer1();
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
  uploadImageToServer1 = () => {
    console.log('header1')
    RNFetchBlob.fetch('POST', 'https://www.tattey.com/tattey_app/appapis/appointment.php', {
      Authorization: "Bearer access-token",
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    }, [
      { name: 'image', filename: 'image.png', type: 'image/png', data: this.state.data },
      { name: 'headerPic', data: this.state.user_id }
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


  render() {
    return (
      <View>
        <TouchableWithoutFeedback onPress={this.selectPhotoTapped1.bind(this)} >
          <Image
            style={{ height: "80%", width: "100%" }}
            source={{ uri: this.props.detail.header }} />

        </TouchableWithoutFeedback>
            <Icon name="edit" size={20} color="red" style={{textAlign: "right"}} onPress={this.selectPhotoTapped1.bind(this)} />

        <TouchableWithoutFeedback onPress={this.selectPhotoTapped.bind(this)}  >
       
          <Image style={{ position: "absolute", top: "35%", zIndex: 10, height: 150, left: "28%", width: 150, borderWidth: 2, borderColor: "black" }} source={{ uri: this.props.detail.logo }} />
           
       
            
        </TouchableWithoutFeedback>




      </View>

    );
  }
}

export default Header;