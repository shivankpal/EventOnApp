'use strict';
import React, { Component } from 'react';
import { View,Text,Image,StatusBar,AsyncStorage,Dimensions } from 'react-native';
import { Actions,ActionConst } from 'react-native-router-flux';
const {height, width} = Dimensions.get('window');
export default class SudoSplash extends Component {
  constructor(props){
    super(props);
    this.state = {
       topevent:this.props.topevent,
       user:this.props.user,
       deeplink:this.props.deeplink,
    }

    this.image = {};
    this.logo = {}

    if(this.props.topevent.theme.splash_screen_background_image!='')
    {
        Image.prefetch(this.props.topevent.theme.splash_screen_background_image);
        this.image = {uri: this.props.topevent.theme.splash_screen_background_image}
    }
    if(this.props.topevent.theme.splash_screen_logo!='')
    {
        Image.prefetch(this.props.topevent.theme.splash_screen_logo);
        this.logo = {uri: this.props.topevent.theme.splash_screen_logo}
    }
  }

  componentDidMount(){
    setTimeout(()=>{
        this.getEvents();
    },3000)
  }
  getEvents = async () => {
     setTimeout(()=>{
        this.props.navigator.replace({id:'Index', user:this.state.user, topevent:this.state.topevent, deeplink:this.state.deeplink});
     },3000)
  }
  renderOption = () => {
     return (
         (this.props.topevent.theme.splash_screen_logo_option=='Image') ? <Image source={this.logo} style={{width:200,height:150,resizeMode:'contain'}} /> : <Text style={{fontFamily:'Roboto-Medium',color:'#333',fontSize:20,backgroundColor:'transparent'}} >{this.props.topevent.theme.splash_screen_title}</Text>
     )
  }
  render() {
    if(this.props.topevent.theme.splash_screen_background_image!='')
    {
        if(this.props.topevent.theme.splash_screen_logo_position=='Top')
        {
          return (
            <View style={{flex:1,backgroundColor:this.props.topevent.theme.splash_screen_background}}>
              <Image source={this.image} style={{flex:1,paddingVertical:30,justifyContent:'flex-start',alignItems:'center',width:null,height:null}}>
                  {this.renderOption()}
              </Image>
            </View>
          );
        }
        if(this.props.topevent.theme.splash_screen_logo_position=='Center' || this.props.topevent.theme.splash_screen_logo_position=='')
        {
          return (
            <View style={{flex:1,backgroundColor:this.props.topevent.theme.splash_screen_background}}>
              <Image source={this.image} style={{flex:1,paddingVertical:30,justifyContent:'center',alignItems:'center',width:null,height:null}}>
                 {this.renderOption()}
              </Image>
            </View>
          );
        }
        if(this.props.topevent.theme.splash_screen_logo_position=='Bottom')
        {
          return (
            <View style={{flex:1,backgroundColor:this.props.topevent.theme.splash_screen_background}}>
              <Image source={this.image} style={{flex:1,paddingVertical:30,justifyContent:'flex-end',alignItems:'center',width:null,height:null}}>
                 {this.renderOption()}
              </Image>
            </View>
          );
        }
        return null;
    }
    else
    {
        if(this.props.topevent.theme.splash_screen_logo_position=='Top')
        {
          return (
            <View style={{flex:1,justifyContent:'flex-start',alignItems:'center',paddingVertical:30,backgroundColor:this.props.topevent.theme.splash_screen_background}}>
                {this.renderOption()}
            </View>
          );
        }
        if(this.props.topevent.theme.splash_screen_logo_position=='Center' || this.props.topevent.theme.splash_screen_logo_position=='')
        {
          return (
            <View style={{flex:1,justifyContent:'center',alignItems:'center',paddingVertical:30,backgroundColor:this.props.topevent.theme.splash_screen_background}}>
                {this.renderOption()}
            </View>
          );
        }
        if(this.props.topevent.theme.splash_screen_logo_position=='Bottom')
        {
          return (
            <View style={{flex:1,justifyContent:'flex-end',alignItems:'center',paddingVertical:30,backgroundColor:this.props.topevent.theme.splash_screen_background}}>
                {this.renderOption()}
            </View>
          );
        }
        return null;
    }
  }
}
