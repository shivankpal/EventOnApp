'use strict';
import React, { Component } from 'react';
import { View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback
  } from 'react-native';
import ActionButton from 'react-native-action-button';
import {Actions} from 'react-native-router-flux';
const HEADER_MAX_HEIGHT = 60;
const HEADER_MIN_HEIGHT = 22;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
var imageSource = {
        flower_plus : require(".././Assets/Img/flower_plus.png"),
        Scan_Business_Card : require(".././Assets/Img/flower_card.png"),
        Add_A_Note : require(".././Assets/Img/flower_note.png"),
        Post_A_Pic : require(".././Assets/Img/photo-camera.png"),
        Chat : require(".././Assets/Img/flower_chat.png"),
}
const getTransformStyle = (animation) =>  {
  return {
    transform:[
      {translateY: animation}
    ]
  }
}
var {height, width} = Dimensions.get('window');
export default class FloatButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
        reference:this.props.currentScene,
        scrollY: new Animated.Value(0),
        animate: new Animated.Value(0),
        fabs: [
          new Animated.Value(0),
          new Animated.Value(0),
          new Animated.Value(0),
          new Animated.Value(0),
        ],
        widths: [
          200,
          170,
          150,
          120,
        ],
        title:[
          "Scan Business Card",
          "Add A Note",
          "Post A Pic",
          "Chat",
        ],
        open: false,
    }
    this.opacity = new Animated.Value(0);
    this.open = false;
    this.postionInterpolate = new Animated.Value(0);
    this.handlePress = this.handlePress.bind(this);
  }
  handlePress = ()  =>{
    const toValue = this.open ? 0 : 1;
    const flyouts = this.state.fabs.map((value,i) => {
      return Animated.spring(value,{
          toValue: (i + 1) * -60 * toValue,
          friction: 10
      })
    })
    Animated.parallel([
      Animated.timing(this.postionInterpolate,{toValue,duration:200}),
      Animated.timing(this.opacity,{toValue,duration:200}),
      Animated.timing(this.state.animate,{toValue,duration:200}),
      Animated.stagger(0,flyouts)
    ]).start();
    this.open = !this.open;
  }
  moveToNext = (i) =>{
      this.handlePress();
      if(i==3)
      {
          Actions.Chats();
      }
      if(i==2)
      {
         this.props.slideToShow();
      }
      if(i==1)
      {
          Actions.Note({reference:this.state.reference});
      }
      if(i==0)
      {
          Actions.Card({reference:this.state.reference});
      }
  }

  render() {
    const backgroundInterpolate = this.state.animate.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(0,0,0,0)','rgba(0,0,0,0.5)']
    })
    const backgroundStyle = {   backgroundColor: backgroundInterpolate  }
    const buttonRotate = this.state.animate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg','135deg']
    })
    const buttonStyle = {
        backgroundColor: '#6699ff',
        transform: [{
          rotate: buttonRotate
        }]
    }
    const topInterpolate = this.postionInterpolate.interpolate({
        inputRange: [0, 1],
        outputRange: [height-150,0]
    })
    const leftInterpolate = this.postionInterpolate.interpolate({
        inputRange: [0, 1],
        outputRange: [width-100,0]
    })
    const shadowOpt = {
        width:60,
        height:60,
        color:"#000",
        border:0,
        radius:1,
        opacity:0.1,
        x:1,
        y:1,
        style:{borderRadius:30},
    }
     return (
           <ActionButton bgColor='rgba(0,0,0,0.5)' useNativeFeedback={true} buttonColor="#6699ff" icon={<Image style={{width:25,height:25}} source={imageSource.flower_plus} />} spacing={10}>
               <ActionButton.Item textContainerStyle={{backgroundColor:'#6699FF'}} textStyle={{color:'#FFF'}} useNativeFeedback={true} spaceBetween={10} title = {this.state.title[0]} buttonColor='#6699ff' onPress={()=>{ this.moveToNext(0) }} style={{width:20,height:20}}>
                  <Image style={{width:20,height:20,resizeMode:'contain'}} source={imageSource[this.state.title[0].replace(new RegExp(' ', 'g'),'_')]}/>
               </ActionButton.Item>
               <ActionButton.Item textContainerStyle={{backgroundColor:'#6699FF'}} textStyle={{color:'#FFF'}} useNativeFeedback={true} spaceBetween={10} title = {this.state.title[1]} buttonColor='#6699ff' onPress={()=>{ this.moveToNext(1) }} style={{width:20,height:20}}>
                  <Image style={{width:20,height:20,resizeMode:'contain'}} source={imageSource[this.state.title[1].replace(new RegExp(' ', 'g'),'_')]}/>
               </ActionButton.Item>
               <ActionButton.Item textContainerStyle={{backgroundColor:'#6699FF'}} textStyle={{color:'#FFF'}} useNativeFeedback={true} spaceBetween={10} title = {this.state.title[2]} buttonColor='#6699ff' onPress={()=>{ this.moveToNext(2) }} style={{width:20,height:20}}>
                  <Image style={{width:20,height:20,resizeMode:'contain'}} source={imageSource[this.state.title[2].replace(new RegExp(' ', 'g'),'_')]}/>
               </ActionButton.Item>
               <ActionButton.Item textContainerStyle={{backgroundColor:'#6699FF'}} textStyle={{color:'#FFF'}} useNativeFeedback={true} spaceBetween={10} title = {this.state.title[3]} buttonColor='#6699ff' onPress={()=>{ this.moveToNext(3) }} style={{width:20,height:20}}>
                  <Image style={{width:20,height:20,resizeMode:'contain'}} source={imageSource[this.state.title[3].replace(new RegExp(' ', 'g'),'_')]}/>
               </ActionButton.Item>
            </ActionButton>
         )
    }
}


const styles = StyleSheet.create({
   position: {
     position: 'absolute',
     right: 25,
     bottom: 25,
   },
   fab: {
     position: 'absolute',
     bottom: 10,
     right: 10,
     width:220,
     height:50,
     backgroundColor:'transparent',
     flexDirection:'row',
     alignItems:'center',
     justifyContent:'flex-end',
   },
   button: {
     width:40,
     height:40,
     borderRadius: 20,
     alignItems: 'center',
     justifyContent: 'center',
     backgroundColor:'#6699ff',
   },

});
