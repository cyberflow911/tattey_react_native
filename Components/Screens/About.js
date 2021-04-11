import React from 'react';
import { View,StyleSheet,TextInput,Text,ScrollView,TouchableOpacity,ActivityIndicator,FlatList } from 'react-native'; 
import Icon from 'react-native-vector-icons/dist/Feather';
import AddSlotModal from './AddSlotModal';
import RNFetchBlob from 'rn-fetch-blob';
import Toast from 'react-native-simple-toast'; 

class About extends React.Component {
    state = 
    {
        about:this.props.bio,
        addSLotModal:false,
        isBioLoading:false,
        slots:this.props.slots
    }


    renderSingleSchedule = (item)=>
    {
      
        return(
            <View style={styles.scheduleContainer}>
                <Text style={styles.scheduleContainerText}>{item.day}</Text>
                <Text style={styles.scheduleContainerText}>{item.start}</Text>
                <Text style={styles.scheduleContainerText}>-</Text>
                <Text style={styles.scheduleContainerText}>{item.end}</Text>
                <TouchableOpacity onPress={() =>this.deleteSlot(item.id)}> 
                    <Icon name="trash" size={20} color="red"/> 
                </TouchableOpacity>

            </View>
        )
    }
    deleteSlot=(id)=>
    {
        RNFetchBlob.fetch('POST', 'https://www.tattey.com/tattey_app/appapis/appointment.php', {
            Authorization: "Bearer access-token",
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          }, [  
            { name: 'temp_id', data: this.props.user }, 
            { name: 'b_id', data: id }, 
            { name: 'deleteSlot', data: "true" }, 
          ]).then((resp) => {
            console.log(resp);
            var tempMSG = JSON.parse(resp.data);
            
            if (tempMSG.msg === "success") { 
                    
                var slots = this.state.slots
                 slots = slots.filter(function(item)
                 {
                     if(item.id==id)
                     {
                         return false;
                     }else
                     {
                         return true;
                     }
                 })
                 this.props.slotUpdate(slots)
                this.setState({slots:slots});
                            
            }  
                
          }).catch((err) => {
            console.log(err)
          })
    }
    openAddSLotModal = ()=>
    {
            this.setState({addSLotModal:true})
    }
    closeModal = () => {
        this.setState({addSLotModal:false})
    }
    slotUpdateLocal =(slots)=>
    {
        this.setState({slots:slots})
    }
    updateBio = () =>
    {
        if(!this.state.isBioLoading)
        {
            this.setState({isBioLoading:true})
            RNFetchBlob.fetch('POST', 'https://www.tattey.com/tattey_app/appapis/appointment.php', {
                Authorization: "Bearer access-token",
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
              }, [  
                { name: 'temp_id', data: this.props.user }, 
                { name: 'about', data: this.state.about }, 
                { name: 'bioUpdate', data: "true" }, 
              ]).then((resp) => {
                console.log(resp);
                var tempMSG = JSON.parse(resp.data);
                
                if (tempMSG.msg === "success") { 
                    this.setState({error:""});
                    this.props.user_func();
                    this.props.updateBioInState(this.state.about)
                    Toast.show('Bio Updated')
                   
                } else if(tempMSG.msg === "usernameError")
                    {
                        this.setState({error:"User Name Not Available"});
                    }
                    this.setState({isBioLoading:false})
              }).catch((err) => {
                console.log(err)
              })
        }
        
    }


     

render() { 



 
        return (
            <ScrollView>
                <View style={styles.container}>
                    
                    <TextInput
                        placeholder={'Bio'} 
                        multiline={true} 
                        defaultValue={this.state.about}
                        onChangeText={(text)=>{this.setState({about: text})}}
                        style={styles.INPUTSTYLE}
                        placeholderTextColor="#fff" 
                    />
                    <TouchableOpacity onPress={() =>this.updateBio()}>
                        <View style={styles.saveBioBtn}>

                        {this.state.isBioLoading?(
                            <ActivityIndicator
                            style={{flex: 0.2, flexDirection: 'column'}}
                            size="large"
                            color="black"  />
                                ):(
                                <Text style={styles.saveBioBtnText}>Update Bio</Text>
                            )}
                        </View>
                    </TouchableOpacity>
                    <View style={styles.bookingSchedule}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionHeading}>Booking Slots</Text>
                            <TouchableOpacity onPress={this.openAddSLotModal}> 
                                <View style={styles.iconView}>
                                    <Icon name="plus" size={25} color="#000" />
                                </View>
                            </TouchableOpacity> 
                        </View> 
                    </View>
                
                    <FlatList data={this.state.slots}  renderItem={({item})=>this.renderSingleSchedule(item)} keyExtractor={(item)=>item.id}/>                     
                </View>
                {this.state.addSLotModal?(
                    <AddSlotModal isVisible={this.state.addSLotModal} closeModal={this.closeModal} user={this.props.user} slots={this.state.slots} updateSlots={this.props.slotUpdate} updateSlotsLocal={this.slotUpdateLocal}/>
                ):(null)}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        flexDirection:"column"
    },
        saveBioBtn:
        {
            backgroundColor:"#fff" ,
            padding:5,
            borderRadius:10
        }, 
            saveBioBtnText:
            {
                textAlign:"center",
                fontSize:18,
                fontWeight:"bold", 
            }, 
        bookingSchedule:
        {
            flex: 1,
            flexDirection: 'row' 
        },
            sectionHeader:
            {
                flex:1,
                flexDirection:"row",
                justifyContent:"space-between"
            },
                sectionHeading:
                {
                    color:"#fff",
                    fontSize:20,
                    margin:10
                },
                iconView:
                {
                     backgroundColor: '#fff'  ,
                     borderRadius:20,
                     height:30,
                     width:30,
                     margin:10,
                     alignItems:'center',
                     justifyContent:"center"
                },
            scheduleContainer:
            {
              flex: 1,
              flexDirection:"row"  ,
              justifyContent:"space-around", 
              marginTop:10

            },
                scheduleContainerText:
                {
                    color:"#fff",
                },

    INPUTSTYLE: //global style for input
    {
        borderColor:"#fff",
        borderWidth:1,
        marginBottom:15,
        marginTop:15,
        color:"#fff", 
        padding:15,
        paddingLeft:15,
        borderRadius:5,
        textAlignVertical: 'top',
        height: 100
    }
})
export default About;