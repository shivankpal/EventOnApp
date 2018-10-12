'use strict';
import React, { Component } from 'react';
import { View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  TextInput,
  NativeModules,
  AsyncStorage,
  KeyboardAvoidingView,
  Dimensions,
  ScrollView,
  Animated,
  Keyboard,
  Easing,
  RefreshControl,
  Linking,
  Alert
  } from 'react-native';
import timer from 'react-native-timer';
import { Actions,ActionConst } from 'react-native-router-flux';
import ToastAndroid from '@remobile/react-native-toast';
const {height, width} = Dimensions.get('window');
const imageSource = {
      chat_more_icon : require(".././Assets/Img/chat_more.png"),
      chat_send_icon : require(".././Assets/Img/chat_send.png"),
};
export default class ChatData extends Component {
    constructor(props){
      super(props);
      this.state = {
         topevent:this.props.topevent,
         user:this.props.user,
         text: '',
         payload:'',
         page: '',
         open:false,
         chats:[],
         message:'',
         refreshing:false,
      }
      this.height = new Animated.Value(0);
      this.slide = false;
      this.receiveMsg = this.receiveMsg.bind(this);
      this.eventfunc;
      this.tempDate = '';
   }
   componentWillMount(){
      setTimeout(()=>{
          this.fetchChats(this.state.user.id,this.state.topevent.id);
      },400)
    }
    componentWillUnmount(){
        timer.clearTimeout('receiver');
    }
    fetchChats = async (uid,eid) => {
        await fetch('https://api.eventonapp.com/api/loadEventChat/?user_id='+uid+'&event_id='+eid , {
           method: 'GET'
        }).then((response) => response.json())
        .then((responseJson) => {
          if(responseJson.data!=null)
          {
              this.setState({
                chats: responseJson.data,
              },()=>{
                  this.tempDate = '';
                  this.receiveMsg();
                  setTimeout(()=>{this.chat_box.scrollToEnd({animated: false})},100)
              });
          }
        }).catch((error) => {      });
    }
    leftChat = (d) => {
      if(d.structure.length > 0)
      {
         var odata = JSON.parse(d.structure);
         return odata.map((o,i) => {
                if(o.type=='BUTTONS')
                {
                    return (
                      <View key={i} style={styles.left}>
                          <Text style={styles.l_text}>{o.content.text}</Text>
                          <ScrollView alwaysBounceVertical={false} horizontal={true} showsHorizontalScrollIndicator={false} style={{marginVertical:20,marginHorizontal:5}}>
                              {
                                  o.content.elements.map((p,j) => {
                                    return (
                                          <TouchableWithoutFeedback key={j} onPress={()=>this.btnSender(p)}>
                                              <View style={{borderWidth:1,borderColor:'#292E39',paddingVertical:7,paddingHorizontal:15,margin:5,borderRadius:5}}>
                                                  <Text style={{textAlign:'center',color:'#292E39'}}>{p.text}</Text>
                                              </View>
                                          </TouchableWithoutFeedback>
                                    )
                                  })
                             }
                          </ScrollView>
                      </View>
                    )
                }
                else{
                  return null;
                }
        })
      }
      else
      {
          return (
            <View style={styles.left}>
                {this.highlight(d.message,styles.l_text)}
                <Text style={{fontSize:9,color:'#999',fontFamily:'Roboto-Regular'}}>{d.time}</Text>
            </View>
          )
      }
    }
    rightChat = (o) => {
      return (
        <View style={styles.right}>
            {this.highlight(o.message,styles.r_text)}
            <Text style={{fontSize:9,color:'#999',fontFamily:'Roboto-Regular'}}>{o.time}</Text>
        </View>
      )
    }
    onPressCall(num) {
    	const url = 'tel:'+num;
    	Linking.canOpenURL(url)
    		.then((supported) => {
    			if (supported) {
    				return Linking.openURL(url)
    					.catch(() => null);
    			}
    		});
    }
    moveToLink = (url) => {
        Actions.Web({url:url})
    }
    highlight = (text,st) => {
      let ta = [];
      let part = text.replace(/[0-9()\-\. +]{10,}/g, '<Replace>$&</Replace>');
      part = part.replace(/(https?:\/\/[^\s]+)/g, '<Replace>$&</Replace>');
      part = part.split('</Replace>');
      for(var i = 0; i < part.length; i++) {
        let j = part[i].split('<Replace>');
        for(var k=0; k < j.length; k++)
        {
            if (j[k].match(/[0-9()\-\. +]{10,}/)) {
              let num = j[k];
              ta.push(<Text key={Math.random()} onPress={()=>{ this.onPressCall(num) }}  style={{color:'#4267B2',textDecorationLine:'underline',fontFamily:'Roboto-Medium',fontSize:15,padding:3}}>{num}</Text>);
            }
            else if (j[k].match(/(https?:\/\/[^\s]+)/)) {
              let num = j[k];
              ta.push(<Text key={Math.random()} onPress={()=>{ this.moveToLink(num) }}  style={{color:'#4267B2',textDecorationLine:'underline',fontFamily:'Roboto-Medium',fontSize:15,padding:3}}>{num}</Text>);
            }
            else{
              ta.push(j[k]);
            }
        }
      }
      return <Text style={st}>{ta}</Text>;
    }
    renderHeader = (date) => {
        this.tempDate = date;
        return (<Text style={{fontSize:9,color:'#000',fontFamily:'Roboto-Regular',textAlign:'center'}}>{date}</Text>)
    }
    pushScreens = (path) => {
      switch (path[0]) {
        case 'Event_Home':
          Actions.Main({type:'push',movetotab:path[1]});
          break;
        case 'Meetup':
              Actions.Meetup();
              break;
        case 'Downloads':
            Actions.Downloads();
            break;
        default:
            Actions.Main()
      }
    }
    btnSender = (p) => {
      if(typeof p.target != 'undefined' &&  p.target!='')
      {
          let l = p.target.split(':');
          this.pushScreens(l);
      }
      else{
        this.setState({message:p.text,payload:''},()=>{
          if(typeof p.payload != 'undefined' &&  p.payload!='')
          {
              this.setState({payload:p.payload});
          }
          this.sender()
        })
      }
    }
    pushToLogin = () => {
        if(typeof this.props.sudonav != 'undefined')
        {
            this.props.sudonav.resetTo({ id: 'SudoLogin'});
        }
    }
    sender = () => {
      if(this.state.user===false)
      {
         AsyncStorage.getItem('DEMOERRORMSG').then((msg) => {
             if(msg!=null){
                 Alert.alert('',
                   msg,
                   [
                     {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                     {text: 'Continue Login', onPress: () => { this.pushToLogin() }},
                   ],
                   { cancelable: false }
                 )
                 return false;
             }
         })
      }
      else{
        if(this.state.message.trim().length)
        {
            let days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
            let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            let x = new Date(Date.now());
            let date = days[x.getDay()]+', '+x.getDate()+' '+months[x.getMonth()];
            let h = x.getHours() > 12 ? x.getHours() - 12 : x.getHours();
            let ampm = x.getHours() >= 12 ? "PM" : "AM";
            let time =  h+':'+x.getMinutes()+' '+ampm;
            var chats = this.state.chats;
             var t = [];
             t['sender'] = 'USER';
             t['message'] = this.state.message;
             t['date'] = date;
             t['time'] = time;
             chats.push(t);
             this.setState({chats:chats,message:''},() => {
                this.tempDate = '';
                this.refs.message.setNativeProps({text: ''});
                this.sendMsg(this.state.user.id, this.state.topevent.id, t['message']);
                setTimeout(()=>{this.chat_box.scrollToEnd({animated: false})},100)
             });
        }
      }
    }
    sendMsg = async (user_id,event_id,message) => {
      await fetch('https://api.eventonapp.com/api/senderEvent/?user_id='+user_id+'&event_id='+event_id+'&message='+encodeURIComponent(message)+'&payload='+encodeURIComponent(this.state.payload), {
         method: 'GET'
      }).then((response) => response.json())
      .then((responseJson) => { setTimeout(()=>{this.chat_box.scrollToEnd({animated: false})},100)  }).catch((error) => { });
    }

    receiveMsg = async () => {

      await fetch('https://api.eventonapp.com/api/receiverEvent/'+this.state.user.id+'/'+this.state.topevent.id+'/'+Math.random(), {
         method: 'GET'
      }).then((response) => response.json())
      .then((responseJson) => {
            if(responseJson.data.length)
            {
                var chats = this.state.chats;

                chats = chats.concat(responseJson.data);
                this.setState({chats:chats},()=>{
                  this.tempDate = '';
                  setTimeout(()=>{this.chat_box.scrollToEnd({animated: false})},100)
                });
            }
            timer.setTimeout('receiver',() =>{ this.receiveMsg(); }  , 3000)
      }).catch((error) => { timer.setTimeout('receiver',() =>{ this.receiveMsg(); }  , 3000) });
    }
    showPop = () => {
      if(this.slide)
      {
        Animated.timing(
              this.height,
              {
                toValue: 0,
                duration: 300,
                easing: Easing.linear
              }
        ).start( ()=>{ this.slide = false; } );
      }
      else {
          Animated.timing(
                this.height,
                {
                  toValue: 120,
                  duration: 300,
                  easing: Easing.linear
                }
          ).start(()=>{ this.slide = true });
      }
    }
    addToText = (message) => {
      this.setState({message},()=>{
        this.refs.message.setNativeProps({text: message});
        this.showPop();
      })
    }
    loadPreviousChat = () => {
        this.setState({refreshing:true});
        if(this.state.chats.length)
        {
            let prev_id = this.state.chats[0].id;
            fetch('https://api.eventonapp.com/api/loadPrevEventChat?user_id='+this.state.user.id+'&event_id='+this.state.topevent.id+'&prev_id='+prev_id, {
               method: 'GET'
            }).then((response) => response.json())
            .then((responseJson) => {
                  if(responseJson.data.length)
                  {
                      this.setState({chats:[...responseJson.data, ...this.state.chats]});
                  }
                  this.setState({refreshing:false})
            }).catch((error) => { this.setState({refreshing:false})  });
        }
    }

    render () {
      return (
        <View style={{flex:1}}>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={this.state.refreshing} onRefresh={this.loadPreviousChat.bind(this)} />
            }
            ref={ref => this.chat_box = ref}
            style={{flex:1}}>
              {
                 this.state.chats.map((o,i) => {
                      return (
                          <View key={i} style={{padding:15}}>
                              { (this.tempDate!= o.date) ? this.renderHeader(o.date) : null }
                              { (o.sender == 'USER') ? this.rightChat(o) : this.leftChat(o) }
                          </View>
                      )
                 })
              }
          </ScrollView>
          <Animated.ScrollView style={{opacity:this.height, flex:1,position:'absolute',zIndex:10,height:this.height,left:0,right:0,bottom:50,backgroundColor:'#FFF'}}>
              <View style={{flexDirection:'row',flexWrap:'wrap',flex:1,borderTopColor:'#EAEAEA',borderTopWidth:0.2,padding:10}}>
                <TouchableOpacity onPress={()=> this.addToText('How are you ?') }><Text style={styles.quick}>How are you ?</Text></TouchableOpacity>
                <TouchableOpacity onPress={()=> this.addToText('Are you coming to event ?') }><Text style={styles.quick}>Are you coming to event ?</Text></TouchableOpacity>
                <TouchableOpacity onPress={()=> this.addToText('Hey. I would like to connect ?') }><Text style={styles.quick}>Hey. I would like to connect ?</Text></TouchableOpacity>
              </View>
          </Animated.ScrollView>
          <View style={{ borderTopColor:'#EFEFEF',borderTopWidth:1,flexDirection:'row' ,height:50 }}>
              <TextInput
                style={{ flex: 1, padding: 5, paddingLeft: 10, height:50,backgroundColor:'#EAEAEA',fontFamily:'Roboto-Regular',color:'#222'}}
                underlineColorAndroid={'transparent'}
                placeholder={"Type a message"}
                placeholderTextColor={'#8F8F8F'}
                ref="message"
                onChangeText = {(message) => this.setState({message})}
              />
              <TouchableOpacity onPress={()=>{ this.showPop() }}>
                    <View style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center', borderLeftColor: 'rgba(0,0,0,0.2)', borderLeftWidth: 1, backgroundColor: '#FFF' }}>
                        <Image style={{width:20,height:20,resizeMode:'contain'}} source={imageSource.chat_more_icon} />
                    </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>{ this.sender() }}>
                    <View style={{ width: 60, height: 50, justifyContent: 'center', alignItems: 'center', borderLeftColor: 'rgba(0,0,0,0.2)', borderLeftWidth: 1, backgroundColor: '#FFF'  }}>
                        <Image style={{width:30,height:30,resizeMode:'contain'}} source={imageSource.chat_send_icon} />
                    </View>
              </TouchableOpacity>
          </View>
        </View>
      )
    }
}

const styles = StyleSheet.create({
 left:{
    justifyContent:'center',
    alignItems:'flex-start',
    marginVertical:5,
    overflow:'hidden'
 },
 right:{
   justifyContent:'center',
   alignItems:'flex-end',
   marginVertical:5,
   overflow:'hidden'
 },
 l_text:{
    padding:10,
    borderRadius:5,
    backgroundColor:'#EFEFEF',
    fontFamily:'Roboto-Regular',
    color:'#333',
    overflow:'hidden'
 },
 r_text:{
    padding:10,
    borderRadius:5,
    backgroundColor:'#6699FF',
    fontFamily:'Roboto-Regular',
    color:'#FFF',
    overflow:'hidden'
 },
 quick:{
   padding:3,
   margin:3,
   paddingHorizontal:6,
   borderRadius:10,
   backgroundColor:'#FFF',
   fontFamily:'Roboto-Regular',
   color:'#6699FF',
   borderWidth:1,
   fontSize:12,
   borderColor:'#6699FF',
 }
});
