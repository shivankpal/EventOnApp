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
  ScrollView,
  Animated,
  Keyboard,
  Easing,
  RefreshControl,
  Alert
  } from 'react-native';
import ToastAndroid from '@remobile/react-native-toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
const {height, width} = Dimensions.get('window');
const imageSource = {
    chat_more_icon : require(".././Assets/Img/chat_more.png"),
    chat_send_icon : require(".././Assets/Img/chat_send.png"),
    chat_block_icon : require(".././Assets/Img/tac_10.png"),
};
export default class ChatData extends Component {
    constructor(props){
      super(props);
      this.state = {
          fromuser: this.props.user,
          touser:this.props.touser,
          chats: [],
          template:this.props.template,
          height:0,
          text: '',
          page: '',
          message: '',
          loading:true,
          refreshing:false,
      }
      this.height = new Animated.Value(0);
      this.slide = false;
      this.eventfunc;
      this.tempDate='';
      this.scrollFunc;
    }
    fetchChats = async () => {
      await fetch('https://api.eventonapp.com/api/loadChat/?from='+this.state.fromuser.id+'&to='+this.state.touser.id , {
         method: 'GET'
      }).then((response) => response.json())
      .then((responseJson) => {
        if(responseJson.data.chats.length==0 && this.props.template)
        {
            this.setState({message: "Hi "+this.state.touser.name+",\nIt is very nice to meet you. I'd be happy to connect. " });
        }
        else
        {
            this.setState({
              chats: responseJson.data.chats,
            },()=>{
                this.tempDate='';
                this.scrollFunc = setTimeout(()=>{this.chat_box.scrollToEnd({animated: false})},100)
            });
        }
        this.receiveMsg();
      }).catch((error) => { this.receiveMsg();  });
    }
    componentDidMount(){
      if(this.state.user===false)
      {
          this.setState({message: "Hi "+this.state.touser.name+",\nIt is very nice to meet you. I'd be happy to connect. " });
      }
      else{
        setTimeout(()=>{ this.fetchChats() },700);
      }
    }
    componentWillUnmount(){
       clearTimeout(this.eventfunc);
       clearTimeout(this.scrollFunc);
    }

    renderRows = () => {
      if(this.state.chats.length)
      {
          return this.state.chats.map((o,i) => {
                return (
                     <View key={i} style={{padding:15}}>
                         { (this.tempDate!= o.date) ? this.renderHeader(o.date) : null}
                         { (o.from_user == this.state.fromuser.id) ? this.rightChat(o) : this.leftChat(o) }
                     </View>
                )
           })
      }
      else{
        return null;
      }
    }

    renderHeader = (date) => {
        this.tempDate = date;
        return (<Text style={{fontSize:9,color:'#000',fontFamily:'Roboto-Regular',textAlign:'center'}}>{date}</Text>)
    }

    leftChat = (o) => {
        return (
          <View style={styles.left}>
              <Text style={styles.l_text}>{o.message}</Text>
              <Text style={{fontSize:9,color:'#999',fontFamily:'Roboto-Regular'}}>{o.time}</Text>
          </View>
        )
    }
    rightChat = (o) => {
      return (
        <View style={styles.right}>
            <Text style={styles.r_text} >{o.message}</Text>
            <Text style={{fontSize:9,color:'#999',fontFamily:'Roboto-Regular'}}>{o.time}</Text>
        </View>
      )
    }
    pushToLogin = () => {
        if(typeof this.props.sudonav != 'undefined')
        {
            this.props.sudonav.resetTo({ id: 'SudoLogin'});
        }
    }
    sender = () => {
      if(this.state.fromuser===false)
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
             let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
             let x = new Date(Date.now());
             let fdate = (x.getDate() < 9) ? '0'+x.getDate(): x.getDate();
             let date = days[x.getDay()]+', '+fdate+' '+months[x.getMonth()];
             let h = x.getHours() > 12 ? x.getHours() - 12 : x.getHours();
             let ampm = x.getHours() >= 12 ? "PM" : "AM";
             let time =  h+':'+x.getMinutes()+' '+ampm;
             var chats = this.state.chats;
             var t = [];
             t['message'] = this.state.message;
             t['from_user'] = this.state.fromuser.id;
             t['to_user'] = this.state.touser.id;
             t['date'] = date;
             t['time'] = time;
             chats.push(t);
             this.setState({ chats:chats, message:'' }, () => {
               this.tempDate='';
                this.refs.message.setNativeProps({text: ''});
                this.sendMsg(this.state.fromuser.id,this.state.touser.id,t['message']);
                this.scrollFunc = setTimeout(()=>{this.chat_box.scrollToEnd({animated: false})},100)
             });
          }
      }
    }
    sendMsg = async (from,to,message) => {
      await fetch('https://api.eventonapp.com/api/sender', {
         method: 'POST',
         body: JSON.stringify({
          message: message,
          from: from,
          to:to
        })
      }).then((responseJson) => {  this.scrollFunc = setTimeout(()=>{this.chat_box.scrollToEnd({animated: false})},100)      })
      .catch((error) => { this.scrollFunc = setTimeout(()=>{this.chat_box.scrollToEnd({animated: false})},100)  });
    }
    updateSize = (height) => {
        this.setState({
          height
        });
    }
    receiveMsg = async () => {
      await fetch('https://api.eventonapp.com/api/receiver/'+this.state.fromuser.id+'/'+this.state.touser.id , {
         method: 'GET'
      }).then((response) => response.json())
      .then((responseJson) => {
          if(responseJson.data.length)
          {
               var chats = this.state.chats;
               chats = chats.concat(responseJson.data);
               this.setState({chats:chats},()=> {
                  this.tempDate = '';
                  this.scrollFunc = setTimeout(()=>{this.chat_box.scrollToEnd({animated: false})},100)
              } );
          }
          this.eventfunc = setTimeout(() => this.receiveMsg() , 3000)
      }).catch((error) => {  this.eventfunc = setTimeout(() => this.receiveMsg() , 3000)  });
    }
    showPop = () => {
        if(this.slide){
            Animated.timing(
                  this.height,
                  {
                    toValue: 0,
                    duration: 300,
                    easing: Easing.linear
                  }
            ).start( ()=>{ this.slide = false; } );
        }
        else{
            Animated.timing(
                  this.height,
                  {
                    toValue: 100,
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
            fetch('https://api.eventonapp.com/api/loadPrevChat?from='+this.state.fromuser.id+'&to='+this.state.touser.id+'&prev_id='+prev_id, {
               method: 'GET'
            }).then((response) => response.json())
            .then((responseJson) => {
                  if(responseJson.data.chats.length)
                  {
                      this.setState({chats:[...responseJson.data.chats, ...this.state.chats]});
                  }
                  this.setState({refreshing:false})
            }).catch((error) => { this.setState({refreshing:false})  });
        }
    }
    render () {
      this.tempDate='';
      return (
        <View style={{flex:1}}>
          <ScrollView
            alwaysBounceVertical={false}
            ref={ref => this.chat_box = ref}
            refreshControl={
              <RefreshControl refreshing={this.state.refreshing} onRefresh={this.loadPreviousChat.bind(this)} />
            }
            style={{flex:1,padding:10}}>
                { this.renderRows() }
          </ScrollView>
          <Animated.View style={{overflow:'hidden',opacity:this.height, height:this.height,backgroundColor:'#FFF',borderTopColor:'#EFEFEF',borderTopWidth:1,justifyContent:'center'}}>
            <ScrollView alwaysBounceVertical={false} keyboardShouldPersistTaps={'always'}>
              <View style={{flexDirection:'row',flexWrap:'wrap',flex:1,padding:10}}>
                <TouchableOpacity onPress={()=> this.addToText('How are you ?') }>
                  <Text style={styles.quick}>How are you ?</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> this.addToText('Are you coming to event ?') }>
                  <Text style={styles.quick}>Are you coming to event ?</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> this.addToText('Hey. I would like to connect ?') }>
                  <Text style={styles.quick}>Hey. I would like to connect ?</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> this.addToText('Hi '+this.state.touser.name+', I think we share common interests. I would love to setup a time to chat at the event.') }>
                  <Text style={styles.quick}>Hi {this.state.touser.name}, I think we share common interests. I would love to setup a time to chat at the event.</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> this.addToText('Hi '+this.state.touser.name+', Its very nice to meet you. I\'d be happy to connect.') }>
                  <Text style={styles.quick}>Hi {this.state.touser.name}, Its very nice to meet you. {"I'd be happy to connect"}.</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> this.addToText('Hi '+this.state.touser.name+', I\'m here at the event. I\'d love to meet up to discuss a possible collaboration  opportunity. Hope to see you soon. .') }>
                  <Text style={styles.quick}>Hi {this.state.touser.name}, I'm here at the event. I'd love to meet up to discuss a possible collaboration  opportunity. Hope to see you soon.</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Animated.View>
          <View style={{ borderTopColor: '#EFEFEF', borderTopWidth: 1, flexDirection: 'row', height: 50 }}>
            <TextInput
              style={{ flex: 1, padding: 5, paddingLeft: 10, maxHeight: 100, minHeight: 50, height: this.state.height, backgroundColor: '#EAEAEA', fontFamily: 'Roboto-Regular', color: '#222'}}
              underlineColorAndroid={'transparent'}
              placeholder={"Type a message"}
              placeholderTextColor={'#8F8F8F'}
              ref="message"
              onChange={(event) => {
                this.setState({
                  message: event.nativeEvent.text,
                  height: event.nativeEvent.contentSize.height,
                });
              }}
              value={this.state.message}
              multiline={true}
              onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}
            />
            <TouchableOpacity onPress={() => { this.showPop() }} >
              <View style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center', borderLeftColor: 'rgba(0,0,0,0.2)', borderLeftWidth: 1, backgroundColor: '#FFF' }}>
                <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={imageSource.chat_more_icon} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { this.sender() }} >
              <View style={{ width: 60, height: 50, justifyContent: 'center', alignItems: 'center', borderLeftColor: 'rgba(0,0,0,0.2)', borderLeftWidth: 1, backgroundColor: '#FFF' }}>
                <Image style={{ width: 30, height: 30, resizeMode: 'contain' }} source={imageSource.chat_send_icon} />
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
    overflow:'hidden',
 },
 right:{
   justifyContent:'center',
   alignItems:'flex-end',
   marginVertical:5,
   overflow:'hidden',
 },
 l_text:{
    padding:10,
    borderRadius:5,
    backgroundColor:'#EFEFEF',
    fontFamily:'Roboto-Regular',
    color:'#333',
    overflow:'hidden',
 },
 r_text:{
    padding:10,
    borderRadius:5,
    backgroundColor:'#6699FF',
    fontFamily:'Roboto-Regular',
    color:'#FFF',
    overflow:'hidden',
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
   fontSize:11,
   borderColor:'#6699FF',
 }
});
