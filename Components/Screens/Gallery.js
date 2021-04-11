import React from 'react';
import { StyleSheet, Text, View,SafeAreaView, TouchableWithoutFeedback,ScrollView,Platform,StatusBar,Modal,TextInput,Image,ActivityIndicator,Dimensions,FlatList,Alert } from 'react-native';
import ImagePicker from 'react-native-image-picker/lib/commonjs'
import RNFetchBlob from 'rn-fetch-blob'; 
import Icon from 'react-native-vector-icons/dist/Feather';
import ViewImage from './ViewImage'
const IMG = require('../../assets/img/add.png');

class Gallery extends React.Component {
    state ={ 
        
        ImageSource: null, 
        user_id: this.props.name,
        data:null,
        image:"",
        imageModalVisible:false,

      }
      closeModal = () => {
        this.setState({imageModalVisible:false})
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
            <TouchableWithoutFeedback onPress={() =>this.setState({image:image.image,imageModalVisible:true})} >
              <View style={{flex:1/3,flexDirection: "row",margin:3}}>
                  <Image source={{uri:image.image}} key={image.id} style={{ height: 90, flex:1}}/> 
                  <Icon name="x" size={20} color="red"  onPress={() =>this.deletePhotoAlert(image.id)} style={{flex:0.2,flexDirection: 'column',textAlign:"center"}} />
              </View>
            </TouchableWithoutFeedback>
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
      deletePhotoAlert = (id)=>{
        Alert.alert(
            'Delete Image',
            `Do You Really Want to Delete Image`,
            [ 
              { text: 'Yes', onPress: () => {this.deleteImage(id)} },
              { text: 'No', onPress: () =>{}}
            ],
            { cancelable: true }
          );
    }
      deleteImage = (id) => { 
        console.log('deleting',id)
        RNFetchBlob.fetch('POST', 'https://www.tattey.com/tattey_app/appapis/appointment.php', {
          Authorization: "Bearer access-token",
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        }, [
            { name: 'delete_imageGallery',   data: "true"},     
            { name: 'image_idGallery',data:id}
          ]).then((resp) => { 
            var tempMSG = JSON.parse(resp.data); 
            console.log(tempMSG);
            if(tempMSG.msg ==="success")
            {
              Alert.alert("Image Deleted Successfully");
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
          <>
            <FlatList data={this.props.imgs} renderItem={({item})=>this.renderItem(item)}  keyExtractor={(item) => item.id} numColumns={3}/> 
            {this.state.imageModalVisible?(<ViewImage image={this.state.image} isVisible={this.state.imageModalVisible} closeModal={this.closeModal}/>):(null)  }
          </>
        );
    }
}

export default Gallery;