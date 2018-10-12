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
  Dimensions,
  Alert
  } from 'react-native';
import { Actions } from 'react-native-router-flux';
import ToastAndroid from '@remobile/react-native-toast';
import LinearGradient from 'react-native-linear-gradient';
import Permissions from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Header from '.././Main/Header';
const {height, width} = Dimensions.get('window');
const imageSource = {
      photo_icon : require(".././Assets/Img/postback_photoadd.png"),
};
export default class Note extends Component {
    constructor(props){
      super(props);
      this.state = {
          user: this.props.user,
          topevent: this.props.topevent,
          title: '',
          note: '',
          reference:'',
          image:[],
      }
    }
    componentWillMount(){
      if(this.props.reference)
      {
          this.setState({reference:this.props.reference});
      }
    }
    pickSingle = () => {
        Permissions.request('photo').then(response => {
            if(response=='authorized')
            {
                ImagePicker.openPicker({
                  multiple: false,
                  waitAnimationEnd: false,
                  compressImageQuality:0.5
                }).then(image => {
                    this.setState({
                      image: { uri: image.path,type: image.mime,  name: image.path.split('/').pop() }
                    })
                }).catch(e => {});
            }
        })
    }
    pushToLogin = () => {
        if(typeof this.props.sudonav != 'undefined')
        {
            this.props.sudonav.resetTo({ id: 'SudoLogin'});
        }
    }
    addNote = () => {
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
          if(this.state.title.length == 0)
          {
              ToastAndroid.show('Title Cannot be blank', ToastAndroid.LONG);
              return false;
          }
          if(this.state.note.length == 0)
          {
              ToastAndroid.show('Note Cannot be blank', ToastAndroid.LONG);
              return false;
          }
          var body = new FormData();
          body.append('uid', this.state.user.id);
          body.append('eid', this.state.topevent.id);
          body.append('title', this.state.title);
          body.append('note', this.state.note);
          body.append('reference', this.state.reference+'@'+this.state.topevent.title);
          if(typeof this.state.image.uri != 'undefined')
          {
              body.append('photo',{ uri: this.state.image.uri, type: this.state.image.type,  name: this.state.image.name });
          }
          var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
            if(xhttp.readyState == 4 && xhttp.status == 200) {
                Actions.pop( {refresh: {isrefresh:'true'} })
            }
          };
          xhttp.open("POST", "https://api.eventonapp.com/api/addNote", true);
          xhttp.setRequestHeader("Content-type", "multipart/form-data");
          xhttp.send(body);
      }
    }
    render () {
      return (
        <LinearGradient
          start={this.state.topevent.theme.bg_gradient.start}
          end={this.state.topevent.theme.bg_gradient.end}
          locations={this.state.topevent.theme.bg_gradient.locations}
          colors={this.state.topevent.theme.bg_gradient.colors}
          style={{ flex: 1 }}
        >
            <Header openDrawer={this.props.openDrawer} currentScene={"Add Note"} topevent={this.props.topevent} user={this.props.user} sudonav={this.props.sudonav}/>
            <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}  scrollEnabled={true}>
                <View style={{flexDirection:'column',margin:10,backgroundColor:'#FFF',padding:10, flexWrap:'wrap',borderRadius:10,marginBottom:80}}>
                  <Text style={{fontFamily:'Roboto-Regular',fontSize:12,color:'#666',marginBottom:3}}>Title</Text>
                  <TextInput
                style={{ fontFamily: 'Roboto-Regular', color: '#333', width: '100%', height: 40, borderRadius: 5, borderWidth: 1, borderColor: 'lightgray', padding: 5, marginBottom: 15 }}
                        multiline = {false}
                        underlineColorAndroid = {'transparent'}
                        placeholder = {"Title"}
                        placeholderTextColor={'#9F9F9F'}
                        onChangeText = {(title) => this.setState({title})}
                  />
                  <Text style={{fontFamily:'Roboto-Regular',fontSize:12,color:'#666',marginBottom:3}}>Note</Text>
                  <TextInput
                        style = {{color:'#333',backgroundColor:'#f7f7f7',fontFamily:'Roboto-Regular',width:'100%',height:200, borderRadius:5,borderWidth:1,borderColor:'#EAEAEA',padding:5,marginBottom:5}}
                        multiline = {true}
                        underlineColorAndroid = {'transparent'}
                        placeholder = {"Note"}
                        placeholderTextColor = {'#9F9F9F'}
                        textAlignVertical = {'top'}
                        onChangeText = {(note) => this.setState({note})}
                  />
                  <Text style={{fontFamily:'Roboto-Regular',fontSize:12,color:'#666',marginBottom:3}}>Upload Photo</Text>
                  { (this.state.image.uri != 'undefined' && this.state.image.uri != '' && this.state.image.uri != null) ? <TouchableOpacity onPress={ ()=>this.setState({image:[]}) }><Image source={{uri:this.state.image.uri}} style={{width:60,height:60,marginVertical:5}} /></TouchableOpacity>  : null }
                  <TouchableOpacity onPress={()=>{this.pickSingle()}} style={{alignSelf:'flex-start',backgroundColor:'#eaeaea',paddingHorizontal:15,paddingVertical:10,flexDirection:'row',alignItems:'center',borderRadius:5,marginBottom:10}}>
                        <Image source={imageSource.photo_icon} style={{resizeMode:'contain',width:25,marginRight:5}}/>
                        <Text style={{fontFamily:'Roboto-Regular',color:'#666',fontSize:13}}>Photo/Video</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{backgroundColor:'#6699ff', padding:10, borderRadius:5, alignItems:'center', justifyContent:'center', flex:1}} onPress={()=>this.addNote()}>
                    <Text style={{color: '#FFF', fontSize:12, fontFamily:'Roboto-Medium',}}>Add Note</Text>
                  </TouchableOpacity>
                </View>
                <View style={{height:20}}></View>
            </KeyboardAwareScrollView>
        </LinearGradient>
      )
    }
}
