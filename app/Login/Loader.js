'use strict';
import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
export default class Loader extends Component {
  render() {
      return (
            <View style={{alignItems:'center',justifyContent:'center',position:'absolute',left:0,top:0,bottom:0,right:0}}>
                <ActivityIndicator
                  animating={true}
                  style={{alignItems: 'center', justifyContent: 'center', padding: 8,height: 80}}
                  size="large"
                />
            </View>
        )
    }
}
