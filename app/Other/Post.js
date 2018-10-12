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
  Switch,
  Dimensions,
  Modal,
  Alert
} from 'react-native';
import ToastAndroid from '@remobile/react-native-toast';
import { Actions } from 'react-native-router-flux';
import Permissions from 'react-native-permissions';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-crop-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Header from '.././Main/Header';
import FBSDK, { LoginManager,LoginButton,AccessToken } from 'react-native-fbsdk';

const imageSource = {
      photo_icon : require(".././Assets/Img/postback_photoadd.png"),
      facebook_icon : require(".././Assets/Img/social_facebook_g.png"),
      twitter_icon : require(".././Assets/Img/social_twitter_g.png"),
};
const options = {};
const {height, width} = Dimensions.get('window');

export default class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
        user:this.props.user,
        topevent:this.props.topevent,
        images:[],
        text:'',
        facebook:this.props.user.isfbpermconnected,
        twitter:this.props.user.istwitterconnected,
        showloading:false,
    };
  }
  componentWillMount(){
    this.props.hideShowFloatBtn(false);
    if(this.state.user===false)
    {
         this.setState({isfetch:true,showlogin:true});
    }
    else
    {
      AsyncStorage.getItem('USER').then((user) => {
          if(user!=null)
          {
              var u = JSON.parse(user);
              this.setState({
                  user:u,
                  facebook:u.isfbpermconnected,
                  twitter:u.istwitterconnected,
              })
          }
      })
      if(this.props.oauth_token && this.props.oauth_verifier)
      {
          var url = "https://api.eventonapp.com/api/connectTwitter?uid="+this.state.user.id;
          this.setState({showAnimate:true});
          setTimeout(()=>{ this.resolveData(url) },3000);
      }
    }
  }
  componentWillUnmount(){
    this.props.hideShowFloatBtn(true);
  }
  pushToLogin = () => {
      if(typeof this.props.sudonav != 'undefined')
      {
          this.props.sudonav.resetTo({ id: 'SudoLogin'});
      }
  }
  loginfacebook = (value) => {
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
    else
    {
        if(value)
        {
            LoginManager.logInWithPublishPermissions(["publish_actions"]).then((result)=>{
               if(result.isCancelled)
               {
                   ToastAndroid.show('Login Cancelled', ToastAndroid.LONG);
               }
               else
               {
                   AccessToken.getCurrentAccessToken().then(
                       (data) => {
                         const token = data.accessToken.toString();
                         var url = 'https://api.eventonapp.com/api/connectFacebook/?token='+token+"&uid="+this.state.user.id+"&permissions=publish_actions";
                         console.log(url);
                         this.resolveData(url);
                       }
                   )
               }
            },(error)=>{
               ToastAndroid.show('Error', ToastAndroid.LONG);
            })
        }
        else {
          var url = "https://api.eventonapp.com/api/removeSocial/"+this.state.user.id+"/FACEBOOK?permissions=publish_actions";
          console.log(url);
          this.removeSocial(url);
        }
    }
  }
  resolveData = async (url) => {
    this.setState({showAnimate:true});
    await fetch(url, {
       method: 'GET'
    }).then((response) => response.json()).then((responseJson) => {
      AsyncStorage.setItem('USER', JSON.stringify(responseJson.user),() => {
        this.setState({
            user:responseJson.user,
            twitter:responseJson.user.istwitterconnected,
            facebook:responseJson.user.isfbpermconnected
        },()=>{
            this.setState({showAnimate:false});
        })
      });
    }).catch((error) => { this.setState({showAnimate:false}) });
  }
  removeSocial = async (url) => {
    this.setState({showAnimate:true})
    await fetch(url, {
       method: 'GET'
    }).then((response) => response.json()).then((responseJson) => {
      AsyncStorage.setItem('USER', JSON.stringify(responseJson.user),() => {
        this.setState({
            user:responseJson.user,
            twitter:responseJson.user.istwitterconnected,
            facebook:responseJson.user.isfbpermconnected
        },()=>{
          this.setState({showAnimate:false});
        })
      });
    }).catch((error) => { this.setState({showAnimate:false}) });
  }
  pickMultiple = () => {
    Permissions.request('photo').then(response => {
      if (response == 'authorized') {
          ImagePicker.openPicker({
            multiple: true,
            waitAnimationEnd: true,
            compressImageQuality:0.4
          }).then(images => {
            this.setState({
              images: images.map(i => {
                return {uri: i.path, type: i.mime ,name: i.path.split('-').pop()};
              })
            });
          }).catch(e => {});
      }
    })
  }
  onSubmitFeed = (obj) => {
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
    else
    {
        if(this.state.text.length == 0)
        {
            ToastAndroid.show('Please type a msg', ToastAndroid.LONG);
            return false;
        }
        this.setState({showloading:true},() => {
          var body = new FormData();
          body.append('twitter', this.state.twitter);
          body.append('facebook', this.state.facebook);
          body.append('user_id', this.state.user.id);
          body.append('event_id', this.state.topevent.id);
          body.append('content', this.state.text);
          if(this.state.images.length > 0)
          {
              this.state.images.map((o,i) => {
                  body.append('photo['+i+']',{ uri: o.uri,type: o.type,  name: o.name });
              })
          }
          var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
            if(xhttp.readyState == 4 && xhttp.status == 200) {
              obj.setState({showloading:false},()=>{
                setTimeout(()=>{ Actions.pop()
                    setTimeout(()=>{ Actions.refresh() },300)
                 },300)
              })
            }
          };
          xhttp.open("POST", "https://api.eventonapp.com/api/postFeed", true);
          xhttp.setRequestHeader("Content-type", "multipart/form-data");
          xhttp.send(body);
        })
    }
  }

  loginTwitter = (value) => {
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
    else
    {
        if(value)
        {
            var url = "https://api.eventonapp.com/api/twitterauth/"+this.state.user.id;
            Actions.Web({url:url,backpage:'Post'})
        }
        else {
          var url = "https://api.eventonapp.com/api/removeSocial/"+this.state.user.id+"/TWITTER";
          this.removeSocial(url);
        }
    }
  }
  removeImage = (pos) => {
    Alert.alert('',
      'Are you sure?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Remove', onPress: () => {
            let images = this.state.images;
            images.splice(pos, 1)
            this.setState({images});
          }
        },
      ],
      { cancelable: false }
    )

  }
  render(){
    return (
          <LinearGradient
            start={this.state.topevent.theme.bg_gradient.start}
            end={this.state.topevent.theme.bg_gradient.end}
            locations={this.state.topevent.theme.bg_gradient.locations}
            colors={this.state.topevent.theme.bg_gradient.colors}
            style={{ flex: 1 }}
          >
              <Header openDrawer={this.props.openDrawer} currentScene={"Add Post"} topevent={this.props.topevent} user={this.props.user} sudonav={this.props.sudonav}/>
              <KeyboardAwareScrollView contentContainerStyle={{justifyContent:'center'}}  keyboardShouldPersistTaps={"always"}>
                        <View style={styles.container}>
                              <View style={{overflow:'hidden',flexDirection:'row',backgroundColor:'#6699ff',justifyContent:'center',borderTopLeftRadius:10,borderTopRightRadius:10,alignItems:'center'}}><Text style={{flex:1,color:'#FFF',padding:10,fontFamily:'Roboto-Bold'}} >Create New Post</Text></View>
                              <TextInput
                                    style = {{color:'#333',backgroundColor:'#f7f7f7',fontFamily:'Roboto-Regular',height:200, borderRadius:5,borderWidth:1,borderColor:'#EAEAEA',padding:10,margin:10}}
                                    multiline = {true}
                                    underlineColorAndroid = {'transparent'}
                                    placeholder = {"Type your message here"}
                                    textAlignVertical = {'top'}
                                    onChangeText = {(text) => this.setState({text})}
                              />
                              <View style={{flexWrap:'wrap',flexDirection:'row',margin:10}}>
                                {
                                  this.state.images.map((o,i) => {
                                      return (
                                          <TouchableOpacity key={i} onPress={()=>{this.removeImage()}}>
                                              <Image source={{uri:o.uri}} style={{width:50,height:50,margin:5,backgroundColor:'#777'}}  />
                                          </TouchableOpacity>
                                      )
                                  })
                                }
                              </View>
                              <View style={{marginHorizontal:10}}>
                                  <View style={{justifyContent:'center',flexDirection:'row'}}>
                                      <Image source={imageSource.facebook_icon} style={{width:20,height:20,marginRight:3}}/>
                                      <Text style={{flex:1,fontFamily:'Roboto-Medium',color:'#666'}}>Post on facebook</Text>
                                      <Switch
                                          style={{margin:0,padding:0,marginBottom:10}}
                                          onValueChange={(value) => this.loginfacebook(value) }
                                          value={this.state.facebook} />
                                  </View>
                                  <View  style={{justifyContent:'center',flexDirection:'row'}}>
                                      <Image source={imageSource.twitter_icon} style={{width:20,height:20,marginRight:3}}/>
                                      <Text style={{flex:1,fontFamily:'Roboto-Medium',color:'#666'}}>Post on twitter</Text>
                                      <Switch
                                          style={{margin:0,padding:0,marginBottom:10}}
                                          onValueChange={(value) => this.loginTwitter(value)}
                                          value={this.state.twitter} />
                                  </View>
                              </View>
                              <View style={{flexDirection:'row',margin:10}}>
                                    <View style={{flex:1}}>
                                      <TouchableOpacity onPress={()=>{this.pickMultiple()}} style={{alignSelf:'flex-start',backgroundColor:'#eaeaea',paddingHorizontal:15,paddingVertical:10,flexDirection:'row',alignItems:'center',borderRadius:5}}>
                                            <Image source={imageSource.photo_icon} style={{resizeMode:'contain',width:25,marginRight:5}}/>
                                            <Text style={{fontFamily:'Roboto-Regular',color:'#666',fontSize:13}}>Photo/Video</Text>
                                      </TouchableOpacity>
                                    </View>
                                    <View style={{flex:1}}>
                                      <TouchableOpacity onPress={()=>{this.onSubmitFeed(this)}} style={{alignSelf:'flex-end',backgroundColor:'#6699ff',paddingHorizontal:15,paddingVertical:10,flexDirection:'row',alignItems:'center',borderRadius:5}}>
                                            <Text style={{fontFamily:'Roboto-Regular',color:'#FFF',fontSize:13}}>Post</Text>
                                      </TouchableOpacity>
                                    </View>
                              </View>
                              {
                                (this.state.showloading) ?
                                <Modal
                                  animationType={"fade"}
                                  transparent={true}
                                  visible={this.state.showloading}
                                  onRequestClose={() => { this.setState({showloading:!this.state.showloading}) }}
                                  >
                                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                      <ActivityIndicator
                                        style={{alignItems: 'center',justifyContent: 'center'}}
                                        color="#487597"
                                        size="large"
                                      />
                                    </View>
                                </Modal>
                                : null
                              }
                        </View>
            </KeyboardAwareScrollView>
          </LinearGradient>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    borderRadius:10,
    margin:10,
    backgroundColor:'#FFF',
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
    borderBottomColor:'#e5e5e5'
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
    borderBottomWidth:0.2,
    borderBottomColor:'#e5e5e5'
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
