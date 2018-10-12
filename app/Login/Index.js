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
  Keyboard,
  TouchableNativeFeedback,
  Platform,
  Dimensions,
  Modal
  } from 'react-native';
import FBSDK, { LoginManager,LoginButton,AccessToken } from 'react-native-fbsdk';
import ToastAndroid from '@remobile/react-native-toast';
import LinearGradient from 'react-native-linear-gradient';
import DeviceInfo from 'react-native-device-info';
import PushNotification from 'react-native-push-notification';
import * as Progress from 'react-native-progress';
import Loader from './Loader';
import CustomStatusBar from '.././Common/CustomStatusBar';

const imageSource = {
      logo : require(".././Assets/Img/logo.png"),
      facebook: require(".././Assets/Img/social_facebook.png"),
};
const {height, width} = Dimensions.get('window');
export default class Index extends Component {
  constructor() {
    super();
    this.state = {
        token:'',
        loader:false,
        devicetoken:'',
        modalVisible:false,
    }
  }
  componentWillMount(){
      AsyncStorage.setItem('DEMOERRORMSG', 'This is a demo event and all actions are disabled. Join a real Event to explore more...');
      this.downloadDemoEvent();
      this.getDeviceToken();
      AsyncStorage.getItem('DEVICETOKEN').then((devicetoken) => {
          if(devicetoken!=null)
          {
             this.setState({devicetoken:devicetoken});
          }
      });
  }
  downloadDemoEvent = () => {
      fetch('https://api.eventonapp.com/api/downloadEvent/106', { method: 'GET' }).then((response) => response.json()).then((responseJson) => {
          AsyncStorage.setItem('DEMOEVENT', JSON.stringify(responseJson.data[0]));
      })
  }
  getDeviceToken = () => {
    AsyncStorage.getItem('DEVICETOKEN').then((devicetoken) => {
        if(devicetoken==null){
            PushNotification.configure({
                onRegister: function(token) {
                  AsyncStorage.setItem('DEVICETOKEN', token.token);
                },
                senderID: "1033314279835",
                popInitialNotification: true,
                requestPermissions: true,
            })
       }
    })
  }
  fbAuth=()=>{
     Keyboard.dismiss();
     LoginManager.logInWithReadPermissions(["public_profile","user_friends","email","user_location"]).then((result)=>{

        if(result.isCancelled)
        {
            ToastAndroid.show("Login Cancelled",ToastAndroid.SHORT);
        }
        else
        {
            AccessToken.getCurrentAccessToken().then(
                (data) => {
                  const token = data.accessToken.toString();
                  this.verifyFbLogin(token);
                }
            )
        }
     },(error)=>{
        ToastAndroid.show(JSON.stringify(error),ToastAndroid.SHORT);
     })
  }
  verifyFbLogin = async (token) => {
    Keyboard.dismiss();
    this.setState({loader:true});
    await fetch('https://api.eventonapp.com/api/facebookLogin?access_token='+token, {
       method: 'GET'
    }).then((response) => response.json())
    .then((responseJson) => {
        if(responseJson.status)
        {
            var url = 'https://api.eventonapp.com/api/deviceToken/'+responseJson.data.user.id+"?device_id="+DeviceInfo.getUniqueID()+"&device_type="+Platform.OS+"&device_token="+this.state.devicetoken;
            fetch(url, {  method: 'GET'}).then((response)=> {
                  if(responseJson.data.user.phone=='')
                  {
                      if(responseJson.data.user.profiling)
                      {
                          AsyncStorage.setItem('PROFILE', responseJson.data.user.profiling.toString());
                      }
                      this.props.navigator.push({ id: 'Number', data: responseJson.data  });
                  }
                  else
                  {
                      ToastAndroid.show('Login Successfull....',ToastAndroid.SHORT);
                      AsyncStorage.setItem('USER', JSON.stringify(responseJson.data.user));

                      if(responseJson.data.user.profiling){
                          AsyncStorage.setItem('PROFILE', responseJson.data.user.profiling.toString());
                      }

                      if(responseJson.data.myevents.length){
                          AsyncStorage.setItem('MYEVENTS', JSON.stringify(responseJson.data.myevents));
                      }

                      setTimeout(() => {
                        this.props.navigator.resetTo({ id: 'Connect' });
                      },300);
                  }
              })
        }
        else
        {
            ToastAndroid.show('Error',ToastAndroid.SHORT);
        }
        this.setState({loader:false});
     })
  }
  pushToLogin = () => {
      this.props.navigator.push({id:'Signup'});
  }
  pushOf = () => {
    AsyncStorage.getItem('DEMOEVENT').then((demoevent) => {
        if(demoevent!=null)
        {
            let topevent = JSON.parse(demoevent);
            let progress = 0;
            let myvar;
            let cl;
            this.setState({ progress:progress,modalVisible:true },()=>{
                  cl = setInterval(() => {
                      this.setState( {progress:parseFloat(this.state.progress)+0.2} )
                  },500)
                  myvar = setTimeout(() => {
                      this.setState({modalVisible:false},()=>{
                          clearInterval(cl);
                          clearTimeout(myvar);
                          myvar = setTimeout(()=>{ clearTimeout(myvar); this.props.navigator.resetTo({id:'SudoSplash', user:false, topevent:topevent})
                        },300)
                      })
                  },5200)
            })
        }
      })
  }
  render() {
      return (
            <View style={{flex:1,backgroundColor:'#292E39',justifyContent:'center'}}>
                  <CustomStatusBar backgroundColor="#292E39" barStyle="light-content"/>
                  <View style={{marginTop:20,justifyContent:'center',alignItems:'center'}}>
                      <Image source={imageSource.logo} style={{width:width/2,height:width/2,resizeMode:'contain'}} />
                  </View>
                  <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <TouchableOpacity onPress={()=>this.fbAuth()} style={{flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#3B5998',paddingVertical:15,paddingHorizontal:30,borderRadius:5,width:'80%'}}>
                              <Image source={imageSource.facebook} style={{width:25,height:20,resizeMode:'contain',marginRight:5}}/>
                              <Text style={{fontFamily:'Roboto-Medium',color:'#FFF',fontSize:15,textAlign:'center'}}>Connect with Facebook</Text>
                        </TouchableOpacity>
                        <Text style={{fontFamily:'Roboto-Thin',color:'#9c9fa6',fontSize:13,marginVertical:30,textAlign:'center'}}>----------------- OR -------------------</Text>
                        <LinearGradient
                            start={{x: 0.0, y: 0.25}} end={{x: 0.75, y: 1.0}}
                            locations={[0,1]}
                            colors={['#6edd99','#53c6f2']}
                            style={{width:'80%',borderRadius:5}}
                        >
                        <TouchableOpacity onPress={()=>this.pushToLogin()} style={{paddingVertical:15,paddingHorizontal:30,borderRadius:5,width:'100%'}}>
                          <Text style={{fontFamily:'Roboto-Medium',color:'#EAEAEA',fontSize:14,textAlign:'center',backgroundColor:'transparent'}}>Signup using Email</Text>
                        </TouchableOpacity>
                        </LinearGradient>
                        <View style={{flexDirection:'row',alignItems:'center',marginTop:30}}>
                            <Text style={{fontFamily:'Roboto-Thin',color:'#9c9fa6',fontSize:13,textAlign:'center',textShadowColor:'#FFF'}}>Already have an account? </Text>
                            <TouchableOpacity style={{marginLeft:10}} onPress={()=>this.props.navigator.push({id:'Login'})}>
                                <Text style={{fontFamily:'Roboto-Medium',color:'#27ccc0',textDecorationLine:'underline'}}>Login</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flexDirection:'column',alignItems:'center',marginTop:50}}>
                            <Text style={{fontFamily:'Roboto-Thin',color:'#9c9fa6',fontSize:13,textAlign:'center',textShadowColor:'#FFF'}}>Tap below to view demo event</Text>
                            <TouchableOpacity style={{marginLeft:10}} onPress={()=>this.pushOf()}>
                                <Text style={{fontFamily:'Roboto-Medium',color:'#9c9fa6',textDecorationLine:'underline'}}>Demo Event</Text>
                            </TouchableOpacity>
                        </View>
                  </View>
                  { this.state.loader && <Loader /> }
                  <Modal
                      animationType={"slide"}
                      transparent={true}
                      visible={this.state.modalVisible}
                      onRequestClose={() => { this.setState({
                              modalVisible:!this.state.modalVisible
                          })
                      }}
                      >
                      <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'center',alignItems:'center',padding:20}} >
                          <View style={{backgroundColor:'#FFF',padding:20,borderRadius:10}}>
                              <Text style={{fontFamily:'Roboto-Medium',fontSize:15,color:'#292E39',textAlign:'center',margin:10}}>Opening Event....</Text>
                              <Progress.Bar progress={this.state.progress} width={(width-100)} height={5} color={'#27ccc0'} borderWidth={0} animated={true} unfilledColor={'#FFF'} borderRadius={5} />
                          </View>
                      </View>
                   </Modal>
            </View>
        )
    }
}
