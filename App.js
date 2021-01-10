 
import React from 'react';
import { StyleSheet, Text, View,Platform ,SafeAreaView} from 'react-native';
import Book from './Components/Screens/Book'
import DefaultPreference from 'react-native-default-preference';
import config from './config'
import Appointments from './Components/Screens/Appointments'
import Icon from 'react-native-vector-icons/dist/Feather';
import BottomNavigation, {
  FullTab
} from 'react-native-material-bottom-navigation'
class App extends React.Component {
  
  state={
    user_id:"",
    appointments:[],
    activeTab:"book",
    appoint_date:[],
  }

  tabs = [
    {
      key: 'book',
      icon: 'calendar',
      label: 'Book',
      barColor: 'black',
      pressColor: 'rgba(255, 255, 255, 0.16)'
    },
    {
      key: 'appoint',
      icon: 'list',
      label: 'Appointments',
      barColor: 'black',
      pressColor: 'rgba(255, 255, 255, 0.16)'
    },
    
  ]

  renderIcon = icon => ({ isActive }) => (
    <Icon size={24} color="white" name={icon} />
  )
 
  renderTab = ({ tab, isActive }) => (
    <FullTab
      isActive={isActive}
      key={tab.key}
      label={tab.label}
      renderIcon={this.renderIcon(tab.icon)}
    />
  )

  fetch_user_appointments = ()=>{ 
    fetch('https://tattey.com/tattey_app/appapis/appointment.php', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type':'application/json' 
              },
              body: JSON.stringify({
                userAppointments: true,
                user_id:this.state.user_id     
              })
            })
            .then((response) => response.json())
            .then(result=>{ 
              // console.log(result)
                if(result.msg=="success")
                {   
                  if(result.rowCount!='0')
                  {
                    var appoint_date =[];
                    result.result.map(item=>{   
                       appoint_date.push(item.date)
                    });
                    this.setState({appointments:result.result,appoint_date:appoint_date});
                  }
                 
                  //  appoint_date.push(result.result)
                }
            })
            .catch((error) => {
               console.error(error);
            });
  }
  saveUser=()=>{
    fetch('https://tattey.com/tattey_app/appapis/appointment.php', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type':'application/json' 
              },
              body: JSON.stringify({
                  userCount: true,     
              })
            })
            .then((response) => response.json())
            .then(result=>{  
                var arr = Object.values(result);
               if(arr[0]===("sucesss"))
               {  
                    var user_id = (parseInt(arr[1])+1)+""+new Date().getTime(); 
                    DefaultPreference.set('user_id',user_id);
                    DefaultPreference.get('user_id').then((value)=>{console.log("sp : "+value);})
                    DefaultPreference.set('isFirstTime',"false");
                    this.setState({user_id:user_id}); 
               }
            
            })
            .catch((error) => {
               console.error(error);
            });
  }
  
  getUser=()=>{ 
    DefaultPreference.get('user_id').then((value)=>{
        this.setState({user_id:value});   
        this.fetch_user_appointments();
    })
  }

  componentDidMount() {
    if (Platform.OS === 'android') DefaultPreference.setName('NativeStorage');
    DefaultPreference.get('isFirstTime').then((value)=> { 
      if(value==null)
      {
        this.saveUser();
      }
      else
      {
        
        this.getUser();
      } 
    });
    
  }
  // setBookState = (ref)=>{
  //   ref.setState({appointment:this.state.appoint_date})
  // }
  renderTabView=(tab)=>{
    switch(tab)
    {
      case 'book':

        return (<Book user={this.state.user_id} appointment={this.state.appoint_date} appoint_func={this.fetch_user_appointments} counter={1}/>)
      case 'appoint':
        
            this.fetch_user_appointments();
        return (<Appointments appointments={this.state.appointments} functionAppointments={this.fetch_user_appointments} /> )
    }
  }
  render() { 
    return ( 
          <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            {this.renderTabView(this.state.activeTab)} 
          </View>
          <BottomNavigation
            activeTab={this.state.activeTab}
            onTabPress={newTab => this.setState({ activeTab: newTab.key })}
            renderTab={this.renderTab}
            tabs={this.tabs}
          />
        </View>
      
    );
  }
} 
export default App;  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
