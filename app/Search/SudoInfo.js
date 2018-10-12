'use strict';
import React, { Component } from 'react';
import { View,
  Text,
  Image,
  StyleSheet,
  AsyncStorage,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  Keyboard,
  } from 'react-native';
import * as Progress from 'react-native-progress';
import ToastAndroid from '@remobile/react-native-toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';

const imageSource = {
        loc_icon : require(".././Assets/Img/ed-top-loc.png"),
        date_icon: require(".././Assets/Img/ed-top-dat.png"),
        event_default : require(".././Assets/Img/event_default_banner.png"),
        close_icon: require(".././Assets/Img/postback_close.png"),
};
const {height, width} = Dimensions.get('window');
export default class SudoInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
        user:this.props.user,
        topevent:this.props.topevent,
        //basic:[],
        //media:[],
        //comment:[],
        code:'',
        loading:false,
        modalVisible:false,
        openingevent:false,
        visible:false,
        text:'',
        data:[],
        progress:0,
        joiningevent:false,
        message:'',
    };
  }
  addToMyEvent = async () => {
    await fetch('https://api.eventonapp.com/api/addToMyEvent/'+this.state.user.id+'/'+this.state.topevent.id, {
       method: 'GET'
    }).then((responseJson) => {

          fetch('https://api.eventonapp.com/api/myEvents/?user_id='+this.state.user.id, {
             method: 'GET'}).then((response) => response.json()).then((responseJson) => {
              AsyncStorage.setItem('MYEVENTS', JSON.stringify(responseJson.data),() => {
                this.sudoOf2()
              })
          })

    }).catch((error) => {    });
  }

  verifyCode = async () => {
    if(this.state.code.length==0)
    {
        ToastAndroid.show('Code cannot be blank please enter code', ToastAndroid.LONG);
        return false;
    }
    Keyboard.dismiss();
    await fetch('https://api.eventonapp.com/api/verfiycode/'+this.state.user.id+'/'+this.state.topevent.id+'/'+this.state.code, {
       method: 'GET'
    }).then((response) => response.json())
    .then((responseJson) => {
          ToastAndroid.show(responseJson.data.msg, ToastAndroid.LONG);
          if(responseJson.status)
          {
              fetch('https://api.eventonapp.com/api/myEvents/?user_id='+this.state.user.id, {
                 method: 'GET'
              }).then((response) => response.json())
              .then((responseJson) => {
                  AsyncStorage.setItem('MYEVENTS', JSON.stringify(responseJson.data),()=>{
                    this.sudoOf2()
                  })
              })

          }
    });
  }
  sudoOf = () => {
        let progress = 0;
        let myvar;
        let cl;
        this.setState({ progress:progress,modalVisible:false,visible:false,openingevent:true},() => {
              cl = setInterval(()=>{
                  this.setState( {progress:parseFloat(this.state.progress)+0.2} )
              },500)
              myvar = setTimeout(()=>{
                  this.setState({openingevent:false},()=>{
                      clearInterval(cl);
                      clearTimeout(myvar);
                      this.props.hidemodel();
                      myvar = setTimeout(()=>{ clearTimeout(myvar); this.props.navigator.push({id:'SudoSplash', user:this.state.user, topevent:this.state.topevent})
                    },300)
                  })
              },5200)
        })
  }
  sudoOf2 = () => {
        let progress = 0;
        let myvar;
        let cl;
        this.setState({ progress:progress,modalVisible:false,visible:false,joiningevent:true},() => {
              cl = setInterval(()=>{  this.setState( {progress:parseFloat(this.state.progress)+0.1} )  },500)
              myvar = setTimeout(()=>{
                  this.setState({joiningevent:false},()=>{
                      clearInterval(cl);
                      clearTimeout(myvar);
                      this.props.hidemodel();
                      myvar = setTimeout(()=>{ clearTimeout(myvar); this.props.navigator.push({id:'SudoSplash', user:this.state.user, topevent:this.state.topevent}) },300)
                  })
              },10200)
        })
  }

  loadAction = () => {
    if(this.state.topevent.isjoin > 0)
    {
        return (
          <View style={{justifyContent:'center',alignItems:'center',padding:10,paddingBottom:30,width:280,alignSelf:'center'}}>
              <Text style={{padding:10,fontSize:13,color:'#555',fontFamily:'Roboto-Medium',textAlign:'center'}}>You have already join this event.</Text>
              <TouchableOpacity onPress={()=> this.sudoOf() } style={{paddingHorizontal:15,paddingVertical:10,backgroundColor:'#6699ff',borderRadius:5}}>
                    <Text style={{color:'#FFF'}}>Open this event</Text>
              </TouchableOpacity>

          </View>
        )
    }
    if(this.state.topevent.event_type=='PUBLIC'){
      return (
        <View style={{justifyContent:'center',alignItems:'center',padding:10,paddingBottom:30,width:280,alignSelf:'center'}}>
            <Text style={{padding:10,paddingBottom:20,fontSize:13,color:'#555',fontFamily:'Roboto-Medium',textAlign:'center'}}>This is a public event you can directly join this event by tapping the below button</Text>
            <TouchableOpacity onPress={()=>this.addToMyEvent()} style={{paddingHorizontal:15,paddingVertical:5,backgroundColor:'#6699ff',alignItems:'center',justifyContent:'center',borderRadius:5}} >
                <Text style={{color:'#FFF'}}>Join</Text>
            </TouchableOpacity>
        </View>
      )
    }
    if(this.state.topevent.event_type=='PRIVATE'){
      return (
        <View style={{justifyContent:'center',alignItems:'center',padding:10,paddingBottom:30,width:280,alignSelf:'center'}}>
            <Text style={{padding:5,fontSize:13,color:'#555',fontFamily:'Roboto-Medium',textAlign:'center'}}>This is a private event you can join only by providing the access code below.</Text>
            <View style={{width:280,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
              <TextInput
                underlineColorAndroid="transparent"
                style={{borderWidth:1,borderColor:'#eaeaea',padding:5,paddingLeft:10,fontFamily:'Roboto-Regular',marginRight:5,color:'#222',flex:1,height:40}}
                placeholder={'Access code'}
                placeholderTextColor={'#8F8F8F'}
                keyboardType={'numeric'}
                onChangeText={(code) => this.setState({code})}
              />
              <TouchableOpacity onPress={()=>this.verifyCode()}  style={{paddingHorizontal:15,paddingVertical:5,backgroundColor:'#6699ff',alignItems:'center',justifyContent:'center',borderRadius:5}}>
                  <Text style={{color:'#FFF',fontFamily:'Roboto-Medium'}}>Join</Text>
              </TouchableOpacity>
            </View>
            <Text style={{padding:20,fontFamily:'Roboto-Bold',fontSize:20,textAlign:'center'}}>Or</Text>
            {
              (this.state.topevent.isRequest > 0) ?
                <View style={{paddingHorizontal:15,paddingVertical:10,alignItems:'center',justifyContent:'center',borderRadius:5}}>
                    <Text style={{color:'#333',fontFamily:'Roboto-Regular',textAlign:'center'}}>You have already requested access code for this event.</Text>
                </View>
               :
              <TouchableOpacity style={{paddingHorizontal:15,paddingVertical:10,backgroundColor:'#6699ff',alignItems:'center',justifyContent:'center',borderRadius:5}} onPress={()=>this.setState({modalVisible:true})}>
                  <Text style={{color:'#FFF',fontFamily:'Roboto-Regular',textAlign:'center'}}>Request to join</Text>
              </TouchableOpacity>
            }
        </View>
      )
    }
    if(this.state.topevent.event_type=='SEMI_PRIVATE')
    {
        return(

              <View style={{justifyContent:'center',alignItems:'center',padding:10,paddingBottom:30,width:280,alignSelf:'center'}}>
                  <Text style={{padding:5,fontSize:13,color:'#555',fontFamily:'Roboto-Medium',textAlign:'center'}}>This is semi private event you can join only by providing the access code below </Text>
                  <View style={{width:280,flexDirection:'row'}}>
                    <TextInput
                      underlineColorAndroid="transparent"
                      style={{borderWidth:1,borderColor:'#eaeaea',padding:5,paddingLeft:10,fontFamily:'Roboto-Regular',marginRight:5,color:'#222',flex:1,height:40}}
                      placeholder={'Access code'}
                      placeholderTextColor={'#8F8F8F'}
                      keyboardType={'numeric'}
                      onChangeText={(code) => this.setState({code})}
                    />
                    <TouchableOpacity onPress={()=>this.verifyCode()}  style={{paddingHorizontal:15,paddingVertical:5,backgroundColor:'#6699ff',alignItems:'center',justifyContent:'center',borderRadius:5}}>
                        <Text style={{color:'#FFF',fontFamily:'Roboto-Medium'}}>Join</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={{padding:20,fontFamily:'Roboto-Bold',fontSize:20,textAlign:'center'}}>Or</Text>
                  {
                    (this.state.topevent.isRequest > 0) ?
                      <View style={{paddingHorizontal:15,paddingVertical:10,alignItems:'center',justifyContent:'center',borderRadius:5}}>
                          <Text style={{color:'#333',fontFamily:'Roboto-Regular',textAlign:'center'}}>Your Already Requested for this event.</Text>
                      </View>
                     :
                      <TouchableOpacity  style={{paddingHorizontal:15,paddingVertical:10,backgroundColor:'#6699ff',alignItems:'center',justifyContent:'center',borderRadius:5}} onPress={()=>this.setState({visible:true})}>
                          <Text style={{color:'#FFF',fontFamily:'Roboto-Regular',textAlign:'center'}}>Request to join</Text>
                      </TouchableOpacity>
                  }
              </View>

        )
    }
    return null;
  }
  requestEvent = (obj) => {
      if(this.state.message.length == 0)
      {
          ToastAndroid.show('Please type message...', ToastAndroid.SHORT);
          return false;
      }
      Keyboard.dismiss();
      var body = new FormData();
      body.append('userid', this.state.user.id);
      body.append('eventid', this.state.topevent.id);
      body.append('message', this.state.message);
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            obj.setState({modalVisible:false,visible:false},()=>{
                  ToastAndroid.show('Request Submitted Successfully....', ToastAndroid.LONG);
                  obj.props.hidemodel();
            })
        }
      };
      xhttp.open("POST", "https://api.eventonapp.com/api/requestEvent", true);
      xhttp.setRequestHeader("Content-type", "multipart/form-data");
      xhttp.send(body);
  }
  render(){
    if(this.state.loading){
      return (
        <View style={{flex:1,height:300,justifyContent:'center',alignItems:'center'}}>
              <ActivityIndicator
                style={styles.centering}
                color="#487597"
                size="large"
              />
        </View>
      );
    }
    return (
          <View style={styles.container}>
              <View style={{width:'100%'}}>
                    {
                      (this.state.topevent.image_cover!='') ?
                        <Image  source={{uri: this.state.topevent.image_cover}} borderTopLeftRadius={10} borderTopRightRadius={10} borderBottomLeftRadius={0} borderBottomRightRadius={0} resizeMode={'cover'} style={styles.coverImage} >
                            <LinearGradient
                                start={{x: 0.5, y: 0.25}} end={{x: 0.5, y: 1}}
                                locations={[0,1]}
                                colors={['rgba(0,0,0,0)','rgba(0,0,0,1)']}
                                style={{flex:1,justifyContent:'flex-end'}}
                              >
                                <Text style={styles.title}>{this.state.topevent.title}</Text>
                              </LinearGradient>
                        </Image>
                        :
                        <Image  source={imageSource.event_default} borderTopLeftRadius={10} borderTopRightRadius={10} borderBottomLeftRadius={0} borderBottomRightRadius={0} resizeMode={'cover'} style={styles.coverImage} >
                            <LinearGradient
                                start={{x: 0.5, y: 0.25}} end={{x: 0.5, y: 1}}
                                locations={[0,1]}
                                colors={['rgba(0,0,0,0)','rgba(0,0,0,1)']}
                                style={{flex:1,justifyContent:'flex-end'}}
                              >
                                <Text style={styles.title}>{this.state.topevent.title}</Text>
                              </LinearGradient>
                        </Image>
                    }
                    <View style={{flexDirection:'row',marginTop:10,flex:1}}>
                        <View style={{flex:1,padding:5,flexDirection:'row'}}>
                            <Image style={{width:25,height:25,marginRight:10}} source={imageSource.loc_icon} />
                            <Text style={styles.location}>{this.state.topevent.location}</Text>
                        </View>
                        <View style={{flex:1,padding:5,flexDirection:'row'}}>
                            <Image style={{width:25,height:25,marginRight:10}} source={imageSource.date_icon} />
                            {
                               (this.state.topevent.str_date=='') ?
                                <View>
                                    <Text style={styles.date}>{this.state.topevent.format_day}</Text>
                                    <Text style={styles.date}>{this.state.topevent.format_date}</Text>
                                </View>
                                :
                                <Text style={styles.date}>{this.state.topevent.str_date}</Text>
                            }
                        </View>
                    </View>
                    <View style={styles.description}>
                        <Text style={styles.descriptionText}>{this.state.topevent.description}</Text>
                    </View>
                    { this.loadAction()  }
                </View>
                <Modal
                    animationType={'fade'}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => { this.setState({
                        modalVisible:!this.state.modalVisible
                    }) }}
                    style={{flex:1,backgroundColor:'rgba(0,0,0,0.9)'}}
                    >
                    <TouchableOpacity style={{position:'absolute',top:20,right:20,zIndex:20,padding:5}} onPress={()=>this.setState({modalVisible:false})}>
                        <Image source={imageSource.close_icon} style={{width:20,height:20,alignSelf:'flex-end'}}  />
                    </TouchableOpacity>
                    <KeyboardAwareScrollView bounces={false} keyboardShouldPersistTaps={"always"} style={{flex:1,backgroundColor:'rgba(0,0,0,0.9)'}} contentContainerStyle={{justifyContent:'center'}}>
                        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                          <View style={{width:'90%',backgroundColor:'#FFF',borderRadius:5,padding:15,marginTop:height/4}}>
                                <TextInput
                                      style = {{padding:10,color:'#222',backgroundColor:'#f7f7f7',fontFamily:'Roboto-Regular',width:'100%',height:200, borderRadius:5,borderWidth:1,borderColor:'#EAEAEA'}}
                                      multiline = {true}
                                      underlineColorAndroid = {'transparent'}
                                      placeholder = {"Type your message here"}
                                      placeholderTextColor={'#8F8F8F'}
                                      textAlignVertical = {'top'}
                                      onChangeText = {(message) => this.setState({message})}
                                />
                                <TouchableOpacity onPress={()=>this.requestEvent(this)} style={{backgroundColor:'#6699ff',margin:10,paddingHorizontal:15,paddingVertical:5,alignSelf:'flex-end',borderRadius:5}}>
                                    <Text style={{color:'#FFF'}}>Send</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                      </KeyboardAwareScrollView>
                </Modal>
                <Modal
                    animationType={'fade'}
                    transparent={true}
                    visible={this.state.visible}
                    onRequestClose={() => { this.setState({
                        visible:!this.state.visible
                    }) }}
                    style={{flex:1,backgroundColor:'rgba(0,0,0,1)'}}
                    >
                    <TouchableOpacity style={{position:'absolute',top:20,right:20,zIndex:20,padding:5}} onPress={()=>this.setState({visible:false})}>
                        <Image source={imageSource.close_icon} style={{width:20,height:20,alignSelf:'flex-end'}}  />
                    </TouchableOpacity>
                    <KeyboardAwareScrollView bounces={false} keyboardShouldPersistTaps={"always"} style={{flex:1,backgroundColor:'rgba(0,0,0,0.9)'}} contentContainerStyle={{justifyContent:'center'}}>
                      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <View style={{width:'90%',backgroundColor:'#FFF',borderRadius:5,padding:15,marginTop:height/4}}>
                                <TextInput
                                      style = {{color:'#b3b3b3',backgroundColor:'#f7f7f7',fontFamily:'Roboto-Regular',width:'100%',height:200, borderRadius:5,borderWidth:1,borderColor:'#EAEAEA'}}
                                      multiline = {true}
                                      underlineColorAndroid = {'transparent'}
                                      placeholder = {"Type your message here"}
                                      placeholderTextColor={'#8F8F8F'}
                                      textAlignVertical = {'top'}
                                      onChangeText = {(message) => this.setState({message})}
                                />
                                <TouchableOpacity onPress={()=>this.requestEvent(this)} style={{backgroundColor:'#6699ff',margin:10,paddingHorizontal:15,paddingVertical:5,alignSelf:'flex-end',borderRadius:5}}>
                                      <Text style={{color:'#FFF',fontFamily:'Roboto-Regular'}}>Send</Text>
                                </TouchableOpacity>
                            </View>
                      </View>
                    </KeyboardAwareScrollView>
                </Modal>
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.openingevent}
                    onRequestClose={() => { this.setState({
                        openingevent:!this.state.openingevent
                    });}}
                    >
                    <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'center',alignItems:'center',padding:20}} >
                        <View style={{backgroundColor:'#FFF',padding:20,borderRadius:10}}>
                            <Text style={{fontFamily:'Roboto-Medium',fontSize:15,color:'#292E39',textAlign:'center',margin:10}}>Opening Event....</Text>
                            <Progress.Bar progress={this.state.progress} width={(width-100)} height={5} color={'#27ccc0'} borderWidth={0} animated={true} unfilledColor={'#FFF'} borderRadius={5} />
                        </View>
                    </View>
                 </Modal>
                 <Modal
                     animationType={"slide"}
                     transparent={true}
                     visible={this.state.joiningevent}
                     onRequestClose={() => { this.setState({
                         joiningevent:!this.state.joiningevent
                     });}}
                     >
                     <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'center',alignItems:'center',padding:20}} >
                         <View style={{backgroundColor:'#FFF',padding:20,borderRadius:10}}>
                             <Text style={{fontFamily:'Roboto-Medium',fontSize:15,color:'#292E39',textAlign:'center',margin:10}}>Downloading Event....</Text>
                             <Progress.Bar progress={this.state.progress} width={(width-100)} height={5} color={'#27ccc0'} borderWidth={0} animated={true} unfilledColor={'#FFF'} borderRadius={5} />
                         </View>
                     </View>
                  </Modal>
          </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin:10,
    borderRadius:10,
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    overflow:'hidden'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  centering: {
   alignItems: 'center',
   justifyContent: 'center',
   padding: 8,
 },
 coverImage: {
    width:null,
    height:200,
    justifyContent:'flex-end',
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    overflow:'hidden'
 },
 title:{
   color: '#FFF',
   padding:10,
   fontFamily:'Roboto-Regular',
   textShadowColor : '#000',
   backgroundColor:'transparent',
 },
 location:{
   color: '#666',
   fontSize:12,
   fontFamily:'Roboto-Regular',
   borderRightWidth: 1,
   borderRightColor: '#EAEAEA',
   flex:1,
 },
 date:{
   color: '#666',
   fontSize:12,
   fontFamily:'Roboto-Regular',
   flex:1,
 },
 description:{
   padding:10,
   marginLeft:10,
   marginRight:10,
   borderBottomWidth:1,
   borderBottomColor:'#EAEAEA',
 },
 descriptionText:{
   color: '#666',
   fontSize:12,
   fontFamily:'Roboto-Regular',
 }
});
