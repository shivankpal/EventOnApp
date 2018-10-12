'use strict';
import React, { Component } from 'react';
import { View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TextInput,
  AsyncStorage,
  Alert
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import BasicFeed from './BasicFeed';
import FacebookFeed from './FacebookFeed';
import TwitterFeed from './TwitterFeed';
const imageSource = {
          feed_icon_down : require(".././Assets/Img/feed_1_down.png"),
          fb_icon_down: require(".././Assets/Img/feed_2_down.png"),
          twitter_icon_down: require(".././Assets/Img/feed_3_down.png"),
          feed_icon_up : require(".././Assets/Img/feed_1_up.png"),
          fb_icon_up: require(".././Assets/Img/feed_2_up.png"),
          twitter_icon_up: require(".././Assets/Img/feed_3_up.png"),
          post_icon: require(".././Assets/Img/tac_6.png"),
};

export default class Feeds extends Component {
  constructor(props) {
    super(props);
    this.state = {
        user:this.props.user,
        topevent:this.props.topevent,
        data:[],
        isfetch:true,
        event_id:this.props.eventid,
        activeTab:'BASIC',
        modalVisible:false,
        tabData:<BasicFeed topevent={this.props.topevent} googleTracker={this.props.googleTracker} user={this.props.user} sudonav={this.props.sudonav} />,
        text:'Hello Everyone,\n\nThis is '+this.props.user.name+'. Looking forward to seeing you all.',
    };
  }
  componentWillMount(){
    this.props.setCurrentScene('Feeds');
    if(this.state.user===false)
    {
      return false;
    }
    else{
        AsyncStorage.getItem(this.state.topevent.id+'@FEEDPOP').then((data) => {
          if(data!=null)
          {
              this.setState({modalVisible:false})
          }
          else
          {
            setTimeout(()=>{
                this.setState({modalVisible:true})
            },400)
          }
        })
    }
  }
  pushToLogin = () => {
      if(typeof this.props.sudonav != 'undefined')
      {
          this.props.sudonav.resetTo({ id: 'SudoLogin'});
      }
  }
  saveToFeed = () => {
    if(this.state.user===false)
    {
       AsyncStorage.getItem('DEMOERRORMSG').then((msg) => {
           if(msg!=null){
               Alert.alert('',
                 msg,
                 [
                   {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                   {text: 'Continue Login', onPress: () => {this.pushToLogin()}},
                 ],
                 { cancelable: false }
               )
               return false;
           }
       })
    }
    else {
        var sudothis = this;
        var body = new FormData();
        body.append('user_id', this.state.user.id);
        body.append('event_id', this.state.topevent.id);
        body.append('content', this.state.text);
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          console.log(xhttp.status);
          if(xhttp.readyState == 4 && xhttp.status == 200) {
              AsyncStorage.setItem(sudothis.state.topevent.id+'@FEEDPOP', 'true',()=>{
                  sudothis.setState({modalVisible:false},()=>{
                      sudothis.setState({tabData:<BasicFeed topevent={sudothis.state.topevent} googleTracker={sudothis.props.googleTracker} user={sudothis.state.user} sudonav={sudothis.props.sudonav} />});
                  });
              })
          }
        };
        xhttp.open("POST", "https://api.eventonapp.com/api/addFeed", true);
        xhttp.setRequestHeader("Content-type", "multipart/form-data");
        xhttp.send(body);
    }
  }
  cancelToFeed = async () => {
      await AsyncStorage.setItem(this.state.topevent.id+'@FEEDPOP', 'true',()=>{
          this.setState({modalVisible:false})
      });
  }
  activateTab = (tab) => {
      this.setState({
          activeTab:tab
      },() => {
          if(tab=='BASIC')
          {
              this.setState({tabData:<BasicFeed topevent={this.state.topevent} googleTracker={this.props.googleTracker} user={this.state.user} sudonav={this.props.sudonav}/>});
          }
          if(tab=='FACEBOOK')
          {
              this.setState({tabData:<FacebookFeed topevent={this.state.topevent} googleTracker={this.props.googleTracker} user={this.state.user} sudonav={this.props.sudonav}/>});
          }
          if(tab=='TWITTER')
          {
              this.setState({tabData:<TwitterFeed topevent={this.state.topevent} googleTracker={this.props.googleTracker} user={this.state.user} sudonav={this.props.sudonav}/>});
          }
      })
  }
  render() {
    return (
      <View style={styles.container}>
          <View style={{backgroundColor:'#FFF',padding:5,borderTopLeftRadius:10,borderTopRightRadius:10}}></View>
          <View style={{backgroundColor:'#FFF',paddingHorizontal:10}}>
              <View style={{flexDirection:'row',alignItems:'center',paddingBottom:10}}>
                    <View style={{flex:2,flexDirection:'row'}}>
                        <TouchableOpacity onPress={ () => this.activateTab('BASIC') } style={{padding:2}}>
                          { (this.state.activeTab=='BASIC') ? <Image source={imageSource.feed_icon_up}  style={{width:55,height:35,marginRight:5,borderRadius:3}} /> : <Image source={imageSource.feed_icon_down}  style={{width:55,height:35,marginRight:5,borderRadius:3}} /> }
                        </TouchableOpacity>
                        <TouchableOpacity onPress={ () => this.activateTab('FACEBOOK') } style={{padding:2}}>
                          { (this.state.activeTab=='FACEBOOK') ? <Image source={imageSource.fb_icon_up} style={{width:55,height:35,marginRight:5,borderRadius:3}}/> : <Image source={imageSource.fb_icon_down} style={{width:55,height:35,marginRight:5,borderRadius:3}}/> }
                        </TouchableOpacity>
                        <TouchableOpacity onPress={ () => this.activateTab('TWITTER') } style={{padding:2}}>
                          { (this.state.activeTab=='TWITTER') ? <Image source={imageSource.twitter_icon_up} style={{width:55,height:35,marginRight:5,borderRadius:3}}/> : <Image source={imageSource.twitter_icon_down} style={{width:55,height:35,marginRight:5,borderRadius:3}}/> }
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => Actions.Post() } style={{flexDirection:'row',alignSelf:'flex-end',paddingVertical:2,paddingHorizontal:5,justifyContent:'center',alignItems:'center',borderRadius:3,borderWidth:1,borderColor:'#4D4D4D'}}>
                        <Image source={imageSource.post_icon} style={{width:18,height:18,resizeMode:'cover'}}/>
                        <Text style={{color:'#4D4D4D',fontSize:14,fontFamily:'Roboto-Medium'}}>Post</Text>
                    </TouchableOpacity>
              </View>
                {  this.state.tabData }
              </View>
              <View style={{backgroundColor:'#FFF',padding:10,borderBottomLeftRadius:10,borderBottomRightRadius:10,marginBottom:40}}></View>
              <Modal
                  animationType={"slide"}
                  transparent={true}
                  visible={this.state.modalVisible}
                  >
                  <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.4)',justifyContent:'center',alignItems:'center'}}>
                        <View style={{backgroundColor:'#FFF',borderRadius:10,width:'90%'}}>
                            <View style={{flexDirection:'row',backgroundColor:'#6699ff',justifyContent:'center',borderTopLeftRadius:10,borderTopRightRadius:10,alignItems:'center',overflow:'hidden'}}>
                                  <Text style={{flex:1,color:'#FFF',padding:10,fontFamily:'Roboto-Bold'}} >Introduce Myself to Everyone</Text>
                                  <TouchableOpacity style={{padding:10}} onPress={()=>this.cancelToFeed()} >
                                    <Text style={{color:'#FFF',fontFamily:'Roboto-Bold'}}>X</Text>
                                  </TouchableOpacity>
                            </View>
                            <View style={{padding:10}}>
                              <TextInput
                                textAlignVertical = {'top'}
                                multiline={true}
                                underlineColorAndroid={'transparent'}
                                style = {{borderWidth:1,backgroundColor:'#EAEAEA',borderColor:'#FAFAFA',width:'100%',borderRadius:10,color:'#333',height:130,padding:10}}
                                value = {this.state.text}
                                onChangeText = {(text) => this.setState({text})}
                              />
                            </View>
                            <View style={{alignItems:'flex-end',flexDirection:'row',marginBottom:10,paddingHorizontal:10,justifyContent:'flex-end'}}>
                                  <TouchableOpacity onPress={()=>this.saveToFeed()} style={{flexWrap:'wrap',paddingVertical:5,paddingHorizontal:15,borderRadius:5,backgroundColor:'#6699ff',alignSelf:'flex-end'}}>
                                      <Text style={{color:'#FFF'}}>Send</Text>
                                  </TouchableOpacity>
                            </View>
                        </View>
                  </View>
               </Modal>
          </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    margin:10,
    marginTop:52,
    marginBottom:60,
  },
  centering: {
   alignItems: 'center',
   justifyContent: 'center',
   padding: 8,
 },
  row: {
    marginTop:5,
    marginBottom:5,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor:'#FFF',
    borderBottomWidth:1,
    borderBottomColor:'#ddd'
  },
  top:{
    flexDirection:'row'
  },
  bottom:{
    flex:1,
    padding:5,
    paddingBottom:10,
    marginTop:5,
    marginBottom:5,
    borderBottomWidth:1,
    borderBottomColor:'#eee'
  },
  left: {
     marginRight:10,
   },
 right: {
    flex:1,
 },
 profile:{
   width:50,
   height:50,
   borderRadius:50,
 },
 title:{
   color: '#444',
   fontSize: 16,
   fontFamily:'Roboto-Medium',
 },
 description:{
   color: '#666',
   fontSize:12,
   fontFamily:'Roboto-Regular',
 },
 date:{
   fontFamily:'Roboto-Regular',
   fontSize:12,
   color:'#999',
 },
 icon_box : {
   flexDirection:'row',
   paddingTop:5,
   paddingBottom:5,
 },
 items:{
   flexDirection:'row',
   marginRight:10,
 }
});
