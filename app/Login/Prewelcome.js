'use strict';
import React, { Component } from 'react';
import { View,
  Text,
  AsyncStorage,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Image,
  Modal,
  Dimensions
  } from 'react-native';
import CustomStatusBar from '.././Common/CustomStatusBar';
import * as Progress from 'react-native-progress';
import ToastAndroid from '@remobile/react-native-toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
const imageSource = {
      arrow_left: require(".././Assets/Img/arrow_left.png"),
};
const {height, width} = Dimensions.get('window');
export default class Prewelcome extends Component {
      constructor(props){
          super(props);
          this.state = {
            user:this.props.user,
            topevent:this.props.topevent,
            code:'',
            modalVisible:false,
          }
      }
      componentDidMount(){
        setTimeout(() => {
            if((typeof this.props.deeplink != 'undefined') && (this.props.deeplink) && (this.props.deeplink.length > 0) )
            {
                var r = this.props.deeplink;
                this.props.clearDeepLink();
                fetch('https://api.eventonapp.com/api/downloadEvent/'+r[0], { method: 'GET' }).then((response) => response.json()).then((responseJson) => {
                      this.props.navigator.push({id:'Search', user:this.state.user, sudotopevent:responseJson.data[0], deeplink:r })
                }).catch((error) => { this.setState({loading:false})  })
            }
        },300)
      }
      movetoSearch = () => {
          this.props.navigator.push({id:'Search', user:this.state.user});
      }
      pushBack = () => {
        this.props.navigator.pop();
      }
      movetoSudoSplash = () => {
        Keyboard.dismiss();
        if(this.state.code.length==0)
        {
            ToastAndroid.show('Please enter code' , ToastAndroid.LONG);
            return false;
        }
        fetch('https://api.eventonapp.com/api/verifyonlycode/'+this.state.user.id+"/"+this.state.code, {method: 'GET'}).then((response) => response.json())
        .then((responseJson) => {
            if(responseJson.status)
            {
                ToastAndroid.show(responseJson.data.msg , ToastAndroid.LONG);
                this.setState({topevent:responseJson.data.event},()=>{
                    this.props.navigator.resetTo({id:'SudoSplash', user:this.state.user, topevent:this.state.topevent});
                })
            }
            else
            {
                ToastAndroid.show(responseJson.data.msg , ToastAndroid.LONG);
            }
        }).catch((error) => {  })
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
                              myvar = setTimeout(()=>{ clearTimeout(myvar); this.props.navigator.resetTo({id:'SudoSplash', user:this.state.user, topevent:topevent})
                            },300)
                          })
                      },5200)
                })
            }
          })
      }
      render(){
        return(
            <View style={{flex:1,backgroundColor:'#292E39'}}>
                <CustomStatusBar backgroundColor="#292E39" barStyle="light-content"/>
                <View style={styles.header}>
                    <View style={styles.header_left}>
                      {
                         (this.props.isback) ?
                          <TouchableOpacity onPress={()=>this.pushBack()}>
                              <Image source={imageSource.arrow_left} style={{width:30,height:30}}></Image>
                          </TouchableOpacity>
                          :
                        null
                      }
                    </View>
                    <View style={styles.header_center}>

                    </View>
                    <View style={styles.header_right}>

                    </View>
                </View>
                <KeyboardAwareScrollView style={{marginTop:20}} keyboardShouldPersistTaps={'always'}>
                    <Text style={[styles.text,{alignSelf:'center',fontSize:25,fontFamily:'Roboto-Bold'}]}>Hi {this.state.user.name}!</Text>
                    <View style={styles.box}>
                        <Text style={{color:'#9c9fa6',fontFamily:'Roboto-Thin',textAlign:'center'}}>Invited to an event?</Text>
                        <Text style={{color:'#9c9fa6',fontFamily:'Roboto-Thin',textAlign:'center',marginBottom:10}}>Enter the event access code</Text>
                        <View style={{flexDirection:'row'}}>
                          <TextInput
                            underlineColorAndroid="transparent"
                            style={{flex:1,borderWidth:1,borderColor:'#9c9fa6',padding:5,paddingLeft:10,fontFamily:'Roboto-Regular',marginRight:5,color:'#EAEAEA',borderRadius:5}}
                            placeholder={'Access code'}
                            placeholderTextColor={"#9c9fa6"}
                            keyboardType={'numeric'}
                            onChangeText={(code) => this.setState({code})}
                          />
                          <TouchableOpacity onPress={()=>this.movetoSudoSplash()} style={[styles.btn,{width:100}]}>
                              <Text style={[styles.text,{color:'#27ccc0'}]}>Submit</Text>
                          </TouchableOpacity>
                        </View>
                        <Text style={[styles.text,{alignSelf:'center',fontSize:20,marginVertical:20}]}>OR</Text>
                        <Text style={{color:'#9c9fa6',fontFamily:'Roboto-Thin',textAlign:'center',marginBottom:10}}>Tap below to view all events</Text>

                        <TouchableOpacity style={styles.btn} onPress={()=>this.movetoSearch()}>
                            <Text style={[styles.text,{color:'#27ccc0'}]}>Browse</Text>
                        </TouchableOpacity>
                        {

                        /*
                        <View style={{flexDirection:'column',alignItems:'center',marginTop:50}}>
                            <Text style={{fontFamily:'Roboto-Thin',color:'#9c9fa6',fontSize:13,textAlign:'center',textShadowColor:'#FFF'}}>Tap below to view demo event</Text>
                            <TouchableOpacity style={{marginLeft:10}} onPress={()=>this.pushOf()}>
                                <Text style={{fontFamily:'Roboto-Medium',color:'#9c9fa6',textDecorationLine:'underline'}}>Demo Event</Text>
                            </TouchableOpacity>
                        </View>
                        */
                        }
                    </View>
              </KeyboardAwareScrollView>
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
const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
  box:{
    margin:20,
    padding:20
  },
  text:{
      padding:5,
      fontFamily:'Roboto-Regular',
      color:'#9c9fa6',
  },
  btn:{
    paddingHorizontal:10,
    paddingVertical:5,
    alignItems:'center',
    width:150,
    alignSelf:'center',
    borderWidth:1,
    borderColor:'#27ccc0',
    borderRadius:5
  },
  header:{
     height:50,
     flexDirection:'row',
     backgroundColor:'transparent',
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
  },
  header_center_title:{
    color: 'white',
    margin: 10,
    fontSize: 16,
    fontFamily:'Roboto-Medium',
  },

});
