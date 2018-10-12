'use strict';
import React, { Component } from 'react';
import { View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  AsyncStorage,
  StyleSheet,
  Dimensions,
  Alert,
  Modal,
  Linking,
  ToastAndroid
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';
import Header from '.././Main/Header';
import PeopleTabview from './PeopleTabview';
const imageSource = {
      loc_icon : require(".././Assets/Img/ico_loc.png"),
      notes: require(".././Assets/Img/ico_notes.png"),
      chats: require(".././Assets/Img/tac_3.png"),
      google: require(".././Assets/Img/tac_4.png"),
      FACEBOOK: require(".././Assets/Img/logo social3.png"),
      TWITTER: require(".././Assets/Img/logo social2.png"),
      LINKEDIN: require(".././Assets/Img/logo social1.png"),
      FACEBOOK_D: require(".././Assets/Img/logo social3_b.png"),
      TWITTER_D: require(".././Assets/Img/logo social2_b.png"),
      LINKEDIN_D: require(".././Assets/Img/logo social1_b.png"),
};
const {height, width} = Dimensions.get('window');
export default class FeedEdit extends Component {
    constructor(props) {
      super(props);
      this.state = {
          user: this.props.user,
          topevent: this.props.topevent,
          loading: false,
          data:this.props.editdata,
      }

    }
    render() {
      return(
        <LinearGradient
          start={this.state.topevent.theme.bg_gradient.start}
          end={this.state.topevent.theme.bg_gradient.end}
          locations={this.state.topevent.theme.bg_gradient.locations}
          colors={this.state.topevent.theme.bg_gradient.colors}
          style={{ flex: 1 }}
        >
            <Header openDrawer={this.props.openDrawer} currentScene={"Details"} topevent={this.props.topevent} user={this.props.user} sudonav={this.props.sudonav}/>
            <ScrollView>

            </ScrollView>
        </LinearGradient>
      );
    }
}

const styles = StyleSheet.create({
  container: {
      flex:1,
  },
  centering: {
   alignItems: 'center',
   justifyContent: 'center',
   padding: 8,
 },
 content:{
   margin:10,
   flex:1,
   alignItems:'center'
 },
 icon:{
   width:15,
   height:15,
   marginRight:5,
 },
 title:{
   color: '#000',
   fontSize:18,
   fontFamily:'Roboto-Regular',
   marginRight:3
 },
 subtitle_pos:{
   color: '#666',
   fontSize:10,
   fontFamily:'Roboto-Medium',
 },
 subtitle_loc:{
   color: '#666',
   fontSize:11,
   fontFamily:'Roboto-Regular',
 },
 prof:{
   color: '#000',
   fontSize:12,
   fontFamily:'Roboto-Regular',
 }
});
