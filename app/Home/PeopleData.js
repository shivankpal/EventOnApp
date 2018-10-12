'use strict';
import React, { Component } from 'react';
import { View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  AsyncStorage,
  StyleSheet,
  Dimensions,
  Alert,
  Modal,
  Linking,
  Platform,
  CameraRoll
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Permissions from 'react-native-permissions';
import RNFS from 'react-native-fs';
import ToastAndroid from '@remobile/react-native-toast';
import LinearGradient from 'react-native-linear-gradient';
import Header from '.././Main/Header';
import PeopleTabview from './PeopleTabview';
const imageSource = {
      loc_icon : require(".././Assets/Img/ico_loc.png"),
      notes: require(".././Assets/Img/ico_notes.png"),
      chats: require(".././Assets/Img/tac_3.png"),
      google: require(".././Assets/Img/tac_4.png"),
      FACEBOOK: require(".././Assets/Img/logo social3.png"),
      TWITTER: require(".././Assets/Img/logo social2.png"),
      LINKEDIN: require(".././Assets/Img/logo social1.png"),
      FACEBOOK_D: require(".././Assets/Img/logo social3_b.png"),
      TWITTER_D: require(".././Assets/Img/logo social2_b.png"),
      LINKEDIN_D: require(".././Assets/Img/logo social1_b.png"),
      prof_icon : require(".././Assets/Img/pro_name.png"),
      star_icon : require(".././Assets/Img/badge_star.png"),
      //close_icon: require(".././Assets/Img/postback_close.png"),
      //ico_downloads: require(".././Assets/Img/ico_downloads.png"),
      close_icon: require(".././Assets/Img/cancel-music.png"),
      ico_downloads: require(".././Assets/Img/download-tray.png"),
};
const {height, width} = Dimensions.get('window');
export default class PeopleData extends Component {
    constructor(props) {
      super(props);
      this.state = {
          user: this.props.user,
          topevent: this.props.topevent,
          loading: true,
          data:[],
          page:'TAGS',
          showid:this.props.showid,
          visible:false,
          sudotopevent:[],
          fimage:'',
          showmap:false,
      }
      this.getEvents = this.getEvents.bind(this);
    }
    disableResponse = (value) => {
        let s = value.toLowerCase().replace(/^[\u00C0-\u1FFF\u2C00-\uD7FF\w]|\s[\u00C0-\u1FFF\u2C00-\uD7FF\w]/g, (letter) => { return letter.toUpperCase() });
        ToastAndroid.show(s+" Account not connected.", ToastAndroid.SHORT);
    }
    componentWillMount(){
        this.getProfile();
    }

    getProfile = async () => {
       await fetch('https://api.eventonapp.com/api/profile/'+this.state.showid+"?user_id="+this.state.user.id, {
          method: 'GET'
       }).then((response) => response.json())
       .then((responseJson) => {
         this.setState({ data:responseJson.data },()=>{
            this.setState({loading:false})
         });
       }).catch((error) => {    });
    }
    moveToChat = (touser) => {
        Actions.Chat({touser: touser});
    }
    pushToLogin = () => {
        if(typeof this.props.sudonav != 'undefined')
        {
            this.props.sudonav.resetTo({ id: 'SudoLogin'});
        }
    }
    addToNetwork = async () => {
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
          await fetch('https://api.eventonapp.com/api/followUser/?user_id='+this.state.user.id+'&follow_id='+this.state.showid, {
             method: 'GET'
          }).then((response) => response.json())
          .then((responseJson) => {
            if(responseJson.status){

                let data = this.state.data;
                data['isfollow'] = 1;
                this.setState({data:data},()=>{
                });
                this.getProfile();
            }
            else{
              ToastAndroid.show(responseJson.msg, ToastAndroid.LONG);
            }
          }).catch((error) => { });
      }
    }
    removeFromNetwork = async () => {
        await fetch('https://api.eventonapp.com/api/unfollowUser/?user_id='+this.state.user.id+'&follow_id='+this.state.showid, {
           method: 'GET'
        }).then((response) => response.json())
        .then((responseJson) => {
          if(responseJson.status){
              let data = this.state.data;
              data['isfollow'] = 0;
              this.setState({data:data},()=>{
              });
              this.getProfile();
          }
          else{
            ToastAndroid.show(responseJson.msg, ToastAndroid.LONG);
          }
        }).catch((error) => { });
    }
    confirmDialog = () => {
        Alert.alert(
          '',
          'Are you sure you want to unfollow?',
          [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: "Yes I'm", onPress: () => this.removeFromNetwork() },
          ],
          { cancelable: false }
        )
    }
    setPage = (page) => {

        this.refs['TAGS'].setNativeProps({
          style: {
            borderBottomColor:'transparent',
          }
        })
        this.refs['TAGS Text'].setNativeProps({
          style: {
            color: "#000",
            fontFamily:'Roboto-Regular'
          },
        })
        this.refs['POSTS'].setNativeProps({
          style: {
            borderBottomColor:'transparent',
          }
        })
        this.refs['POSTS Text'].setNativeProps({
          style: {
            color: "#000",
            fontFamily:'Roboto-Regular'
          },
        })
        this.refs['EVENTS'].setNativeProps({
          style: {
            borderBottomColor:'transparent',
          }
        })
        this.refs['EVENTS Text'].setNativeProps({
          style: {
            fontFamily:'Roboto-Regular',
            color: "#000",
          }
        })
        this.refs[page].setNativeProps({
          style: {
            borderBottomColor:'#27ccc0',
          }
        })
        this.refs[page+' Text'].setNativeProps({
          style: {
            color:'#000',
            fontFamily:'Roboto-Bold',
          },

        })
        this.setState({page:page},() => {
        })
    }
    getEvents = (o) => {
      this.setState({sudotopevent:o},()=>{
        this.setState({visible:true},()=>{
        });
      });
    }
    moveToSearchGoogle = () => {
      var url = "https://www.google.co.in/search?q="+encodeURIComponent(this.state.data.name);
      Actions.Web({url:url})
    }
    moveToCommonConnection = (touser) => {
      Actions.CommonConnection({user:touser});
    }
    moveToNetwork = (param) => {
        Actions.EventNetwork({filterTag:param,user:this.state.data,hideaction:true});
    }
    downloadUrl = (url) => {
      url = 'https://api.eventonapp.com/api/downloadFile?url='+encodeURIComponent(url);
      Linking.canOpenURL(url).then(supported => {
        if (!supported) {

        } else {
          return Linking.openURL(url);
        }
      })
    }
    moveToSocial = (url) => {
      Actions.Web({url:url});
    }
    arraySearch = (val) => {
      var index = this.state.data.social.map(function (j) { return j.source; }).indexOf(val);
      if(index >= 0)
      {
        return(
            <TouchableOpacity onPress={()=>this.moveToSocial(this.state.data.social[index].source_url)} style={{flex:1,justifyContent:'center', alignItems:'center',padding:3,flexDirection:'row'}}>
                  <Image source={imageSource[this.state.data.social[index].source]} style={{width:70,height:50,resizeMode:'contain'}}/>
            </TouchableOpacity>
        )
      }
      else{
        return(
            <TouchableOpacity onPress={()=>this.disableResponse(val)} style={{flex:1,justifyContent:'center', alignItems:'center',padding:3,flexDirection:'row'}}>
                  <Image source={imageSource[val+'_D']} style={{width:70,height:50,resizeMode:'contain'}}/>
            </TouchableOpacity>
        )
      }
    }
    showmap = (url) => {
        this.setState({fimage:url},()=>{
            this.setState({showmap:true})
        })
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



    render() {

      if(this.state.loading){
        return (
          <LinearGradient
                start={this.state.topevent.theme.bg_gradient.start}
                end={this.state.topevent.theme.bg_gradient.end}
                locations={this.state.topevent.theme.bg_gradient.locations}
                colors={this.state.topevent.theme.bg_gradient.colors}
                style={{ flex: 1 }}
            >
              <Header openDrawer={this.props.openDrawer} currentScene={"Details"} topevent={this.props.topevent} isback={true} sudonav={this.props.sudonav}/>
              <View style={{justifyContent:'center',alignItems:'center',height:200,backgroundColor:'#FFF',borderRadius:10,margin:10}}>
                  <ActivityIndicator
                    style={styles.centering}
                    color="#487597"
                    size="large"
                  />
            </View>
          </LinearGradient>
        );
      }

      return(
        <LinearGradient
          start={this.state.topevent.theme.bg_gradient.start}
          end={this.state.topevent.theme.bg_gradient.end}
          locations={this.state.topevent.theme.bg_gradient.locations}
          colors={this.state.topevent.theme.bg_gradient.colors}
          style={{ flex: 1 }}
        >
            <Header openDrawer={this.props.openDrawer}  currentScene={"Details"} topevent={this.props.topevent} isback={true} sudonav={this.props.sudonav}/>
            <ScrollView>
                  <View style={[styles.content,{backgroundColor:'#FFF',borderRadius:10}]}>

                    <View style={{flexDirection:'row',marginHorizontal:10,marginBottom:20,marginTop:10}}>
                      {
                        (this.state.data.image!='') ?
                          <View>
                              <Image borderRadius={35} source={{uri: this.state.data.image}} style={{width:70,height:70,borderRadius:35,marginRight:5}}/>
                              { (this.state.data.isfollow > 0) ? <Image source={imageSource.star_icon} style={{width:20,height:20,position:'absolute',bottom:5,right:5}}/> : null }
                          </View>
                           :
                          <View>
                               <Image source={imageSource.prof_icon} style={{width:70,height:70,borderRadius:35,marginRight:5,borderWidth:1,borderColor:'#CCC'}}/>
                               { (this.state.data.isfollow > 0) ? <Image source={imageSource.star_icon} style={{width:20,height:20,position:'absolute',bottom:5,right:5}}/> : null }
                          </View>
                      }
                      <View style={{flex:1,paddingHorizontal:10}}>
                          <View style={{flexDirection:'row',alignItems:'center'}}>
                              <Text style={styles.title}>{this.state.data.name.toLowerCase().replace(/^[\u00C0-\u1FFF\u2C00-\uD7FF\w]|\s[\u00C0-\u1FFF\u2C00-\uD7FF\w]/g, (letter) => { return letter.toUpperCase() })}</Text>
                          </View>
                          {(this.state.data.profession!='') ?<Text style={styles.subtitle_pos} numberOfLines={2} >{this.state.data.profession}</Text> : null }
                          {(this.state.data.location!='') ?<Text style={styles.subtitle_loc}>{this.state.data.location}</Text> : null }
                      </View>
                      <View style={{alignItems:'center',justifyContent:'center'}}>
                        {
                            (this.state.data.business_card!='') ?
                            <TouchableOpacity onPress={()=>this.downloadUrl(this.state.data.business_card)}>
                                <Image source={{uri:this.state.data.business_card}} style={{width:70,height:50,justifyContent:'flex-end'}}>
                                    <Text style={{color: '#9c9fa6',fontSize:10,fontFamily:'Roboto-Regular',textAlign:'center',backgroundColor:'rgba(0,0,0,0.8)'}}>Save</Text>
                                </Image>
                            </TouchableOpacity>
                            :
                            null
                        }
                      </View>
                    </View>



                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',marginHorizontal:15,marginBottom:20}}>
                        <View style={{flex:1,alignItems:'center'}}>
                            <TouchableOpacity onPress={()=>this.moveToChat(this.state.data)} style={{borderRadius:5,borderWidth:1,paddingHorizontal:7,paddingVertical:5,borderColor:'#9c9fa6'}}>
                                <Text style={{textAlign:'center',color:'#666',fontFamily:'Roboto-Regular',fontSize:13}}>Message</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex:1,alignItems:'center'}}>
                          {
                            (this.state.data.isfollow > 0) ?
                            <TouchableOpacity onPress={()=>this.confirmDialog()} style={{borderRadius:5,borderWidth:1,paddingHorizontal:7,paddingVertical:5,borderColor:'#9c9fa6'}}>
                                <Text style={{textAlign:'center',color:'#666',fontFamily:'Roboto-Regular',fontSize:13}}>Unfollow</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={()=>this.addToNetwork()} style={{borderRadius:5,borderWidth:1,paddingHorizontal:7,paddingVertical:5,borderColor:'#9c9fa6'}}>
                                <Text style={{textAlign:'center',color:'#666',fontFamily:'Roboto-Regular',fontSize:13}}>Follow</Text>
                            </TouchableOpacity>
                          }
                        </View>
                        <View style={{flex:1,alignItems:'center'}}>
                          <TouchableOpacity onPress={()=>this.moveToSearchGoogle()} style={{borderRadius:5,borderWidth:1,paddingHorizontal:7,paddingVertical:5,borderColor:'#9c9fa6'}}>
                              <Text style={{textAlign:'center',color:'#666',fontFamily:'Roboto-Regular',fontSize:13}}>Google</Text>
                          </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',marginHorizontal:30,marginBottom:10}}>
                      { this.arraySearch('FACEBOOK') }
                      { this.arraySearch('TWITTER') }
                      { this.arraySearch('LINKEDIN') }
                    </View>

                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',marginHorizontal:10,marginTop:10,marginBottom:20}}>
                      <TouchableOpacity onPress={()=>this.moveToNetwork('Followers')} style={{flex:1,justifyContent:'center', alignItems:'center',flexDirection:'column'}}>
                          <Text style={{textAlign:'center',color:'#666',fontFamily:'Roboto-Medium',fontSize:16}}>{this.state.data.followers_count}</Text>
                          <Text style={{textAlign:'center',color:'#000',fontFamily:'Roboto-Regular',fontSize:10}}>Followers</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>this.moveToNetwork('Following')} style={{flex:1,justifyContent:'center', alignItems:'center',flexDirection:'column'}}>
                          <Text style={{textAlign:'center',color:'#666',fontFamily:'Roboto-Medium',fontSize:16}}>{this.state.data.following_count}</Text>
                          <Text style={{textAlign:'center',color:'#000',fontFamily:'Roboto-Regular',fontSize:10}}>Following</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={ ()=>this.moveToCommonConnection(this.state.data) }style={{flex:1,justifyContent:'center', alignItems:'center',flexDirection:'column'}}>
                          <Text style={{textAlign:'center',color:'#666',fontFamily:'Roboto-Medium',fontSize:16}}>{this.state.data.common_people.length}</Text>
                          <Text style={{textAlign:'center',color:'#000',fontFamily:'Roboto-Regular',fontSize:10}}>Common Connections</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={{borderTopWidth:1,borderTopColor:'rgba(55, 61, 76,0.1)',width:'100%',marginBottom:10}}></View>
                    <View style={{flexDirection:'row',flex:1}}>
                        <TouchableOpacity ref="TAGS" onPress={()=>this.setPage('TAGS')} style={{flex:1,justifyContent:'center',alignItems:'center',padding:10,borderBottomWidth:2,borderBottomColor:'#29CCC0'}}>
                            <Text  ref="TAGS Text" style={[styles.prof,{color:'#000',fontFamily:'Roboto-Bold'}]}>TAGS</Text>
                        </TouchableOpacity>
                        <TouchableOpacity ref="POSTS"  onPress={()=>this.setPage('POSTS')} style={{flex:1,justifyContent:'center',alignItems:'center',padding:10,borderBottomWidth:2,borderBottomColor:'transparent'}}>
                            <Text ref="POSTS Text" style={styles.prof}>POSTS</Text>
                        </TouchableOpacity>
                        <TouchableOpacity ref="EVENTS" onPress={()=>this.setPage('EVENTS')} style={{flex:1,justifyContent:'center',alignItems:'center',padding:10,borderBottomWidth:2,borderBottomColor:'transparent'}}>
                            <Text ref="EVENTS Text" style={styles.prof}>EVENTS</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{backgroundColor:'transparent',width:'100%', padding:20,minHeight:height-370,justifyContent:'flex-start'}}>
                          <PeopleTabview {...this.state} getProfile={this.getProfile.bind(this)} getEvents={this.getEvents} showmap={this.showmap.bind(this)} />
                    </View>
                </View>
            </ScrollView>
            <Modal
                animationType={"fade"}
                transparent={true}
                visible={this.state.showmap}
                onRequestClose={() => { this.setState({ showmap: !this.state.showmap} ) }}
                >
               <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.8)',paddingVertical:60,paddingHorizontal:20}}>
                   <TouchableOpacity style={{position:'absolute',top:20,left:20,zIndex:20,padding:5}} onPress={()=>{ this.downloadFile(this.state.fimage) }}>
                       <Image source={imageSource.ico_downloads} style={{width:20,height:20}}  />
                   </TouchableOpacity>
                    <TouchableOpacity style={{position:'absolute',top:20,right:20,zIndex:20,padding:5}} onPress={()=>this.setState({ showmap: false })}>
                        <Image source={imageSource.close_icon} style={{width:20,height:20}}  />
                    </TouchableOpacity>
                  <Image source={{uri:this.state.fimage}} style={{width:undefined,height:undefined,flex:1,resizeMode:'contain'}}/>
               </View>
            </Modal>
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.state.visible}
                onRequestClose={() => { this.setState({
                    visible:!this.state.visible,
                    sudotopevent:[],
                });}}
                >
                <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.9)',justifyContent:'center',alignItems:'center',padding:10}} >
                     <TouchableOpacity style={{position:'absolute',top:20,right:20,zIndex:20,padding:5}} onPress={()=>this.setState({ visible: false })}>
                        <Image source={imageSource.close_icon} style={{width:20,height:20,alignSelf:'flex-end'}}  />
                     </TouchableOpacity>
                      <View style={{width:'100%',backgroundColor:'#FFF',borderRadius:10}}>
                            <Image  source={{uri: this.state.sudotopevent.image_cover}} borderTopLeftRadius={10} borderTopRightRadius={10} resizeMode={'cover'} style={{width:null, height:150,justifyContent:'flex-end',borderRadius:10}} >
                              <LinearGradient
                                  start={{x: 0.5, y: 0.25}} end={{x: 0.5, y: 1}}
                                  locations={[0,1]}
                                  colors={['rgba(0,0,0,0)','rgba(0,0,0,1)']}
                                  style={{flex:1,justifyContent:'flex-end'}}
                                >
                                  <Text style={{color: '#FFF',padding:10,fontFamily:'Roboto-Regular',textShadowColor : '#000',backgroundColor:'transparent'}}>{this.state.sudotopevent.title}</Text>
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
                                       (this.state.sudotopevent.str_date == '') ?
                                        <View>
                                            <Text style={{color: '#666',fontSize:12,fontFamily:'Roboto-Regular',flex:1}}>{this.state.sudotopevent.format_day}</Text>
                                            <Text style={{color: '#666',fontSize:12,fontFamily:'Roboto-Regular',flex:1}}>{this.state.sudotopevent.format_date}</Text>
                                        </View>
                                        :
                                        <Text style={{color: '#666',fontSize:12,fontFamily:'Roboto-Regular',flex:1}}>{this.state.sudotopevent.str_date}</Text>
                                    }
                                </View>
                            </View>
                            <View style={{padding:10,marginLeft:10,marginRight:10,borderBottomWidth:1, borderBottomColor:'#EAEAEA'}}>
                                <Text style={{color: '#666',fontSize:12,fontFamily:'Roboto-Regular'}}>{this.state.sudotopevent.description}</Text>
                            </View>
                        </View>
                </View>
             </Modal>
      </LinearGradient>
      );
    }
}

const styles = StyleSheet.create({
  container: {
      flex:1,
  },
  centering: {
   alignItems: 'center',
   justifyContent: 'center',
   padding: 8,
 },
 content:{
   margin:10,
   flex:1,
   alignItems:'center'
 },
 icon:{
   width:15,
   height:15,
   marginRight:5,
 },
 title:{
   color: '#000',
   fontSize:18,
   fontFamily:'Roboto-Regular',
   marginRight:3
 },
 subtitle_pos:{
   color: '#666',
   fontSize:10,
   fontFamily:'Roboto-Medium',
 },
 subtitle_loc:{
   color: '#666',
   fontSize:11,
   fontFamily:'Roboto-Regular',
 },
 prof:{
   color: '#000',
   fontSize:12,
   fontFamily:'Roboto-Regular',
 }
});
