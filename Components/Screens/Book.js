import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Platform, StatusBar, Image,Modal, TouchableOpacity,TextInput, Button, ActivityIndicator, Dimensions,Alert } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import config from '../../config'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Notification from "../service/Notification/Notification"
import CardView from 'react-native-cardview'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Isao } from 'react-native-textinput-effects';
import DefaultPreference from 'react-native-default-preference';
import Icon from 'react-native-vector-icons/dist/Feather'; 

const LOGO = require('../../assets/img/logo_black.png')
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import moment from 'moment';
class Book extends React.Component {
    state = {
        selectedStartDate: null,
        modalVisible: false,
        name: "",
        phone: "",
        time: '',
        service:'',
        comment:"",
        isDatePickerVisible: false,
        isBooking: false,
        errors:[],
        appointment:this.props.appointment,
        counter:this.props.counter

    };
componentDidMount() {
    if (Platform.OS === 'android') DefaultPreference.setName('NativeStorage');
    DefaultPreference.get('name').then((value)=>{
        
        if(value!=null)
        {
            this.setState({name: value});
        }
        
    })
    DefaultPreference.get('phone').then((value)=>{ 
        if(value!=null)
        {
            this.setState({phone: value});
        }
        
    })
}
    onDateChange(date) {
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
        }
        else
        {
            this.setState({
                selectedStartDate: date,
                modalVisible: true
            });
        }
        
    }
    onDateChange = this.onDateChange.bind(this);
    closeModal = () => {
        this.setState({
            modalVisible: false
        })
    }
    customDatesStylesCallback = date => { 
        var d = new Date(date);
        var formatted_date = d.getFullYear()+"-"+(this.makeTwoDigits(d.getMonth()+1))+"-"+this.makeTwoDigits(d.getDate());
      
        // console.log(formatted_date)
        // console.log(this.props.appointment)
        if(this.state.appointment.includes(formatted_date))
        {
            return {
                style:{
                  backgroundColor: 'grey',
                },
                textStyle: {
                  color: 'white',
                  fontWeight: 'bold',
                }
              };
        }
        
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
    makeTwoDigits = (time) => {
        const timeString = `${time}`;
        if (timeString.length === 2) return time
        return `0${time}`
    }
    hideDatePicker = () => {
        this.setState({ isDatePickerVisible: false });
    };

    handleConfirm = (date) => {
        this.setState({ time: this.tConvert(this.getCurrentTime(date)) })
        this.hideDatePicker();
    };
      tConvert  = (time)=> {
        // Check correct time format and split into components
        time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
      
        if (time.length > 1) { // If time format correct
          time = time.slice (1);  // Remove full string match value
          time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
          time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join (''); // return adjusted time or original string
      }
    bookAppointment = () => {
        this.setState({ isBooking: true }) 
        fetch('https://www.tattbooking.com/tattey_app/appapis/appointment.php', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                isAppointment: true,
                name: this.state.name,
                num: this.state.phone,
                date: this.state.selectedStartDate,
                time: this.state.time,
                temp_user: this.props.user,
                service: this.state.service,
                comment: this.state.comment
            })
        })
            .then((response) => response.json())
            .then(result => { 
                if (Object.values(result)[0] === ("sucesss")) {

                    DefaultPreference.set('name',this.state.name);
                    DefaultPreference.set('phone',this.state.phone);
                    Alert.alert(
                        'Tattoo Appointment Booked',
                        `Appointment Booked on ${new Date(this.state.selectedStartDate).toDateString()} at ${this.state.time}`,
                        [ 
                          { text: 'OK', onPress: () => console.log('OK Pressed') }
                        ],
                        { cancelable: true }
                      );
                    // console.log(new Date(new Date(this.state.selectedStartDate).getDate()+` ${this.state.time}`).toLocaleDateString())
                    var d = new Date(this.state.selectedStartDate);
                    var t = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+(d.getDate()-1)+" 12:00 PM"; 
                    var tt = moment(t, "YYYY-MM-DD HH:mm a");  
                    var formatted_oneDay = new Date(tt); 
                    var times = this.state.time.split(":");
                    var hours  = times[0]-2;
                    t = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+(d.getDate())+" "+`${hours}:${times[1]}`;     
                      tt = moment(t, "YYYY-MM-DD HH:mm a");  
                    var formatted_2hour = new Date(tt); 
                    Notification(new Date().getTime(), "Tatt Booking", `Appointment  Booked on ${new Date(this.state.selectedStartDate).toDateString()} at ${this.state.time}`)
                    Notification(formatted_oneDay.getTime(), "Tatt Booking", `Appointment Booked on ${new Date(this.state.selectedStartDate).toDateString()} at ${this.state.time}`)
                    // Notification(formatted_2hour.getTime(), "Tattey", `Appointment at Tattey Booked on ${new Date(this.state.selectedStartDate).toDateString()} at ${this.state.time}`)
                    this.setState({ name:"",phone:"",time:"",service:"",comment:"",selectedStartDate:"",isBooking: false, modalVisible: false,counter:1,appointment:[] })
                    this.props.appoint_func() 
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
      isFormEmpty = ({ time, selectedStartDate, name, phone }) => {
        return (
          !time.length ||
          !selectedStartDate  ||
          !name.length ||
          !phone.length
        );
      };
      displayErrors = errors =>
      errors.map((error, i) => <Text key={i} style={{fontSize:15}}>{error.message}</Text>);
    

      componentDidUpdate(prevProps, prevState) { 
 
       
          if(this.props.appointment.length >0 && (this.state.counter==1 || (this.props.appointment.length - prevState.appointment.length)>0))
          { 
            
              this.setState({appointment:this.props.appointment,counter:2})
              this.renderClalender(this.state.appointment)
          }
      }
      renderClalender =(appointment)=>{
         
         
            return (                   
                <CalendarPicker
                key={appointment.length}
                style={{ margin: 10 }}
                onDateChange={this.onDateChange}
                // minDate={new Date()} 
                selectedDayColor={"red"}  
                customDatesStyles={this.customDatesStylesCallback}  
            /> )
         
           
      }
    render() {
        const { selectedStartDate, time } = this.state;
        const startDate = selectedStartDate ? selectedStartDate.toString() : ''; 
        // console.log(this.state.appointment)
        return (
            <SafeAreaView style={styles.AndroidSafeArea}  >
                {this.state.isBooking ? (
                    <View style={{flex:1, flexDirection:"column",alignItems: "center",justifyContent: "center"}}>
                    <ActivityIndicator
                        style={{ flex:0.8, flexDirection:"column",}}
                        size="large"
                        color="red"
                    />  
                </View>
                ) : (
                        <ScrollView  >
                            <View style={{ ...styles.nameHeader,  marginTop: 0 }}>
                                <Text style={{fontSize:25,fontWeight:"bold"}}>Booking</Text>
                                <Text style={{ color: "red",   fontSize: 15 }}>Select A Date for Appointment</Text>
                            </View> 
                            {this.renderClalender(this.state.appointment)} 
                            <View>
                                <Modal
                                    style={styles.Model}
                                    animationType="slide"
                                    transparent={false}
                                    visible={this.state.modalVisible}
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
                                    {/* <Image 
                                        style={{marginLeft:50,height:90,width:150}}
                                        source={LOGO}
                                            />   */}

                                    </View>
                                        
                                    <Icon name="x-circle" size={20} color="red"  onPress={() =>this.setState({modalVisible:false})} style={{flex:0.1,flexDirection: 'column',textAlign:"right",margin:10}} />
                                  
                                </View>
                                            
                                            {this.state.errors.length > 0 && (
                                                <View style={{color: "#721c24",
                                                    backgroundColor:"#f8d7da",
                                                    borderColor: "#f5c6cb",
                                                    borderWidth:2,fontSize:15,flex:1,flexDirection:"column",paddingLeft:10,paddingRight:10}}>
                                           
                                                {this.displayErrors(this.state.errors)}
                                                </View>
                                            )}
                                            
                                            <Text style={{ marginLeft: 10, color: "#000", fontSize: 25,textAlign: "center",marginTop:10,fontWeight: "bold"}}>Appointment Details</Text>
                                        </View>
                                        <View style={{flex:1,flexDirection: "row",marginLeft:20,marginRight:20}}>  
                                            {/* <View style={{flex:0.2,flexDirection: "column"}}><Text style={{ fontSize:15,color:"black",marginTop:35}}>Phone </Text></View>     */}
                                            <View style={{flex:1,flexDirection: "column",marginTop:10}}>
                                                    <View style={{flex:1,flexDirection: "row"}}>

                                                    <View style={{flex:0.3,flexDirection: "column"}}>
                                                            <Text>
                                                                Time
                                                            </Text>
                                                        </View>
                                                        <View style={{flex:0.6,flexDirection: "column"}}>
                                                            <Text>
                                                                {this.state.time}
                                                            </Text>
                                                        </View>

                                                        <View style={{flex:0.4,flexDirection: "column"}}>

                                                               
                                                                <TouchableOpacity
                                                                    style={{backgroundColor:"#000",color:"white",padding:10,borderRadius:5,marginTop:10}}
                                                                    onPress={() => this.setState({isDatePickerVisible:true})}>
                                                                        <Text style={{color:"white",margin:5}}>Select Time </Text>
                                                                </TouchableOpacity>
                                                                <DateTimePickerModal
                                                                    isVisible={this.state.isDatePickerVisible}
                                                                    mode="time"
                                                                    onConfirm={this.handleConfirm}
                                                                    onCancel={this.hideDatePicker}
                                                                /> 
                                                        </View>
                                                         
                                                    </View>    
                                            </View>    
                                            
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
                                                                    // this is applied as passive border and label color
                                                                    passiveColor={'#dadada'}
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
                                        <View style={{flex:1,flexDirection: "row",marginLeft:20,marginRight:20}}>  
                                            {/* <View style={{flex:0.2,flexDirection: "column"}}><Text style={{ fontSize:15,color:"black",marginTop:35}}>Phone </Text></View>     */}
                                            <View style={{flex:1,flexDirection: "column"}}>
                                                    <View style={{flex:1,flexDirection: "row"}}>
                                                        <View style={{flex:1,flexDirection: "column"}}>

                                                                <Isao
                                                                    label={'Phone*'}
                                                                    // this is applied as active border and label color
                                                                    activeColor={'#da7071'}
                                                                    // active border height
                                                                    borderHeight={2}
                                                                    inputPadding={16}
                                                                    onChangeText={(text)=>{this.setState({phone: text})}}
                                                                    labelHeight={24}
                                                                    // this is applied as passive border and label color
                                                                    passiveColor={'#dadada'}
                                                                />
                                                             
                                    
                                                        </View>
                                                         
                                                    </View>    
                                            </View>    
                                            
                                        </View>
                                         <View style={{flex:1,flexDirection: "row",marginLeft:20,marginRight:20}}>  
                                            {/* <View style={{flex:0.2,flexDirection: "column"}}><Text style={{ fontSize:15,color:"black",marginTop:35}}>Service </Text></View>     */}
                                            <View style={{flex:1,flexDirection: "column"}}>
                                                    <View style={{flex:1,flexDirection: "row"}}>
                                                        <View style={{flex:1,flexDirection: "column"}}>

                                                             
                                                             <Isao
                                                                    label={'Service'}
                                                                    // this is applied as active border and label color
                                                                    activeColor={'#da7071'}
                                                                    // active border height
                                                                    borderHeight={2}
                                                                    inputPadding={16}
                                                                    onChangeText={(text)=>{this.setState({service: text})}}
                                                                    labelHeight={24}
                                                                    // this is applied as passive border and label color
                                                                    passiveColor={'#dadada'}
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
                                        <View style={{flex:1,flexDirection: "row",marginLeft:20,marginRight:20}}>  
                                            {/* <View style={{flex:0.2,flexDirection: "column"}}><Text style={{ fontSize:15,color:"black",marginTop:35}}>Comment </Text></View>     */}
                                            <View style={{flex:1,flexDirection: "column"}}>
                                                    <View style={{flex:1,flexDirection: "row"}}>
                                                        <View style={{flex:1,flexDirection: "column"}}>

                                                        <Isao
                                                                    label={'Comment'}
                                                                    // this is applied as active border and label color
                                                                    activeColor={'#da7071'}
                                                                    // active border height
                                                                    borderHeight={2}
                                                                    inputPadding={16}
                                                                    onChangeText={(text)=>{this.setState({comment: text})}}
                                                                    labelHeight={24}
                                                                    // this is applied as passive border and label color
                                                                    passiveColor={'#dadada'}
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
                                    <DateTimePickerModal
                                        isVisible={this.state.isDatePickerVisible}
                                        mode="time"
                                        onConfirm={this.handleConfirm}
                                        onCancel={this.hideDatePicker}
                                    />
                                     
                                     
                                    <View style={{flex: 1,flexDirection:"row",alignItems: "center",justifyContent: "center",marginTop:5}}> 
                                            <TouchableOpacity
                                                style={{backgroundColor:"#000",color:"white",padding:10,borderRadius:5,marginTop:10}}
                                                onPress={() => this.isFormValid()?this.bookAppointment():(null)}>
                                                    <Text style={{color:"white",margin:5}}>Book Appointment</Text>
                                            </TouchableOpacity>
                                    </View> 

                                        </ScrollView>
                                    

                                </Modal>
                            </View>
                        </ScrollView>

                    )}
            </SafeAreaView>
        );
    }
}
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

export default Book;
