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
  StatusBar,
  Alert
  } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ToastAndroid from '@remobile/react-native-toast';
import ChatData from './ChatData';
import CustomStatusBar from '.././Common/CustomStatusBar';
const imageSource = {
      chat_block_icon : require(".././Assets/Img/tac_10.png"),
      profile_icon : require(".././Assets/Img/pro_name.png"),
      arrow_left: require(".././Assets/Img/arrow_left.png"),
};
const {height, width} = Dimensions.get('window');
export default class Chat extends Component {
    constructor(props){
      super(props);
      this.state = {
         user:this.props.user,
         topevent:this.props.topevent,
         chats:[],
         touser:this.props.touser,
         template:false,
         attended:'',
         ouser:[],
      }
    }
    componentWillMount(){
      AsyncStorage.getItem('USER').then((ouser) => {
          if(ouser!=null)
          {
            this.setState({ouser:JSON.parse(ouser)});
          }
      })
      this.fetchChats();

    }
    fetchChats = async () => {
      await fetch('https://api.eventonapp.com/api/loadChat/?from='+this.state.user.id+'&to='+this.state.touser.id , {
         method: 'GET'
      }).then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          chats: responseJson.data.chats,
        },()=>{
          this.fetchStatus();
        });
      }).catch((error) => {   });
    }
    fetchStatus = async () => {
      await fetch('https://api.eventonapp.com/api/chatStatus/'+this.state.user.id+'/'+this.state.touser.id, {
         method: 'GET'
      }).then((response) => response.json())
      .then((responseJson) => {
        this.setState({attended:responseJson.data.status});
      }).catch((error) => {   });
    }
    pushBack = () => {
      this.props.navigator.pop();
    }
    blockPeople = (uid,toid) => {
      Alert.alert('',
        'This action will block this person permanently?',
        [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'OK', onPress: () => {
                      fetch('https://api.eventonapp.com/api/blockpeople/'+uid+"/"+toid, {
                         method: 'GET'
                      }).then((response) => {  this.props.refreshChat(toid); this.props.navigator.pop() })
                      .catch((error) => {  })
                }
          },
        ],
        { cancelable: false }
      )
    }
    showPeople = (id) => {
       if(this.state.ouser.id == id){
         this.props.navigator.push({id:'Profile',user:this.state.user})
       }
       else{
          this.props.navigator.push({id:'PeopleDetail',showid:id,user:this.state.user});
       }
    }

    render () {
        if(this.state.touser.image!='undefined'){
          return (
            <View style={{flex:1,backgroundColor:'#292E39'}}>
                <CustomStatusBar backgroundColor="#292E39" barStyle="light-content"/>
                <View style={styles.header}>
                    <View style={styles.header_left}>
                      <TouchableOpacity onPress={()=>this.pushBack()}>
                          <Image source={imageSource.arrow_left} style={{width:30,height:30}}></Image>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.header_center}>
                        <Text style={[styles.header_center_title,{color:'#9c9fa6'}]} ellipsizeMode={'tail'}  numberOfLines={1}>Chat</Text>
                    </View>
                    <View style={styles.header_right}>
                      <View style={{width:30,height:30}}>
                      </View>
                    </View>
                </View>
                <View style={{flex:1,margin:15,borderTopLeftRadius:10,borderTopRightRadius:10,overflow:'hidden'}}>
                    <View style={{borderTopLeftRadius: 10, borderTopRightRadius: 10,backgroundColor:'#FFF', padding:10,flexDirection:'row', elevation:1,borderBottomWidth:1,borderBottomColor:'#EAEAEA'}}>
                        { (this.state.touser.image!='') ? <TouchableOpacity onPress={()=>this.showPeople(this.state.touser.id)}><Image source={{uri:this.state.touser.image}} style={styles.profileicon} /></TouchableOpacity> :  <TouchableOpacity onPress={()=>this.showPeople(this.state.touser.id)}><Image source={imageSource.profile_icon} style={styles.profileicon}/></TouchableOpacity> }
                        <TouchableOpacity onPress={()=>this.showPeople(this.state.touser.id)} style={{flexDirection:'column',flex:1}}>
                            <Text style={{fontFamily:'Roboto-Medium',color:'#444',fontSize:15}}>{this.state.touser.name}</Text>
                            <Text style={{fontFamily:'Roboto-Regular',color:'#666',fontSize:11}}>{this.state.attended }</Text>
                        </TouchableOpacity>
                        <View>
                            <TouchableOpacity onPress={ ()=>this.blockPeople(this.state.user.id,this.state.touser.id) }>
                                <Image source={imageSource.chat_block_icon} style={{width:30,height:30}}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <KeyboardAwareScrollView
                      contentContainerStyle={{ flex: 1}}
                      extraScrollHeight={100}
                      keyboardShouldPersistTaps={'always'}
                      alwaysBounceVertical={false}
                      scrollEnabled={false}
                    >
                        <View style={{flex:1,backgroundColor:'#FFF'}}>
                           <ChatData user={this.state.user} touser={this.state.touser} chats={this.state.chats} template={this.props.template} />
                        </View>
                  </KeyboardAwareScrollView>
                </View>
            </View>
          )
       }
       else{
         return null;
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
  },
  header:{
     height:50,
     flexDirection:'row',
     alignItems:'center',
     borderBottomWidth:1,
     borderColor:'#363a4f'
  },
  header_left:{
    justifyContent: 'center',
    padding:10,
    flexDirection:'row',
  },
  header_center:{
     flex:1,
     justifyContent: 'center',
     alignItems: 'center',
     padding:5,
  },
  header_right:{
    justifyContent: 'center',
    padding:10,
    flexDirection:'row',
  },
  header_center_title:{
    color: 'white',
    margin: 10,
    fontSize: 16,
    fontFamily:'Roboto-Medium',
  }

})
