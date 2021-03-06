import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity, 
  ScrollView,
  Platform,
  StatusBar,
  Modal, 
  Alert,
} from 'react-native'; 
import { Isao } from 'react-native-textinput-effects';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import config from '../../config'
import Icon from 'react-native-vector-icons/dist/Feather';  
import { TextInput } from 'react-native';

class EditAppointment extends React.Component {
  state = {
    date:this.props.date,
    time:this.props.time,
    name:this.props.name,
    phone:this.props.phone,
    comment:this.props.comment,
    service:this.props.service,
    email:this.props.email,
    serviceDuration:this.props.serviceDuration,
    errors:[],
    isDatePickerVisible:false,
    datePickerMode:'',
    counter:1
  };
     
  handleConfirm = (date) => {
    switch(this.state.datePickerMode)
    {
      case "time":
        this.setState({ time: this.tConvert(this.getCurrentTime(date)) })
        break;
      case "date":
        if(date<new Date())
                {
                    Alert.alert(
                        'Alert',
                        `Can't Book Appointment for a Past Date`,
                        [
                            { text: 'OK', onPress: () => console.log('OK Pressed') }
                        ],
                            { cancelable: true }
                    );
                }else
                {
                  this.setState({ date:date.getFullYear()+'-'+this.makeTwoDigits(date.getMonth()+1)+'-'+this.makeTwoDigits(date.getDate())})
                } 
        
        break;
    } 
    this.hideDatePicker();
};
makeTwoDigits = (time) => {
    const timeString = `${time}`;
    if (timeString.length === 2) return time
    return `0${time}`
}
getCurrentTime = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    // let seconds = date.getSeconds();
    hours = this.makeTwoDigits(hours);
    minutes = this.makeTwoDigits(minutes)
    // seconds = makeTwoDigits(seconds)
    return `${hours}:${minutes}`;
}
tConvert  = (time)=> {
    // Check correct time format and split into components
    time = time.toString().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  
    if (time.length > 1) { // If time format correct
      time = time.slice (1);  // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join (''); // return adjusted time or original string
  }
hideDatePicker = () => {
    this.setState({ isDatePickerVisible: false });
};

updateAppointment = () => {
    this.setState({ isBooking: true }) 
    fetch('https://www.tattbooking.com/tattey_app/appapis/appointment.php', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            updateAppointment: this.props.appoint_id,
            name: this.state.name,
            num: this.state.phone,
            date: this.state.date,
            time: this.state.time, 
            service: this.state.service,
            serviceDuration:this.state.serviceDuration,
            comment: this.state.comment,
            email: this.state.email.toLowerCase()
        })
    })
        .then((response) => {console.log(response);return response.json()})
        .then(result => { 
            if (Object.values(result)[0] === ("success")) { 
                Alert.alert(
                    'Appointment Updated',
                    `Appointment Details Changed Successfully`,
                    [ 
                      { text: 'OK', onPress: () => console.log('OK Pressed') }
                    ],
                    { cancelable: true }
                  ); 
                  this.props.updateStateAppointment(this.state.name,this.state.phone,this.state.comment,this.state.service,this.state.time,this.state.date,this.state.email,this.state.serviceDuration)
                  this.props.appoint_func() 
                  this.props.closeFunction();
                  this.props.appoint_modalOpenFunc();
            }

        })
        .catch((error) => {
            console.error(error);
        });
} 
isFormValid = () => {
    let errors = [];
    let error;

    if (this.isFormEmpty(this.state)) {
      error = { message: "Fill in all fields" };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else {
      return true;
    }
  };

  isFormEmpty = ({ time, date, name }) => {
    return (
      !time ||
      !date  ||
      !name.length  
    );
  };
  displayErrors = errors =>
  errors.map((error, i) => <Text key={i} style={{fontSize:15,color:'white'}}>{error.message}</Text>);

  render() {   
    return (
      <SafeAreaView style={styles.AndroidSafeArea}>
        <Modal
          style={styles.Model}
          animationType="slide"
          transparent={false}
          visible={this.props.isVisible}
          onRequestClose={this.props.closeFunction} // Used to handle the Android Back Button
          backdropOpacity={0}
          swipeToClose={true}
          // swipeDirection="left"
          onSwipe={this.props.closeFunction}
          onBackdropPress={this.props.closeFunction}>
          <ScrollView style={{backgroundColor: '#fff', paddingTop: 25,paddingBottom:25}}>
            <View style={styles.nameHeader}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}>
                  {/* <Image 
                                    style={{marginLeft:50,height:90,width:150}}
                                    source={LOGO}
                                        />   */}
                </View>

                <Icon
                  name="x"
                  size={20}
                  color="red"
                  onPress={this.props.closeFunction}
                  style={{
                    flex: 0.1,
                    flexDirection: 'column',
                    textAlign: 'right',
                    margin: 10,
                  }}
                />
              </View>

              {this.state.errors.length > 0 && (
                <View
                  style={{
                    color: 'white',
                    backgroundColor: '#000',
                    borderColor: '#000',
                    borderWidth: 2,
                    fontSize: 15,
                    flex: 1,
                    flexDirection: 'column',
                    paddingLeft: 10,
                    paddingRight: 10,
                  }}>
                  {this.displayErrors(this.state.errors)}
                </View>
              )}

              <Text
                style={{
                  marginLeft: 10,
                  color: '#000',
                  fontSize: 25,
                  textAlign: 'center',
                  marginTop: 10,
                  fontWeight: 'bold',
                }}>
                Appointment Details
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                marginLeft: 20,
                marginRight: 20,
              }}>
               
              <View style={{flex: 1, flexDirection: 'column', marginTop: 10}}>
                <View style={{flex: 1, flexDirection: 'column'}}> 

                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#000',
                        color: 'white',
                        padding: 10,
                        borderRadius: 5,
                        marginTop: 10,
                      }}
                      onPress={() =>
                        this.setState({isDatePickerVisible: true,datePickerMode:"date"})
                      }>
                      <Text style={{color: 'white', margin: 5}}>
                        Select Date{' '}
                      </Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                      isVisible={this.state.isDatePickerVisible}
                      mode={this.state.datePickerMode}
                      onConfirm={this.handleConfirm}
                      onCancel={this.hideDatePicker}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 15,
                      marginBottom:15,
                      fontSize: 20,
                    }}>
                    <Text>{this.state.date}</Text>
                  </View>
                </View>
              </View>
              <View style={{flex: 1, flexDirection: 'column', marginTop: 10}}>
                <View style={{flex: 1, flexDirection: 'column'}}> 

                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#000',
                        color: 'white',
                        padding: 10,
                        borderRadius: 5,
                        marginTop: 10,
                      }}
                      onPress={() =>
                        this.setState({isDatePickerVisible: true,datePickerMode:"time"})
                      }>
                      <Text style={{color: 'white', margin: 5}}>
                        Select Time{' '}
                      </Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                      isVisible={this.state.isDatePickerVisible}
                      mode={this.state.datePickerMode}
                      onConfirm={this.handleConfirm}
                      onCancel={this.hideDatePicker}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 15,
                      marginBottom:15,
                      fontSize: 20,
                    }}>
                    <Text>{this.state.time}</Text>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                marginLeft: 20,
                marginRight: 20,
              }}>
              {/* <View style={{flex:0.2,flexDirection: "column"}}><Text style={{ fontSize:15,color:"black",marginTop:35}}>Contact </Text></View>     */}
              <View style={{flex: 1, flexDirection: 'column'}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <View style={{flex: 1, flexDirection: 'column'}}>
                    <TextInput
                      placeholder={'Name*'}
                       
                      // active border height 
                      onChangeText={(text) => {
                        this.setState({name: text});
                      }}
                       
                     
                      defaultValue={this.state.name}
                      style={{borderColor:"#000",borderWidth:1,marginBottom:15,
    marginTop:15,
    padding:10,
    paddingLeft:15,borderRadius:5}}
                    />
                  </View>
                  {/* <View style={{flex:0.35,flexDirection: "column",alignText:"center"}}>
                                                            
                                                        <TouchableOpacity
                                                        style={{backgroundColor:"#000",color:"white",padding:5,borderRadius:5,marginRight:10}}
                                                        onPress={() => this.setState({ isDatePickerVisible: true })}>
                                                            <Text style={{color:"white",margin:5,alignText:"center"}}>Select Time</Text>
                                                        </TouchableOpacity>
                                                    </View>     */}
                </View>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                marginLeft: 20,
                marginRight: 20,
              }}>
              {/* <View style={{flex:0.2,flexDirection: "column"}}><Text style={{ fontSize:15,color:"black",marginTop:35}}>Phone </Text></View>     */}
              <View style={{flex: 1, flexDirection: 'column'}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <View style={{flex: 1, flexDirection: 'column'}}>
                    <TextInput
                      placeholder={'Phone'} 
                      onChangeText={(text) => {
                        this.setState({phone: text});
                      }} 
                      defaultValue={this.state.phone}
                      style={{borderColor:"#000",borderWidth:1,marginBottom:15,
    marginTop:15,
    padding:10,
    paddingLeft:15,borderRadius:5}}
                    />
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                marginLeft: 20,
                marginRight: 20,
              }}>
              {/* <View style={{flex:0.2,flexDirection: "column"}}><Text style={{ fontSize:15,color:"black",marginTop:35}}>Phone </Text></View>     */}
              <View style={{flex: 1, flexDirection: 'column'}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <View style={{flex: 1, flexDirection: 'column'}}>
                    <TextInput
                      placeholder={'Email'} 
                      onChangeText={(text) => {
                        this.setState({email: text});
                      }}
                     
                      style={{borderColor:"#000",borderWidth:1,marginBottom:15,
    marginTop:15,
    padding:10,
    paddingLeft:15,borderRadius:5}}
                      defaultValue={this.state.email}
                    />
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                marginLeft: 20,
                marginRight: 20,
              }}>
              {/* <View style={{flex:0.2,flexDirection: "column"}}><Text style={{ fontSize:15,color:"black",marginTop:35}}>Service </Text></View>     */}
              <View style={{flex: 1, flexDirection: 'column'}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <View style={{flex: 1, flexDirection: 'column'}}>
                    <TextInput
                      placeholder={'Service'}
                      
                      onChangeText={(text) => {
                        this.setState({service: text});
                      }}
                      style={{borderColor:"#000",borderWidth:1,marginBottom:15,
    marginTop:15,
    padding:10,
    paddingLeft:15,borderRadius:5}}
                      defaultValue={this.state.service}
                    />
                  </View>
                  {/* <View style={{flex:0.35,flexDirection: "column",alignText:"center"}}>
                                                             
                                                            <TouchableOpacity
                                                            style={{backgroundColor:"#000",color:"white",padding:5,borderRadius:5,marginRight:10}}
                                                            onPress={() => this.setState({ isDatePickerVisible: true })}>
                                                                <Text style={{color:"white",margin:5,alignText:"center"}}>Select Time</Text>
                                                            </TouchableOpacity>
                                                        </View>     */}
                </View>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                marginLeft: 20,
                marginRight: 20,
              }}>
              {/* <View style={{flex:0.2,flexDirection: "column"}}><Text style={{ fontSize:15,color:"black",marginTop:35}}>Service </Text></View>     */}
              <View style={{flex: 1, flexDirection: 'column'}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <View style={{flex: 1, flexDirection: 'column'}}>
                    <TextInput
                      placeholder={'Service Duration'} 
                      onChangeText={(text) => {this.setState({serviceDuration: text});}}
                      style={{borderColor:"#000",borderWidth:1,marginBottom:15,marginTop:15,padding:10,paddingLeft:15,borderRadius:5}}
                      defaultValue={this.state.serviceDuration}
                    />
                  </View>
                  {/* <View style={{flex:0.35,flexDirection: "column",alignText:"center"}}>
                                                             
                                                            <TouchableOpacity
                                                            style={{backgroundColor:"#000",color:"white",padding:5,borderRadius:5,marginRight:10}}
                                                            onPress={() => this.setState({ isDatePickerVisible: true })}>
                                                                <Text style={{color:"white",margin:5,alignText:"center"}}>Select Time</Text>
                                                            </TouchableOpacity>
                                                        </View>     */}
                </View>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                marginLeft: 20,
                marginRight: 20,
              }}>
              {/* <View style={{flex:0.2,flexDirection: "column"}}><Text style={{ fontSize:15,color:"black",marginTop:35}}>Comment </Text></View>     */}
              <View style={{flex: 1, flexDirection: 'column'}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <View style={{flex: 1, flexDirection: 'column'}}>
                    <TextInput
                      placeholder={'Comment'}
                    
                      onChangeText={(text) => {
                        this.setState({comment: text});
                      }}
                      style={{borderColor:"#000",borderWidth:1,marginBottom:15,
    marginTop:15,
    padding:10,
    paddingLeft:15,borderRadius:5}}
                      
                      defaultValue={this.state.comment}
                    />
                  </View>
                  {/* <View style={{flex:0.35,flexDirection: "column",alignText:"center"}}>
                                                             
                                                            <TouchableOpacity
                                                            style={{backgroundColor:"#000",color:"white",padding:5,borderRadius:5,marginRight:10}}
                                                            onPress={() => this.setState({ isDatePickerVisible: true })}>
                                                                <Text style={{color:"white",margin:5,alignText:"center"}}>Select Time</Text>
                                                            </TouchableOpacity>
                                                        </View>     */}
                </View>
              </View>
            </View>
            {/* <DateTimePickerModal
              isVisible={this.state.isDatePickerVisible}
              mode="time"
              onConfirm={this.handleConfirm}
              onCancel={this.hideDatePicker}
            /> */}

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 5,
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#000',
                  color: 'white',
                  padding: 10,
                  borderRadius: 5,
                  marginTop: 10,
                  marginBottom:35
                }}
                onPress={() =>
                  this.isFormValid() ? this.updateAppointment() : null
                }
                >
                <Text style={{color: 'white', margin: 5}}>
                  Edit Appointment
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Modal>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
    AndroidSafeArea: {
        flex: 1,
        backgroundColor: config.app.color.primaryColor,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      
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
export default EditAppointment;
