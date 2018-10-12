'use strict';
import React, { Component } from 'react';
import { View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  NativeModules,
  AsyncStorage,
  KeyboardAvoidingView,
  Dimensions,
  } from 'react-native';
import ToastAndroid from '@remobile/react-native-toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import { Actions } from 'react-native-router-flux';
import ChatData from './ChatData';
import Header from '.././Main/Header';
const imageSource = {
      chat_block_icon : require(".././Assets/Img/tac_10.png"),
      profile_icon : require(".././Assets/Img/default_p.png"),
};
const {height, width} = Dimensions.get('window');
export default class Chat extends Component {
    constructor(props){
      super(props);
      this.state = {
         user:this.props.user,
         topevent:this.props.topevent,
         touser:this.props.touser,
         template:false,
         attended:[],
      }
    }
    showPeople = (id) => {
        Actions.PeopleData({showid:id});
    }
    componentWillMount(){
        this.props.hideShowFloatBtn(false);
        setTimeout(()=>{ this.fetchStatus() },600);
    }
    componentWillUnmount(){
        this.props.hideShowFloatBtn(true);
    }
    fetchStatus = async () => {
      await fetch('https://api.eventonapp.com/api/chatStatus/'+this.state.user.id+'/'+this.state.touser.id, {
         method: 'GET'
      }).then((response) => response.json())
      .then((responseJson) => {
        this.setState({attended:responseJson.data.status});
      }).catch((error) => {   });
    }

    render () {
        if(this.state.touser.image!='undefined') {
          return (

            <LinearGradient
              start={this.state.topevent.theme.bg_gradient.start}
              end={this.state.topevent.theme.bg_gradient.end}
              locations={this.state.topevent.theme.bg_gradient.locations}
              colors={this.state.topevent.theme.bg_gradient.colors}
              style={{ flex: 1 }}
            >
              <Header openDrawer={this.props.openDrawer} currentScene={"Chat"} topevent={this.props.topevent} isback={true} sudonav={this.props.sudonav}/>

              <View style={{ flex: 1, margin: 15,borderTopLeftRadius:10,borderTopRightRadius:10,overflow:'hidden'}}>
                    <View style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10,backgroundColor:'#FFF',padding:10,flexDirection:'row',elevation:1,borderBottomWidth:1,borderBottomColor:'#EAEAEA'}}>
                        { (this.state.touser.image!='') ? <TouchableOpacity onPress={()=>this.showPeople(this.state.touser.id)}><Image source={{uri:this.state.touser.image}} style={styles.profileicon} /></TouchableOpacity> :  <TouchableOpacity onPress={()=>this.showPeople(this.state.touser.id)}><Image source={imageSource.profile_icon} style={styles.profileicon}/></TouchableOpacity> }
                        <TouchableOpacity onPress={()=>this.showPeople(this.state.touser.id)} style={{flexDirection:'column',flex:1}}>
                            <Text style={{fontFamily:'Roboto-Medium',color:'#444',fontSize:15}}>{this.state.touser.name}</Text>
                            <Text style={{fontFamily:'Roboto-Regular',color:'#666',fontSize:11}}>{ this.state.attended }</Text>
                        </TouchableOpacity>
                    </View>
                    <KeyboardAwareScrollView
                      contentContainerStyle={{ flex: 1}}
                      extraScrollHeight={100}
                      keyboardShouldPersistTaps={'always'}
                      alwaysBounceVertical={false}
                      scrollEnabled={false}
                    >
                        <View style={{flex:1,backgroundColor:'#FFF'}}>
                          <ChatData user={this.state.user} touser={this.state.touser} template={this.props.template} />
                        </View>
                    </KeyboardAwareScrollView>
                </View>

            </LinearGradient>

          )
       }
       else{
         return (
           <LinearGradient
             start={this.state.topevent.theme.bg_gradient.start}
             end={this.state.topevent.theme.bg_gradient.end}
             locations={this.state.topevent.theme.bg_gradient.locations}
             colors={this.state.topevent.theme.bg_gradient.colors}
             style={{ flex: 1 }}
           >
                  <Header openDrawer={this.props.openDrawer} currentScene={"Chat"} topevent={this.props.topevent} isback={true} sudonav={this.props.sudonav}/>

            </LinearGradient>
         );
       }
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
