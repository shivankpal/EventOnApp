'use strict';
import React, { Component } from 'react';
import { View,  Text,  ScrollView,  ActivityIndicator, AsyncStorage, Image,Dimensions,TouchableOpacity,Alert  } from 'react-native';
import {Actions} from 'react-native-router-flux';
import ToastAndroid from '@remobile/react-native-toast';
import LinearGradient from 'react-native-linear-gradient';
import styles from './Style';
import Header from '.././Main/Header';
var {height, width} = Dimensions.get('window');
export default class Index extends Component {
    constructor(props) {
      super(props);
      this.state = {
          user:this.props.user,
          topevent:this.props.topevent,
          data: [],
          loading:true,
          showload:true,
          animating:false,
      }
      this.page = 1;
    }
    componentWillMount () {
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
                 this.setState({animating:false,loading:false})
                 return false;
             }
         })
      }
      else{
        this.props.googleTracker('NOTIFICATIONS');
        this.props.setCurrentScene('NOTIFICATIONS');
        setTimeout(()=>{
            this.getData()
        },500)
      }
    }
    pushToLogin = () => {
        if(typeof this.props.sudonav != 'undefined')
        {
            this.props.sudonav.resetTo({ id: 'SudoLogin'});
        }
    }
    moveToScreens = (path) => {
      switch (path) {
        case 'Event_Home':
          Actions.Main()
          break;
        case 'Notes':
            Actions.MyNotes();
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
        case 'ChatEvent':
            Actions.ChatEvent();
            break;
        case 'SponsorOffer':
            Actions.SponsorOffer();
            break;
        case 'Meetup':
            Actions.Meetup();
            break;
        case 'EventNetwork':
            Actions.EventNetwork();
            break;
      }
    }
    getData = async () => {
      this.setState({animating:true});
       await fetch('https://api.eventonapp.com/api/notifications/'+this.state.user.id+"/"+this.state.topevent.id+"/"+this.page, {
            method: 'GET'
         }).then((response) => response.json())
         .then((responseJson) => {
           let param = true;
           if(responseJson.data.length < 15)
           {
              param = false;
           }
           this.setState({
                 data: this.page === 1 ? responseJson.data : [...this.state.data, ...responseJson.data],
                 loading:false,
                 showload:param,
                 animating:false,
               },()=>{
                 this.page = this.page + 1;
           })
         }).catch((error) => { this.setState({animating:false})   })
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
                    <Header openDrawer={this.props.openDrawer} currentScene={"Notifications"} topevent={this.props.topevent} user={this.props.user} sudonav={this.props.sudonav}/>
                    <View style={[styles.box,{flex:1,justifyContent:'center',alignItems:'center'}]}>
                        <ActivityIndicator
                            style={styles.centering}
                            color="#487597"
                            size="large"
                        />
                    </View>
            </LinearGradient>
        );
      }
      if(this.state.data.length==0)
      {
          return (
            <LinearGradient
                start={this.state.topevent.theme.bg_gradient.start}
                end={this.state.topevent.theme.bg_gradient.end}
                locations={this.state.topevent.theme.bg_gradient.locations}
                colors={this.state.topevent.theme.bg_gradient.colors}
                style={{ flex: 1 }}
            >
                <Header openDrawer={this.props.openDrawer} currentScene={"Notifications"} topevent={this.props.topevent} user={this.props.user} sudonav={this.props.sudonav}/>
                <View style={styles.box}>
                    <View style={{height:250,justifyContent:'center',alignItems:'center',backgroundColor:'#FFF',padding:30,borderRadius:10}}>
                        <Text style={{fontFamily:'Roboto-Medium',color:'#222',textAlign:'center',fontSize:16}}>{"Hmm… It's empty"}</Text>
                        <Text style={{fontFamily:'Roboto-Thin',color:'#000',textAlign:'center',marginTop:15,fontSize:12}}>No notifications from the app creator to show.</Text>
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
                <Header openDrawer={this.props.openDrawer} currentScene={"Notifications"} topevent={this.props.topevent} user={this.props.user} sudonav={this.props.sudonav}/>
                <ScrollView
                  removeClippedSubviews={true}
                  contentContainerStyle={{paddingHorizontal:10,paddingBottom:40,paddingTop:20}}>
                  <View>
                      <View style={{backgroundColor:'#FFF',padding:5,borderTopLeftRadius:10,borderTopRightRadius:10}}></View>
                      <View style={{backgroundColor:'#FFF'}}>
                        {  this.state.data.map((o,i) => {
                            return (
                              <TouchableOpacity onPress={()=>this.moveToScreens(o.target)}>
                                  <View key={i} style={styles.row}>
                                      <Image source={{uri:o.icon}}  style={{width:40,height:40,marginRight:10,resizeMode:'contain'}} />
                                      <View style={{flex:1}}>
                                          <Text style={styles.title}>{o.title}</Text>
                                          <Text style={styles.description}>{o.message}</Text>
                                      </View>
                                      <Text style={styles.ago}>{o.ago}</Text>
                                  </View>
                                </TouchableOpacity>
                            )
                          })
                        }
                      </View>
                      <View style={{backgroundColor:'#FFF',padding:5,borderBottomLeftRadius:10,borderBottomRightRadius:10,marginBottom:40}}></View>
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
          </LinearGradient>
      )
    }
}
