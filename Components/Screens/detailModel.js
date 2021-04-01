import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Platform, StatusBar, Image,Modal, TouchableOpacity,TextInput, Button, ActivityIndicator, Dimensions,Alert } from 'react-native';
import config from '../../config'
import Icon from 'react-native-vector-icons/dist/Feather';  
import { Isao } from 'react-native-textinput-effects';
import RNFetchBlob from 'rn-fetch-blob';
class DetailModel extends React.Component {
    state = { name:this.props.name,about:this.props.about,role:this.props.role }


    saveDetail = () => {
       

        RNFetchBlob.fetch('POST', 'https://www.tattey.com/tattey_app/appapis/appointment.php', {
            Authorization: "Bearer access-token",
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          }, [ 
            { name: 'userName', data: this.state.name },
            { name: 'temp_id', data: this.props.user },
            { name: 'role', data: this.state.role },
            { name: 'about', data: this.state.about },

          ]).then((resp) => {
            console.log(resp);
            var tempMSG = JSON.parse(resp.data);
            
            if (tempMSG.msg === "success") { 
                this.setState({error:""});
                this.props.user_func()
                this.props.closeModal()
               
            } else if(tempMSG.msg === "usernameError")
                {
                        this.setState({error:"User Name Not Available"});
                }
             
          }).catch((err) => {
            console.log(err)
          })


        // fetch('https://tattey.com/tattey_app/appapis/appointment.php', {
        //     method: 'POST',
        //     headers: {
        //         Accept: 'application/json',
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ 
        //         userName: this.state.name,
        //         about: this.state.about, 
        //         temp_id: this.props.user,
        //         role: this.state.role 
        //     })
        // })
        //     .then((response) =>{ 
        //         return response.json()})
        //     .then(result => { 
                 
                

        //     })
        //     .catch((error) => {
        //         console.error(error);
        //     });
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
                <ScrollView style={{backgroundColor:"#fff",paddingTop:25}}>
                    <View style={styles.nameHeader}>
                    <View style={{flex:1,flexDirection: 'row'}}> 
                <View style={{flex:1,flexDirection: 'column',alignItems: 'center'}}> 

                </View>
                    
                <Icon name="x" size={20} color="red"  onPress={() =>this.props.closeModal()} style={{flex:0.1,flexDirection: 'column',textAlign:"right",margin:10}} />
              
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

                                            <TextInput
                                                placeholder={'Name*'}
                                                // this is applied as active border and label color
                                                
                                                onChangeText={(text)=>{this.setState({name: text})}}
                                                 
                                                defaultValue={this.state.name}
                                                style={{borderColor:"#000",borderWidth:1,marginBottom:15,
                                                    marginTop:15,
                                                    padding:10,
                                                    paddingLeft:15,
                                                    borderRadius:5}}
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

                                            <TextInput
                                                placeholder={'About'}
                                                 
                                                multiline={true} 
                                                defaultValue={this.state.about}
                                                onChangeText={(text)=>{this.setState({about: text})}}
                                                style={{borderColor:"#000",borderWidth:1,marginBottom:15,
        marginTop:15,
        padding:15,
        paddingLeft:15,borderRadius:5,textAlignVertical: 'top'}}
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
                                            <TextInput
                                                placeholder={'Role'}
                                                 
                                                multiline={true}
                                                style={{borderColor:"#000",borderWidth:1,marginBottom:15,
        marginTop:15,
        padding:15,
        paddingLeft:15,borderRadius:5,textAlignVertical: 'top'}}
                                          
                                                 
                                                defaultValue={this.state.role}
                                                onChangeText={(text)=>{this.setState({role: text})}}
                                                 
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
                                        {this.state.error?(
                                            <View style={{color: "white",
                                                backgroundColor:"#000",
                                                borderColor: "#000",
                                                borderWidth:2,fontSize:15,flex:1,flexDirection:"column",paddingLeft:10,paddingRight:10,marginTop:10,paddingTop:5,paddingBottom:5}}>
                                                <Text style={{fontSize:15,color: "white"}}>{this.state.error}</Text>
                                            </View> 
                                        ):(null)}
                                    
                                         
                
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
