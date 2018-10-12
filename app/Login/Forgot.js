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
  BackHandler,
  Keyboard
  } from 'react-native';
  import LinearGradient from 'react-native-linear-gradient';
  import CustomStatusBar from '.././Common/CustomStatusBar';
  import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
  import ToastAndroid from '@remobile/react-native-toast';
  const imageSource = {
        email : require(".././Assets/Img/pro_email.png"),
        phone: require(".././Assets/Img/pro_phone.png"),
        logo: require(".././Assets/Img/logo.png"),
        arrow_left: require(".././Assets/Img/arrow_left.png"),
  };
  const {height, width} = Dimensions.get('window');
  export default class Forgot extends Component {
        constructor(props) {
          super(props);
          this.state = {
              email:'',
          }
        }
        validateEmail = (email) => {
          var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return re.test(email);
        }
        sendEmail = async () => {
          if(this.validateEmail(this.state.email)===false)
          {
              ToastAndroid.show('Please enter valid email', ToastAndroid.LONG);
              return false;
          }
          Keyboard.dismiss();
          await fetch('https://api.eventonapp.com/api/forgotPassword/?email='+encodeURIComponent(this.state.email), {
             method: 'GET',
          }).then((response) => response.json()).then((responseJson) => {
                if(responseJson.data.status)
                {
                    ToastAndroid.show(responseJson.data.msg, ToastAndroid.LONG);
                    this.props.navigator.pop();
                }
                else{
                  ToastAndroid.show(responseJson.data.msg, ToastAndroid.LONG);
                }
           });
        }
        pushBack = () => {
          this.props.navigator.pop();
        }
        render(){
            return (
              <View style={{flex:1,backgroundColor:'#292E39',justifyContent:'center'}}>
                  <CustomStatusBar backgroundColor="#292E39" barStyle="light-content"/>
                    <View style={styles.header}>
                        <View style={styles.header_left}>
                          <TouchableOpacity onPress={()=>this.pushBack()}>
                              <Image source={imageSource.arrow_left} style={{width:30,height:30}}></Image>
                          </TouchableOpacity>
                        </View>
                        <View style={styles.header_center}>
                            <Text style={{color:'#FFF',fontFamily:'Roboto-Medium',fontSize:14,textAlign:'center'}} ellipsizeMode={'tail'}  numberOfLines={1}>Forgot Password</Text>
                        </View>
                        <View style={styles.header_right}>
                            <View style={{width:30,height:30}}></View>
                        </View>
                    </View>
                    <KeyboardAwareScrollView contentContainerStyle={{justifyContent:'center'}}  keyboardShouldPersistTaps={"always"}>
                          <View style={{flex:0.8,justifyContent:'center',alignItems:'center'}}>
                              <Image source={imageSource.logo} style={{width:width/2,height:width/2,resizeMode:'contain'}} />
                          </View>
                          <View style={{flex:1,padding:20,alignItems:'center'}}>
                              <View style={{borderBottomWidth:1,borderColor:'#9c9fa6',flexDirection:'row',alignItems:'center',marginHorizontal:10,marginVertical:5}}>
                                  <Image source={imageSource.email} style={{width:20,height:20,marginRight:5}}/>
                                  <TextInput
                                    underlineColorAndroid="transparent"
                                    style={{fontFamily:'Roboto-Regular',color:'#EAEAEA',width:'100%',height:40}}
                                    placeholder={'Email'}
                                    placeholderTextColor={"#9c9fa6"}
                                    onChangeText={(email) => this.setState({email})}
                                  />
                              </View>
                              <LinearGradient
                                  start={{x: 0.0, y: 0.25}} end={{x: 0.75, y: 1.0}}
                                  locations={[0,1]}
                                  colors={['#6edd99','#53c6f2']}
                                  style={{width:'90%',borderRadius:5,marginTop:20}}
                              >
                                <TouchableOpacity onPress={()=>this.sendEmail()} style={{paddingVertical:15,paddingHorizontal:30,borderRadius:5,width:'100%'}}>
                                  <Text style={{fontFamily:'Roboto-Medium',color:'#EAEAEA',fontSize:14,textAlign:'center',backgroundColor:'transparent'}}>Submit</Text>
                                </TouchableOpacity>
                              </LinearGradient>
                          </View>
                    </KeyboardAwareScrollView>
              </View>
            )
        }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#FFF',
  },
  form:{
    margin:20
  },
  label:{
    fontFamily:'Roboto-Regular',
    color:'#888',
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
