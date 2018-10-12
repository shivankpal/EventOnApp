'use strict';
import React, { Component } from 'react';
import { View, Text,  ScrollView,  ActivityIndicator,AsyncStorage,Image,Dimensions,TouchableOpacity,Modal,TouchableWithoutFeedback,Platform,CameraRoll } from 'react-native';
import PhotoView from 'react-native-photo-view';
import Permissions from 'react-native-permissions';
import RNFS from 'react-native-fs';
import LinearGradient from 'react-native-linear-gradient';
import ToastAndroid from '@remobile/react-native-toast';

import Pin from './Pin';
import styles from './Style';
import Header from '.././Main/Header';
const {height, width} = Dimensions.get('window');
const imageSource = {
      heart_icon: require(".././Assets/Img/feed_like.png"),
      comment_icon: require(".././Assets/Img/feed_comment.png"),
      //close_icon: require(".././Assets/Img/postback_close.png"),
      //ico_downloads: require(".././Assets/Img/ico_downloads.png"),
      close_icon: require(".././Assets/Img/cancel-music.png"),
      ico_downloads: require(".././Assets/Img/download-tray.png"),
};
export default class Index extends Component {
    constructor(props) {
      super(props);
      this.state = {
          user:this.props.user,
          topevent:this.props.topevent,
          loading:true,
          leftData:[],
          rightData:[],
          modalVisible:false,
          uri : '',
          height:'',
          showload:true,

      }
      this.getData = this.getData.bind(this);
      this.showPop = this.showPop.bind(this);
      this.page = 1;
    }
    componentWillMount () {
      this.props.googleTracker('EVENT PHOTOS:'+this.state.topevent.title);
      this.props.setCurrentScene('Event Photos');
      setTimeout(()=>{
          this.getData();
      },500)
    }
    getData = async (eid) => {
      this.setState({animating:true});
       await fetch('https://api.eventonapp.com/api/media/'+this.state.topevent.id+'/'+this.page, {
          method: 'GET'
       }).then((response) => response.json())
       .then((responseJson) => {
         let param = true;
         if(responseJson.data.length < 15)
         {
            param=false;
         }
         responseJson.data.map((o,i)=>{
            if(i % 2)
            {
                var f = this.state.rightData  ;
                f.push(o);
                this.setState({rightData: f });
            }
            else
            {
              var f = this.state.leftData  ;
              f.push(o);
              this.setState({leftData: f });
            }
         })
         this.setState({loading:false,showload:param,animating:false},()=>{
           this.page = this.page + 1;
         });
       })
       .catch((error) => { this.setState({animating:false}) })
    }
    showPop = (path,height) => {
      this.setState({uri:path,height:height},() => {
        this.setState({
            modalVisible:!this.state.modalVisible
        })
      })
    }
    showAnimating = () => {
        return (
            <ActivityIndicator
              style={styles.centering}
              color="#487597"
              size="large"
            />
        )
    }
    ext = (url) => {
      return (url = url.substr(1 + url.lastIndexOf("/")).split('?')[0]).split('#')[0].substr(url.lastIndexOf("."))
    }
    downloadFile = async (file) => {
      let ext = this.ext(file);
      let name = new Date().getUTCMilliseconds();
      let os = await Platform.OS;
      if(os==='ios')
      {
        Permissions.request('photo').then(response => {
          if(response=='authorized')
          {
            CameraRoll.saveToCameraRoll(file).then(
              ToastAndroid.show('Photo added to camera roll!', ToastAndroid.LONG)
            )
          }
        })
      }
      else
      {
          Permissions.request('storage').then(response => {
            if(response=='authorized')
            {
                let path = RNFS.PicturesDirectoryPath+'/'+name+ext;
                RNFS.downloadFile({fromUrl:file, toFile: path}).promise.then(res => {
                    ToastAndroid.show("Image Downloaded Successfully\n"+path, ToastAndroid.LONG)
                }).catch((err) => {
                  ToastAndroid.show(err.message, ToastAndroid.LONG)
                })
            }
          })
      }
    }
    render () {
      if(this.state.loading){
        return (
            <LinearGradient
                start={this.state.topevent.theme.bg_gradient.start}
                end={this.state.topevent.theme.bg_gradient.end}
                locations={this.state.topevent.theme.bg_gradient.locations}
                colors={this.state.topevent.theme.bg_gradient.colors}
                style={{ flex: 1 }}
            >
              <Header openDrawer={this.props.openDrawer} currentScene={"Event Photos"} topevent={this.props.topevent} user={this.state.user} sudonav={this.props.sudonav}/>
              <View style={[styles.box,{flex:1,justifyContent:'center',alignItems:'center'}]}>
                    <ActivityIndicator
                      style={styles.centering}
                      color="#487597"
                      size="large"
                    />
              </View>
          </LinearGradient>
        )
      }
      if(this.state.leftData.length==0 && this.state.loading==false)
      {
          return (
            <LinearGradient
                start={this.state.topevent.theme.bg_gradient.start}
                end={this.state.topevent.theme.bg_gradient.end}
                locations={this.state.topevent.theme.bg_gradient.locations}
                colors={this.state.topevent.theme.bg_gradient.colors}
                style={{ flex: 1 }}
            >
              <Header openDrawer={this.props.openDrawer} currentScene={"Event Photos"} topevent={this.props.topevent} user={this.state.user} sudonav={this.props.sudonav}/>
              <View style={styles.box}>
                  <View style={{height:250,justifyContent:'center',alignItems:'center',backgroundColor:'#FFF',padding:30,borderRadius:10}}>
                    <Text style={{fontFamily:'Roboto-Medium',color:'#222',textAlign:'center',fontSize:16}}>Calm Crowd!</Text>
                    <Text style={{fontFamily:'Roboto-Thin',color:'#000',textAlign:'center',marginTop:15,fontSize:12}}>No one have posted a pic to the event. Be the the first to post a pic for this event.</Text>
                  </View>
              </View>
            </LinearGradient>
          )
      }
      return (
        <LinearGradient
            start={this.state.topevent.theme.bg_gradient.start}
            end={this.state.topevent.theme.bg_gradient.end}
            locations={this.state.topevent.theme.bg_gradient.locations}
            colors={this.state.topevent.theme.bg_gradient.colors}
            style={{ flex: 1 }}
        >
            <Header openDrawer={this.props.openDrawer} currentScene={"Event Photos"} topevent={this.props.topevent} user={this.state.user} sudonav={this.props.sudonav}/>
            <ScrollView
                removeClippedSubviews={true}
                contentContainerStyle={{paddingBottom:30,paddingTop:20}}
              >
                <View style={{flexDirection:'row'}}>
                    <View ref={ref => this.left = ref} style={{width:((width-40)/2),margin:10,flexDirection:'column'}}>
                        {
                            this.state.leftData.map((o,i)=>{
                              return (  <Pin key={i} row={o} showPop={this.showPop} /> )
                            })
                        }
                    </View>
                    <View ref={ref => this.right = ref} style={{width:((width-40)/2),margin:10,flexDirection:'column'}}>
                        {
                            this.state.rightData.map((o,i)=>{
                                return (  <Pin key={i} row={o} showPop={this.showPop}  /> )
                            })
                        }
                    </View>
                </View>
                {
                    (this.state.showload && (this.state.loading==false)) ?
                      <View style={{justifyContent:'center',alignItems:'center'}}>
                        {
                            (this.state.animating) ? this.showAnimating() :
                            <TouchableOpacity style={{backgroundColor:'#FFF',paddingHorizontal:35,paddingVertical:10,borderRadius:20}} onPress={()=>this.getData()} >
                                <Text style={{textAlign:'center',color:'#555'}}>Load More</Text>
                            </TouchableOpacity>
                        }
                      </View>
                      :
                      null
                }
            </ScrollView>
            <Modal
                animationType={'fade'}
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => { this.setState({
                    modalVisible:!this.state.modalVisible
                });}}
                >
                <View removeClippedSubviews={true} style={{flex:1,backgroundColor:'rgba(0,0,0,0.7)',justifyContent:'center',alignItems:'center'}}>
                       <View style={{width: '100%', height: '100%',justifyContent:'center',alignItems:'center',backgroundColor:'transparent' }}>
                         <TouchableOpacity style={{position:'absolute',top:20,left:20,zIndex:20,padding:5}} onPress={()=>{ this.downloadFile(this.state.uri) }}>
                             <Image source={imageSource.ico_downloads} style={{width:20,height:20}}  />
                         </TouchableOpacity>
                         <TouchableOpacity style={{position:'absolute',top:20,right:20,zIndex:20,padding:5}} onPress={()=>this.setState({modalVisible:false,uri:''})}>
                             <Image source={imageSource.close_icon} style={{width:20,height:20}}  />
                         </TouchableOpacity>
                         {
                           this.state.uri &&
                              <PhotoView
                                  source={{uri: this.state.uri}}
                                  minimumZoomScale={0.8}
                                  maximumZoomScale={4}
                                  transparent={true}
                                  androidScaleType="fitCenter"
                                  onLoad={() => console.log("Image loaded!")}
                                  onViewTap={() => { this.setState({
                                      modalVisible:!this.state.modalVisible
                                  });}}
                                  style={{width: '100%', height: '100%',backgroundColor:'transparent' }} />
                        }
                      </View>
                </View>
            </Modal>
        </LinearGradient>
      )
    }
}
