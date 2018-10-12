import React, { Component } from 'react';
import { AppRegistry,BackHandler, ToastAndroid,Platform,AsyncStorage,Linking,ActivityIndicator,View,Text } from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';
import PushNotification from 'react-native-push-notification';
import DeviceInfo from 'react-native-device-info';


import Search from './app/Search/Index';
import Splash from './app/Main/Splash';
import Index from './app/Main/Index';
import SudoSplash from './app/Main/SudoSplash';
import SudoLogin from './app/Login/Index';
import Login from './app/Login/Login';
import Signup from './app/Login/Signup';
import Screen1 from './app/Login/Screen1';
import Screen2 from './app/Login/Screen2';
import Screen3 from './app/Login/Screen3';
import Screen4 from './app/Login/Screen4';
import Connect from './app/Login/Connect';
import Web from './app/Login/Web';
import Location from './app/Login/Location';
import Forgot from './app/Login/Forgot';

import Number from './app/Login/Number';
import Otp from './app/Login/Otp';
import Prewelcome from './app/Login/Prewelcome';
import SudoSearch from './app/Login/SudoSearch';
import Myhome from './app/Login/Myhome';

import Profile from './app/Profile/Index';
import Chat from './app/Profile/Chat';
import UpdateProfile from './app/Profile/Update';
import Mynetwork from './app/Mynetwork/Index';
import MyBusinesscards from './app/Businesscards/MyBusinesscards';
import MyNotes from './app/Notes/MyNotes';
import PeopleDetail from './app/Profile/PeopleDetail';
import SocialConnection from './app/Profile/SocialConnection';
import CommonConnection from './app/Profile/CommonConnection';
import ChatList from './app/Profile/ChatList';
import Prefer from './app/Other/Prefer';

var Fabric = require('react-native-fabric');

var { Crashlytics } = Fabric;
export default class EventOnApp extends Component {
  constructor() {
    super();
    this.navigator = null;
    this.state = {
      exit:false,
      event_id:0,
      user:false,
      events:false,
      topevent:false,
      loading:true,
      deeplink:[],
    }
    console.disableYellowBox = true;
    this.handleBackButton = this.handleBackButton.bind(this);
    this.handleDeepLink = this.handleDeepLink.bind(this);
    this.handlePushNotification = this.handlePushNotification.bind(this);
    this.initialPage = 'Splash';
  }
  componentWillMount(){
    this.gatherData();
    this.downloadDemoEvent();
    this.getDeviceToken();
    this.getRef();
    this.handlePushNotification();
    this.updateDeviceToken();
  }
  getRef = () => {
    AsyncStorage.getItem('USER').then((user)=>{
        if(user==null)
        {
            fetch('https://api.eventonapp.com/api/referrer/ANDROID', { method: 'GET' }).then((response) => response.json()).then((responseJson) => {
                if(responseJson.status)
                {
                    this.setState({
                        deeplink:[responseJson.data.event_id,'Event_Home'],loading:false
                    })
                }
                else{
                  this.setState({
                      deeplink:false,loading:false
                  })
                }
            }).catch((error) => { this.setState({loading:false})  })
        }
    })
  }
  componentDidMount() {
       AsyncStorage.setItem('DEMOERRORMSG', 'This is a demo event and all actions are disabled. Join a real Event to explore more...');
       BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
       this.handleDeepLink();
       AsyncStorage.getItem('USER').then((user)=>{
           if(user!=null)
           {
               let u = JSON.parse(user);
               Crashlytics.setUserName(u.name);

               Crashlytics.setUserEmail(u.email);

               Crashlytics.setUserIdentifier(u.id);
           }
       })
  }

  componentWillUnmount() {
       BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  downloadDemoEvent = () => {
      fetch('https://api.eventonapp.com/api/downloadEvent/106', { method: 'GET' }).then((response) => response.json()).then((responseJson) => {
          AsyncStorage.setItem('DEMOEVENT', JSON.stringify(responseJson.data[0]));
      })
  }
  gatherData = () => {
    AsyncStorage.getItem('USER').then((user) => {
        if(user!=null){
            this.setState({user:JSON.parse(user)})
        }
    })
    AsyncStorage.getItem('MYEVENTS').then((events) => {
        if(events!=null){
            this.setState({events:JSON.parse(events)})
        }
    })
  }
  updateDeviceToken = () => {
    AsyncStorage.getItem('DEVICETOKEN').then((devicetoken) => {
        if(devicetoken!=null){
          AsyncStorage.getItem('USER').then((user) => {
              if(user!=null){
                let u = JSON.parse(user);
                var url = 'https://api.eventonapp.com/api/deviceToken/'+u.id+"?device_id="+DeviceInfo.getUniqueID()+"&device_type=ANDROID&device_token="+devicetoken;
                fetch(url, { method: 'GET' })
              }
          })
        }
    })
  }
  handleDeepLink = () => {
      Linking.getInitialURL().then(url => {
        if(url!=null)
        {
           let surl = url.replace(/.*?:\/\//g, '').split('/');
           surl = surl[1].split('-');
           if(surl.length > 1)
           {
               this.setState({
                   deeplink:[surl[surl.length-1],'Event_Home']
               },()=>{
                     this.downloadEvent();
               })
           }
           else{
               this.setState({
                   deeplink:[0,surl[0]]
               },()=>{
                   this.setState({loading:false},()=>{
                   })
               })
           }
        }
        else{
           this.setState({loading:false});
        }
     })
  }

  downloadEvent = async () => {
      AsyncStorage.getItem('USER').then((user) => {
          if(user!=null){
                var r = this.state.deeplink;
                var event = this.state.events;
                if(parseInt(r[0]))
                {
                    var ind = event.map(function (o) { return o.id; }).indexOf(r[0]);
                    if(ind >= 0)
                    {
                        this.setState({topevent:event[ind],loading:false},() => {
                            this.navigator.resetTo({id:'SudoSplash', user:this.state.user, topevent:event[ind], deeplink:this.state.deeplink });
                            this.clearDeepLink();
                        })
                    }
                    else {
                        fetch('https://api.eventonapp.com/api/downloadEvent/'+r[0], { method: 'GET' }).then((response) => response.json()).then((responseJson) => {
                            this.setState({loading:false},()=>{
                              this.navigator.resetTo({id:'Search', user:this.state.user, sudotopevent:responseJson.data[0], deeplink:this.state.deeplink,ishome:true });
                              this.clearDeepLink();
                            })

                        }).catch((error) => { this.setState({loading:false})  })
                    }
                }
                else{
                      this.setState({loading:false},() => {
                        this.navigator.resetTo({id:'ChatList', user:this.state.user, ishome:true });
                        this.clearDeepLink();
                      })
                }
           }
      })
  }
  clearDeepLink = () => {
      this.setState({deeplink:false});
  }
  getDeviceToken = () => {
    AsyncStorage.getItem('DEVICETOKEN').then((devicetoken) => {
        if(devicetoken==null){
            PushNotification.configure({
                onRegister: function(token) {
                  AsyncStorage.setItem('DEVICETOKEN', token.token);
                },
                senderID: "1033314279835",
                popInitialNotification: true,
                requestPermissions: true,
            })
       }
    })
  }
  handlePushNotification = () => {
      var sudothis = this;
      PushNotification.configure({
          onNotification: function(notification) {
              if(notification.foreground)
              {
                  PushNotification.localNotification({
                      title: notification.title,
                      message: notification.message,
                      event_id:notification.event_id,
                      landing:notification.landing,
                  })
              }
              if(notification.userInteraction)
              {
                  AsyncStorage.getItem('USER').then((user)=>{
                      if(user!=null)
                      {
                          AsyncStorage.getItem('MYEVENTS').then((events)=>{
                              if(events!=null)
                              {
                                  var e = JSON.parse(events);
                                  e.map((o,i)=>{
                                      if(o.id==notification.event_id)
                                      {
                                          var deeplink = [];
                                          deeplink[0] = o.id;
                                          deeplink[1] = notification.landing;
                                          sudothis.setState({loading:false},()=>{
                                              sudothis.navigator.replace( { id:'SudoSplash', user:JSON.parse(user), topevent:o, deeplink:deeplink } )
                                          })
                                      }
                                  })
                              }
                          })
                       }
                   })
              }
         },
         senderID: "1033314279835",
         popInitialNotification: true,
         requestPermissions: true,
      })
  }
  handleBackButton = () => {
     if (this.navigator && this.navigator.getCurrentRoutes().length > 1){
       this.navigator.pop();
       return true;
     }
     if(this.state.exit)
     {
        BackHandler.exitApp();
     }
     else
     {
         this.setState({exit:true},() => {
            ToastAndroid.show('Press Again to exit app',ToastAndroid.SHORT);
            setTimeout(()=>{ this.setState({exit:false}) },1000);
         })
         return true;
     }
  }
  getData = () => {
    AsyncStorage.getItem('USER').then((user) => {
       if(user!=null){
            this.setState({user:JSON.parse(user)},()=>{

            })
       }
    })
  }

  render() {
    if(this.state.loading){
      return (
          <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <ActivityIndicator
                  style={{alignItems: 'center',justifyContent: 'center',padding: 8}}
                  color="#487597"
                  size="large"
                />
          </View>
      );
    }
    return (
      <Navigator
            initialRoute={{id: 'Splash', event_id: this.state.event_id, deeplink:this.state.deeplink}}
            renderScene={this.renderScene.bind(this)}
            ref={navigator => {this.navigator = navigator}}
            configureScene={(route) => {
              if (route.sceneConfig) {
                return route.sceneConfig;
              }
             return Navigator.SceneConfigs.FloatFromRight;
        }} />
    );
  }
  renderScene(route, navigator) {
    var routeId = route.id.toLowerCase();
    if (routeId === 'splash') {
      return (
        <Splash navigator={navigator} deeplink={this.state.deeplink} />
      );
    }

    if (routeId === 'sudosplash') {
      return (
        <SudoSplash navigator={navigator} {...route}/>
      );
    }
    if (routeId === 'search') {
      return (
        <Search navigator={navigator} {...route}   />
      );
    }
    if (routeId==='login') {
        return (
          <Login navigator={navigator} />
        )
    }
    if (routeId === 'forgot') {
      return (
        <Forgot navigator={navigator} />
      )
    }
    if (routeId==='location') {
        return (
          <Location navigator={navigator} {...route} />
        )
    }
    if (routeId==='sudologin') {
        return (
          <SudoLogin navigator={navigator} />
        )
    }
    if (routeId==='signup') {
        return (
          <Signup navigator={navigator} />
        )
    }
    if (routeId === 'connect') {
      return (
        <Connect navigator={navigator} {...route}  />
      );
    }
    if (routeId === 'screen1') {
      return (
        <Screen1 navigator={navigator}  />
      );
    }
    if (routeId === 'screen2') {
      return (
        <Screen2 navigator={navigator} data={route.data}   />
      );
    }
    if (routeId === 'screen3') {
      return (
        <Screen3 navigator={navigator} data={route.data} />
      );
    }
    if (routeId === 'screen4') {
      return (
        <Screen4 navigator={navigator} data={route.data} />
      );
    }
    if (routeId === 'number') {
      return (
        <Number data={route.data} navigator={navigator}  />
      );
    }
    if (routeId === 'otp') {
      return (
        <Otp navigator={navigator} otp={route.otp} number={route.number} data={route.data} />
      );
    }
    if (routeId === 'prewelcome') {
      return (
        <Prewelcome navigator={navigator} {...route} deeplink={this.state.deeplink} clearDeepLink={this.clearDeepLink.bind(this)} />
      );
    }
    if (routeId === 'sudosearch') {
      return (
        <SudoSearch navigator={navigator} {...route} />
      );
    }
    if (routeId === 'web') {
      return (
        <Web navigator={navigator} {...route} />
      );
    }
    if(routeId === 'myhome')
    {
        return (
          <Myhome navigator={navigator} {...route} deeplink={this.state.deeplink} clearDeepLink={this.clearDeepLink.bind(this)} />
        )
    }
    if(routeId === 'profile')
    {
        return (
          <Profile navigator={navigator} {...route} />
        )
    }
    if(routeId === 'updateprofile')
    {
        return (
          <UpdateProfile navigator={navigator} {...route} />
        )
    }
    if(routeId === 'mynetwork')
    {
        return (
          <Mynetwork navigator={navigator} {...route} />
        )
    }
    if(routeId === 'mynotes')
    {
        return (
          <MyNotes navigator={navigator} {...route} />
        )
    }
    if(routeId === 'peopledetail')
    {
        return (
          <PeopleDetail navigator={navigator} {...route} />
        )
    }
    if(routeId === 'mybusinesscards')
    {
        return (
          <MyBusinesscards navigator={navigator} {...route} />
        )
    }
    if(routeId === 'prefer')
    {
        return (
          <Prefer navigator={navigator} {...route} />
        )
    }
    if(routeId === 'chat')
    {
        return (
          <Chat navigator={navigator} {...route} />
        )
    }
    if(routeId === 'socialconnection')
    {
        return (
          <SocialConnection navigator={navigator} {...route} />
        )
    }
    if(routeId === 'chatlist')
    {
        return (
          <ChatList navigator={navigator} {...route} />
        )
    }
    if (routeId === 'commonconnection') {
      return (
        <CommonConnection navigator={navigator} {...route}  />
      );
    }
    if (routeId === 'index') {
      return (
        <Index sudonav={navigator}  user={route.user} topevent={route.topevent} deeplink={route.deeplink}  />
      );
    }
    return (
      <Myhome navigator={navigator} {...route} />
    )
  }
}
AppRegistry.registerComponent('EventOnApp', () => EventOnApp);
