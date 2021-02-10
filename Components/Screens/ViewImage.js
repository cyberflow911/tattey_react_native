import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Platform, StatusBar, Image,Modal, TouchableOpacity,TextInput, Button, ActivityIndicator, Dimensions,Alert } from 'react-native';
import config from '../../config'
import Icon from 'react-native-vector-icons/dist/Feather';  
import { Isao } from 'react-native-textinput-effects';
import RNFetchBlob from 'rn-fetch-blob';
class ViewImage extends React.Component {
    state = {}

 
    render() {
        return (
            <View>
            <Modal
                style={styles.Model}
                animationType="slide"
                transparent={false}
                visible={this.props.isVisible}
                onRequestClose={this.props.closeModal} // Used to handle the Android Back Button
                backdropOpacity={0}
                swipeToClose={true}
                // swipeDirection="left"
                
                onSwipe={this.props.closeModal}
                onBackdropPress={this.props.closeModal}>
                    <View style={{flex: 1}}>
                            <Image source={{uri:this.props.image}} style={{flex:1}}/>
                            <View style={{position: "absolute", right:10,top:10}}>
                            <Icon
                                style={{flex: 0.1}}
                                size={20}
                                color="red"
                                name="x-circle"
                                onPress={() => this.props.closeModal()}
                                />
                            </View>
                    </View>
            </Modal>
        </View>
        );
    }
}

export default ViewImage;

const styles = StyleSheet.create({
   
    Model: {
        height: 50,
        width: 100,
        backgroundColor: config.app.color.primaryColor
    },
   
});