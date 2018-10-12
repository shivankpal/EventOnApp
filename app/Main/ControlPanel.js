'use strict';
import React, { Component } from 'react';
import { View,
  Text,
  Image,
  StatusBar,
  Navigator,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Share,
  Alert,
  TouchableWithoutFeedback,
  Dimensions,
  AsyncStorage
  } from 'react-native';
  import { Actions,ActionConst } from 'react-native-router-flux';
  import ToastAndroid from '@remobile/react-native-toast';
  import Communications from 'react-native-communications';
  import LinearGradient from 'react-native-linear-gradient';
  const imageSource = {
          prof_icon : require(".././Assets/Img/pro_name.png"),
          business: require(".././Assets/Img/ico_business_card.png"),
          notes: require(".././Assets/Img/ico_notes.png"),
          home: require(".././Assets/Img/ico_home.png"),
          agenda : require(".././Assets/Img/ico_agenda.png"),
          polls: require(".././Assets/Img/ico_polls.png"),
          faq: require(".././Assets/Img/ico_faq.png"),
          downloads: require(".././Assets/Img/ico_downloads.png"),
          search: require(".././Assets/Img/ico_search.png"),
          photos: require(".././Assets/Img/ico_photos.png"),
          makeyourapp: require(".././Assets/Img/ico_create_app.png"),
          eventAssitant: require(".././Assets/Img/ico_event_assistant.png"),
          meetup: require(".././Assets/Img/ico_people.png"),
          arrow:require(".././Assets/Img/kink_open.png"),
          share: require(".././Assets/Img/ico_share.png"),
          event_default: require(".././Assets/Img/event_default_banner.png"),
};
export default class ControlPanel extends Component {
    constructor(props) {
      super(props);
      this.state = {
        user:this.props.user,
        topevent: this.props.topevent,
        events: this.props.events,
        maxHeight:0,
        share:'',
      }
      this.fetchShare();
    }
    sendEmail = () => {
      let str = "Hello,\n\nI have visited your event app "+this.state.topevent.title+". I want to create an application for my Event. \n\nThanks";
      Communications.email(["hello@eventonapp.com"],null,null,'Create app for my Event',str);
    }
    fetchShare = () => {
        AsyncStorage.getItem(this.state.topevent.id+'@share').then((share) => {
            if(share!=null)
            {
                this.setState({share:JSON.parse(share)},()=>{

                  fetch('https://api.eventonapp.com/api/shareevent/'+this.state.topevent.id, {
                     method: 'GET'
                  }).then((response) => response.json())
                  .then((responseJson) => {
                      this.setState({share:responseJson.data},()=>{
                            AsyncStorage.setItem(this.state.topevent.id+'@share', JSON.stringify(responseJson.data));
                      });
                  })

                });
            }
            else
            {
                fetch('https://api.eventonapp.com/api/shareevent/'+this.state.topevent.id, {
                   method: 'GET'
                }).then((response) => response.json())
                .then((responseJson) => {
                    this.setState({share:responseJson.data},()=>{
                          AsyncStorage.setItem(this.state.topevent.id+'@share', JSON.stringify(responseJson.data));
                    });
                })
            }
        })
    }
    pushToLogin = () => {
        if(typeof this.props.sudonav != 'undefined')
        {
            this.props.sudonav.resetTo({ id: 'SudoLogin'});
        }
    }
    shareevent = () => {
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
          Share.share({
            message: this.state.share.message,
            title: this.state.share.title
          }, {
            dialogTitle: this.state.share.dialog_title,
          })
      }
    }
    pushOut = (search) => {
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
        Alert.alert('',
          'This action is taking you off the event - are you sure?',
          [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: 'OK', onPress: () => this.props.sudonav.resetTo({id:search, user:this.state.user, events:this.state.events,ishome:true})},
          ],
          { cancelable: false }
        )
      }
    }
    pushScreens = (path) => {
      this.props.closeDrawer();
      switch (path) {
        case 'Main':
          Actions.Main()
          break;
        case 'Home':
            this.pushOut('Myhome');
        break;
        case 'Event Notes':
            Actions.Notes();
            break;
        case 'Event Business Cards':
            Actions.Businesscards();
            break;
        case 'Chats':
            Actions.Chats();
            break;
        case 'Pollsnsurveys':
            Actions.Pollsnsurveys();
            break;
        case 'Logistics':
            Actions.Logistics();
            break;
        case 'Photos':
            Actions.Photos();
            break;
        case 'Downloads':
            Actions.Downloads();
            break;
        case 'Notifications':
            Actions.Notifications();
            break;
        case 'Search':
            this.pushOut('Search');
            break;
        case 'Profile':
            this.pushOut('Profile');
            break;
        case 'ChatEvent':
            Actions.ChatEvent();
            break;
        case 'SponsorOffer':
            Actions.SponsorOffer();
            break;
        case 'Meetup':
            Actions.Meetup();
            break;
      }
    }
    render() {
        var cnt = 5;
        (this.state.topevent.downloadcount > 0) ? cnt++ : false;
        (this.state.topevent.faqcount > 0) ? cnt++ : false;
        (this.state.topevent.pollcount > 0) ? cnt++ : false;
        let f = imageSource.event_default;
        if(this.state.topevent.image_cover!='') { f = {uri:this.state.topevent.image_cover}; }
      return (
          <View style={{flex:1,backgroundColor:'#292E39',justifyContent:'center'}}>
                  <ScrollView
                        style={{flex:1,marginBottom:60}}
                        scrollEnabled={true}
                    >
                    <View style={{borderBottomWidth:1,borderBottomColor:'#353a4c'}}>
                          <Image style={{width:'100%',height:150}} source={f}>
                            <LinearGradient
                                start={{x: 0.5, y: 0.25}} end={{x: 0.5, y: 1}}
                                locations={[0,1]}
                                colors={['rgba(0,0,0,0)','rgba(0,0,0,0.9)']}
                                style={{flex:1}}
                              >
                              <TouchableWithoutFeedback onPress={()=>this.pushScreens('Main')}>
                                  <View style={{width:'100%',height:150,justifyContent:'flex-end',padding:10}}>
                                      <Text style={{fontSize:15,fontFamily:'Roboto-Medium',color:'#EAEAEA',backgroundColor:'transparent'}}>{this.state.topevent.title}</Text>
                                  </View>
                              </TouchableWithoutFeedback>
                              </LinearGradient>
                          </Image>

                          <View>
                            <View style={{flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#353a4c',justifyContent:'center',alignItems:'center'}}>
                                <TouchableOpacity onPress={this.pushScreens.bind(this,'Meetup')} style={{flex:1,justifyContent:'center',alignItems:'center',borderRightWidth:1,borderRightColor:'#353a4c',paddingVertical:20}}>
                                    <Image source={imageSource.meetup} style={{width:30,height:30}}  />
                                    <Text style={{fontSize:12,fontFamily:'Roboto-Medium',color:'#9c9fa6'}}>People I should meet</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.pushScreens.bind(this,'Logistics')} style={{flex:1,justifyContent:'center',alignItems:'center',paddingVertical:20}}>
                                      <Image source={imageSource.faq} style={{width:30,height:30}}/>
                                      <Text style={{fontSize:12,fontFamily:'Roboto-Medium',color:'#9c9fa6'}}>FAQs</Text>
                                </TouchableOpacity>
                            </View>
                              <View style={{flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#353a4c',justifyContent:'center',alignItems:'center'}}>
                                  <TouchableOpacity onPress={this.pushScreens.bind(this,'Photos')} style={{flex:1,justifyContent:'center',alignItems:'center',borderRightWidth:1,borderRightColor:'#353a4c',paddingVertical:20}}>
                                        <Image source={imageSource.photos} style={{width:30,height:30}}/>
                                        <Text style={{fontSize:12,fontFamily:'Roboto-Medium',color:'#9c9fa6'}}>Photos</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity onPress={this.pushScreens.bind(this,'ChatEvent')} style={{flex:1,justifyContent:'center',alignItems:'center',paddingVertical:20}}>
                                        <Image source={imageSource.eventAssitant} style={{width:30,height:30}}/>
                                        <Text style={{fontSize:12,fontFamily:'Roboto-Medium',color:'#9c9fa6'}}>My Assistant</Text>
                                  </TouchableOpacity>
                              </View>
                              <View style={{flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#353a4c',justifyContent:'center',alignItems:'center'}}>
                                  <TouchableOpacity onPress={this.pushScreens.bind(this,'Event Notes')} style={{flex:1,justifyContent:'center',alignItems:'center',borderRightWidth:1,borderRightColor:'#353a4c',paddingVertical:20}}>
                                        <Image source={imageSource.notes} style={{width:30,height:30}}/>
                                        <Text style={{fontSize:12,fontFamily:'Roboto-Medium',color:'#9c9fa6'}}>Event Notes</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity onPress={this.pushScreens.bind(this,'Event Business Cards')} style={{flex:1,justifyContent:'center',alignItems:'center',paddingVertical:20}}>
                                        <Image source={imageSource.business} style={{width:30,height:30}}/>
                                        <Text style={{fontSize:12,fontFamily:'Roboto-Medium',color:'#9c9fa6'}}>Business Cards</Text>
                                  </TouchableOpacity>
                              </View>
                              <View style={{flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#353a4c',justifyContent:'center',alignItems:'center'}}>
                                  <TouchableOpacity onPress={this.pushScreens.bind(this,'Pollsnsurveys')} style={{flex:1,justifyContent:'center',alignItems:'center',borderRightWidth:1,borderRightColor:'#353a4c',paddingVertical:20}}>
                                        <Image source={imageSource.polls} style={{width:30,height:30}}/>
                                        <Text style={{fontSize:12,fontFamily:'Roboto-Medium',color:'#9c9fa6'}}>Polls/Surveys</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity onPress={this.pushScreens.bind(this,'Downloads')} style={{flex:1,justifyContent:'center',alignItems:'center',paddingVertical:20}}>
                                        <Image source={imageSource.downloads} style={{width:30,height:30}}/>
                                        <Text style={{fontSize:12,fontFamily:'Roboto-Medium',color:'#9c9fa6'}}>Downloads</Text>
                                  </TouchableOpacity>
                              </View>
                          </View>
                          <View style={{flexDirection:'row',paddingVertical:15,paddingHorizontal:20,justifyContent:'center',alignItems:'center'}}>
                              <TouchableOpacity onPress={this.pushScreens.bind(this,'Home')} style={{justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                                  <Image style={{width:30,height:30,marginRight:10}} source={imageSource.home} /><Text style={ControlPanelCss.menu_items_lable}>My Home</Text>
                              </TouchableOpacity>
                          </View>
                    </View>
                    <View style={[ControlPanelCss.menu_head,{paddingLeft:10,marginBottom:10}]}>
                      <Text style={{color:'#777',fontFamily:'Roboto-Medium',fontSize:13,marginBottom:5,padding:10}}>Others</Text>
                      <View style={{paddingLeft:10}}>
                          <TouchableOpacity key={12} style={ControlPanelCss.menu_items_row} onPress={this.pushScreens.bind(this,'Search')}>
                              <Image style={ControlPanelCss.menu_items_image} source={imageSource.search} /><Text style={ControlPanelCss.menu_items_lable}>Search Other events</Text>
                          </TouchableOpacity>

                          <TouchableOpacity onPress={()=>this.sendEmail()} style={ControlPanelCss.menu_items_row}>
                              <Image style={ControlPanelCss.menu_items_image} source={imageSource.makeyourapp} /><Text style={ControlPanelCss.menu_items_lable}>Create an event app</Text>
                          </TouchableOpacity>

                          <TouchableOpacity onPress={()=>this.shareevent()} style={ControlPanelCss.menu_items_row}>
                              <Image style={ControlPanelCss.menu_items_image} source={imageSource.share} /><Text style={ControlPanelCss.menu_items_lable}>Share this event</Text>
                          </TouchableOpacity>
                      </View>
                    </View>
                  </ScrollView>
                  <View style={{position:'absolute',bottom:0,left:0,right:0,backgroundColor:'#353a4c'}}>
                      <TouchableWithoutFeedback onPress={this.pushScreens.bind(this,'Profile')}>
                          <View style={{flexDirection:'row',alignItems:'center',padding:10}}>
                              { (this.state.user.image!='') ?
                                  <Image source={{uri:this.state.user.image}} style={{width:40,height:40,marginRight:20,borderRadius:20}} />
                                  :
                                  <Image source={imageSource.prof_icon} style={{width:40,height:40,marginRight:20,borderRadius:20,borderWidth:1,borderColor:'#CCC'}}/>

                              }
                              <View style={{alignItems:'center'}}>
                                  <Text style={{color:'#FFF',fontFamily:'Roboto-Regular',fontSize:16}}>{this.state.user.name}</Text>
                              </View>
                          </View>
                      </TouchableWithoutFeedback>
                      <Text style={{color:'#FFF',fontFamily:'Roboto-Regular',fontSize:12,position:'absolute',right:0,bottom:0,padding:3}}>EventOnApp</Text>
                  </View>
          </View>
        );
    }
  }
const ControlPanelCss = StyleSheet.create({
       menu_head: {
          justifyContent:'center'
       },
       menu_head_image:{
         width:60,
         height:60,
         borderRadius:30,
         marginRight:20
       },
       menu_head_lable_box:{
         flex:1,
       },
       menu_head_title:{
         color:'#FFF',
         fontSize:20,
         fontFamily:'Roboto-Medium',
       },
       menu_head_date:{
          color:'#999',
          fontSize:13,
          fontFamily:'Roboto-Regular',
       },
       Moreevent:{
         flexDirection:'column',
         margin:10
       },
       eventRow:{
         flexDirection:'row',
         padding:10,
         alignItems:'center',
         height:50,
       },
       eventTitle: {
         color:'#FFF',
         fontFamily:'Roboto-Regular',
       },
       menu_items:{
         flex:1
       },
       menu_items_pt:{
       },
       menu_items_pu:{
         //borderTopWidth:1,
         //borderTopColor:'#333',
       },
       menu_items_row:{
           paddingHorizontal:5,
           paddingTop:5,
           paddingBottom:10,
           flexDirection:'row',
           alignItems:'center',
       },
       menu_items_lable_box:{

       },
       menu_items_lable:{
         color:'#9c9fa6',
         fontFamily:'Roboto-Medium',
         fontSize:14,
         flex:1,
       },
       menu_items_image_box:{

       },
       menu_items_image:{
          width:25,
          height:25,
          marginRight:15,
          resizeMode:'cover',
       },
       menu_head_lable_arrow_box:{

       }
  });
