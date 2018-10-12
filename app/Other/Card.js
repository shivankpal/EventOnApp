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
  ScrollView,
  Picker,
  TouchableHighlight,
  Dimensions,
  Alert
  } from 'react-native';
import ToastAndroid from '@remobile/react-native-toast';
import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';
import ModalDropdown from 'react-native-modal-dropdown';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import Permissions from 'react-native-permissions';
import Header from '.././Main/Header';
const {height, width} = Dimensions.get('window');
const imageSource = {
          photo_icon : require(".././Assets/Img/postback_photoadd.png"),
          add_photo_icon : require(".././Assets/Img/photo-camera.png"),
};
export default class Card extends Component {
    constructor(props){
      super(props);
      this.state = {
         user:this.props.user,
         topevent:this.props.topevent,
         fid: this.props.topevent.id,
         defaultValue:this.props.topevent.title,
         title: '',
         image:[],
         events:[],
         eventsid:[],
         reference:'',
      }
      this.getEvents();
    }
    componentWillMount(){
      if(this.props.reference)
      {
          this.setState({reference:this.props.reference});
      }
    }
    getEvents = async () => {
       await fetch('https://api.eventonapp.com/api/myEvents?user_id='+this.state.user.id, {
          method: 'GET'
       }).then((response) => response.json()).then((responseJson) => {
           var events = [];
           var eventsid = [];
           responseJson.data.map((o,i)=>{
             events.push(o.title);
             eventsid.push(o.id);
           });
           this.setState({events: events, eventsid:eventsid });
         }).catch((error) => {
         });
    }
    pushToLogin = () => {
        if(typeof this.props.sudonav != 'undefined')
        {
            this.props.sudonav.resetTo({ id: 'SudoLogin'});
        }
    }
    addCard = () => {
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
        if(this.state.fid == 0)
        {
            ToastAndroid.show('Please select a event', ToastAndroid.LONG);
            return false;
        }
        if(typeof this.state.image.uri == 'undefined')
        {
            ToastAndroid.show('Please select a image', ToastAndroid.LONG);
            return false;
        }

        var body = new FormData();
        body.append('user_id', this.state.user.id);
        body.append('event_id', this.state.fid);
        body.append('title', this.state.title);
        body.append('reference', this.state.reference);
        if(typeof this.state.image.uri != 'undefined')
        {
            body.append('photo',{ uri: this.state.image.uri, type: this.state.image.type,  name: this.state.image.name });
        }
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if(xhttp.readyState == 4 && xhttp.status == 200) {
              var ct =  JSON.parse(xhttp.responseText);
              if(ct.status){
                  ToastAndroid.show(ct.msg, ToastAndroid.LONG);
                  Actions.Businesscards();
              }
              else{
                  ToastAndroid.show(ct.msg, ToastAndroid.LONG);
              }
          }
        };
        xhttp.open("POST", "https://api.eventonapp.com/api/addCard", true);
        xhttp.setRequestHeader("Content-type", "multipart/form-data");
        xhttp.send(body);
      }
    }
    dropdown_2_renderRow = (rowData, rowID, highlighted) => {
        return (
          <TouchableOpacity>
            <View style={styles.dropdown_2_row}><Text style={{fontFamily:'Roboto-Regular'}} >{rowData}</Text></View>
          </TouchableOpacity>
        );
    }
    setVlue = (id) => {
      var e = this.state.eventsid;
        this.setState({fid:e[id]});
    }
    openCam = async () => {
      Permissions.request('camera').then(response => {
        if(response=='authorized')
        {
            ImagePicker.openCamera({
              width:400,
              height:300,
              cropping: true,
              compressImageQuality:0.5,
            }).then(image => {
              this.setState({
                 image: { uri: image.path,type: image.mime,  name: image.path.split('/').pop() },
              })
            }).catch(e => {});
        }
      });
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
            <Header openDrawer={this.props.openDrawer} currentScene={"Add Business Card"} topevent={this.props.topevent} user={this.props.user} sudonav={this.props.sudonav}/>
            <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}  scrollEnabled={true}>
                  <View style={{margin:10,flex:1, backgroundColor:'#FFF',padding:10,borderRadius:10,marginBottom:80}}>
                    <Text style={{fontFamily:'Roboto-Regular',fontSize:12,color:'#666'}}>Title</Text>
                    <TextInput
                          style={{ fontFamily: 'Roboto-Regular', color: '#333', width: '100%', height: 40, borderRadius: 5, borderWidth: 1, borderColor: 'lightgray', padding: 5, marginBottom: 15 }}
                          multiline = {false}
                          underlineColorAndroid = {'transparent'}
                          placeholder = {"Title"}
                          placeholderTextColor={'#9F9F9F'}
                          onChangeText = {(title) => this.setState({title})}
                    />
                    <Text style={{fontFamily:'Roboto-Regular',fontSize:12,color:'#666'}}>Select Event</Text>
                    <ModalDropdown style={styles.dropdown_2}
                                textStyle={styles.dropdown_2_text}
                                dropdownStyle={styles.dropdown_2_dropdown}
                                defaultIndex={-1}
                                defaultValue={this.state.defaultValue}
                                options={this.state.events}
                                renderRow={this.dropdown_2_renderRow.bind(this)}
                                onSelect={(idx, value) => this.setVlue(idx) }
                    />
                    <Text style={{fontFamily:'Roboto-Regular',fontSize:12,color:'#666'}}>Select Image</Text>
                    <TouchableOpacity onPress={()=>{this.openCam()}} style={{position:'relative', alignSelf:'flex-start',backgroundColor:'#eaeaea',width:'100%',height:150,marginBottom:10,alignItems:'center',justifyContent:'center',borderRadius:5}}>
                          {(typeof this.state.image.uri != 'undefined') ? <Image source={{uri:this.state.image.uri}} style={{width:'100%',height:150,resizeMode:'cover',alignItems:'center',justifyContent:'center'}}><Image source={imageSource.add_photo_icon} style={{width:60,height:60}} /></Image> : <Image source={imageSource.add_photo_icon} style={{width:60,height:60}} /> }
                    </TouchableOpacity>
                    <TouchableOpacity style={{backgroundColor:'#6699ff', padding:10, borderRadius:5, alignItems:'center', justifyContent:'center'}} onPress={()=>this.addCard()}>
                      <Text style={{color: '#FFF', fontSize:12, fontFamily:'Roboto-Medium',}}>Add Card</Text>
                    </TouchableOpacity>

                  </View>
                  <View style={{height:20}}></View>
              </KeyboardAwareScrollView>
        </LinearGradient>
      )
    }
}

const styles = StyleSheet.create({
  dropdown_2: {
   width: '100%',
   padding:5,
   borderWidth: 1,
   borderRadius: 3,
   borderColor: 'lightgray',
   marginBottom:10
 },
 dropdown_2_text: {
   width: '100%',
   color: '#666',
   padding:5,
   textAlign: 'center',
   textAlignVertical: 'center',
   fontFamily:'Roboto-Regular'
 },
 dropdown_2_dropdown: {
   width: width-60,
   maxHeight: 250,
   borderWidth: 2,
   borderRadius: 3,
 },
 dropdown_2_row: {
   height: 40,
   justifyContent:'center',
   alignItems: 'center',
   width:'100%',
 },
});
