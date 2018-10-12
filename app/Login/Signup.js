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
  Dimensions,
  BackHandler
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ToastAndroid from '@remobile/react-native-toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomStatusBar from '.././Common/CustomStatusBar';
import Loader from './Loader';
const imageSource = {
    email : require(".././Assets/Img/pro_email.png"),
    name : require(".././Assets/Img/pro_name.png"),
    password : require(".././Assets/Img/pro_password.png"),
    logo : require(".././Assets/Img/logo.png"),
    arrow_left: require(".././Assets/Img/arrow_left.png"),
};
const {height, width} = Dimensions.get('window');
export default class Signup extends Component {
      constructor() {
        super();
        this.state = {
            email:'',
            password:'',
            confirmPassword:'',
            name:'',
            isotp:false,
            otp:'',
            userData:[],
            loader:false,
        }
      }
      componentWillMount() {
        var navigator = this.props.navigator;
        BackHandler.addEventListener('hardwareBackPress', () => {
          navigator.pop();
          return true;
        });
      }
      signUp = async () => {
        if(this.validateEmail(this.state.email)===false)
        {
            ToastAndroid.show('Please enter valid email', ToastAndroid.LONG);
            return false;
        }
        if(this.state.password.length < 6)
        {
            ToastAndroid.show('Password length greater than 6.', ToastAndroid.LONG);
            return false;
        }
        if(this.state.confirmPassword.length==0)
        {
            ToastAndroid.show('Confirm Password length greater than 6.', ToastAndroid.LONG);
            return false;
        }
        if(this.state.password.length >= 6 && (this.state.password !== this.state.confirmPassword))
        {
            ToastAndroid.show("Password and confirm password didn't match.", ToastAndroid.LONG);
            return false;
        }

        if(this.state.name.length==0)
        {
            ToastAndroid.show('Name is required', ToastAndroid.LONG);
            return false;
        }
        this.setState({loader:true});
        await fetch('https://api.eventonapp.com/api/signup', {
           method: 'POST',
           body: JSON.stringify({
             email: this.state.email,
             password: this.state.password,
             name: this.state.name,
           }),
        }).then((response) => response.json())
        .then((responseJson) => {
            if(responseJson.status)
            {
                this.setState({userData:responseJson.data},()=>{
                      this.props.navigator.push({ id: 'Number', data: responseJson.data });
                });
            }
            else
            {
               ToastAndroid.show(responseJson.msg, ToastAndroid.LONG);
            }
            this.setState({loader:false});
         });
      }
      validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
      }
      pushBack = () => {
        this.props.navigator.pop();
      }
      render(){
        return(
          <View style={{flex:1,backgroundColor:'#292E39'}}>
                <CustomStatusBar backgroundColor="#292E39" barStyle="light-content"/>
                <View style={styles.header}>
                    <View style={styles.header_left}>
                      <TouchableOpacity onPress={()=>this.pushBack()}>
                          <Image source={imageSource.arrow_left} style={{width:30,height:30}}></Image>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.header_center}>
                        <Text style={{color:'#FFF',fontFamily:'Roboto-Medium',fontSize:14,textAlign:'center'}} ellipsizeMode={'tail'}  numberOfLines={1}>Signup</Text>
                    </View>
                    <View style={styles.header_right}>
                        <View style={{width:30,height:30}}></View>
                    </View>
                </View>
                <KeyboardAwareScrollView contentContainerStyle={{justifyContent:'center'}}  keyboardShouldPersistTaps={"always"}>
                    <View style={{justifyContent:'center',alignItems:'center'}}>
                          <Image source={imageSource.logo} style={{width:(width-60)/2,height:(width-60)/2,resizeMode:'contain'}} />
                    </View>
                    <View style={{flex:1,paddingHorizontal:20}}>
                        <View style={{borderBottomWidth:1,borderColor:'#9c9fa6',flexDirection:'row',alignItems:'center',marginHorizontal:10,paddingVertical:5}}>
                            <Image source={imageSource.email} style={{width:20,height:20,marginRight:5}}/>
                            <TextInput
                              underlineColorAndroid="transparent"
                              style={{fontFamily:'Roboto-Regular',color:'#EAEAEA',width:'100%',height:40}}
                              placeholder={'Email'}
                              placeholderTextColor={"#9c9fa6"}
                              onChangeText={(email) => this.setState({email})}
                            />
                        </View>
                        <View style={{borderBottomWidth:1,borderColor:'#9c9fa6',flexDirection:'row',alignItems:'center',marginHorizontal:10,marginVertical:5}}>
                            <Image source={imageSource.password} style={{width:20,height:20,marginRight:5}}/>
                            <TextInput
                              underlineColorAndroid="transparent"
                              style={{fontFamily:'Roboto-Regular',color:'#EAEAEA',width:'100%',height:40}}
                              placeholder={'Password'}
                              placeholderTextColor={"#9c9fa6"}
                              onChangeText={(password) => this.setState({password})}
                              secureTextEntry={true}
                            />
                        </View>
                        <View style={{borderBottomWidth:1,borderColor:'#9c9fa6',flexDirection:'row',alignItems:'center',marginHorizontal:10,marginVertical:5}}>
                            <Image source={imageSource.password} style={{width:20,height:20,marginRight:5}}/>
                            <TextInput
                              underlineColorAndroid="transparent"
                              style={{fontFamily:'Roboto-Regular',color:'#EAEAEA',width:'100%',height:40}}
                              placeholder={'Confirm Password'}
                              placeholderTextColor={"#9c9fa6"}
                              onChangeText={(confirmPassword) => this.setState({confirmPassword})}
                              secureTextEntry={true}
                            />
                        </View>
                        <View style={{borderBottomWidth:1,borderColor:'#9c9fa6',flexDirection:'row',alignItems:'center',marginHorizontal:10,marginVertical:5}}>
                            <Image source={imageSource.name} style={{width:20,height:20,marginRight:5}}/>
                            <TextInput
                              underlineColorAndroid="transparent"
                              style={{fontFamily:'Roboto-Regular',color:'#EAEAEA',width:'100%',height:40}}
                              placeholder={'Name'}
                              placeholderTextColor={"#9c9fa6"}
                              onChangeText={(name) => this.setState({name})}
                            />
                        </View>
                        <LinearGradient
                            start={{x: 0.0, y: 0.25}} end={{x: 0.75, y: 1.0}}
                            locations={[0,1]}
                            colors={['#6edd99','#53c6f2']}
                            style={{borderRadius:5,marginTop:20}}
                        >
                          <TouchableOpacity onPress={ ()=>{ this.signUp() }} style={{paddingVertical:15,alignItems:'center',width:'100%'}}>
                                  <Text style={{color:'#FFF',fontFamily:'Roboto-Regular',textAlign:'center',backgroundColor:'transparent'}}>Signup</Text>
                          </TouchableOpacity>
                        </LinearGradient>
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
  },
  form:{
    margin:20
  },
  label:{
    fontFamily:'Roboto-Regular',
    color:'#888',
  }

});
