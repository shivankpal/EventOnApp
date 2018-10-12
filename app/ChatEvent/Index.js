'use strict';
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  NativeModules,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ToastAndroid from '@remobile/react-native-toast';
import LinearGradient from 'react-native-linear-gradient';
import ChatData from './ChatData';
import Header from '.././Main/Header';
const {height, width} = Dimensions.get('window');
const imageSource = {
        profile_icon : require(".././Assets/Img/default_p.png"),
};
export default class Index extends Component {
   constructor(props){
     super(props);
     this.state = {
       topevent:this.props.topevent,
       user:this.props.user,
     }
   }
   componentWillMount(){
     this.props.googleTracker('MY EVENT ASSISTANT:'+this.state.topevent.title);
     this.props.setCurrentScene('MY EVENT ASSISTANT');
     this.props.hideShowFloatBtn(false);
   }
   componentWillUnmount(){
      this.props.hideShowFloatBtn(true);
   }
    render () {
      var to = this.props.topevent;
      return (
        <LinearGradient
                start={this.state.topevent.theme.bg_gradient.start}
                end={this.state.topevent.theme.bg_gradient.end}
                locations={this.state.topevent.theme.bg_gradient.locations}
                colors={this.state.topevent.theme.bg_gradient.colors}
                style={{ flex: 1 }}
            >
            <Header openDrawer={this.props.openDrawer} currentScene={"My Event Assistant"} topevent={this.props.topevent} isback={true} sudonav={this.props.sudonav}/>
            <View style={{flex:1,margin:15,borderTopLeftRadius:10,borderTopRightRadius:10,overflow:'hidden'}}>
                <View style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10, backgroundColor: '#FFF',padding:10,flexDirection:'row',elevation:1,borderBottomWidth:1,borderBottomColor:'#EAEAEA' }}>
                    { (to.image_small!='') ? <Image source={{uri:to.image_small}} style={styles.profileicon} /> :  <Image source={imageSource.profile_icon} style={{width:80,height:80}}/>}
                    <View style={{flexDirection:'column',flex:1}}>
                      <Text style={{fontFamily:'Roboto-Medium',color:'#444',fontSize:15}}>{to.title}</Text>
                    </View>
                    <View style={{width:20,height:20}}>

                    </View>
                </View>
                <KeyboardAwareScrollView
                  contentContainerStyle={{ flex: 1 }}
                  extraScrollHeight={100}
                  keyboardShouldPersistTaps={'always'}
                  alwaysBounceVertical={false}
                  scrollEnabled={false}
                >
                  <View style={{flex:1,backgroundColor:'#FFF'}}>
                        <ChatData topevent={this.state.topevent} user={this.state.user} />
                  </View>
                </KeyboardAwareScrollView>
            </View>
        </LinearGradient>
      )
    }
}
const styles = StyleSheet.create({
  profileicon: {
    marginRight:10,
    width:50,
    height:50,
    resizeMode:'cover',
    borderRadius:25
  }
})
