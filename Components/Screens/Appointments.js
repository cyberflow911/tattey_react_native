import React from 'react';
import { StyleSheet, Text, View,SafeAreaView, TouchableWithoutFeedback,ScrollView,Platform,StatusBar,Modal,TextInput,Image,ActivityIndicator,Dimensions,FlatList,Alert } from 'react-native'; 
import config from '../../config'
import Icon from 'react-native-vector-icons/dist/Feather';
import CardView from 'react-native-cardview'

const LOGO = require('../../assets/img/logo_black.png')
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class Appointments extends React.Component {
    state = { item:{
        id:"",
        date:"",
        time:"",
        status:"",
        loader:"notloading"
    },
    date: "",
    h:"",
    m:"",
    name:"",
    phone:"",
    status:"",
    isVisible:false

}
    cancelAppointment=(id,date,time,status) =>{
        this.setState({item:{id:id,date:date,time:time,status:status,loader:"loading"}})
        fetch('https://tattey.com/tattey_app/appapis/appointment.php', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type':'application/json' 
              },
              body: JSON.stringify({
                cancelAppointment: true,
                appoint_id:id     
              })
            })
            .then((response) => response.json())
            .then(result=>{ 
              // console.log(result)
                if(result.msg=="success")
                {  
                    this.setState({item:{id:id,date:date,time:time,status:"Cancelled",loader:"loading"}})
                }
            })
            .catch((error) => {
               console.error(error);
            });
    }
    cancelAppointmentAlert =(id,date,time,status)=>{
        Alert.alert(
            'Cancel Appointment',
            `Do You Really Want to Cancel Your Appointment at Tattey Booked on ${date} at ${time}`,
            [ 
              { text: 'Yes', onPress: () => {this.cancelAppointment(id,date,time,status)} },
              { text: 'No', onPress: () =>{}}
            ],
            { cancelable: true }
          );
    }
    closeModal = () => {
        this.setState({
            isVisible: false
        })
    }
    showAppointmentDetails = (item) => { 
        this.setState({date: item.date, status: item.status,time:item.time,name:item.name,phone:item.m_number,service:item.service,comment:item.comment,isVisible:true})
    }
      CustomRow = (item) => item.loader=="loading"?(
        <View style={{marginTop:10,flex: 1,flexDirection: 'column',alignItems: 'center',justifyContent: 'center'}}>
        <ActivityIndicator
            style={{flex: 1,flexDirection: 'row'}}
            size="large"
            color="red"
        /> 
        <Text style={{ flex: 1,flexDirection: 'row', color: "red"}}>Processing request...</Text>
    </View>
      ):( 
        <TouchableWithoutFeedback onPress={() =>this.showAppointmentDetails(item)}>
                <View style={styles.container}> 
                    <View style={styles.container_text}>
                        <View style={{flex: 1,flexDirection: 'row',}}> 
                            <Text style={styles.heading}>
                                 {item.name} 
                            </Text>
                            <Icon style={{flex:0.1 }} size={20} color="red" name="x-circle" onPress={()=>{this.cancelAppointmentAlert(item.id,item.date,item.time,item.status)}}/> 
                        </View>
                        
                        <View style={{flex:1,flexDirection: 'row'}}>
                            <Text style={styles.title}>
                                Date : {item.date}
                            </Text>
                            <Text style={{marginRight:10,flexDirection:"column",flex:1,color:"white",textAlign:"right"}}>
                                Status : {item.status}
                            </Text>
                        </View>
                        
                        <Text style={styles.description}>
                        Time :  {item.time}
                        </Text>
                    </View> 
                    <View> 
                    </View>
                </View>

        </TouchableWithoutFeedback>  
           );
    render() {
        return (
            <SafeAreaView style={styles.AndroidSafeArea} >
                {this.props.appointments && !this.props.appointments.length?(
                    <View>
                    <ActivityIndicator
                        style={{ position: "absolute", top: windowHeight / 2-50, left: windowWidth / 2 }}
                        size="large"
                        color="red"
                    /> 
                    <Text style={{ position: "absolute", top: windowHeight / 2-20, left: windowWidth / 2-10,color: "red"}}>Please wait...</Text>
                </View>
                
                ):(
                <View style={styles.Maincontainer}>
                    <Text style={styles.nameHeading}>Booked Appointments</Text> 
                    <FlatList
                        extras={this.state.item}
                        data={this.props.appointments}
                        renderItem={({item}) =>(this.CustomRow(item))}
                        keyExtractor={item => item.id}
                    />
                </View>
                )}
                <View>
                    <Modal
                        style={styles.Model}
                        animationType="slide"
                        transparent={false}
                        visible={this.state.isVisible}
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
                                    <Image 
                                        style={{marginLeft:50,height:90,width:150}}
                                        source={LOGO}
                                            />  

                                    </View>
                                        
                                    <Icon name="x-circle" size={20} color="red"  onPress={() =>this.setState({isVisible:false})} style={{flex:0.1,flexDirection: 'column',textAlign:"right",margin:10}} />
                                  
                                </View>
                                

                                <View style={{color: "#721c24",
                                                    backgroundColor:"#f8d7da",
                                                    borderColor: "#f5c6cb",
                                                    borderWidth:2,fontSize:15,flex:1,flexDirection:"column",paddingLeft:10,paddingRight:10,marginTop:10,paddingTop:5,paddingBottom:5}}>
                                                    <Text style={{fontSize:15}}>{this.state.status}</Text>
                                </View>
                                <Text style={{ marginLeft: 10, color: "#000", fontSize: 25,textAlign: "center",marginTop:20,fontWeight: "bold"}}>Appointment Details</Text>
                            </View> 
                        <View style={{flex:1,flexDirection: 'row',margin:10}}>
                                <Text   style={{flex:0.2,flexDirection: 'column',color: 'red',fontSize:18}}>Date : </Text> 
                                <Text style={{flex:0.8,flexDirection: 'column',fontSize:18}}>{new Date(this.state.date).toDateString()}</Text>

                        </View>
                        <View style={{flex:1,flexDirection: 'row',margin:10}}>
                                <Text   style={{flex:0.2,flexDirection: 'column',color: 'red',fontSize:18}}>Time : </Text> 
                                <Text style={{flex:0.8,flexDirection: 'column',fontSize:18}}>{this.state.time}</Text>

                        </View>
                        <View style={{flex:1,flexDirection: 'row',margin:10}}>
                                <Text   style={{flex:0.3,flexDirection: 'column',color: 'red',fontSize:18}}>Contact : </Text> 
                                <Text style={{flex:0.7,flexDirection: 'column',fontSize:18}}>{this.state.name}</Text>

                        </View>
                        <View style={{flex:1,flexDirection: 'row',margin:10}}>
                                <Text   style={{flex:0.2,flexDirection: 'column',color: 'red',fontSize:18}}>Phone : </Text> 
                                <Text style={{flex:0.8,flexDirection: 'column',fontSize:18}}>{this.state.phone}</Text>

                        </View>
                        <View style={{flex:1,flexDirection: 'row',margin:10}}>
                                <Text   style={{flex:0.2,flexDirection: 'column',color: 'red',fontSize:18}}>Service : </Text> 
                                <Text style={{flex:0.8,flexDirection: 'column',fontSize:18}}>{this.state.service}</Text>

                        </View> 
                        <View style={{flex:1,flexDirection: 'row',margin:10}}>
                                <Text   style={{flex:0.3,flexDirection: 'column',color: 'red',fontSize:18}}>Comment : </Text> 
                                <Text style={{flex:0.7,flexDirection: 'column',fontSize:18}}>{this.state.comment}</Text>

                        </View>     
                            </ScrollView>
                        

                    </Modal>
                </View>
            </SafeAreaView>
        );
    }
}
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        marginLeft:16,
        marginRight:16,
        marginTop: 8,
        marginBottom: 8,
        borderRadius: 5,
        backgroundColor: '#000',
        elevation: 2,
    },
    title: {
        fontSize: 16,
        color: '#fff',
        marginRight: 10,
        flex:1,
        flexDirection: 'column'
    },
    heading:{ 
        flex:0.9,
        flexDirection: 'column',
        textAlign: 'center',

        marginTop:5,
        marginBottom:10,
        fontSize: 20,
        color: '#fff',
    },
    container_text: { 
        flex:1,
        flexDirection: 'column',
        marginLeft: 12, 
    },
    description: {
        fontSize: 14,
        color: '#fff',  
        fontStyle: 'italic',
        marginTop:10
    },
    photo: {
        height: 50,
        width: 50,
    },
    AndroidSafeArea: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    
    MainContainer: {
        flex: 1,
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
        marginTop: 10, 
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
export default Appointments;