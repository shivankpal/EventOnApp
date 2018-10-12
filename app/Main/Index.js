'use strict';
import React, { Component } from 'react';
import { View,
  Text,
  Image,
  StatusBar,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  AsyncStorage,
  KeyboardAvoidingView,
  Modal,
  Animated,
  Easing,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
  NetInfo,
  ActivityIndicator
} from 'react-native';
import {Scene, Router, ActionConst, Actions,Reducer} from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';
import Permissions from 'react-native-permissions';
import { GoogleAnalyticsTracker, GoogleTagManager, GoogleAnalyticsSettings } from 'react-native-google-analytics-bridge';
import { Navigator } from 'react-native-deprecated-custom-components';
import Drawer from 'react-native-drawer';
import ImagePicker from 'react-native-image-crop-picker';
import ToastAndroid from '@remobile/react-native-toast';

import CustomStatusBar from '.././Common/CustomStatusBar';
import FloatButton from './FloatButton';
import Notes from '.././Notes/Index';
import Chats from '.././Chats/Index';
import Businesscards from '.././Businesscards/Index';
import Pollsnsurveys from '.././Pollsnsurveys/Index';
import Logistics from '.././Logistics/Index';
import Photos from '.././Photos/Index';
import Downloads from '.././Downloads/Index';
import Notifications from '.././Notifications/Index';
import Post from '.././Other/Post';
import Chat from '.././Other/Chat';
import Card from '.././Other/Card';
import Note from '.././Other/Note';
import Web from '.././Other/Web';
import Prefer from '.././Other/Prefer';
import ChatEvent from '.././ChatEvent/Index';
import SponsorOffer from '.././SponsorOffer/Index';
import Meetup from '.././Meetup/Index';
import SponsorInfo from '.././Home/SponsorInfo';
import ScheduleInfo from '.././Home/ScheduleInfo';
import PeopleData from '.././Home/PeopleData';
import EventNetwork from '.././Home/EventNetwork';
import FeedEdit from '.././Home/FeedEdit';
import ControlPanel from './ControlPanel';
import CommonConnection from '.././Home/CommonConnection';
import Main from './Main';
let screenArray = {
  'Downloads':'DOWNLOADS',
  'Pollsnsurveys':'POLLS/SURVEYS',
  'Photos':'EVENT PHOTOS',
  'Meetup':'PEOPLE RECOMMENDATION',
  'Logistics':'FAQ'
};

const {height, width} = Dimensions.get('window');
const imageSource = {
      upload_camera: require(".././Assets/Img/upload_camera.png"),
      upload_gallery: require(".././Assets/Img/upload_gallery.png"),
      close_icon: require(".././Assets/Img/cancel-music.png"),
};
export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
       topevent:this.props.topevent,
       user:this.props.user,
       modalVisible:false,
       images:[],
       hideShowFloatBtn:true,
       show:false,
       currentScene:'Event_Home',
       Chooser:false,
       deeplink:this.props.deeplink,
       showphotoloading:false,
    }
    this.height = new Animated.Value(0);
    this.slide = false;
    this.slideToShow = this.slideToShow.bind(this);
    this.hideShowFloatBtn = this.hideShowFloatBtn.bind(this);
    this.setCurrentScene = this.setCurrentScene.bind(this);
    this.pushOf = this.pushOf.bind(this);
    this.googleTracker = this.googleTracker.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.closeControlPanel = this.closeControlPanel.bind(this);
    this.openControlPanel = this.openControlPanel.bind(this);
    this.screenTracker = this.screenTracker.bind(this);
    this.screens = [];
    this.executeFunction = null;
  }
  reducerCreate (params) {
    const defaultReducer = new Reducer(params);
    return (state, action) => {
      if(this.executeFunction!= null){
          clearTimeout(this.executeFunction);
      }
      if(action.key)
      {
          if(action.type=='REACT_NATIVE_ROUTER_FLUX_RESET')
          {
              this.screens = [];
          }
          else{
            this.screens.push(action.key);
            let name = this.screens[this.screens.length-1];
            if(screenArray[name])
            {
                this.screenTracker(screenArray[name],'OPEN');
            }
          }
      }
      else if(action.type=='REACT_NATIVE_ROUTER_FLUX_ANDROID_BACK'){
          this.screens.pop()
          let name = this.screens[this.screens.length-1];
          if(screenArray[name])
          {
              this.screenTracker(screenArray[name],'OPEN');
          }
      }
      return defaultReducer(state, action);
    };
  }
  googleTracker = (pagename) => {
    let tracker = new GoogleAnalyticsTracker('UA-102308943-1');
    tracker.trackScreenView(pagename);
    let name = pagename.split(":",1)[0];
    let data = Object.values(screenArray);
    if(data.indexOf(name) === -1)
    {
        if(this.executeFunction != null){
            clearTimeout(this.executeFunction);
        }
        this.screenTracker(name,'OPEN');
    }
  }
  screenTracker = async  (pagename,param) => {
      if(this.state.user===false)
      {
        return false;
      }
      await fetch('https://api.eventonapp.com/api/trackScreen/'+this.state.user.id+'/'+this.state.topevent.id+'?screen_name='+encodeURIComponent(pagename)+'&state='+encodeURIComponent(param),
       {  method: 'GET' }).then((response) => {
          if(this.executeFunction != null){
               clearTimeout(this.executeFunction);
          }
          this.executeFunction = setTimeout(()=>{ this.screenTracker(pagename,'CONTINUE')  },10000);
      })
  }


  componentDidMount() {
    setTimeout(() => {
          this.setState({show:true})
    },590)
  }

  updateUser = (user) => {
      this.setState({user:user});
  }
  setCurrentScene = (key) => {
      this.setState({currentScene:key});
  }
  showOptions = () => {
    this.setState({
        modalVisible:!this.state.modalVisible
    })
  }
  closeControlPanel = () => {
      this._drawer.close()
  };
  openControlPanel = () => {
      this._drawer.open()
  };
  pushOf = (topevent) => {
      if(this.state.topevent.id!=topevent.id)
      {
          Alert.alert(
            '',
            'Are you sure want to leave '+this.state.topevent.title+'?',
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: "Yes", onPress: () => this.props.sudonav.push({id:'SudoSplash', user:this.state.user, topevent:topevent}) },
            ],
            { cancelable: false }
          )
      }
      else
      {
        this.props.sudonav.push({id:'SudoSplash', user:this.state.user, topevent:topevent})
      }
  }
  slideToShow = () => {
    if(this.state.Chooser)
    {
      Animated.timing(
            this.height,
            {
              toValue: 0,
              duration: 300,
              easing: Easing.linear
            }
      ).start( ()=>{  setTimeout(()=>{this.setState({Chooser:false})},100 )  } );
    }
    else {
        Animated.timing(
              this.height,
              {
                toValue: height,
                duration: 300,
                easing: Easing.linear
              }
        ).start(()=>{ setTimeout(()=>{ this.setState({Chooser:true})},100 )  });
    }

  }
  pickMultiple = async () => {
    await Permissions.request('photo').then(response => {
        if(response=='authorized')
        {
            ImagePicker.openPicker({
              multiple: true,
              waitAnimationEnd: true,
              mediaType:'photo',
              compressImageQuality:0.4
            }).then(images => {
              this.setState({
                images: images.map(i => {
                   return {uri: i.path, type: i.mime ,name: i.path.split('-').pop()};
                })
              },()=>{
                  this.setState({ modalVisible:true,Chooser:false  });
              });
            }).catch(e => {
              this.setState({  modalVisible:false,Chooser:false });
            });
        }
        else{
            this.setState({ Chooser:false, modalVisible:false });
        }
    })
  }
  openCam = async () => {
      await Permissions.request('camera').then(response => {
        if(response=='authorized')
        {
            ImagePicker.openCamera({
              compressImageQuality:0.5
            }).then(i => {
                var images = [];
                images.push({uri: i.path, type: i.mime ,name: i.path.split('-').pop()});
                this.setState({ Chooser:false,images: images },()=>{
                    this.setState({ Chooser:false, modalVisible:true });
                });
            }).catch(e => {
              this.setState({ Chooser:false, modalVisible:false });
            });
        }
        else{
          this.setState({ Chooser:false, modalVisible:false });
        }
     })
  }
  pushToLogin = () => {
      if(typeof this.props.sudonav != 'undefined')
      {
          this.props.sudonav.resetTo({ id: 'SudoLogin'});
      }
  }
  onSubmitPhoto = () => {
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
        this.setState({showphotoloading:true});
        var body = new FormData();
        body.append('user_id',  this.state.user.id);
        body.append('event_id', this.state.topevent.id);
        if(this.state.images.length > 0)
        {
            this.state.images.map((o,i) => {
                body.append('photo['+i+']',{ uri: o.uri,type: o.type,  name: o.name });
            })
        }
        var np = this;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if(xhttp.readyState == 4 && xhttp.status == 200) {

              np.setState({ showphotoloading:false, modalVisible:false,images:[] },()=>{
                Actions.Photos({refresh: {isrefresh:'true'}});
              });
          }
        };
        xhttp.open("POST", "https://api.eventonapp.com/api/addPhotos", true);
        xhttp.setRequestHeader("Content-type", "multipart/form-data");
        xhttp.send(body);
    }
  }
  hideShowFloatBtn = (s) => {
      this.setState({hideShowFloatBtn:s});
  }

  moveToSplash = () => {
      this.props.sudonav.push({id:'SudoSplash', user:this.state.user, topevent:this.state.topevent});
  }


  render(){
    return (
        <LinearGradient
            start={this.state.topevent.theme.bg_gradient.start}
            end={this.state.topevent.theme.bg_gradient.end}
            locations={this.state.topevent.theme.bg_gradient.locations}
            colors={this.state.topevent.theme.bg_gradient.colors}
            style={{ flex: 1 }}
        >
            <CustomStatusBar backgroundColor="#292E39" barStyle="light-content"/>
            {this.state.show &&
            <Drawer
              ref={(ref) => this._drawer = ref}
              type="overlay"
              tapToClose={true}
              openDrawerOffset={70}
              closedDrawerOffset={0}
              tweenDuration={400}
              tweenEasing = {'linear'}
              content= { <ControlPanel pushOf={this.pushOf} closeDrawer={this.closeControlPanel}  topevent={this.state.topevent} user={this.state.user} sudonav={this.props.sudonav}   /> }
              >
                <View style={{flex:1}}>
                    <Router getSceneStyle={() => styles.defaultBG}
                            openDrawer={this.openControlPanel}
                            googleTracker={this.googleTracker}
                            hideNavBar={true}
                            topevent={this.state.topevent}
                            user={this.state.user}
                            setCurrentScene={this.setCurrentScene}
                            sudonav={this.props.sudonav}
                            pushOf={this.pushOf}
                            hideShowFloatBtn={this.hideShowFloatBtn}
                            createReducer={this.reducerCreate.bind(this)}
                        >
                       <Scene key="root">
                         <Scene key="Main" type="reset" component={Main} initial={true} deeplink={this.state.deeplink} />
                         <Scene key="Chats" component={Chats}  />
                         <Scene key="Notes" component={Notes}  />
                         <Scene key="Businesscards" component={Businesscards}  />
                         <Scene key="Pollsnsurveys"  component={Pollsnsurveys}  />
                         <Scene key="Logistics" component={Logistics}  />
                         <Scene key="Photos" component={Photos}  />
                         <Scene key="Downloads" component={Downloads}  />
                         <Scene key="Notifications" component={Notifications} />
                         <Scene key="Chat" component={Chat} />
                         <Scene key="Post" component={Post}  />
                         <Scene key="Note" component={Note}  />
                         <Scene key="Card" component={Card}  />
                         <Scene key="ChatEvent" component={ChatEvent}  />
                         <Scene key="Web" component={Web} />
                         <Scene key="Prefer" component={Prefer} />
                         <Scene key="SponsorOffer" component={SponsorOffer} />
                         <Scene key="Meetup" component={Meetup} />
                         <Scene key="SponsorInfo" component={SponsorInfo} />
                         <Scene key="ScheduleInfo" component={ScheduleInfo} />
                         <Scene key="PeopleData" component={PeopleData} />
                         <Scene key="EventNetwork" component={EventNetwork} />
                         <Scene key="FeedEdit" component={FeedEdit} />
                         <Scene key="CommonConnection" component={CommonConnection} />
                       </Scene>
                   </Router>
                    {this.state.hideShowFloatBtn && <FloatButton currentScene={this.state.currentScene} showOptions={this.showOptions.bind(this)}  slideToShow={this.slideToShow} />}
                    <Modal
                        animationType={"slide"}
                        transparent={true}
                        visible={this.state.Chooser}
                        onRequestClose={() => { this.setState({
                            Chooser:!this.state.Chooser
                        });}}
                        >
                          <TouchableWithoutFeedback onPress={ ()=>this.slideToShow() }>
                             <Animated.View style={{opacity:this.height, flex:1,position:'absolute',height:this.height,left:0,right:0,bottom:0,justifyContent:'flex-end'}}>
                                  <View style={{flexDirection:'row',justifyContent:'space-between',height:120,alignSelf:'flex-end',backgroundColor:'rgba(255,255,255,0.9)'}}>
                                      <TouchableOpacity onPress={()=>{ this.openCam() }} style={{flex:1,justifyContent:'center',alignItems:'center',borderRightColor:'#EAEAEA',borderRightWidth:0.5}}>
                                            <Image source={imageSource.upload_camera} style={{width:40,height:40}}/>
                                            <Text>Camera</Text>
                                      </TouchableOpacity>
                                      <TouchableOpacity onPress={()=>{ this.pickMultiple() }} style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                          <Image source={imageSource.upload_gallery} style={{width:40,height:40}}/>
                                          <Text>Gallery</Text>
                                      </TouchableOpacity>
                                  </View>
                             </Animated.View>
                          </TouchableWithoutFeedback>
                    </Modal>
                   <Modal
                       animationType={"slide"}
                       transparent={true}
                       visible={this.state.modalVisible}
                       onRequestClose={() => { this.setState({
                           modalVisible:!this.state.modalVisible
                       });}}
                       >
                       <View style={{flex:1,backgroundColor:'rgba(255,255,255,1)'}} >
                            <View style={{backgroundColor:'#2B2F3E',flexDirection:'row',alignItems:'center',padding:10}}>
                                <View style={{width:30,height:30}}>
                                    <TouchableOpacity onPress={() =>  this.setState({
                                                        modalVisible:!this.state.modalVisible,images:[]
                                                      }) } style={{}}>
                                        <Text style={{color:'#FFF',fontFamily:'Roboto-Medium',textAlign:'center',fontSize:22}}>&#x2715;</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex:1,padding:10}}>
                                    <Text style={{color:'#FFF',fontFamily:'Roboto-Medium',textAlign:'center',fontSize:18}}>Photo Upload</Text>
                                </View>
                                <View style={{width:30,height:30}}></View>
                            </View>
                            <View style={{padding:10,width:'100%',flexWrap:'wrap',flexDirection:'row'}}>
                              <ScrollView contentContainerStyle={{paddingBottom:110,flexDirection: 'row',flexWrap:'wrap'}} removeClippedSubviews={true}>
                                {
                                  this.state.images.map((o,i)=>{
                                      return (
                                        <Image key={i} source={{uri:o.uri}} resizeMode={'contain'}  style={{width:((width-40)/2),height:((width-40)/2),margin:5,borderWidth:1,borderColor:'#999'}}  />
                                      )
                                  })
                                }
                              </ScrollView>
                            </View>
                            <View style={{position:'absolute',bottom:0,left:0,right:0,paddingVertical:15,backgroundColor:'#2B2F3E'}}>
                                <TouchableOpacity onPress={()=>{ this.onSubmitPhoto() }}>
                                    <Text style={{color:'#FFF',fontFamily:'Roboto-Medium',textAlign:'center',fontSize:18}}>Done</Text>
                                </TouchableOpacity>
                            </View>
                            {
                                (this.state.showphotoloading) ?
                                  <View style={{position:'absolute',top:0,bottom:0,right:0,left:0,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.2)',zIndex:100}}>
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
                    </Modal>
                 </View>
               </Drawer>
              }
         </LinearGradient>
       )
    }
}
const styles = StyleSheet.create({
  defaultBG: {
    backgroundColor: 'transparent',
    shadowColor: null,
    shadowOffset: null,
    shadowOpacity: null,
    shadowRadius: null,
    flex: 1,
  },
});
