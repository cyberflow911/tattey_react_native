import React from 'react';
import { FlatList,View,Text } from 'react-native';

class TodayAppointment extends React.Component {
    state = {  }
    
    renderAppointmentHoulryContainer(item) { 
        var keys = Object.keys(item);  
        return (     
            <View style={{flex:1,flexDirection:"row",backgroundColor:"#444d56",margin:3}}>
                <View style={{flex:0.1,flexDirection:"row",margin:10}}>
                    {/* time outer */}
                    <Text style={{color:"white"}}>{keys[0]}:00</Text>
                </View>
                <View style={{flex:0.9,flexDirection:"column"}}>
                    
                    <FlatList 
                        data={item[keys[0]]}
                        renderItem={({item}) =>(this.renderSingleAppointment(item))}
                        keyExtractor={item => item.id} 
                    />
              
              </View> 
            </View>
        );

    }
    renderSingleAppointment=(item)=>{
        var color = "";  
        switch (item.status)
        {
            case"pending":
                color = "#FFFF00"; 
                break;
            case "complete":
                color = "#39FF14";
                break;
            case "confirmed":
                color = "#39FF14";
                break;
            case "cancelled":    
                color = "#FF0000";
                break;
        }
     return (
        <View style={{borderLeftWidth:2,borderColor:color}}>
            <View style={{flex:1,flexDirection:"row"}}>
                <View style={{flex:1,flexDirection:"column",marginLeft:10}}>
                    {/* name */}
                    <Text style={{fontSize:13,color:"#fff"}}>{item.name}</Text>
                </View>
                <View style={{flex:1,flexDirection:"column",alignItems: "flex-end",justifyContent:"flex-end",marginRight:15}}>
                    {/* time inner */}
                    <Text style={{fontSize:13,color:"#fff"}}>{item.time}</Text>
                </View> 
            </View>
                <View style={{flex:1,flexDirection:"row",paddingBottom:5}}>
                    <View style={{flex:1,flexDirection:"row",marginLeft:10}}>
                        {/* sub name */}
                        <Text style={{textAlign: "right",color:"#fff",fontSize:12}}>{item.service}</Text>
                    </View>
                    <View style={{flex:1,flexDirection:"column",alignItems: "flex-end",justifyContent:"flex-end",marginRight:15}}>
                        {/* status  */}
                        <Text style={{color: color,fontSize:12}}>{item.status}</Text>  
                    </View>

                </View>
        </View>
     )   
    }

    // renderEmptyComponent=()=>{
    //     return(

    //         <View style={{color: "#721c24",
    //                 backgroundColor:"#f8d7da",
    //                 borderColor: "#f5c6cb",
    //                 borderWidth:2,fontSize:15,flex:0.5,flexDirection:"column",paddingLeft:10,paddingRight:10,marginTop:10,paddingTop:5,paddingBottom:5,textAlign:"center",justifyContent:"center",alignItems: "center",margin:30}}>
    //             <Text style={{fontSize:15}}>No Appointments Available</Text>
    //         </View>
    //     );
    // }
    render() {
        return (
            <FlatList 
                data={this.props.appointment}
                renderItem={({item}) =>(this.renderAppointmentHoulryContainer(item))}
                keyExtractor={item => {
                    var keys = Object.keys(item);
                    return keys[0];  
                }}
                // ListEmptyComponent={this.renderEmptyComponent}
            />
            
        );
    }
}

export default TodayAppointment;