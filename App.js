 
import React from 'react';
import { StyleSheet, Text, View,Platform ,SafeAreaView} from 'react-native';
import Book from './Components/Screens/Book'
import DefaultPreference from 'react-native-default-preference'; 
import Appointments from './Components/Screens/Appointments'
import Icon from 'react-native-vector-icons/dist/Feather';
import Profile from './Components/Screens/profile';
import Deposits from './Components/Screens/Deposits';
import BottomNavigation, {
  FullTab
} from 'react-native-material-bottom-navigation'
import SplashScreen from 'react-native-splash-screen';
import Auth from './Components/Screens/Auth'
 
class App extends React.Component {
  
  state={
    user_id:"",
    appointments:[],
    activeTab:"book",
    appoint_date:[],
    rowCount:0,
    u_details:[],
    imgs:[],
    rowCountD:0,
    appMode:1,
    name:null,
    tabUpdated:false,
    authMode:1,
    slots:[]
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
    {
      key: 'profile',
      icon: 'user',
      label: 'Profile',
      barColor: 'black',
      pressColor: 'rgba(255, 255, 255, 0.16)'
    },
    {
      key: 'deposits',
      icon: 'dollar-sign',
      label: 'Deposit',
      barColor: 'black',
      pressColor: 'rgba(255, 255, 255, 0.16)'
    }
    
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
handleModeChange=(mode)=>
{
    this.setState({authMode:mode});
}
fetch_use_make=(user_id)=>{ 
  fetch('https://www.tattbooking.com/tattey_app/appapis/appointment.php', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type':'application/json' 
              },
              body: JSON.stringify({
                makeUser:user_id 
              })
            })
            .then((response) => response.json())
            .then(result=>{  
                if(result.msg=="success")
                { 
                  this.fetch_user_details(); 
                }
            })
            .catch((error) => {
               console.error(error);
            });
}

  fetch_user_appointments = ()=>{
    console.log("running")
    fetch('https://www.tattbooking.com/tattey_app/appapis/appointment.php', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type':'application/json' 
              },
              body: JSON.stringify({
                userAppointments: true,
                user_id:this.state.name,
                user_temp_id:this.state.user_id

              })
            })
            .then((response) => response.json())
            .then(result=>{  
              console.log(result)
                if(result.msg=="success")
                {   
                  var appoint_date =[];
                  if(result.rowCount!='0')
                  {  
                    result.result.map(item=>{   
                       appoint_date.push(item.date)
                    });
                  }
                  this.setState({appointments:result.result,appoint_date:appoint_date,rowCount:result.rowCount,appMode:result.appMode});        
                  
                  this.hidesplash();
                  // console.log(this.state.appointments)
                  //  appoint_date.push(result.result)
                }
            })
            .catch((error) => {
               console.error(error);
            });
  }
  setUserIdToState=(user_id)=>
  {
    this.setState({user_id:user_id});
  }
  fetch_user_details = ()=>{
  
    fetch('https://www.tattbooking.com/tattey_app/appapis/appointment.php', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type':'application/json' 
              },
              body: JSON.stringify({
                userDetails: true, 
                user_id:this.state.user_id, 
              })
            })
            .then((response) => response.json())
            .then(result=>{  
              console.log("user_id",this.state.user_id,"user_deatil : ",result.slots)
                if(result.msg=="success")
                {   
                  if(result.rowCount!='0')
                  {
                  
                    if(result.result.email==""||result.result.email==null||result.result.email=="NULL"||result.result.password=="")
                    {
                        this.setState({authMode:0})
                    }else
                    {  
                        if(result.result.name==''||result.result.about==''||result.result.logo==''||result.result.link=='')
                        {
                            this.fetch_use_make(this.state.user_id);
                        }
                        var imgs  = [];
                        if(result.imgs && result.imgs.length>0)
                        {
                          imgs.push(...result.imgs); 
                        } 
                        imgs.push({id:"add",image:'',user_id:""});
                        this.setState({u_details:result.result ,imgs:imgs,rowCountD:result.rowCount,name:result.result.name,authMode:1,slots:result.slots});  
               
                        this.fetch_user_appointments(); 
                    }

                  }
                  else
                  {
                      this.fetch_use_make(this.state.user_id);
                  }
                 
                  //  appoint_date.push(result.result)
                }
            })
            .catch((error) => {
               console.error(error);
            });
  }
  hidesplash = ()=>{
     
    SplashScreen.hide()
    console.log("called")
  }
  saveUser=()=>{
    fetch('https://www.tattbooking.com/tattey_app/appapis/appointment.php', {
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
                    this.fetch_use_make(user_id); 
               }
            
            })
            .catch((error) => {
               console.error(error);
            });
  }
  
  getUser=()=>{ 
    DefaultPreference.get('user_id').then((value)=>{ 
      console.log('value: ',value);
        if(value==null||value=='null'||value=='undefined'|| value==undefined)
        {   
          this.setState({authMode:0}) 
        }else
        {
          this.setState({user_id:value});    
          this.fetch_user_details();
        }
        
    })
  }

  componentDidMount() {
    if (Platform.OS === 'android') DefaultPreference.setName('NativeStorage');
    DefaultPreference.get('isFirstTime').then((value)=> { 
     
      if(value === null)
      {
        DefaultPreference.set('isFirstTime',"no");
        this.setState({authMode:0})
        // this.saveUser();
        // this.hidesplash();
      }
      else
      {
        // this.setState({appMode: 0})
        this.getUser();
      } 
    });
    
    
  }

  componentDidUpdate()
  {
     
        if(!this.state.tabUpdated &&!(this.state.pro=="0" && (this.props.appMode=="0"||Platform.OS=="android")) )
        {
          this.tabs.push()
          this.setState({tabUpdated:true})
        }
  }
  


updateSlots =(slots)=>
{
  this.setState({slots:slots})
}
  
  renderTabView=(tab)=>{
    switch(tab)
    {
      case 'book': 
        return (<Book user={this.state.user_id} appointment={this.state.appoint_date} appoint_func={this.fetch_user_appointments} counter={1} appointments_whole={this.state.appointments} user_name={this.state.name} />)
      case 'appoint': 
            // this.fetch_user_appointments();
        return (<Appointments appointments={this.state.appointments} functionAppointments={this.fetch_user_appointments} rowCount={this.state.rowCount} deposits={this.state.u_details.deposits} /> )
        case 'profile':
          return(<Profile user={this.state.user_id} user_func={this.fetch_user_details} detail={this.state.u_details} imgs={this.state.imgs} appMode={this.state.appMode} handleModeChange={this.handleModeChange} slots={this.state.slots} slotUpdate={this.updateSlots}/>)
        case 'deposits':
          return(<Deposits user={this.state.user_id} user_func={this.fetch_user_details} detail={this.state.u_details}   appMode={this.state.appMode}/>)
    }
  }

  renderWithAuth=(authMode,tab)=>
  {
      switch(authMode)
      {
        case 0:
          this.hidesplash()
          return(<Auth handleModeChange={this.handleModeChange} user_detailsFunction={this.fetch_user_details} setStateFunction={this.setUserIdToState}/>)
        case 1:
          return( <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>  
              {this.renderTabView(this.state.activeTab)}
            </View>
            <BottomNavigation
              activeTab={this.state.activeTab}
              onTabPress={newTab => this.setState({ activeTab: newTab.key })}
              renderTab={this.renderTab}
              tabs={this.tabs}
            />
        </View>)
      }
  }
  render() { 
    return ( 
         this.renderWithAuth(this.state.authMode,this.state.activeTab)
      
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
