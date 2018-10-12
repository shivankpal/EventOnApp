'use strict';
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput, Dimensions,AsyncStorage,Modal,Switch,Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import Permissions from 'react-native-permissions';
import LinearGradient from 'react-native-linear-gradient';
import CustomStatusBar from '.././Common/CustomStatusBar';
import ToastAndroid from '@remobile/react-native-toast';
import DeviceInfo from 'react-native-device-info';
const {height, width} = Dimensions.get('window');
const imageSource = {
        prof_icon : require(".././Assets/Img/pro_name.png"),
        arrow_left: require(".././Assets/Img/arrow_left.png"),
        close_icon: require(".././Assets/Img/postback_close.png"),
        upload_camera: require(".././Assets/Img/upload_camera.png"),
        upload_gallery: require(".././Assets/Img/upload_gallery.png"),
};
var options = {
  title: 'Select Avatar',
  customButtons: [
    {name: 'fb', title: 'Choose Photo from Facebook'},
  ],
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};
export default class Update extends Component {
    constructor(props) {
      super(props);
      this.state = {
          user:this.props.user,
          topevent:this.props.topevent,
          loading:false,
          avatarSource:{ uri: this.props.user.image },
          avatarResponse: { uri: '',type: '',  name: '' },
          id: this.props.user.id,
          name:this.props.user.name,
          profession:this.props.user.profession,
          location:this.props.user.location,
          email:this.props.user.email,
          company:this.props.user.company,
          business_card:this.props.user.business_card,
          modalVisible:false,
          chooseFor:'',
          ischatmsg:this.props.user.ischatmsg,
          isnotification:this.props.user.isnotification,
          token:'',
      }

    }
    componentWillMount(){
      AsyncStorage.getItem('DEVICETOKEN').then((devicetoken) => {
          if(devicetoken!=null){
                this.setState({token:devicetoken});
          }
      })
    }
    showChooser = (type) => {
        this.setState({chooseFor:type},()=>{
          this.setState({
              modalVisible:true,
          })
        }
        )
    }
    openCamera = () => {
      Permissions.request('camera').then(response => {
        if(response=='authorized')
        {
            this.setState({avatarResponse:''});
            ImagePicker.openCamera({compressImageQuality:0.5}).then(image => {
                let source = { uri: image.path };
                if(this.state.chooseFor=='LOGO')
                {
                    this.setState({
                      avatarResponse: { uri: image.path,type: image.mime,  name: image.path.split('/').pop() },
                      avatarSource: source
                    },()=>{
                          this.setState({modalVisible:false,chooseFor:''})
                    })
                }
            }).catch(e => {});
        }
      }).catch(e => { alert(e) });
    }
    openGallery = () => {
        Permissions.request('photo').then(response => {
            if(response=='authorized')
            {
                ImagePicker.openPicker({
                  multiple: false,
                  waitAnimationEnd: false,
                  mediaType:'photo',
                  compressImageQuality:0.5
                }).then(image => {
                    let source = { uri: image.path };
                    if(this.state.chooseFor=='LOGO')
                    {
                        this.setState({
                          avatarResponse: { uri: image.path,type: image.mime,  name: image.path.split('/').pop() },
                          avatarSource: source
                        },()=>{
                              this.setState({modalVisible:false,chooseFor:''})
                        })
                    }
               }).catch(e => {});
            }
        })
    }
    updateProfile = async () => {
      this.setState({loading:true},()=>{
        this.executeUpdate(this)
      });
    }
    executeUpdate = (obj) => {
      var body = new FormData();
      body.append('id', this.state.id);
      body.append('name', this.state.name);
      body.append('profession', this.state.profession);
      body.append('location', this.state.location);
      body.append('email', this.state.email);
      body.append('company', this.state.company);
      body.append('ischatmsg',this.state.ischatmsg);
      body.append('isnotification',this.state.isnotification);
      body.append('token',this.state.token);
      body.append('device_id',DeviceInfo.getUniqueID());
      body.append('device',Platform.OS);


      if((this.state.avatarSource.uri.indexOf('https:') < 0) && (this.state.avatarResponse.uri.length >  0) )
      {
          body.append('photo',this.state.avatarResponse);
      }
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            obj.setState({loading:false});
            var ndata = JSON.parse(xhttp.responseText);
            if(ndata.status)
            {
                AsyncStorage.setItem('USER', JSON.stringify(ndata.data.user),()=>{
                    ToastAndroid.show('Data updated Successfully',ToastAndroid.LONG);
                    setTimeout(() => { obj.props.navigator.pop()  },300);
                });
            }
        }
      };
      xhttp.open("POST", "https://api.eventonapp.com/api/updateProfile", true);
      xhttp.setRequestHeader("Content-type", "multipart/form-data");
      xhttp.send(body);
    }
    pushBack = () => {
      this.props.navigator.pop();
    }

    render () {
      if(this.state.loading){
        return (
          <View style={styles.container}>
              <CustomStatusBar backgroundColor="#292E39" barStyle="light-content"/>
                  <View style={styles.header}>
                      <View style={styles.header_left}>
                        <TouchableOpacity onPress={()=>this.pushBack()}>
                            <Image source={imageSource.arrow_left} style={{width:30,height:30}}></Image>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.header_center}>
                          <Text style={[styles.header_center_title,{color:'#9c9fa6'}]} ellipsizeMode={'tail'}  numberOfLines={1}>Edit Profile</Text>
                      </View>
                      <View style={styles.header_right}>
                        <View style={{width:30,height:30}}>
                        </View>
                      </View>
                  </View>
                  <View style={[styles.box,{flex:1,justifyContent:'center',alignItems:'center'}]}>
                      <ActivityIndicator
                        style={styles.centering}
                        color="#487597"
                        size="large"
                      />
                </View>
          </View>
        )
      }
      return (
        <View style={styles.container}>
            <CustomStatusBar backgroundColor="#292E39" barStyle="light-content"/>
              <View style={styles.header}>
                  <View style={styles.header_left}>
                    <TouchableOpacity onPress={()=>this.pushBack()}>
                        <Image source={imageSource.arrow_left} style={{width:30,height:30}}></Image>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.header_center}>
                      <Text style={[styles.header_center_title,{color:'#9c9fa6'}]} ellipsizeMode={'tail'}  numberOfLines={1}>Edit Profile</Text>
                  </View>
                  <View style={styles.header_right}>
                    <View style={{width:30,height:30}}>
                    </View>
                  </View>
              </View>
                <KeyboardAwareScrollView extraScrollHeight={50} extraHeight={50} keyboardShouldPersistTaps="always" resetScrollToCoords={{ x: 0, y: 0 }}  scrollEnabled={true} style={{flex:1}}>
                    <View style={styles.box}>
                            <View style={{justifyContent:'center',alignItems:'center',marginHorizontal:10, marginBottom:20,marginTop:10,borderRadius:5}}>
                                <TouchableOpacity onPress={()=>this.showChooser('LOGO')}>
                                  { (this.state.avatarSource.uri!='') ?
                                      <Image borderRadius={5} source={this.state.avatarSource} style={{width:100,height:100,justifyContent:'flex-end',alignItems:'flex-end'}}>
                                          <Text style={styles.editImgText}>EDIT</Text>
                                      </Image>
                                      :
                                      <Image borderRadius={5} source={imageSource.prof_icon} style={{width:100,height:100,justifyContent:'flex-end',alignItems:'flex-end'}}>
                                          <Text style={styles.editImgText}>EDIT</Text>
                                      </Image>
                                  }
                                </TouchableOpacity>
                            </View>
                            <View style={styles.rowEdit}>
                                  <Text style={styles.prof}>NAME</Text>
                                  <TextInput
                                    style={styles.textinp}
                                    placeholder = {'Enter Name'}
                                    onChangeText={(text) => this.setState({name: text})}
                                    value={this.state.name}
                                    underlineColorAndroid={'transparent'}
                                  />
                            </View>
                            <View style={styles.rowEdit}>
                                <Text style={styles.prof}>JOB ROLE</Text>
                                <TextInput
                                  style={styles.textinp}
                                  placeholder ={'Enter Role'}
                                  onChangeText={(text) => this.setState({profession: text})}
                                  value={this.state.profession}
                                  underlineColorAndroid={'transparent'}
                                />
                            </View>
                            <View style={styles.rowEdit}>
                                <Text style={styles.prof}>COMPANY</Text>
                                <TextInput
                                  style={styles.textinp}
                                  placeholder ={'Your Company Name'}
                                  onChangeText={(text) => this.setState({company: text})}
                                  value={this.state.company}
                                  underlineColorAndroid={'transparent'}
                                />
                            </View>
                            <View style={styles.rowEdit}>
                                <Text style={styles.prof}>LOCATION</Text>
                                <TextInput
                                  style={styles.textinp}
                                  placeholder ={'Enter Location'}
                                  onChangeText={(text) => this.setState({location: text})}
                                  value={this.state.location}
                                  underlineColorAndroid={'transparent'}
                                />
                            </View>
                            <View style={styles.rowEdit}>
                                  <Text style={styles.prof}>EMAIL</Text>
                                  <TextInput
                                    style={styles.textinp}
                                    placeholder ={'Enter Email'}
                                    onChangeText={(text) => this.setState({email: text})}
                                    value={this.state.email}
                                    underlineColorAndroid={'transparent'}
                                  />
                            </View>
                            <View style={styles.rowEdit}>
                              <Text style={styles.prof}>SETTINGS</Text>
                              <View style={styles.textinp}>
                                <View style={{flexDirection:'row',marginVertical: 10,paddingLeft:5}}>
                                    <Text style={{flex:1}}>Receive sms for chat</Text>
                                    <Switch onValueChange={(value) => this.setState({ischatmsg: value})} value={this.state.ischatmsg} />
                                </View>
                                <View style={{flexDirection:'row',marginVertical: 10,paddingLeft:5}}>
                                    <Text  style={{flex:1}}>Receive notification</Text>
                                    <Switch onValueChange={(value) => this.setState({isnotification: value})} value={this.state.isnotification} />
                                </View>
                              </View>
                            </View>
                            <LinearGradient
                                start={{x: 0.0, y: 0.25}} end={{x: 0.75, y: 1.0}}
                                locations={[0,1]}
                                colors={['#6edd99','#53c6f2']}
                                 style={{height:50,borderRadius:5,justifyContent:'center',marginTop:10,marginBottom:5}}
                            >
                                <TouchableOpacity style={styles.btn} onPress={()=>this.updateProfile()}>
                                    <Text style={styles.btntext}>Update Profile</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                </KeyboardAwareScrollView>
                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => { this.setState({ modalVisible: !this.state.modalVisible} ) }}
                    >
                   <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'center',alignItems:'center'}}>
                          <TouchableOpacity style={{position:'absolute',top:20,right:20,zIndex:20,padding:5}} onPress={()=>this.setState({ modalVisible: !this.state.modalVisible })}>
                              <Image source={imageSource.close_icon} style={{width:20,height:20,alignSelf:'flex-end'}}  />
                          </TouchableOpacity>
                          <View style={{borderRadius:10,elevation:5,marginHorizontal:30}}>
                                <View style={{flexDirection:'row',justifyContent:'space-between',height:120,alignSelf:'flex-end',backgroundColor:'#FFF',borderRadius:10,borderWidth:1,borderColor:'#DDD'}}>
                                    <TouchableOpacity onPress={()=>{ this.openCamera() }} style={{flex:1,justifyContent:'center',alignItems:'center',borderRightColor:'#EAEAEA',borderRightWidth:0.5}}>
                                          <Image source={imageSource.upload_camera} style={{width:40,height:40}}/>
                                          <Text>Camera</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>{ this.openGallery() }} style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                        <Image source={imageSource.upload_gallery} style={{width:40,height:40}}/>
                                        <Text>Gallery</Text>
                                    </TouchableOpacity>
                                </View>
                          </View>
                   </View>
              </Modal>
          </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
      flex:1,
      backgroundColor:'#292E39',
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
    flexDirection:'row',
  },
  header_center:{
     flex:1,
     justifyContent: 'center',
     alignItems: 'center',
     padding:5,
  },
  header_right:{
    justifyContent: 'center',
    padding:10,
    flexDirection:'row',
  },
  header_center_title:{
    color: 'white',
    margin: 10,
    fontSize: 16,
    fontFamily:'Roboto-Medium',
  },
  centering: {
   alignItems: 'center',
   justifyContent: 'center',
   padding: 8,
 },
 box: {
    margin:20,
    marginTop:20,
    borderRadius:10,
    backgroundColor:'#FFF',
    padding:10,
    flex:1,
    justifyContent:'center',
 },
 rowEdit:{
   marginBottom:3,
   flexDirection:'column',
   paddingTop:10
 },
 textinp:{
   color: '#666',
   fontSize:14,
   fontFamily:'Roboto-Regular',
   width:'100%',
   height:40,
   borderBottomWidth:1,
   borderBottomColor:'#EAEAEA'
 },
 prof:{
   color: '#666',
   fontSize:11,
   fontFamily:'Roboto-Regular',
   paddingLeft:5
 },
 btn:{
   borderRadius:5,
   alignItems:'center',
   justifyContent:'center',
 },
 btntext:{
   color: '#FFF',
   fontSize:14,
   fontFamily:'Roboto-Medium',
   backgroundColor:'transparent',
 },
 editImgText:{
   padding:5,
   paddingLeft:10,
   paddingRight:10,
   fontFamily:'Roboto-Medium',
   backgroundColor:'rgba(0,0,0,0.8)',
   color:'#FFF',
   fontSize:10,
   alignSelf:'flex-end',
   borderBottomRightRadius:5,
 }
 });
