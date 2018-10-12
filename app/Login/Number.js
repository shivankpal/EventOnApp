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
  Keyboard,
  Picker
  } from 'react-native';
  import LinearGradient from 'react-native-linear-gradient';
  import CustomStatusBar from '.././Common/CustomStatusBar';
  import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
  import ToastAndroid from '@remobile/react-native-toast';
  import ModalDropdown from 'react-native-modal-dropdown';
  const imageSource = {
        phone: require(".././Assets/Img/pro_phone.png"),
        logo: require(".././Assets/Img/logo.png"),
        arrow_left: require(".././Assets/Img/arrow_left.png"),
  };
  const {height, width} = Dimensions.get('window');
  export default class Number extends Component {
        constructor(props) {
          super(props);
          this.state = {
              phone:'',
              data: this.props.data,
              otp:'',
              defaultValue:'India',
              value:['India (+91)','UAE (+971)','US (+1)','Singapore (+65)','Veitnam (+84)' ,'Indonesia (+62)','Thailand (+66)','Philippines (+63)','Malaysia (+60)','Myanmar (+95)'],
              codes:['+91','+971','+1','+65','+84','+62','+66','+63','+60','+95'],
              defaultCode:'+91',
              loading:false,
          }
          this.dropdown;
        }
        sendOtp = async () => {

          Keyboard.dismiss();
          if(this.state.phone.length < 10)
          {
              ToastAndroid.show('Invalid mobile number', ToastAndroid.LONG);
              return false;
          }
          this.setState({loading:true})
          let number = this.state.defaultCode.replace('+','')+this.state.phone;
          await fetch('https://api.eventonapp.com/api/addNumber/'+number, {
             method: 'GET',
          }).then((response) => response.json()).then((responseJson) => {
                this.setState({loading:false})
                if(responseJson.status){
                    ToastAndroid.show(responseJson.data.msg, ToastAndroid.LONG);
                    this.setState({otp: responseJson.data.otp}, () => {
                        this.props.navigator.push({id: 'Otp', otp: responseJson.data.otp, number: number, data:this.state.data })
                    });
                }
                else{
                    ToastAndroid.show(responseJson.data.msg, ToastAndroid.LONG);
                }
           });
        }
        pushBack = () => {
          this.props.navigator.pop();
        }
        dropdown_2_renderRow = (rowData, rowID, highlighted) => {
            return (
                <View style={styles.dropdown_2_row}><Text style={{fontFamily:'Roboto-Regular'}} >{rowData}</Text></View>
            );
        }
        setVlue = (id) => {
            let code = this.state.codes;
            this.setState({
              defaultCode:code[id]
            })
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
                            <Text style={{color:'#FFF',fontFamily:'Roboto-Medium',fontSize:14,textAlign:'center'}} ellipsizeMode={'tail'}  numberOfLines={1}>Number</Text>
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
                              <View style={{flexDirection:'row',alignItems:'center',paddingHorizontal:15}}>
                                  <Image source={imageSource.phone} style={{width:20,height:20,marginRight:5}}/>
                                  <View style={{borderBottomWidth:1,borderColor:'#9c9fa6',height:40,flexDirection:'row',alignItems:'center',marginRight:10 }}>
                                      <Text style={{fontFamily:'Roboto-Regular',color:'#EAEAEA',textAlign:'center',paddingHorizontal:10}}>+</Text>
                                  </View>
                                  <View style={{borderBottomWidth:1,borderColor:'#9c9fa6',flex:1}}>
                                      <TextInput
                                        underlineColorAndroid="transparent"
                                        style={{fontFamily:'Roboto-Regular',color:'#EAEAEA',flex:1,height:40}}
                                        placeholder={'911234567890'}
                                        placeholderTextColor={"#9c9fa6"}
                                        keyboardType={'numeric'}
                                        onChangeText={(phone) => this.setState({phone})}
                                      />
                                  </View>
                              </View>
                              <LinearGradient
                                  start={{x: 0.0, y: 0.25}} end={{x: 0.75, y: 1.0}}
                                  locations={[0,1]}
                                  colors={['#6edd99','#53c6f2']}
                                  style={{width:'90%',borderRadius:5,marginTop:20}}
                              >
                                <TouchableOpacity onPress={()=>this.sendOtp()} style={{paddingVertical:15,paddingHorizontal:30,borderRadius:5,width:'100%'}}>
                                  <Text style={{fontFamily:'Roboto-Medium',color:'#EAEAEA',fontSize:14,textAlign:'center',backgroundColor:'transparent'}}>Send OTP</Text>
                                </TouchableOpacity>
                              </LinearGradient>
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
  },
  dropdown_2: {
   width: 60,
   borderBottomWidth: 1,
   borderRadius: 3,
   borderColor: 'lightgray',
   position:'absolute',
   opacity:0,
   top:0,
   left:0
 },
 dropdown_2_text: {
   color: '#EAEAEA',
   textAlign: 'center',
   textAlignVertical: 'center',
   fontFamily:'Roboto-Regular',
   paddingHorizontal:10
 },
 dropdown_2_dropdown: {
   maxHeight: 250,
   borderWidth: 2,
   borderRadius: 3,
   paddingHorizontal:10
 },
 dropdown_2_row: {
   height: 40,
   justifyContent:'center',
   alignItems: 'center',
 },

});
