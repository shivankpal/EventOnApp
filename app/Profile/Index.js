'use strict';
import React, { Component } from 'react';
import { View, Text,  Image,  TouchableOpacity,  ScrollView, StatusBar,  ActivityIndicator,  AsyncStorage, Dimensions, Switch, Linking, Alert, Modal} from 'react-native';
import {Actions} from 'react-native-router-flux';
import CustomStatusBar from '.././Common/CustomStatusBar';
import styles from './Style';
import LinearGradient from 'react-native-linear-gradient';
import Permissions from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';
import Tabview from './Tabview';
import FBSDK, { LoginManager,LoginButton,AccessToken } from 'react-native-fbsdk';

import ToastAndroid from '@remobile/react-native-toast';
const imageSource = {
      prof_icon : require(".././Assets/Img/pro_name.png"),
      arrow_left: require(".././Assets/Img/arrow_left.png"),
      business: require(".././Assets/Img/tac_2.png"),
      notes: require(".././Assets/Img/tac_1.png"),
      home: require(".././Assets/Img/ico_home.png"),
      loc_icon : require(".././Assets/Img/ed-top-loc.png"),
      date_icon: require(".././Assets/Img/ed-top-dat.png"),
      FACEBOOK: require(".././Assets/Img/logo social3.png"),
      TWITTER: require(".././Assets/Img/logo social2.png"),
      LINKEDIN: require(".././Assets/Img/logo social1.png"),
      FACEBOOK_D: require(".././Assets/Img/logo social3_b.png"),
      TWITTER_D: require(".././Assets/Img/logo social2_b.png"),
      LINKEDIN_D: require(".././Assets/Img/logo social1_b.png"),
      close_icon: require(".././Assets/Img/postback_close.png"),
      logout: require(".././Assets/Img/logout.png"),
      upload_camera: require(".././Assets/Img/upload_camera.png"),
      upload_gallery: require(".././Assets/Img/upload_gallery.png"),
};
const {height, width} = Dimensions.get('window');

export default class Index extends Component {
    constructor(props) {
      super(props);
      this.state = {
          user:this.props.user,
          events:[],
          prefer: [],
          interest:[],
          comment:[],
          data:[],
          topevent:[],
          loading:true,
          facebook:this.props.user.isfbconnected,
          twitter:this.props.user.istwitterconnected,
          linkedin:this.props.user.islinkedinconnected,
          showAnimate:false,
          page:'TAGS',
          code:this.props.code,
          modalVisible:false,
          visible:false,
          showmap:false,
      }
      this.readmore = [];
      this.readmorebtn = [];
      this.getEvents = this.getEvents.bind(this);
    }
    componentWillMount(){
      AsyncStorage.getItem('MYEVENTS').then((events) => {
        if(events!=null) {
            this.setState({events:JSON.parse(events)})
          }
      })
      AsyncStorage.getItem('USER').then((user) => {
        if(user!=null) {
          let t = JSON.parse(user);
            this.setState({user:t,facebook:t.isfbconnected,twitter:t.istwitterconnected,linkedin:t.islinkedinconnected},()=>{
              this.getProfile(this.state.user.id)
            })
          }
      })
      if(this.props.code)
      {
          this.postdata(this.props.code,this.state.user.id);
      }
      if(this.props.oauth_token && this.props.oauth_verifier)
      {
          var url = "https://api.eventonapp.com/api/connectTwitter?uid="+this.state.user.id;
          this.setState({showAnimate:true});
          setTimeout(()=>{ this.resolveData(url) },3000);
      }
    }
    componentWillReceiveProps(nextProps){
      AsyncStorage.getItem('USER').then((user) => {
        if(user!=null) {
          let t = JSON.parse(user);
            this.setState({user:t,facebook:t.isfbconnected,twitter:t.istwitterconnected,linkedin:t.islinkedinconnected},()=>{
              this.getProfile(this.state.user.id)
            })
        }
      })
    }

    getProfile = async (id) => {
       await fetch('https://api.eventonapp.com/api/profile/'+id, {
          method: 'GET'
       }).then((response) => response.json())
       .then((responseJson) => {
           this.setState({
             data:responseJson.data,
             prefer: responseJson.data.prefer,
             interest: responseJson.data.interest,
             comment:responseJson.data.comment,
             loading:false
           })
       }).catch((error) => {    });
    }
    setPage = (page) => {
        this.refs['TAGS'].setNativeProps({
          style: {
            backgroundColor: "transparent",
          }
        })
        this.refs['TAGS Text'].setNativeProps({
          style: {
            color: "#9c9fa6",
          }
        })
        this.refs['POSTS'].setNativeProps({
          style: {
            backgroundColor: "transparent",
          }
        })
        this.refs['POSTS Text'].setNativeProps({
          style: {
            color: "#9c9fa6",
          }
        })
        this.refs['EVENTS'].setNativeProps({
          style: {
            backgroundColor: "transparent",
          }
        })
        this.refs['EVENTS Text'].setNativeProps({
          style: {
            color: "#9c9fa6",
          }
        })
        this.refs[page].setNativeProps({
          style: {
            backgroundColor: "#262831",
          }
        })
        this.refs[page+' Text'].setNativeProps({
          style: {
            color: "#EAEAEA",
          }
        })
        this.setState({page:page})
    }

    removeSocial = async (url) => {
      this.setState({showAnimate:true});
      Alert.alert('',
        'Do you want remove your account?',
        [
          {text: 'Cancel', onPress: () => this.setState({showAnimate:false}), style: 'cancel'},
          {text: 'Yes', onPress: () => {

            fetch(url, {
               method: 'GET'
            }).then((response) => response.json()).then((responseJson) => {
              AsyncStorage.setItem('USER', JSON.stringify(responseJson.user),() => {
                this.setState({
                    linkedin:responseJson.user.islinkedinconnected,
                    twitter:responseJson.user.istwitterconnected,
                    facebook:responseJson.user.isfbconnected
                },()=>{
                  this.setState({showAnimate:false});
                })
              });
            }).catch((error) => { this.setState({showAnimate:false}); });

          } },
        ],
        { cancelable: false }
      )
    }

    loginLinkedin = () => {
      if(this.state.linkedin)
      {
          var url = "https://api.eventonapp.com/api/removeSocial/"+this.state.user.id+"/LINKEDIN";
          this.removeSocial(url);
      }
      else
      {
          var url = "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=8179st8te2d7r1&redirect_uri=https://api.eventonapp.com/api/linkedin";
          this.props.navigator.replace({id:'Web',url:url,backpage:'Profile'});
      }
    }

    postdata = (code,uid) => {
        var sudothis = this;
        var body = "grant_type=authorization_code&code="+code+"&redirect_uri=https://api.eventonapp.com/api/linkedin&client_id=8179st8te2d7r1&client_secret=CaeiZ6f30i8zy01S";
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (xhttp.readyState == 4 && xhttp.status == 200) {
              var t = JSON.parse(xhttp.responseText);
              var url = 'https://api.eventonapp.com/api/connectLinkedin/?token='+t.access_token+"&uid="+uid;
              sudothis.resolveData(url);
          }
        };
        xhttp.open("POST", "https://www.linkedin.com/oauth/v2/accessToken", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(body);
    }
    loginTwitter = () => {
      if(this.state.twitter)
      {
        var url = "https://api.eventonapp.com/api/removeSocial/"+this.state.user.id+"/TWITTER";
        this.removeSocial(url);
      }
      else{
        var url = "https://api.eventonapp.com/api/twitterauth/"+this.state.user.id;
        this.props.navigator.replace({id:'Web',url:url,backpage:'Profile'});
      }
    }
    loginfacebook = () => {
      if(this.state.facebook)
      {
          var url = "https://api.eventonapp.com/api/removeSocial/"+this.state.user.id+"/FACEBOOK";
          this.removeSocial(url);
      }
      else {

        LoginManager.logInWithReadPermissions(["public_profile","user_friends","email"]).then((result)=>{
           if(result.isCancelled)
           {
               ToastAndroid.show('Login Cancelled', ToastAndroid.LONG);
           }
           else
           {
               AccessToken.getCurrentAccessToken().then(
                   (data) => {
                     const token = data.accessToken.toString();
                     var url = 'https://api.eventonapp.com/api/connectFacebook/?token='+token+"&uid="+this.state.user.id;
                     this.resolveData(url);
                   }
               )
           }
        },(error)=>{
           ToastAndroid.show('Error', ToastAndroid.LONG);
        })
      }
    }
    resolveData = async (url) => {
      this.setState({showAnimate:true});
      await fetch(url, {
         method: 'GET'
      }).then((response) => response.json()).then((responseJson) => {
        AsyncStorage.setItem('USER', JSON.stringify(responseJson.user),() => {
          this.setState({
              linkedin:responseJson.user.islinkedinconnected,
              twitter:responseJson.user.istwitterconnected,
              facebook:responseJson.user.isfbconnected
          },()=>{
              this.setState({showAnimate:false});
          })
        });
      }).catch((error) => {
          this.setState({showAnimate:false});
       });
    }

    pushBack = () => {
      this.props.navigator.pop();
    }
    moveToNetwork = (tag) => {
      this.props.navigator.push({id:'Mynetwork', user:this.state.user, filterTag:tag});
    }
    moveToSocial = () => {
      this.props.navigator.push({id:'SocialConnection', user:this.state.user});
    }
    moveToBusinesscard = () => {
      this.props.navigator.push({id:'MyBusinesscards', user:this.state.user});
    }
    moveToNotes = () => {
      this.props.navigator.push({id:'MyNotes', user:this.state.user});
    }
    moveToUpdateprofile = () => {
      this.props.navigator.push({id:'UpdateProfile', user:this.state.user});
    }
    moveToHome = () => {
      this.props.navigator.push({id:'Myhome', user:this.state.user,events:this.props.events});
    }
    showChooser = () => {
      this.setState({
          modalVisible:true,
      })
    }
    getEvents = (id) => {
      this.state.events.map((o,i)=>{
          if(o.id==id)
          {
              this.setState({topevent:o},()=>{
                this.setState({visible:true});
              });
          }
      })
    }
    openCamera = () => {
      Permissions.request('camera').then(response => {
        if(response=='authorized')
        {
            ImagePicker.openCamera({compressImageQuality:0.5}).then(image => {
                  this.setState({
                    businessResponse: { uri: image.path,type: image.mime,  name: image.path.split('/').pop() },
                  },() => {
                      this.setState({modalVisible:false},()=>{
                            this.executeUpdate(this);
                      })
                  })
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
                    this.setState({
                      businessResponse: { uri: image.path,type: image.mime,  name: image.path.split('/').pop() },
                    },()=>{
                        this.setState({modalVisible:false},()=>{
                              this.executeUpdate(this);
                        })
                    })
               }).catch(e => {});
            }
        })
    }
    executeUpdate = (obj) => {
      obj.setState({showAnimate:true},()=>{
        var body = new FormData();
        body.append('id', obj.state.user.id);
        if(obj.state.businessResponse.uri.length >  0)
        {
            body.append('business',obj.state.businessResponse);
        }
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (xhttp.readyState == 4 && xhttp.status == 200) {
              obj.setState({loading:false});
              var ndata = JSON.parse(xhttp.responseText);
              if(ndata.status)
              {
                  obj.setState({user:ndata.data.user,showAnimate:false},()=>{
                    AsyncStorage.setItem('USER', JSON.stringify(ndata.data.user),()=>{
                        ToastAndroid.showLongBottom('Data updated Successfully');

                    });
                  })
              }
          }
        };
        xhttp.open("POST", "https://api.eventonapp.com/api/updateCard", true);
        xhttp.setRequestHeader("Content-type", "multipart/form-data");
        xhttp.send(body);
      })
    }
    logout = () => {
      Alert.alert('',
        'Are you sure want to logout?',
        [
          {text: 'Cancel', onPress: () => { }, style: 'cancel'},
          {text: 'Yes', onPress: () => {
                AsyncStorage.clear(() => {
                     this.props.navigator.resetTo({id:'Splash'});
                })
          } },
        ],
        { cancelable: false }
      )
    }
    showmap = (url) => {
        this.setState({image:url},()=>{
            this.setState({showmap:true})
        })
    }
    expandMore = (id) => {
      this.readmore[id].setNativeProps({
        numberOfLines:0
      })
      this.readmorebtn[id].setNativeProps({
          style:{
            width:0,
            height:0,
          }
      })
    }
    render () {
      return (
        <View style={styles.container}>
            <CustomStatusBar backgroundColor="#292E39" barStyle="light-content"/>
                <View style={styles.header}>
                    <View style={styles.header_left}>
                      {
                        (this.props.ishome) ?
                          <TouchableOpacity onPress={()=>this.moveToHome()}>
                              <Image source={imageSource.home} style={{width:30,height:30}}></Image>
                          </TouchableOpacity>
                        :
                          <TouchableOpacity onPress={()=>this.pushBack()}>
                              <Image source={imageSource.arrow_left} style={{width:30,height:30}}></Image>
                          </TouchableOpacity>
                      }
                    </View>
                    <View style={styles.header_center}>
                        <Text style={[styles.header_center_title,{color:'#9c9fa6'}]} ellipsizeMode={'tail'}  numberOfLines={1}>My Profile</Text>
                    </View>
                    <View style={styles.header_right}>
                      <TouchableOpacity onPress={()=>this.logout()}>
                          <Image source={imageSource.logout} style={{width:25,height:25,margin:3}}></Image>
                      </TouchableOpacity>
                    </View>
                </View>
                <ScrollView>
                      <View style={styles.content}>
                          <View style={{flexDirection:'row',marginHorizontal:10,marginBottom:20,marginTop:10}}>
                            {
                              (this.state.user.image!='') ?
                                <View>
                                  <Image borderRadius={35} source={{uri: this.state.user.image}} style={{width:70,height:70,borderRadius:35,marginRight:5}}/>
                                </View>
                                   :
                                <View>
                                  <Image source={imageSource.prof_icon} style={{width:70,height:70,borderRadius:35,marginRight:5,borderWidth:1,borderColor:'#CCC'}}/>
                                </View>
                            }
                            <View style={{flex:1,paddingHorizontal:10}}>
                                <Text style={styles.title}>{this.state.user.name.toLowerCase().replace(/^[\u00C0-\u1FFF\u2C00-\uD7FF\w]|\s[\u00C0-\u1FFF\u2C00-\uD7FF\w]/g, (letter) => { return letter.toUpperCase() })}</Text>
                                {(this.state.user.profession!='') ?<Text style={styles.subtitle_pos} numberOfLines={2} >{this.state.user.profession}</Text> : null }
                                {(this.state.user.location!='') ?<Text style={styles.subtitle_loc}>{this.state.user.location}</Text> : null }
                            </View>
                            <View style={{alignItems:'center',justifyContent:'center'}}>
                              {
                                  (this.state.user.business_card!='') ?
                                  <TouchableOpacity onPress={()=>this.showChooser()}>
                                      <Image source={{uri:this.state.user.business_card}} style={{width:70,height:50,justifyContent:'flex-end'}}>
                                          <Text style={{color: '#9c9fa6',fontSize:10,fontFamily:'Roboto-Regular',textAlign:'center',backgroundColor:'rgba(0,0,0,0.8)'}}>Upload</Text>
                                      </Image>
                                  </TouchableOpacity>
                                  :
                                  <TouchableOpacity onPress={()=>this.showChooser()}>
                                      <View style={{width:70,height:50,justifyContent:'center',backgroundColor:'#262831',padding:5}}>
                                          <Text style={{color: '#9c9fa6',fontSize:13,fontFamily:'Roboto-Regular',textAlign:'center'}}>Upload Your Card</Text>
                                      </View>
                                  </TouchableOpacity>
                              }
                            </View>
                        </View>

                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',marginHorizontal:15,marginBottom:20}}>
                            <View style={{flex:1,alignItems:'center'}}>

                                <TouchableOpacity onPress={()=>this.moveToNotes()} style={{borderRadius:5,borderWidth:1,paddingHorizontal:10,paddingVertical:5,borderColor:'#9c9fa6'}}>
                                    <Text style={{textAlign:'center',color:'#bbb',fontFamily:'Roboto-Regular',fontSize:13}}>Notes</Text>
                                </TouchableOpacity>

                            </View>
                            <View style={{flex:1,alignItems:'center'}}>
                                <TouchableOpacity onPress={()=>this.moveToUpdateprofile()} style={{borderRadius:5,borderWidth:1,paddingHorizontal:10,paddingVertical:5,borderColor:'#9c9fa6'}}>
                                    <Text style={{textAlign:'center',color:'#bbb',fontFamily:'Roboto-Regular',fontSize:13}}>Account</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex:1,alignItems:'center'}}>
                              <TouchableOpacity onPress={()=>this.moveToBusinesscard()} style={{borderRadius:5,borderWidth:1,paddingHorizontal:10,paddingVertical:5,borderColor:'#9c9fa6'}}>
                                  <Text style={{textAlign:'center',color:'#bbb',fontFamily:'Roboto-Regular',fontSize:13}}>Cards</Text>
                              </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',marginHorizontal:30,marginBottom:10,marginTop:10}}>
                            {
                              (this.state.linkedin) ?
                              <TouchableOpacity onPress={()=>this.loginLinkedin()} style={{flex:1,justifyContent:'center', alignItems:'center',padding:3,flexDirection:'row'}}>
                                    <Image source={imageSource.LINKEDIN} style={{width:70,height:50,resizeMode:'contain'}}/>
                              </TouchableOpacity>
                            :
                              <TouchableOpacity onPress={()=>this.loginLinkedin()} style={{flex:1,justifyContent:'center', alignItems:'center',padding:3,flexDirection:'row'}}>
                                    <Image source={imageSource.LINKEDIN_D} style={{width:70,height:50,resizeMode:'contain'}}/>
                              </TouchableOpacity>
                            }
                            {
                               (this.state.twitter) ?
                                <TouchableOpacity onPress={()=>this.loginTwitter()} style={{flex:1,justifyContent:'center', alignItems:'center',padding:3,flexDirection:'row'}}>
                                      <Image source={imageSource.TWITTER} style={{width:70,height:50,resizeMode:'contain'}}/>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={()=>this.loginTwitter()} style={{flex:1,justifyContent:'center', alignItems:'center',padding:3,flexDirection:'row'}}>
                                      <Image source={imageSource.TWITTER_D} style={{width:70,height:50,resizeMode:'contain'}}/>
                                </TouchableOpacity>
                            }
                            {
                               (this.state.facebook) ?
                                <TouchableOpacity onPress={()=>this.loginfacebook()} style={{flex:1,justifyContent:'center', alignItems:'center',padding:3,flexDirection:'row'}}>
                                      <Image source={imageSource.FACEBOOK} style={{width:70,height:50,resizeMode:'contain'}}/>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={()=>this.loginfacebook()} style={{flex:1,justifyContent:'center', alignItems:'center',padding:3,flexDirection:'row'}}>
                                      <Image source={imageSource.FACEBOOK_D} style={{width:70,height:50,resizeMode:'contain'}}/>
                                </TouchableOpacity>
                            }
                        </View>

                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',marginHorizontal:20,marginTop:10,marginBottom:20}}>
                          <TouchableOpacity onPress={()=>this.moveToNetwork('Followers')} style={{flex:1,justifyContent:'center', alignItems:'center',flexDirection:'column',padding:5}}>
                              <Text style={{textAlign:'center',color:'#bbb',fontFamily:'Roboto-Medium',fontSize:16}}>{this.state.data.followers_count}</Text>
                              <Text style={{textAlign:'center',color:'#bbb',fontFamily:'Roboto-Regular',fontSize:10}}>Followers</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={()=>this.moveToNetwork('Following')} style={{flex:1,justifyContent:'center', alignItems:'center',flexDirection:'column',padding:5}}>
                              <Text style={{textAlign:'center',color:'#bbb',fontFamily:'Roboto-Medium',fontSize:16}}>{this.state.data.following_count}</Text>
                              <Text style={{textAlign:'center',color:'#bbb',fontFamily:'Roboto-Regular',fontSize:10}}>Following</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={()=>this.moveToSocial()} style={{flex:1,justifyContent:'center', alignItems:'center',flexDirection:'column'}}>
                              <Text style={{textAlign:'center',color:'#bbb',fontFamily:'Roboto-Medium',fontSize:16}}>{this.state.data.social_count}</Text>
                              <Text style={{textAlign:'center',color:'#bbb',fontFamily:'Roboto-Regular',fontSize:10}}>Connections</Text>
                          </TouchableOpacity>
                        </View>

                        <View style={{flexDirection:'row',marginTop:15,flex:1,marginHorizontal:15}}>
                            <TouchableOpacity ref="TAGS" onPress={()=>this.setPage('TAGS')} style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#262831',padding:10,borderTopLeftRadius:7,borderTopRightRadius:7}}>
                                <Text  ref="TAGS Text" style={[styles.prof,{color:'#EAEAEA'}]}>TAGS</Text>
                            </TouchableOpacity>
                            <TouchableOpacity ref="POSTS"  onPress={()=>this.setPage('POSTS')} style={{flex:1,justifyContent:'center',alignItems:'center',padding:10,borderTopLeftRadius:7,borderTopRightRadius:7}}>
                                <Text ref="POSTS Text" style={styles.prof}>POSTS</Text>
                            </TouchableOpacity>
                            <TouchableOpacity ref="EVENTS" onPress={()=>this.setPage('EVENTS')} style={{flex:1,justifyContent:'center',alignItems:'center',padding:10,borderTopLeftRadius:7,borderTopRightRadius:7}}>
                                <Text ref="EVENTS Text" style={styles.prof}>EVENTS</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{backgroundColor:'#262831',width:'100%', padding:20,minHeight:height-370,justifyContent:'flex-start'}}>
                              <Tabview {...this.state} navigator={this.props.navigator} showmap={this.showmap.bind(this)} getEvents={this.getEvents} />
                        </View>
                    </View>
            </ScrollView>
            {
              (this.state.showAnimate) ?
              <ActivityIndicator
                animating={true}
                style={{position:'absolute',top:0,bottom:0,left:0,right:0}}
                size="large"
              />
              :
              null
            }

            <Modal
                animationType={"fade"}
                transparent={true}
                visible={this.state.showmap}
                onRequestClose={() => { this.setState({ showmap: !this.state.showmap} ) }}
                >
               <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.8)',paddingVertical:60,paddingHorizontal:20}}>
                    <TouchableOpacity style={{position:'absolute',top:20,right:20,zIndex:20,padding:5}} onPress={()=>this.setState({ showmap: false })}>
                        <Image source={imageSource.close_icon} style={{width:20,height:20,alignSelf:'flex-end'}}  />
                    </TouchableOpacity>
                  <Image source={{uri:this.state.image}} style={{width:undefined,height:undefined,flex:1,resizeMode:'contain'}}/>
               </View>
            </Modal>
            <Modal
                animationType={"fade"}
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => { this.setState({ modalVisible: !this.state.modalVisible} ) }}
                >
               <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'center',alignItems:'center'}}>
                     <TouchableOpacity style={{position:'absolute',top:20,right:20,zIndex:20,padding:5}} onPress={()=>this.setState({ modalVisible: false })}>
                         <Image source={imageSource.close_icon} style={{width:20,height:20,alignSelf:'flex-end'}}  />
                     </TouchableOpacity>
                      <View style={{borderRadius:10,elevation:5,marginHorizontal:30}}>
                            <View style={{flexDirection:'row',justifyContent:'space-between',height:120,alignSelf:'flex-end',backgroundColor:'#FFF',borderRadius:10,borderWidth:1,borderColor:'#DDD'}}>
                                <TouchableOpacity onPress={()=>{ this.openCamera() }} style={{flex:1,justifyContent:'center',alignItems:'center',borderRightColor:'#EAEAEA',borderRightWidth:0.5}}>
                                      <Image source={imageSource.upload_camera} style={{width:50,height:50}}/>
                                      <Text>Camera</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>{ this.openGallery() }} style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                    <Image source={imageSource.upload_gallery} style={{width:50,height:50}}/>
                                    <Text>Gallery</Text>
                                </TouchableOpacity>
                            </View>
                      </View>
               </View>
          </Modal>
          <Modal
              animationType={"slide"}
              transparent={true}
              visible={this.state.visible}
              onRequestClose={() => { this.setState({
                  visible:!this.state.visible
              });}}
              >
              <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'center',alignItems:'center',padding:20}} >
                    <TouchableOpacity style={{position:'absolute',top:20,right:20,zIndex:20,padding:5}} onPress={()=>this.setState({ visible: false })}>
                        <Image source={imageSource.close_icon} style={{width:20,height:20,alignSelf:'flex-end'}}  />
                    </TouchableOpacity>
                    <View style={{width:'100%',backgroundColor:'#FFF',borderRadius:10}}>
                          <Image  source={{uri: this.state.topevent.image_cover}} borderTopLeftRadius={10} borderTopRightRadius={10} resizeMode={'cover'} style={{width:null, height:150,justifyContent:'flex-end',borderRadius:10}} >
                            <LinearGradient
                                start={{x: 0.5, y: 0.25}} end={{x: 0.5, y: 1}}
                                locations={[0,1]}
                                colors={['rgba(0,0,0,0)','rgba(0,0,0,1)']}
                                style={{flex:1,justifyContent:'flex-end'}}
                              >
                                <Text style={{color: '#FFF',padding:10,fontFamily:'Roboto-Regular',textShadowColor : '#000',backgroundColor:'transparent'}}>{this.state.topevent.title}</Text>
                              </LinearGradient>
                          </Image>
                          <View style={{flexDirection:'row',marginTop:10}}>
                              <View style={{flex:1,padding:5,flexDirection:'row'}}>
                                  <Image style={{width:25,height:25,marginRight:10}} source={imageSource.loc_icon} />
                                  <Text style={{flex:1,color: '#666',fontSize:12,fontFamily:'Roboto-Regular',borderRightWidth: 1, borderRightColor: '#EAEAEA'}}>{this.state.topevent.location}</Text>
                              </View>
                              <View style={{flex:1,padding:5,flexDirection:'row'}}>
                                  <Image style={{width:25,height:25,marginRight:10}} source={imageSource.date_icon} />
                                  {
                                     (this.state.topevent.str_date == '') ?
                                      <View>
                                          <Text style={{color: '#666',fontSize:12,fontFamily:'Roboto-Regular',flex:1}}>{this.state.topevent.format_day}</Text>
                                          <Text style={{color: '#666',fontSize:12,fontFamily:'Roboto-Regular',flex:1}}>{this.state.topevent.format_date}</Text>
                                      </View>
                                      :
                                      <Text style={{color: '#666',fontSize:12,fontFamily:'Roboto-Regular',flex:1}}>{this.state.topevent.str_date}</Text>
                                  }
                              </View>
                          </View>
                          <View style={{padding:10,marginLeft:10,marginRight:10,borderBottomWidth:1, borderBottomColor:'#EAEAEA'}}>
                              <Text style={{color: '#666',fontSize:12,fontFamily:'Roboto-Regular'}}>{this.state.topevent.description}</Text>
                          </View>
                      </View>
              </View>
           </Modal>

        </View>
      );
    }
}
