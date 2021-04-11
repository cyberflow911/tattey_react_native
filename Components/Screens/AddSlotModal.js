import React from 'react';
import {Modal, Text, TextInput, TouchableOpacity,StyleSheet,ScrollView,View,ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/dist/Feather'; 
import ModalDropdown from 'react-native-modal-dropdown';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RNFetchBlob from 'rn-fetch-blob';
import Toast from 'react-native-simple-toast'; 

class AddSlotModal extends React.Component {
  state = {

    datePickerMode:'',
    isDatePickerVisible:false,
    startTime:'',
    endTime:'',
    weekDay: '',
    isLoading:false,
    errors:[]

    };  
    weekDays = ['Mon', 'Tues','Wed','Thur','Fri', 'Sat', 'Sun'];
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
        time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    
        if (time.length > 1) { // If time format correct
        time = time.slice (1);  // Remove full string match value
        time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join (''); // return adjusted time or original string
    }
    handleConfirm = (date) => {
        switch (this.state.datePickerMode)
        {
            case 'start':
                this.setState({ startTime: this.tConvert(this.getCurrentTime(date)) })
                break;
            case 'end': 
                this.setState({ endTime: this.tConvert(this.getCurrentTime(date)) })
                break;
        }   
        this.hideDatePicker();
    };


    makeTwoDigits = (time) => {
        const timeString = `${time}`;
        if (timeString.length === 2) return time
        return `0${time}`
    }

    hideDatePicker = () => {
        this.setState({ isDatePickerVisible: false });
    };

    AddSlot = () =>
    {

        if(!this.state.isLoading)
        {
            this.setState({isLoading:true})
            RNFetchBlob.fetch('POST', 'https://www.tattey.com/tattey_app/appapis/appointment.php', {
                Authorization: "Bearer access-token",
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
              }, [  
                { name:'temp_id', data: this.props.user }, 
                { name:'start', data: this.state.startTime }, 
                { name:'end', data: this.state.endTime },
                { name:'day', data: this.state.weekDay }, 
                { name:"addSlot", data:"true"},
              ]).then((resp) => {
                console.log(resp);
                var tempMSG = JSON.parse(resp.data); 
                if (tempMSG.msg === "success") { 
                    this.setState({error:""});
                    // this.props.user_func(); 

                    var id = tempMSG.insert_id.toString();
                    console.log(id)
                    var slots = [...this.props.slots,{day:this.state.weekDay,start:this.state.startTime,end:this.state.endTime,id:id}]
                    this.props.updateSlots(slots)
                    this.props.updateSlotsLocal(slots)
                    Toast.show('Slot Added')
                   this.props.closeModal()
                } else if(tempMSG.msg === "usernameError")
                    {
                        this.setState({error:"User Name Not Available"});
                    }
                    this.setState({isLoading:false})
              }).catch((err) => {
                console.log(err)
              })
        }
       
    }
    displayErrors = errors =>
    errors.map((error, i) => <Text key={i} style={{fontSize:15,color: 'white'}}>{error.message}</Text>);
  
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
      isFormEmpty = ({ startTime, endTime, weekDay }) => {
        return (
          !startTime.length ||
          !weekDay.length   ||
          !endTime.length
        );
      };
  render() {
    return (
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
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                
                <View style={styles.sectionHeader}> 
                    <View style={styles.sectionHeading}> 
                        <Text style={styles.sectionHeadingText}>Add New Time Slot</Text>
                    </View> 
                    <Icon name="x" size={20} color="red"  onPress={() =>this.props.closeModal()} style={styles.modalCloseIcon} />
                </View>
                <View style={{flex:1,flexDirection:'row',justifyContent:'center',marginTop:20}}>
                    {this.state.errors.length > 0 && (
                        <View style={{color: "white",
                            backgroundColor:"#000",
                            borderColor: "#000",
                            borderWidth:2,
                            fontSize:15,
                            width:300,
                            justifyContent: "center",
                            flexDirection:"row",
                            padding:5, }}>
                        {this.displayErrors(this.state.errors)}
                        </View>
                    )}
                </View>                        
                <View style={styles.mainSection}>
                    <View style={styles.addField}>
                        <Text style={styles.fieldLabel}>Week Day : </Text>
                        <View style={styles.selectContainer}>
                            <ModalDropdown 
                                options={this.weekDays} 
                                defaultValue="Select" 
                                dropdownStyle={{width:90,}} 
                                textStyle={{fontSize:17,fontWeight: "bold",color:"white"}} 
                                dropdownTextStyle={{fontSize:18}}  
                                style={{fontSize:20}}
                                onSelect={(data)=>{this.setState({weekDay:this.weekDays[data]})}}
                                ref={input => this.dropdown = input}
                                />
                                <TouchableOpacity onPress={()=>{this.dropdown.show()}} style={{paddingLeft:10}}>
                                            <Icon name="chevron-down" size={20} color="white"/>
                                </TouchableOpacity>
                                
                        </View>
                        
                    </View>
                    <View style={styles.addField}>
                        <Text style={styles.fieldLabel}>Start Time: </Text>
                        <View style={styles.selectContainer}> 
                                <TouchableOpacity onPress={()=>{this.setState({isDatePickerVisible: true,datePickerMode:"start"})}}>
                                            <Text style={{color: 'white',fontSize:18,fontWeight: "bold"}}>{this.state.startTime!=''?(this.state.startTime):('Select')}</Text>
                                </TouchableOpacity>
                                
                        </View> 
                    </View>
                    <View style={styles.addField}>
                        <Text style={styles.fieldLabel}>End Time: {' '} </Text>
                        <View style={styles.selectContainer}> 
                            <TouchableOpacity onPress={()=>{this.setState({isDatePickerVisible: true,datePickerMode:"end"})}}>
                                        <Text style={{color: 'white',fontSize:18,fontWeight: "bold"}}>{this.state.endTime!=''?(this.state.endTime):('Select')}</Text>
                            </TouchableOpacity>
                                
                        </View> 
                    </View>
                    <TouchableOpacity onPress={()=>{this.isFormValid()?this.AddSlot():null}}>
                        <View style={styles.addSlotBtn}> 
                        {this.state.isLoading?(
                            <ActivityIndicator
                            style={{flex: 0.2, flexDirection: 'column'}}
                            size="large"
                            color="white"  />
                                ):(
                                    <Text style={{color: 'white',fontSize:18,fontWeight: "bold"}}>Add Time Slot</Text>
                            )}
                           
                        </View>    
                    </TouchableOpacity>
                </View>
                
            </View>
            <DateTimePickerModal
                isVisible={this.state.isDatePickerVisible}
                mode="time"
                onConfirm={this.handleConfirm}
                onCancel={this.hideDatePicker} 
            /> 
        </ScrollView>
      </Modal>
    );
  }
}


const styles = StyleSheet.create({
    scrollView:{
        backgroundColor: '#fff', 
        paddingTop: 25
    }, 
        container:
        {
            flex:1,
            flexDirection:'column',

        },
            sectionHeader:
            {
                flex:1,
                flexDirection: 'row'
            },
                sectionHeading:
                {
                    flex:1,
                    flexDirection: 'column',
                    alignItems: 'center'
                },
                    sectionHeadingText:
                    {
                        margin:10,
                        fontSize:18,
                        fontWeight: "bold"
                    },
                modalCloseIcon:
                {
                    flex:0.1,
                    flexDirection: 'column',
                    textAlign:"right",
                    margin:10
                },
            mainSection:
            {
                    margin:15
            },
                addField:
                {
                    flex:1,
                    flexDirection: 'row', 
                    marginTop:30
                },
                    fieldLabel:
                    {
                        fontSize:18,
                        fontWeight: "bold",
                        marginRight:20,
                        marginTop:2

                    },
                    selectContainer:
                    {
                        
                        backgroundColor:'black',
                        flex:0.4,
                        flexDirection:'row',
                        padding: 4,
                        paddingLeft:10,
                        paddingRight:10,
                        justifyContent: 'center'
                    },
                addSlotBtn:
                {
                    backgroundColor:'black',
                    margin:10,
                    marginTop:50,
                    flex:1,
                    padding:10,
                    borderRadius: 5,
                    flexDirection:'row', 
                    justifyContent: 'center'
                }

})

export default AddSlotModal;
