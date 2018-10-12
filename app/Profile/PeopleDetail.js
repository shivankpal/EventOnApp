'use strict';
import React, { Component } from 'react';
import { View, Text,  Image,Modal,Alert, TouchableOpacity,  ScrollView, StatusBar,  ActivityIndicator,  AsyncStorage, Dimensions, Switch, Linking} from 'react-native';
import ToastAndroid from '@remobile/react-native-toast';

import styles from './Style';
import LinearGradient from 'react-native-linear-gradient';
import PeopleTabview from './PeopleTabview';
import CustomStatusBar from '.././Common/CustomStatusBar';
const imageSource = {
      prof_icon : require(".././Assets/Img/pro_name.png"),
      arrow_left: require(".././Assets/Img/arrow_left.png"),
      google: require(".././Assets/Img/tac_4_w.png"),
      chats: require(".././Assets/Img/tac_3.png"),
      loc_icon : require(".././Assets/Img/ed-top-loc.png"),
      date_icon: require(".././Assets/Img/ed-top-dat.png"),
      close_icon: require(".././Assets/Img/postback_close.png"),
      download: require(".././Assets/Img/ico_downloads.png"),
      FACEBOOK: require(".././Assets/Img/logo social3.png"),
      TWITTER: require(".././Assets/Img/logo social2.png"),
      LINKEDIN: require(".././Assets/Img/logo social1.png"),
      FACEBOOK_D: require(".././Assets/Img/logo social3_b.png"),
      TWITTER_D: require(".././Assets/Img/logo social2_b.png"),
      LINKEDIN_D: require(".././Assets/Img/logo social1_b.png"),
      star_icon : require(".././Assets/Img/badge_star.png"),
};

const {height, width} = Dimensions.get('window');

export default class Index extends Component {
    constructor(props) {
      super(props);
      this.state = {
          user:[],
          showid:this.props.showid,
          prefer: [],
          interest:[],
          comment:[],
          common:[],
          data:[],
          loading:true,
          page:'TAGS',
          topevent:[],
          visible:false,
          showmap:false,
      }
      this.getEvents = this.getEvents.bind(this);
    }
    disableResponse = (value) => {
        let s = value.toLowerCase().replace(/^[\u00C0-\u1FFF\u2C00-\uD7FF\w]|\s[\u00C0-\u1FFF\u2C00-\uD7FF\w]/g, (letter) => { return letter.toUpperCase() });
        ToastAndroid.show(s+" Account not connected.", ToastAndroid.SHORT);
    }
    componentWillMount(){
      AsyncStorage.getItem('USER').then((user) => {
            if(user!=null)
            {
                this.setState({user:JSON.parse(user)},()=>{
                    setTimeout(()=>{ this.getProfile() },1000)
                })
            }
      })
    }
    getEvents = (o) => {
      this.setState({topevent:o},()=>{
        this.setState({visible:true},()=>{

        });
      })
    }
    getProfile = async () => {
       await fetch('https://api.eventonapp.com/api/profile/'+this.state.showid+"?user_id="+this.state.user.id, {
          method: 'GET'
       }).then((response) => response.json())
       .then((responseJson) => {
         this.setState({data:responseJson.data},()=>{
            this.setState({loading:false})
         });
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
        this.setState({page:page},() => {
        })
    }
    componentWillReceiveProps(nextProps){
    }

    pushBack = () => {
      this.props.navigator.pop();
    }
    moveToNetwork = (tag) => {
      this.props.navigator.push({id:'Mynetwork', user:this.state.data, filterTag:tag,hideaction:true});
    }
    moveToCommonConnection = (touser) => {
      this.props.navigator.push({id:'CommonConnection', user:touser});
    }
    moveToSearchGoogle = () => {
        var url = "https://www.google.co.in/search?q="+encodeURIComponent(this.state.data.name);
        this.props.navigator.push({id:'Web',url:url});
    }

    moveToChat = (touser) => {
      this.props.navigator.push({id:'Chat',user:this.state.user,touser:touser,template:false});
    }
    moveToSocial = (url) => {
      this.props.navigator.push({id:'Web',url:url});
    }

    addToNetwork = async () => {
        await fetch('https://api.eventonapp.com/api/followUser/?user_id='+this.state.user.id+'&follow_id='+this.state.showid, {
           method: 'GET'
        }).then((response) => response.json())
        .then((responseJson) => {
          if(responseJson.status){
              let data = this.state.data;
              data['isfollow'] = 1;
              this.setState({data:data},()=>{
                  this.getProfile()
              })
          }
          else{
            ToastAndroid.show(responseJson.msg, ToastAndroid.LONG);
          }
        }).catch((error) => { });
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
                this.getProfile()
              })
          }
          else{
            ToastAndroid.show(responseJson.msg, ToastAndroid.LONG);
          }
        }).catch((error) => { });
    }
    confirmDialog = () =>{
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
    downloadUrl = (url) => {
      url = 'https://api.eventonapp.com/api/downloadFile?url='+encodeURIComponent(url);
      Linking.canOpenURL(url).then(supported => {
        if (!supported) {

        } else {
          return Linking.openURL(url);
        }
      })
    }
    showmap = (url) => {
        this.setState({image:url},()=>{
            this.setState({showmap:true})
        })
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
                          <Text style={[styles.header_center_title,{color:'#9c9fa6'}]} ellipsizeMode={'tail'}  numberOfLines={1}>Profile</Text>
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
                        <Text style={[styles.header_center_title,{color:'#9c9fa6'}]} ellipsizeMode={'tail'}  numberOfLines={1}>Profile</Text>
                    </View>
                    <View style={styles.header_right}>
                      <View style={{width:30,height:30}}>
                      </View>
                    </View>
                </View>
                <ScrollView>
                      <View style={styles.content}>

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
                                    <Text style={[styles.title,{marginRight:3}]}>{this.state.data.name.toLowerCase().replace(/^[\u00C0-\u1FFF\u2C00-\uD7FF\w]|\s[\u00C0-\u1FFF\u2C00-\uD7FF\w]/g, (letter) => { return letter.toUpperCase() })}</Text>
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
                                    <Text style={{textAlign:'center',color:'#bbb',fontFamily:'Roboto-Regular',fontSize:13}}>Message</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex:1,alignItems:'center'}}>
                              {
                                (this.state.data.isfollow > 0) ?
                                <TouchableOpacity onPress={()=>this.confirmDialog()} style={{borderRadius:5,borderWidth:1,paddingHorizontal:7,paddingVertical:5,borderColor:'#9c9fa6'}}>
                                    <Text style={{textAlign:'center',color:'#bbb',fontFamily:'Roboto-Regular',fontSize:13}}>Unfollow</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={()=>this.addToNetwork()} style={{borderRadius:5,borderWidth:1,paddingHorizontal:7,paddingVertical:5,borderColor:'#9c9fa6'}}>
                                    <Text style={{textAlign:'center',color:'#bbb',fontFamily:'Roboto-Regular',fontSize:13}}>Follow</Text>
                                </TouchableOpacity>
                              }
                            </View>
                            <View style={{flex:1,alignItems:'center'}}>
                              <TouchableOpacity onPress={()=>this.moveToSearchGoogle()} style={{borderRadius:5,borderWidth:1,paddingHorizontal:7,paddingVertical:5,borderColor:'#9c9fa6'}}>
                                  <Text style={{textAlign:'center',color:'#bbb',fontFamily:'Roboto-Regular',fontSize:13}}>Google</Text>
                              </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',marginHorizontal:30,marginBottom:10,marginTop:10}}>
                          { this.arraySearch('FACEBOOK') }
                          { this.arraySearch('TWITTER') }
                          { this.arraySearch('LINKEDIN') }
                        </View>


                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',marginHorizontal:20,marginTop:10,marginBottom:20}}>
                          <TouchableOpacity onPress={()=>this.moveToNetwork('Followers')} style={{flex:1,justifyContent:'center', alignItems:'center',flexDirection:'column'}}>
                              <Text style={{textAlign:'center',color:'#bbb',fontFamily:'Roboto-Medium',fontSize:16}}>{this.state.data.followers_count}</Text>
                              <Text style={{textAlign:'center',color:'#bbb',fontFamily:'Roboto-Regular',fontSize:10}}>Followers</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={()=>this.moveToNetwork('Following')} style={{flex:1,justifyContent:'center', alignItems:'center',flexDirection:'column'}}>
                              <Text style={{textAlign:'center',color:'#bbb',fontFamily:'Roboto-Medium',fontSize:16}}>{this.state.data.following_count}</Text>
                              <Text style={{textAlign:'center',color:'#bbb',fontFamily:'Roboto-Regular',fontSize:10}}>Following</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={()=>this.moveToCommonConnection(this.state.data)} style={{flex:1,justifyContent:'center', alignItems:'center',flexDirection:'column'}}>
                              <Text style={{textAlign:'center',color:'#bbb',fontFamily:'Roboto-Medium',fontSize:16}}>{this.state.data.common_people.length}</Text>
                              <Text style={{textAlign:'center',color:'#bbb',fontFamily:'Roboto-Regular',fontSize:10}}>Common Connections</Text>
                          </TouchableOpacity>
                        </View>

                        <View style={{flexDirection:'row',marginTop:15,flex:1,marginHorizontal:15}}>
                            <TouchableOpacity ref="TAGS" onPress={()=>this.setPage('TAGS')} style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#262831',padding:10,borderTopLeftRadius:7,borderTopRightRadius:7}}>
                                <Text ref="TAGS Text" style={[styles.prof,{color:'#EAEAEA'}]}>TAGS</Text>
                            </TouchableOpacity>
                            <TouchableOpacity ref="POSTS"  onPress={()=>this.setPage('POSTS')} style={{flex:1,justifyContent:'center',alignItems:'center',padding:10,borderTopLeftRadius:7,borderTopRightRadius:7}}>
                                <Text ref="POSTS Text" style={styles.prof}>POSTS</Text>
                            </TouchableOpacity>
                            <TouchableOpacity ref="EVENTS" onPress={()=>this.setPage('EVENTS')} style={{flex:1,justifyContent:'center',alignItems:'center',padding:10,borderTopLeftRadius:7,borderTopRightRadius:7}}>
                                <Text ref="EVENTS Text" style={styles.prof}>EVENTS</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{backgroundColor:'#262831',width:'100%', padding:20,minHeight:height-370,justifyContent:'flex-start'}}>
                            <PeopleTabview {...this.state} getProfile={this.getProfile.bind(this)} showmap={this.showmap.bind(this)} navigator={this.props.navigator} getEvents={this.getEvents} />
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
                    <TouchableOpacity style={{position:'absolute',top:20,right:20,zIndex:20,padding:5}} onPress={()=>this.setState({ showmap: false })}>
                        <Image source={imageSource.close_icon} style={{width:20,height:20,alignSelf:'flex-end'}}  />
                    </TouchableOpacity>
                  <Image source={{uri:this.state.image}} style={{width:undefined,height:undefined,flex:1,resizeMode:'contain'}}/>
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
      )
    }
}
