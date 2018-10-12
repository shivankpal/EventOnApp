'use strict';
import React, { Component } from 'react';
import { View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  AsyncStorage,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Animated,
  ToastAndroid
  } from 'react-native';
import Search from '.././Search/Index';
import {
  GoogleAnalyticsTracker,
  GoogleTagManager,
  GoogleAnalyticsSettings
} from 'react-native-google-analytics-bridge';
export default class SudoSearch extends Component {
      constructor(props){
          super(props);
          this.state = {
            user:this.props.user,
            topevent:this.props.topevent,
          }
      }
      render(){
        return(
            <Search setCurrentScene={this.setCurrentScene} topevent={false} user={this.state.user} sudonav={this.props.navigator} googleTracker={this.googleTracker} sudoSearch={true} />
        )
      }
}
