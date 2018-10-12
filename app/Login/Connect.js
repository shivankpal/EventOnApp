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
  Dimensions,
  Switch
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ToastAndroid from '@remobile/react-native-toast';
import FBSDK, { LoginManager,LoginButton,AccessToken } from 'react-native-fbsdk';

import CustomStatusBar from '.././Common/CustomStatusBar';
const imageSource = {
    facebook_icon: require(".././Assets/Img/social_facebook_g.png"),
    twitter_icon: require(".././Assets/Img/social_twitter_g.png"),
    linkedin_icon: require(".././Assets/Img/social_linkedin_g.png"),
};
var {height, width} = Dimensions.get('window');
export default class Connect extends Component {
  constructor() {
    super();
    this.state = {
      user:false,
      events:false,
      facebook:false,
      twitter:false,
      linkedin:false,
    }
  }
  componentWillMount() {
    AsyncStorage.getItem('USER').then((user) => {
        if(user!=null)
        {
            var u = JSON.parse(user);
            this.setState({ user:u, facebook:u.isfbconnected,
                            twitter:u.istwitterconnected, linkedin:u.islinkedinconnected  });
        }
    })
    if(this.props.code)
    {
        this.setState({showAnimate:true},() => {
            this.postdata(this.props.code,this.state.user.id);
        })
    }
    if(this.props.oauth_token && this.props.oauth_verifier)
    {
        var url = "https://api.eventonapp.com/api/connectTwitter?uid="+this.state.user.id;
        this.setState({showAnimate:true});
        setTimeout(()=>{ this.resolveData(url) },3000);
    }
  }
  removeSocial = async (url) => {
    this.setState({showAnimate:true});
    await fetch(url, {
       method: 'GET'
    }).then((response) => response.json()).then((responseJson) => {
      AsyncStorage.setItem('USER', JSON.stringify(responseJson.user),() => {
        this.setState({
            linkedin:responseJson.user.islinkedinconnected,
            twitter:responseJson.user.istwitterconnected,
            facebook:responseJson.user.isfbconnected
        },()=>{
          this.setState({showAnimate:false});
        })
      });
    }).catch((error) => { this.setState({showAnimate:false}); });
  }

  loginLinkedin = (value) => {
    if(value)
    {
        var url = "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=8179st8te2d7r1&redirect_uri=https://api.eventonapp.com/api/linkedin";
        this.props.navigator.push({id:'Web', url:url ,backpage:'Connect'});
    }
    else
    {
        var url = "https://api.eventonapp.com/api/removeSocial/"+this.state.user.id+"/LINKEDIN";
        this.removeSocial(url);
    }
  }

  postdata = (code,uid) => {
    var sudothis = this;
      var body = "grant_type=authorization_code&code="+code+"&redirect_uri=https://api.eventonapp.com/api/linkedin&client_id=8179st8te2d7r1&client_secret=CaeiZ6f30i8zy01S";
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            var t = JSON.parse(xhttp.responseText);
            var url = 'https://api.eventonapp.com/api/connectLinkedin/?token='+t.access_token+"&uid="+uid;
            sudothis.resolveData(url);
        }
      };
      xhttp.open("POST", "https://www.linkedin.com/oauth/v2/accessToken", true);
      xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhttp.send(body);
  }
  loginTwitter = (value) => {
    if(value)
    {
      var url = "https://api.eventonapp.com/api/twitterauth/"+this.state.user.id;
      this.props.navigator.replace({id:'Web',url:url,backpage:'Connect'});
    }
    else {
      var url = "https://api.eventonapp.com/api/removeSocial/"+this.state.user.id+"/TWITTER";
      this.removeSocial(url);
    }
  }
  loginfacebook = (value) => {
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
                     var url = 'https://api.eventonapp.com/api/connectFacebook/?token='+token+"&uid="+this.state.user.id;
                     this.resolveData(url);
                   }
               )
           }
        },(error)=>{
           ToastAndroid.show('Error', ToastAndroid.LONG);
        })
    }
    else {
      this.setState({facebook:false});
      var url = "https://api.eventonapp.com/api/removeSocial/"+this.state.user.id+"/FACEBOOK";
      this.removeSocial(url);
    }
  }
  resolveData = async (url) => {
    console.log(url);
    this.setState({showAnimate:true});
    await fetch(url, {
       method: 'GET'
    }).then((response) => response.json()).then((responseJson) => {
      console.log(JSON.stringify(responseJson.user));
      AsyncStorage.setItem('USER', JSON.stringify(responseJson.user),() => {
        this.setState({
            linkedin:responseJson.user.islinkedinconnected,
            twitter:responseJson.user.istwitterconnected,
            facebook:responseJson.user.isfbconnected
        },()=>{
            this.setState({showAnimate:false});
        })
      });
    }).catch((error) => { this.setState({showAnimate:false}); });
  }
  pushToScreen1 = () => {
    AsyncStorage.getItem('MYEVENTS').then((events) => {
        if(events!=null){
          this.setState({events: JSON.parse(events)},()=>{
              AsyncStorage.getItem('PROFILE').then((profile) => {
                if(profile!=null){
                  this.props.navigator.resetTo({id:'Myhome', user:this.state.user, events:this.state.events});
                }
                else
                {
                   this.props.navigator.replace({  id: 'Screen1' });
                }
              })
          })
        }
        else
        {
            AsyncStorage.getItem('PROFILE').then((profile) => {
              if(profile!=null){
                 setTimeout(()=>{
                    this.props.navigator.replace({  id: 'Prewelcome',  user:this.state.user});
                 },500)
              }
              else{
                setTimeout(()=>{
                    this.props.navigator.replace({  id: 'Screen1' });
                  },500)
              }
            })
        }
      })
  }
  render() {
      return (
        <View style={{flex:1,backgroundColor:'#292E39',justifyContent:'center'}}>
            <CustomStatusBar backgroundColor="#292E39" barStyle="light-content"/>
              <View style={{flex:0.5,justifyContent:'center',alignItems:'center'}}>
                  <Text style={{fontFamily:'Roboto-Regular',color:'#9c9fa6',fontSize:20,textAlign:'center'}}>Lets connect your social media accounts here</Text>
              </View>
              <View style={{flex:0.5,padding:20,justifyContent:'center',alignItems:'center'}}>
                  <View style={{alignItems:'center',flexDirection:'row',padding:10}}>
                      <Image source={imageSource.facebook_icon} style={{width:20,height:20,marginRight:3}}/>
                      <Text style={{flex:1,fontFamily:'Roboto-Regular',color:'#EAEAEA',fontSize:18}}>Facebook</Text>
                      <Switch
                          style={{margin:0,padding:0}}
                          onTintColor={"#27ccc0"}
                          onValueChange={(value) => this.loginfacebook(value) }
                          value={this.state.facebook}
                      />
                  </View>
                  <View style={{alignItems:'center',flexDirection:'row',padding:10}}>
                      <Image source={imageSource.twitter_icon} style={{width:20,height:20,marginRight:3}}/>
                      <Text style={{flex:1,fontFamily:'Roboto-Regular',color:'#EAEAEA',fontSize:18}}>Twitter</Text>
                      <Switch
                          style={{margin:0,padding:0}}
                          onTintColor={"#27ccc0"}
                          onValueChange={(value) => this.loginTwitter(value) }
                          value={this.state.twitter}
                          />
                  </View>
                  <View style={{alignItems:'center',flexDirection:'row',padding:10}}>
                      <Image source={imageSource.linkedin_icon} style={{width:20,height:20,marginRight:3}}/>
                      <Text style={{flex:1,fontFamily:'Roboto-Regular',color:'#EAEAEA',fontSize:18}}>LinkedIn</Text>
                      <Switch
                          style={{margin:0,padding:0}}
                          onTintColor={"#27ccc0"}
                          onValueChange={(value) => this.loginLinkedin(value) }
                          value={this.state.linkedin}
                          />
                  </View>
              </View>
              <View style={{flex:0.5,justifyContent:'center',alignItems:'center',paddingHorizontal:30}}>
                  <Text style={{fontFamily:'Roboto-Regular',color:'#9c9fa6',fontSize:11,textAlign:'center'}}>We take this to connect you to your social media connections at events - we do not send message / connect with any any of your social media connections.{"\n\n\n"}
Not sure? You can always do this later</Text>
                  <TouchableOpacity onPress={()=>this.pushToScreen1()} style={{paddingVertical:15,paddingHorizontal:30,borderRadius:5,width:'100%'}}>
                      <Text style={{fontFamily:'Roboto-Regular',color:'#9c9fa6',fontSize:14,textAlign:'center',textDecorationLine:'underline'}}>Next >></Text>
                  </TouchableOpacity>
              </View>
              {
                (this.state.showAnimate) ?
                <ActivityIndicator
                  animating={true}
                  style={{position:'absolute',top:0,bottom:0,left:0,right:0}}
                  size="large"
                />
                :
                null
              }
        </View>
      )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#FFF',
  },
  contain:{
    flex:1,
    alignItems: 'center',
    flexDirection:'row',
    justifyContent:'center',
    flexWrap:'wrap',
    margin:10,
  },
  item:{
    justifyContent:'center',
    alignItems:'center',
    padding:7,
    borderWidth:1,
    borderColor:'#353a4c',
    margin:5,
    borderRadius:5,
    flexDirection:'row'
  },
  title:{
    color:'#9c9fa6',
    fontFamily:'Roboto-Regular',
    fontSize:12,
    marginRight:5
  },
  header:{
    height:60,
    backgroundColor:'blue'
  },
  footer:{
    height:60,
    backgroundColor:'blue'
  }

});
