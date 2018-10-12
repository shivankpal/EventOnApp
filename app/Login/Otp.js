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
import ToastAndroid from '@remobile/react-native-toast';
import Loader from './Loader';
import CustomStatusBar from '.././Common/CustomStatusBar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
const imageSource = {
      logo: require(".././Assets/Img/logo.png"),
      arrow_left: require(".././Assets/Img/arrow_left.png"),
};
const {height, width} = Dimensions.get('window');
export default class Otp extends Component {
        constructor(props) {
            super(props);
            this.state = {
                number:this.props.number,
                otp: this.props.otp,
                data: this.props.data,
                enterOtp: '',
                num1: '',
                num2: '',
                num3: '',
                num4: '',
                loading:false,
            }
        }
        componentWillMount(){
            this.prefilled();
        }
        prefilled = async () => {
            let r = await this.state.otp.toString();
            await this.setState({ num1: r.substr(0,1), num2: r.substr(1,1), num3: r.substr(2,1), num4: r.substr(3,1) })
        }
        verifyOtp = () => {
            var enterOtp = this.state.num1+this.state.num2+this.state.num3+this.state.num4;
            if(enterOtp!=this.state.otp)
            {
                ToastAndroid.show('Invalid OTP', ToastAndroid.LONG);
                return false;
            }
            this.saveNumber();
        }
        saveNumber = () => {
            Keyboard.dismiss();
            this.setState({loading:true})
            fetch('https://api.eventonapp.com/api/updatePhone/'+this.state.data.user.id+"/"+this.state.number, {
               method: 'GET',
            }).then((response) => response.json()).then((responseJson) => {
                  this.setState({loading:false})
                  if(responseJson.status)
                  {
                      ToastAndroid.show(responseJson.data.msg, ToastAndroid.LONG);
                      AsyncStorage.setItem('USER', JSON.stringify(this.state.data.user),()=>{
                            if(this.state.data.myevents.length > 0){
                                AsyncStorage.setItem('MYEVENTS', JSON.stringify(this.state.data.myevents));
                            }
                            setTimeout(()=>{
                              if(this.state.data.user.location == '')
                              {
                                  this.props.navigator.resetTo({id:'Location', user:this.state.data.user });
                              }
                              else{
                                  this.props.navigator.resetTo({ id: 'Connect' });
                              }
                            },300)
                      })

                  }
                  else{
                      ToastAndroid.show(responseJson.data.msg, ToastAndroid.LONG);
                  }
             })
        }
        sendOtp = async () => {
          Keyboard.dismiss();
          if(this.state.phone.length < 10)
          {
              ToastAndroid.show('Invalid mobile number', ToastAndroid.LONG);
              return false;
          }
          await fetch('https://api.eventonapp.com/api/addNumber/'+this.state.number, {
                method: 'GET',
                }).then((response) => response.json()).then((responseJson) => {
                if(responseJson.status)
                {
                    ToastAndroid.show(responseJson.data.msg, ToastAndroid.LONG);
                    this.setState({otp: responseJson.data.otp});
                }
                else
                {
                    ToastAndroid.show(responseJson.data.msg, ToastAndroid.LONG);
                }
           });
        }
        pushBack = () => {
          this.props.navigator.pop();
        }
        render(){
          return (
              <View style={{flex:1,backgroundColor:'#2B2F3E',justifyContent:'center'}}>
                  <CustomStatusBar backgroundColor="#292E39" barStyle="light-content"/>
                    <View style={styles.header}>
                        <View style={styles.header_left}>
                          <TouchableOpacity onPress={()=>this.pushBack()}>
                              <Image source={imageSource.arrow_left} style={{width:30,height:30}}></Image>
                          </TouchableOpacity>
                        </View>
                        <View style={styles.header_center}>
                            <Text style={{color:'#FFF',fontFamily:'Roboto-Medium',fontSize:14,textAlign:'center'}}>OTP</Text>
                        </View>
                        <View style={styles.header_right}>

                        </View>
                    </View>
                    <KeyboardAwareScrollView contentContainerStyle={{justifyContent:'center'}}  keyboardShouldPersistTaps={"always"}>
                        <View style={{flex:0.8,justifyContent:'center',alignItems:'center'}}>
                              <Image source={imageSource.logo} style={{width:width/2,height:width/2,resizeMode:'contain'}} />
                        </View>
                        <View style={{flex:1,padding:20}}>
                            <View style={{flexDirection:'row',justifyContent: 'space-between',alignItems:'center',marginHorizontal:5,marginVertical:5}}>
                                <TextInput
                                  editable={false}
                                  ref='num1'
                                  underlineColorAndroid="transparent"
                                  style={{borderWidth:1,borderColor:'#9c9fa6',fontFamily:'Roboto-Regular',color:'#FFF',marginRight:5,textAlign:'center',flex:1,height:50}}
                                  keyboardType={'numeric'}
                                  maxLength={1}
                                  value={this.state.num1}
                                  //onChangeText={(num1) => this.setState({num1},()=>{ (num1.length) ? this.refs.num2.focus() :false  })}
                                />
                                <TextInput
                                  editable={false}
                                  ref='num2'
                                  underlineColorAndroid="transparent"
                                  style={{borderWidth:1,borderColor:'#9c9fa6',fontFamily:'Roboto-Regular',color:'#FFF',marginRight:5,textAlign:'center',flex:1,height:50}}
                                  keyboardType={'numeric'}
                                  maxLength={1}
                                  value={this.state.num2}
                                  //onChangeText={(num2) => this.setState({num2},()=>{ (num2.length) ? this.refs.num3.focus() :false  })}
                                />
                                <TextInput
                                  editable={false}
                                  ref='num3'
                                  underlineColorAndroid="transparent"
                                  style={{borderWidth:1,borderColor:'#9c9fa6',fontFamily:'Roboto-Regular',color:'#FFF',marginRight:5,textAlign:'center',flex:1,height:50}}
                                  keyboardType={'numeric'}
                                  maxLength={1}
                                  value={this.state.num3}
                                  //onChangeText={(num3) => this.setState({num3},()=>{ (num3.length) ? this.refs.num4.focus() : false  })}
                                />
                                <TextInput
                                  editable={false}
                                  ref='num4'
                                  underlineColorAndroid="transparent"
                                  style={{borderWidth:1,borderColor:'#9c9fa6',fontFamily:'Roboto-Regular',color:'#FFF',textAlign:'center',flex:1,height:50}}
                                  keyboardType={'numeric'}
                                  maxLength={1}
                                  value={this.state.num4}
                                  //onChangeText={(num4) => this.setState({num4})}
                                />
                            </View>
                            <LinearGradient
                                start={{x: 0.0, y: 0.25}} end={{x: 0.75, y: 1.0}}
                                locations={[0,1]}
                                colors={['#6edd99','#53c6f2']}
                                style={{width:'90%',borderRadius:5,marginTop:20,alignSelf:'center'}}
                            >
                                <TouchableOpacity onPress={ ()=>{this.verifyOtp() }} style={{paddingVertical:15,alignItems:'center'}}>
                                        <Text style={{color:'#FFF',fontFamily:'Roboto-Medium',textAlign:'center',backgroundColor:'transparent'}}>Get  Started</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:30}}>
                                <Text style={{fontFamily:'Roboto-Thin',color:'#9c9fa6',fontSize:13,textAlign:'center',textShadowColor:'#FFF'}}>{"Haven't recieve OTP ? "}</Text>
                                <TouchableOpacity style={{marginLeft:10}} onPress={ () => this.sendOtp() }><Text style={{fontFamily:'Roboto-Medium',color:'#9c9fa6',textDecorationLine:'underline'}}>Send Again</Text></TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={ ()=>this.props.navigator.pop() } style={{marginTop:30,justifyContent:'center',alignItems:'center'}}>
                                <Text style={{textDecorationLine:'underline',color:'#9c9fa6'}}>Change Number</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAwareScrollView>
                    {
                        (this.state.loading) ?
                          <View style={{position:'absolute',top:0,bottom:0,right:0,left:0,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.2)'}}>
                                <ActivityIndicator
                                  style={styles.centering}
                                  color="#6699ff"
                                  size="large"
                                />
                          </View>
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
