'use strict';
import React, { Component } from 'react';
import { View,Text,Image,StatusBar,AsyncStorage,Dimensions,Platform,Linking } from 'react-native';
export default class CustomToast extends Component {
  render() {
    return (
      <View style={{flex:1,backgroundColor:'#292E39',justifyContent:'center',alignItems:'center'}}>
        <StatusBar backgroundColor="#292E39" barStyle="light-content"/>
        <Image source={imageSource.logo} style={{width:width/2,height:width/2,resizeMode:'contain'}} />
      </View>
    );
  }
}
