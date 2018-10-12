'use strict';
import React, { Component } from 'react';
import { View,Text,Image,StatusBar,AsyncStorage,Dimensions,Platform,Linking } from 'react-native';
import { Actions } from 'react-native-router-flux';
const imageSource = {
      logo: require(".././Assets/Img/logo.png"),
};
const {height, width} = Dimensions.get('window');
export default class Splash extends Component {
  constructor(props){
    super(props);
    this.state = {
        topevent:false,
        user:false,
        events:false,
        deeplink:this.props.deeplink,
    }
  }

  updateEvents = async (id) => {
    await fetch('https://api.eventonapp.com/api/myEvents/?user_id='+id, {
       method: 'GET'
    }).then((response) => response.json())
    .then((responseJson) => {
        AsyncStorage.setItem('MYEVENTS', JSON.stringify(responseJson.data));
    }).catch((error) => {  });
  }

  componentDidMount(){
      setTimeout(()=>{ this.checkUser() },3000);
  }
  componentWillUnmount(){

  }
  moveToDeeplink = () => {
      if(this.state.deeplink.length)
      {
          if(parseInt(this.state.deeplink[0])==0)
          {
              this.props.navigator.resetTo({id:this.state.deeplink[1],navigator:this.props.navigator, user:this.state.user,ishome:true });
          }
      }
      else{
          this.props.navigator.resetTo({id:'Myhome', user:this.state.user, topevent:this.state.topevent, events:this.state.events });
      }
  }
  checkUser = async () => {
      await AsyncStorage.getItem('USER').then((user) => {
          if(user!=null){
              this.setState({user:JSON.parse(user)},() => {
                  this.updateEvents(this.state.user.id);
                  setTimeout(()=>{
                          AsyncStorage.getItem('MYEVENTS').then((events) => {
                              if(events!=null){
                                this.setState({events: JSON.parse(events)},() => {
                                    AsyncStorage.getItem('PROFILE').then((profile) => {
                                      if(profile!=null){
                                            this.moveToDeeplink();
                                      }
                                      else
                                      {
                                         this.props.navigator.resetTo({  id: 'Screen1' });
                                      }
                                    })
                                })
                              }
                              else
                              {
                                  AsyncStorage.getItem('PROFILE').then((profile) => {
                                    if(profile!=null) {
                                       setTimeout(() => {
                                          this.props.navigator.resetTo({  id: 'Prewelcome',  user:this.state.user});
                                       },500)
                                    }
                                    else {
                                       setTimeout(() => {
                                          this.props.navigator.resetTo({  id: 'Screen1' });
                                       },500)
                                    }
                                  })
                              }
                          })
                  },3000)
               })
          }
          else
          {
              setTimeout(() => {
                  this.props.navigator.replace({ id: 'SudoLogin'});
              },1000);
          }
       })
  }
  render() {
    return (
      <View style={{flex:1,backgroundColor:'#292E39',justifyContent:'center',alignItems:'center'}}>
        <StatusBar backgroundColor="#292E39" barStyle="light-content"/>
        <Image source={imageSource.logo} style={{width:width/2,height:width/2,resizeMode:'contain'}} />
      </View>
    );
  }
}
