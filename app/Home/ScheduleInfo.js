'use strict';
import React, { Component } from 'react';
import { View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  AsyncStorage,
  TextInput,
  Dimensions,
  ScrollView,
  Alert
  } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ToastAndroid from '@remobile/react-native-toast';
import Header from '.././Main/Header';
import {Actions} from 'react-native-router-flux';
import RNCalendarEvents from 'react-native-calendar-events';
var imageSource = {
          loc_icon : require(".././Assets/Img/ico_loc.png"),
          date_icon: require(".././Assets/Img/ico_clock.png"),
          speaker_icon: require(".././Assets/Img/speaker.png"),
};
var {height, width} = Dimensions.get('window');
export default class ScheduleInfo extends Component {
  constructor(props){
    super(props);
    this.state = {
      user:this.props.user,
      topevent:this.props.topevent,
      btntitle:'Add To My Agenda',
      showdata:this.props.showdata,
    }
  }
  componentWillMount(){
    if(this.state.showdata.is_added > 0)
    {
        this.setState({btntitle:'Remove from My Agenda'})
    }
  }
  pushToLogin = () => {
      if(typeof this.props.sudonav != 'undefined')
      {
          this.props.sudonav.resetTo({ id: 'SudoLogin'});
      }
  }
  addToAgenda = async (uid,eid,sid) => {
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
      else{
          await fetch('https://api.eventonapp.com/api/addToAgenda/'+uid+'/'+eid+'/'+sid, {
             method: 'GET'
          }).then((response) => response.json())
          .then((responseJson) => {
              ToastAndroid.show('Added in your agenda', ToastAndroid.SHORT);
                        this.addToCalender();
          }).catch((error) => { });
      }
  }
  addToCalender = () => {
    RNCalendarEvents.authorizeEventStore().then(status => {
      if(status=='authorized')
      {
          RNCalendarEvents.saveEvent(this.props.showdata.title, {
            location: this.props.showdata.location,
            notes: 'notes',
            startDate: (new Date(this.props.showdata.start_date+' '+this.props.showdata.start_time)).toISOString(),
            endDate: (new Date(this.props.showdata.end_date+' '+this.props.showdata.end_time)).toISOString()
          }).then(id => {
              Actions.pop( {refresh: {isrefresh:'true'} })
          }).catch(error => {  alert(error)     })
      }
    }).catch(error => {
        alert(error);
     // handle error
    });


  }
  removeFromAgenda = async (uid,eid,sid) => {
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
      else{
          await fetch('https://api.eventonapp.com/api/removeFromAgenda/'+uid+'/'+eid+'/'+sid, {
             method: 'GET'
          }).then((response) => response.json())
          .then((responseJson) => {
              ToastAndroid.show('Remove from your agenda', ToastAndroid.SHORT);
              Actions.pop( {refresh: {isrefresh:'true'} })
          }).catch((error) => { });
      }
  }
  speakerAction = (o) => {
      if(o.type=='LINK')
      {
          Actions.Web({url:o.target});
      }
      else{
        Actions.PeopleData({showid:o.target});
      }
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
          <Header openDrawer={this.props.openDrawer} currentScene={"Agenda"} topevent={this.props.topevent} isback={true} sudonav={this.props.sudonav}/>
          <ScrollView>
          <View style={styles.container}>
                <Text style={{fontSize:20,fontFamily:'Roboto-Medium',color:'#444',paddingHorizontal:15,paddingVertical:10}}>{this.props.showdata.title}</Text>
                {
                  (this.props.showdata.start_date_day) ?
                    <View style={{flexDirection:'row',paddingHorizontal:10,paddingVertical:5}}>
                      <Image source={imageSource.date_icon} style={{width:20,height:20,marginRight:5}}/>
                      <Text style={{color:'#666'}}>{this.props.showdata.start_date_day}, {this.props.showdata.start_date}</Text>
                    </View>
                  : null
                }
                {
                  (this.props.showdata.location) ?
                    <View style={{flexDirection:'row',paddingHorizontal:10,paddingVertical:5}}>
                        <Image source={imageSource.loc_icon} style={{width:20,height:20,marginRight:5}}/>
                        <Text style={{color:'#666'}}>{this.props.showdata.location}</Text>
                    </View>
                  :
                  null
                }
                {
                  (this.props.showdata.speakers.length > 0) ?
                    <View style={{flexDirection:'row',paddingHorizontal:10,paddingVertical:5}}>
                        <Image source={imageSource.speaker_icon} style={{width:20,height:20,marginRight:5}}/>
                        <View>
                              {
                                  this.props.showdata.speakers.map((o,i) => {
                                        return(
                                              <TouchableOpacity key={i} onPress={()=>{ this.speakerAction(o) }}>
                                                  <View style={{paddingBottom:10}}>
                                                        <Text style={{color:'#666',fontFamily:'Roboto-Regular',textDecorationLine:'underline'}}>{o.title}</Text>
                                                  </View>
                                              </TouchableOpacity>
                                        )
                                  })
                              }
                        </View>
                    </View>
                  :
                  null
                }
                <View style={{flexDirection:'row',backgroundColor:'#E5E5E5',padding:5,paddingHorizontal:10,marginTop:10}}>
                    <Text style={{color:'#333'}}>About</Text>
                </View>

                  <View style={{flexDirection:'row',padding:10}}>
                      <Text style={{color:'#666'}}>{this.props.showdata.description}</Text>
                  </View>
                  <View style={{justifyContent:'center',alignItems:'center',marginTop:15}}>
                    {
                     (parseInt(this.state.showdata.is_added) > 0) ?
                      <TouchableOpacity onPress={()=>this.removeFromAgenda(this.state.user.id,this.state.topevent.id,this.props.showdata.id)} style={{backgroundColor:'#6699ff',paddingVertical:5,paddingHorizontal:10,borderRadius:5,justifyContent:'center',alignItems:'center'}}>
                          <Text style={{width:200,height:20,padding:0,margin:0,alignSelf:'center',textAlign:'center',color:'#FFF'}}>
                              Remove From your Agenda
                          </Text>
                      </TouchableOpacity>
                      :
                      <TouchableOpacity onPress={()=>this.addToAgenda(this.state.user.id,this.state.topevent.id,this.props.showdata.id)} style={{backgroundColor:'#6699ff',paddingVertical:5,paddingHorizontal:10,borderRadius:5,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{width:200,height:20,padding:0,margin:0,alignSelf:'center',textAlign:'center',color:'#FFF'}}>
                              Add to your Agenda
                        </Text>
                      </TouchableOpacity>
                    }
                  </View>
              </View>
        </ScrollView>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius:10,
    margin:10,
    backgroundColor:'#FFF',
    paddingBottom:30,
    marginBottom:90,
    overflow:'hidden',
  },
  centering: {
   alignItems: 'center',
   justifyContent: 'center',
   padding: 8,
 },
  row: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor:'#FFF',
    borderRadius:10,
    flexDirection:'column',
  },
  left: {
     backgroundColor:'#E5E5E5',
     flex:1,
     borderTopLeftRadius:10,
     borderTopRightRadius:10,
     alignItems:'center',
  },
 right: {
    flex:1,
    padding:10,
 },
 title:{
   color: '#444',
   fontSize: 16,
   fontFamily:'Roboto-Medium',
   flex:1,
 },
 location:{
   color: '#666',
   fontSize:12,
   fontFamily:'Roboto-Regular',
 },
 description:{
   color: '#666',
   fontSize:12,
   fontFamily:'Roboto-Regular',
 },
 date:{
   alignSelf:'flex-start',
   fontFamily:'Roboto-Medium',
   fontSize:16,
   padding:10,
   color:'#999',
 }

});
