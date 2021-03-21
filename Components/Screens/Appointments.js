import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Platform,
  StatusBar,
  Modal,
  TextInput,
  Image,
  ActivityIndicator,
  Dimensions,
  FlatList,
  Alert,
} from 'react-native';
import config from '../../config';
import RNFetchBlob from 'rn-fetch-blob';
import Icon from 'react-native-vector-icons/dist/Feather';
import EditAppointment from './EditAppointment';

class Appointments extends React.Component {
  state = {
      item: {
        id: '',
        date: '',
        time: '',
        status: '',
        loader: 'notloading',
      },
      
      date: '',
      time:'',
      h: '',
      m: '',
      name: '',
      phone: '',
      status: '',
      email:"",
      isVisible: false,
      loading: true,
      cur_appointment_id: null,
      editModalVisible:false,
      paymentStatus:''
  };

  display_no_appointmentMessage = () => {
    if (this.props.rowCount == 0) {
      this.setState({loading: false});
    }
  };
  capitalizeFirstLetter = (str) => {
    if (str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
    return str;
    //
  };
  cancelAppointment = (id, date, time, status) => { 
    fetch('https://www.tattbooking.com/tattey_app/appapis/appointment.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cancelAppointment: true,
        appoint_id: id,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.msg == 'sucesss') { 
          this.setState({
            item: {
              id: id,
              date: date,
              time: time,
              status: 'Cancelled',
              loader: 'notloading',
            },
          });
          this.props.functionAppointments();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  cancelAppointmentAlert = (id, date, time, status) => {
    Alert.alert(
      'Cancel Appointment',
      `Do You Really Want to Cancel Your Appointment Booked on ${date} at ${time}`,
      [
        {
          text: 'Yes',
          onPress: () => {
            this.cancelAppointment(id, date, time, status);
          },
        },
        {text: 'No', onPress: () => {}},
      ],
      {cancelable: true},
    );
  };
  closeModal = () => {
    this.setState({
      isVisible: false,
    });
  };
  showAppointmentDetails = (item) => {
    this.setState({
      date: item.date,
      status: item.status,
      time: item.time,
      name: item.name,
      phone: item.m_number,
      service: item.service,
      comment: item.comment,
      email:item.email,
      isVisible: true,
      cur_appointment_id: item.id,
      paymentStatus:item.payment_status
    });
  };

  renderStatusButton = (status) => {
    switch (status) {
      case 'pending':
        return 'Confirm Appointment';
      case 'confirmed':
        return 'Mark Pending';
    }
  };
  renderStatusPayButton = (status) => {
    switch (status) {
      case '0':
        return 'Confirm Deposit';
      case '1':
        return 'Not Deposited';
    }
  };
  CustomRow = (item) => {
    var backgroundcolor = "";  
    var color ='';
    switch (item.status)
    {
        case"pending":
        backgroundcolor = "#FFFF0080"; 
         
            break;
        case "complete":
          backgroundcolor = "#39FF1480";
         
            break;
        case "confirmed":
          backgroundcolor = "#39FF1480";
        
            break;
        case "cancelled":    
        backgroundcolor = "#FF000080";
    
            break;
    }
    color="#000";
    return(<TouchableWithoutFeedback onPress={() => this.showAppointmentDetails(item)}>
      <View style={{...styles.container,backgroundColor:backgroundcolor}}>
        <View style={styles.container_text}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Text style={{...styles.heading,color:color}}>
              {this.capitalizeFirstLetter(item.name)}
            </Text>
            <Icon
              style={{flex: 0.1}}
              size={20}
              color="red"
              name="x"
              onPress={() => {
                this.cancelAppointmentAlert(
                  item.id,
                  item.date,
                  item.time,
                  item.status,
                );
              }}
            />
          </View>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Text style={{...styles.title,color:color}}>Date : {item.date}</Text>
            <Text
              style={{
                marginRight: 10,
                flexDirection: 'column',
                flex: 1,
                color: 'white',
                textAlign: 'right',
                color:color
              }}>
              Status : {this.capitalizeFirstLetter(item.status)}
            </Text>
          </View>
          <Text style={{...styles.description,color:color}}>Time : {item.time}</Text>
        </View>
        <View></View>
      </View>
    </TouchableWithoutFeedback>);
  }
  componentDidMount() {
    this.props.functionAppointments();
    setTimeout(() => {
      if (this.props.appointments && !this.props.appointments.length) {
        setTimeout(this.display_no_appointmentMessage, 5000);
      } else {
        this.setState({loading: false});
      } 
    }, 3000);
  }
  renderEmptyComponent = () => {
    return (
      <View
        style={{
          color: 'white',
          backgroundColor: '#000',
          borderColor: '#000',
          borderWidth: 2,
          fontSize: 15,
          flex: 0.5,
          flexDirection: 'column',
          paddingLeft: 10,
          paddingRight: 10,
          marginTop: 10,
          paddingTop: 5,
          paddingBottom: 5,
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          margin: 30,
        }}>
        <Text style={{fontSize: 15,color: 'white'}}>No Appointments Available</Text>
      </View>
    );
  };
  processAppointmentRequest = () => { 
    RNFetchBlob.fetch(
      'POST',
      'https://www.tattey.com/tattey_app/appapis/appointment.php',
      {
        Authorization: 'Bearer access-token',
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      [
        {name: 'processAppointmentRequest', data: 'true'},
        {name: 'appointment_idProcess', data: this.state.cur_appointment_id},
        {name: 'appoint_status', data: this.state.status},
      ],
    )
      .then((resp) => { 
        var tempMSG = JSON.parse(resp.data);

        if (tempMSG.msg === 'success') {
          Alert.alert('Request Processed Successfully');
          this.props.functionAppointments();
          this.setState({status: tempMSG.status});
          console.log(tempMSG.status)
        } else {
          Alert.alert(tempMSG.msg);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  
  processAppointmentPaymentRequest = () => { 
    RNFetchBlob.fetch(
      'POST',
      'https://www.tattey.com/tattey_app/appapis/appointment.php',
      {
        Authorization: 'Bearer access-token',
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      [
        {name: 'processAppointmentPaymentRequest', data: 'true'},
        {name: 'appointment_idProcess', data: this.state.cur_appointment_id},
        {name: 'appoint_status', data: this.state.paymentStatus},
      ],
    )
      .then((resp) => { 
        var tempMSG = JSON.parse(resp.data); 
        if (tempMSG.msg === 'success') {
          Alert.alert('Request Processed Successfully');
          this.props.functionAppointments();
          this.setState({paymentStatus: tempMSG.status});
        } else {
          Alert.alert(tempMSG.msg);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  
  sendReminder = () => { 
    RNFetchBlob.fetch(
      'POST',
      'https://www.tattbooking.com/tattey_app/appapis/appointment.php',
      {
        Authorization: 'Bearer access-token',
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      [
        {name: 'sendReminder', data: 'true'},
        {name: 'name', data: this.state.name},
        {name: 'phone', data: this.state.phone},
        {name: 'date', data: this.state.date},
        {name: 'time', data: this.state.time},
        {name: 'email', data: ""+this.state.email},
      ],
    )
      .then((resp) => { 
        console.log(resp)
        var tempMSG = JSON.parse(resp.data);
     
        if (tempMSG.msg === 'success') {
          Alert.alert('Reminder Sent  Successfully');
          this.props.functionAppointments(); 
        } else {
          Alert.alert("Unable to Send notification");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  openAppointmentModal=()=> {
    this.setState({isVisible:true});
  }
  closeEditModal = ()=>
  {
      this.setState({editModalVisible:false})
  }
  updateStateAppointment = (name,phone,comment,service,time,date,email)=>
  {
        this.setState({name:name,phone:phone,comment:comment,service:service,time:time,date:date,email:email})
  }
  render() {
    return (
      <SafeAreaView style={styles.AndroidSafeArea}>
        {this.state.loading ? (
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ActivityIndicator
              style={{flex: 0.8, flexDirection: 'column'}}
              size="large"
              color="red"
            />
          </View>
        ) : (
          <View style={styles.Maincontainer}>
            <Text style={styles.nameHeading}>Booked Appointments </Text>
            <FlatList
              extras={this.state.item}
              data={this.props.appointments}
              renderItem={({item}) => this.CustomRow(item)}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={this.renderEmptyComponent}
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
            <ScrollView style={{backgroundColor: '#fff', paddingTop: 25}}>
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
                    onPress={() => this.setState({isVisible: false})}
                    style={{
                      flex: 0.1,
                      flexDirection: 'column',
                      textAlign: 'right',
                      margin: 10,
                    }}
                  />
                </View>

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
                    marginTop: 10,
                    paddingTop: 5,
                    paddingBottom: 5,
                  }}>
                  <Text style={{fontSize: 15,color: 'white'}}>
                    {this.capitalizeFirstLetter(this.state.status)}
                  </Text>
                </View>
                <View style={{flex: 1, flexDirection: 'row', margin: 10}}>
                  <Text
                    style={{
                      marginLeft: 10,
                      color: '#000',
                      fontSize: 25,
                      textAlign: 'center', 
                      fontWeight: 'bold',
                    }}>
                    Appointment Details{' '}
                    
                  </Text>
                   

                </View>
                
              </View>
              <View style={{flex: 1, flexDirection: 'row', margin: 10}}>
                <Text
                  style={{
                    flex: 0.15,
                    flexDirection: 'column',
                    color: 'black',
                    fontSize: 18,
                  }}>
                  Date :{' '}
                </Text>
                <Text
                  style={{flex: 0.8, flexDirection: 'column', fontSize: 18}}>
                  {new Date(this.state.date).toDateString()}
                </Text>
              </View>
              <View style={{flex: 1, flexDirection: 'row', margin: 10}}>
                <Text
                  style={{
                    flex: 0.15,
                    flexDirection: 'column',
                    color: 'black',
                    fontSize: 18,
                  }}>
                  Time :{' '}
                </Text>
                <Text
                  style={{flex: 0.8, flexDirection: 'column', fontSize: 18}}>
                  {this.state.time}
                </Text>
              </View>
              <View style={{flex: 1, flexDirection: 'row', margin: 10}}>
                <Text
                  style={{
                    flex: 0.21,
                    flexDirection: 'column',
                    color: 'black',
                    fontSize: 18,
                  }}>
                  Contact :{' '}
                </Text>
                <Text
                  style={{flex: 0.8, flexDirection: 'column', fontSize: 18}}>
                  {this.capitalizeFirstLetter(this.state.name)}
                </Text>
              </View>
              <View style={{flex: 1, flexDirection: 'row', margin: 10}}>
                <Text
                  style={{
                    flex: 0.2,
                    flexDirection: 'column',
                    color: 'black',
                    fontSize: 18,
                  }}>
                  Phone :{' '}
                </Text>
                <Text
                  style={{flex: 0.8, flexDirection: 'column', fontSize: 18}}>
                  {this.state.phone}
                </Text>
              </View>
              <View style={{flex: 1, flexDirection: 'row', margin: 10}}>
                <Text
                  style={{
                    flex: 0.21,
                    flexDirection: 'column',
                    color: 'black',
                    fontSize: 18,
                  }}>
                  Email :{' '}
                </Text>
                <Text
                  style={{flex: 0.8, flexDirection: 'column', fontSize: 18}}>
                  {this.state.email}
                </Text>
              </View>
              
              <View style={{flex: 1, flexDirection: 'row', margin: 10}}>
                <Text
                  style={{
                    flex: 0.2,
                    flexDirection: 'column',
                    color: 'black',
                    fontSize: 18,
                  }}>
                  Service :{' '}
                </Text>
                <Text
                  style={{flex: 0.8, flexDirection: 'column', fontSize: 18}}>
                  {this.capitalizeFirstLetter(this.state.service)}
                </Text>
              </View>
              <View style={{flex: 1, flexDirection: 'row', margin: 10}}>
                <Text
                  style={{
                    flex: 0.26,
                    flexDirection: 'column',
                    color: 'black',
                    fontSize: 18,
                  }}>
                  Comment :{' '}
                </Text>
                <Text
                  style={{flex: 0.7, flexDirection: 'column', fontSize: 18}}>
                  {this.capitalizeFirstLetter(this.state.comment)}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  margin: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#000',
                    color: 'white',
                    padding: 10,
                    borderRadius: 5,
                    alignSelf:"stretch",
                    marginTop: 10,
                  }}
                  onPress={() => this.processAppointmentRequest()}>
                  <Text style={{color: 'white', margin: 5,textAlign: 'center'}}>
                    {this.renderStatusButton(this.state.status)}{' '}
                  </Text>
                </TouchableOpacity>
                {this.props.deposits==1?(


                        <TouchableOpacity
                        style={{
                          backgroundColor: '#000',
                          color: 'white', 
                          alignSelf:"stretch",
                          padding: 10,
                          borderRadius: 5,
                          marginTop: 10, 
                        }}
                        onPress={() => this.processAppointmentPaymentRequest()}>
                        <Text style={{color: 'white', margin: 5,textAlign: 'center'}}>
                          {this.renderStatusPayButton(this.state.paymentStatus)}{' '} 
                        </Text>
                        </TouchableOpacity>

                ):(null)}
                <TouchableOpacity
                  style={{
                    backgroundColor: '#000',
                    color: 'white',
                    padding: 10,
                    borderRadius: 5,
                    marginTop: 10, 
                    alignSelf:"stretch",  
                  }}
                  onPress={() => this.sendReminder()}>
                  <Text style={{color: 'white', margin: 5,textAlign: 'center'}}>
                      Send Reminder
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#000',
                    color: 'white',
                    padding: 10,
                    borderRadius: 5,
                    marginTop: 10, 
                    alignSelf:"stretch", 
                    marginBottom: 20,
                  }}
                  onPress={() => {this.setState({editModalVisible:true,isVisible:false})}}>
                  <Text style={{color: 'white', margin: 5,textAlign: 'center'}}>
                      Edit Appointment
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Modal>
        </View>
        {this.state.editModalVisible?(
                    
                    <EditAppointment 
                        closeFunction={this.closeEditModal} 
                        date={this.state.date} 
                        name={this.state.name}
                        time={this.state.time} 
                        phone={this.state.phone} 
                        comment={this.state.comment}
                        email={this.state.email} 
                        service={this.state.service}
                        appoint_id={this.state.cur_appointment_id}
                        updateStateAppointment={this.updateStateAppointment}
                        appoint_func={this.props.functionAppointments}
                        isVisible={this.state.editModalVisible}
                        appoint_modalOpenFunc = {this.openAppointmentModal}
                        appoint_modalCloseFunc ={this.closeModal}
                        
                    />

        ):(null)}
        
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    marginLeft: 16,
    marginRight: 16,
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
    flex: 1,
    flexDirection: 'column',
  },
  heading: {
    flex: 0.9,
    flexDirection: 'column',
    textAlign: 'center',

    marginTop: 5,
    marginBottom: 10,
    fontSize: 20,
    color: '#fff',
  },
  container_text: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 12,
  },
  description: {
    fontSize: 14,
    color: '#fff',
    fontStyle: 'italic',
    marginTop: 10,
  },
  photo: {
    height: 50,
    width: 50,
  },
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  MainContainer: {
    flex: 1,
  },
  Model: {
    height: 50,
    width: 100,
    backgroundColor: config.app.color.primaryColor,
  },

  nameHeading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  subheading: {
    fontWeight: 'bold',
    color: 'red',
    fontSize: 15,
  },
  nameHeader: {
    marginTop: 10,
    textAlign: 'center',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateColumn: {
    flex: 0.1,
    flexDirection: 'row',
    margin: 10,
  },
  innerDateText: {
    color: 'red',
    fontSize: 18,
  },
  outerDateText: {
    fontSize: 18,
    color: '#000',
    marginRight: 20,
  },
});
export default Appointments;
