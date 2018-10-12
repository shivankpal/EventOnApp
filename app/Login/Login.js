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
  Dimensions,
  Platform
  } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ToastAndroid from '@remobile/react-native-toast';
import LinearGradient from 'react-native-linear-gradient';
import DeviceInfo from 'react-native-device-info';
import PushNotification from 'react-native-push-notification';
import CustomStatusBar from '.././Common/CustomStatusBar';
import Loader from './Loader';
const imageSource = {
    email : require(".././Assets/Img/pro_email.png"),
    password: require(".././Assets/Img/pro_password.png"),
    logo: require(".././Assets/Img/logo.png"),
    arrow_left: require(".././Assets/Img/arrow_left.png"),
};
const {height, width} = Dimensions.get('window');
export default class Index extends Component {
  constructor() {
    super();
    this.state = {
        username:'',
        password:'',
        number:'',
        loader:false,
        devicetoken:'',
    }
  }
  componentWillMount () {
    AsyncStorage.getItem('DEVICETOKEN').then((devicetoken) => {
        if(devicetoken!=null){
           this.setState({devicetoken:devicetoken});
        }
    })
  }

  nativeLoginUserName = async () => {
    Keyboard.dismiss();
    if(this.state.username.length && this.state.password.length)
    {
        this.setState({loader:true});
        await fetch('https://api.eventonapp.com/api/nativeLogin', {
           method: 'POST',
           body: JSON.stringify({
             username: this.state.username,
             password: this.state.password,
           }),
        }).then((response) => response.json())
        .then((responseJson) => {
            if(responseJson.status)
            {
                var url = 'https://api.eventonapp.com/api/deviceToken/'+responseJson.data.user.id+"?device_id="+DeviceInfo.getUniqueID()+"&device_type="+Platform.OS+"&device_token="+this.state.devicetoken;
                fetch(url, {  method: 'GET'}).then((response)=> {
                    if(responseJson.data.user.profiling){
                        AsyncStorage.setItem('PROFILE', responseJson.data.user.profiling.toString());
                    }
                    if(responseJson.data.user.phone==''){
                        this.props.navigator.push({ id: 'Number', data: responseJson.data  });
                    }
                    else{
                        ToastAndroid.show('Login Successfull....' , ToastAndroid.LONG);
                        AsyncStorage.setItem('USER', JSON.stringify(responseJson.data.user));

                        if(responseJson.data.myevents.length)
                        {
                            AsyncStorage.setItem('MYEVENTS', JSON.stringify(responseJson.data.myevents));
                        }
                        setTimeout(()=>{
                            this.props.navigator.push({ id: 'Connect' });
                        },300);
                    }
                })
            }
            else
            {
               ToastAndroid.show('Sorry, the username/password entered by you is incorrect.', ToastAndroid.LONG);
            }
            this.setState({loader:false});
         })
    }
    else{
         ToastAndroid.show('Username Or Password cannot be blank', ToastAndroid.LONG);
    }
  }
  pushBack = () => {
    this.props.navigator.pop();
  }
  render() {
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
                        <Text style={{color:'#FFF',fontFamily:'Roboto-Medium',fontSize:14,textAlign:'center'}} ellipsizeMode={'tail'}  numberOfLines={1}>Login</Text>
                    </View>
                    <View style={styles.header_right}>
                        <View style={{width:30,height:30}}></View>
                    </View>
                </View>
                <KeyboardAwareScrollView contentContainerStyle={{justifyContent:'center'}}  keyboardShouldPersistTaps={"always"}>
                  <View style={{flex:0.8,justifyContent:'center',alignItems:'center'}}>
                        <Image source={imageSource.logo} style={{width:width/2,height:width/2,resizeMode:'contain'}} />
                  </View>
                  <View style={{flex:1,padding:20}}>
                      <View style={{borderBottomWidth:1,borderColor:'#9c9fa6',flexDirection:'row',alignItems:'center',marginHorizontal:10,marginVertical:5}}>
                          <Image source={imageSource.email} style={{width:20,height:20,marginRight:5}}/>
                          <TextInput
                            underlineColorAndroid="transparent"
                            style={{fontFamily:'Roboto-Regular',color:'#EAEAEA',width:'100%',height:40}}
                            placeholderTextColor={"#9c9fa6"}
                            placeholder={'Email'}
                            onChangeText={(username) => this.setState({username})}
                          />
                      </View>
                      <View style={{borderBottomWidth:1,borderColor:'#9c9fa6',flexDirection:'row',alignItems:'center',marginHorizontal:10,marginVertical:5}}>
                          <Image source={imageSource.password} style={{width:20,height:20,marginRight:5}}/>
                          <TextInput
                            underlineColorAndroid="transparent"
                            style={{fontFamily:'Roboto-Regular',color:'#EAEAEA',width:'100%',height:40}}
                            placeholderTextColor={"#9c9fa6"}
                            placeholder={'Password'}
                            onChangeText={(password) => this.setState({password})}
                            secureTextEntry={true}
                          />
                      </View>
                      <LinearGradient
                          start={{x: 0.0, y: 0.25}} end={{x: 0.75, y: 1.0}}
                          locations={[0,1]}
                          colors={['#6edd99','#53c6f2']}
                          style={{borderRadius:5,marginTop:30}}
                      >
                        <TouchableOpacity onPress={ ()=>{this.nativeLoginUserName() }} style={{paddingVertical:15,alignItems:'center',width:'100%'}}>
                                <Text style={{color:'#FFF',fontFamily:'Roboto-Regular',textAlign:'center',backgroundColor:'transparent'}}>Login</Text>
                        </TouchableOpacity>
                      </LinearGradient>
                  </View>
                  <View style={{flexDirection:'row',justifyContent:'center',marginTop:15}}>
                      <TouchableOpacity onPress={()=>this.props.navigator.push({id:'Forgot'})}>
                          <Text style={{fontFamily:'Roboto-Regular',color:'#27ccc0',textDecorationLine:'underline'}}>Forgot Password?</Text>
                      </TouchableOpacity>
                  </View>
              </KeyboardAwareScrollView>
              { this.state.loader && <Loader /> }
            </View>
        )
    }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#FFF',
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
  },
  header_center:{
     flex:1,
     justifyContent: 'center',
     alignItems: 'center',
  },
  header_right:{
    justifyContent: 'center',
    padding:10,
    flexDirection:'row',
  },
  header_center_title:{
    color: 'white',
    fontSize: 16,
    fontFamily:'Roboto-Medium',
  }
});
