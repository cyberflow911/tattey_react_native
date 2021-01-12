import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Platform, StatusBar, Image,Modal, TouchableOpacity,TextInput, Button, ActivityIndicator, Dimensions,Alert } from 'react-native';
import config from '../../config'
import Icon from 'react-native-vector-icons/dist/Feather';  
import { Isao } from 'react-native-textinput-effects';

class DetailModel extends React.Component {
    state = { name:this.props.name,about:this.props.about }


    saveDetail = () => {
        console.log(this.state.name,this.state.about);
        fetch('https://tattey.com/tattey_app/appapis/appointment.php', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                userName: this.state.name,
                about: this.state.about, 
                temp_id: this.props.user, 
            })
        })
            .then((response) =>{ 
                return response.json()})
            .then(result => { 
                console.log(result)
                if (Object.values(result)[0] === ("success")) {
                        this.props.user_func()
                        this.props.closeModal()
                }

            })
            .catch((error) => {
                console.error(error);
            });
    }
    render() {
        return (
            <View>
            <Modal
                style={styles.Model}
                animationType="slide"
                transparent={false}
                visible={this.props.modalVisible}
                onRequestClose={this.closeModal} // Used to handle the Android Back Button
                backdropOpacity={0}
                swipeToClose={true}
                // swipeDirection="left"
                
                onSwipe={this.closeModal}
                onBackdropPress={this.closeModal}>
                <ScrollView style={{backgroundColor:"#fff"}}>
                    <View style={styles.nameHeader}>
                    <View style={{flex:1,flexDirection: 'row'}}> 
                <View style={{flex:1,flexDirection: 'column',alignItems: 'center'}}>
                

                </View>
                    
                <Icon name="x-circle" size={20} color="red"  onPress={() =>this.props.closeModal()} style={{flex:0.1,flexDirection: 'column',textAlign:"right",margin:10}} />
              
            </View>
                        
                        
                        
                        <Text style={{ marginLeft: 10, color: "#000", fontSize: 25,textAlign: "center",marginTop:10,fontWeight: "bold"}}>Profile Details</Text>
                    </View>
                    <View style={{flex:1,flexDirection: "row",marginLeft:20,marginRight:20}}>  
                        {/* <View style={{flex:0.2,flexDirection: "column"}}><Text style={{ fontSize:15,color:"black",marginTop:35}}>Phone </Text></View>     */}
                           
                        
                    </View>
                    <View style={{flex:1,flexDirection: "row",marginLeft:20,marginRight:20}}> 
                        {/* <View style={{flex:0.2,flexDirection: "column"}}><Text style={{ fontSize:15,color:"black",marginTop:35}}>Contact </Text></View>     */}
                        <View style={{flex:1,flexDirection: "column"}}>
                                <View style={{flex:1,flexDirection: "row"}}>
                                    <View style={{flex:1,flexDirection: "column"}}>

                                            <Isao
                                                label={'Name*'}
                                                // this is applied as active border and label color
                                                activeColor={'#da7071'}
                                                // active border height
                                                borderHeight={2}
                                                inputPadding={16}
                                                onChangeText={(text)=>{this.setState({name: text})}}
                                                labelHeight={24}
                                                defaultValue={this.state.name}
                                                // this is applied as passive border and label color
                                                passiveColor={'#dadada'}
                                            />
                                         
                
                                    </View>
                                     
                                </View>    
                        </View>    
                        
                    </View>
                    <View style={{flex:1,flexDirection: "row",marginLeft:20,marginRight:20}}>  
                        {/* <View style={{flex:0.2,flexDirection: "column"}}><Text style={{ fontSize:15,color:"black",marginTop:35}}>Phone </Text></View>     */}
                        <View style={{flex:1,flexDirection: "column"}}>
                                <View style={{flex:1,flexDirection: "row"}}>
                                    <View style={{flex:1,flexDirection: "column"}}>

                                            <Isao
                                                label={'About'}
                                                // this is applied as active border and label color
                                                activeColor={'#da7071'}
                                                // active border height
                                                borderHeight={2}
                                                multiline={true}
                                                style={{textAlignVertical: 'top'}}
                                                inputPadding={16}
                                                defaultValue={this.state.about}
                                                onChangeText={(text)=>{this.setState({about: text})}}
                                                labelHeight={24}
                                                // this is applied as passive border and label color
                                                passiveColor={'#dadada'}
                                            />
                                         
                
                                    </View>
                                     
                                </View>    
                        </View>    
                        
                    </View>
                     
                 
                <View style={{flex: 1,flexDirection:"row",alignItems: "center",justifyContent: "center",marginTop:5}}> 
                        <TouchableOpacity
                            style={{backgroundColor:"#000",color:"white",padding:10,borderRadius:5,marginTop:10}}
                            onPress={() =>  this.saveDetail()}>
                                <Text style={{color:"white",margin:5}}>Save</Text>
                        </TouchableOpacity>
                </View> 

                    </ScrollView>
                

            </Modal>
        </View>
        );
    }
}

export default DetailModel;

const styles = StyleSheet.create({
    AndroidSafeArea: {
        flex: 1,
        backgroundColor: config.app.color.primaryColor,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    Model: {
        height: 50,
        width: 100,
        backgroundColor: config.app.color.primaryColor
    },
    nameHeading: {
        fontSize: 30,
        fontWeight: 'bold',
        color: "black", textAlign:'center'
    },
    subheading: {
        fontWeight: 'bold',
        color: "red",
        fontSize: 15

    },
    nameHeader: {
        marginTop: 5, 
        textAlign: "center",
        flex:1,flexDirection: 'column',alignItems: 'center',justifyContent:"center"
    },
    dateColumn: {
        flex: 0.1,
        flexDirection: "row",
        margin: 10
    },
    innerDateText: {
        color: "red",
        fontSize: 18,
    },
    outerDateText: {
        fontSize: 18, color: "#000", marginRight: 20
    }
});