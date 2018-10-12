'use strict';
import React, { Component } from 'react';
import { View, Text,  ScrollView,  ActivityIndicator,AsyncStorage,Image,StyleSheet,Dimensions,TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ToastAndroid from '@remobile/react-native-toast';
import Header from '.././Main/Header';
import Peopledata from '.././Home/PeopleData';
import { Actions } from 'react-native-router-flux';
const { height, width } = Dimensions.get('window');
const imageSource = {
    user_icon: require(".././Assets/Img/default_p.png"),
    add_people_icon: require(".././Assets/Img/people_network.png"),
    chat_people_icon: require(".././Assets/Img/tac_3_2.png"),
    star_icon : require(".././Assets/Img/badge_star.png"),
};
export default class Index extends Component {
    constructor(props) {
      super(props);
      this.state = {
          user: this.props.user,
          topevent: this.props.topevent,
          data: [],
          loading:true,
          showload:true,
          animating:false,
      }
      this.page = 1;
      this.getData = this.getData.bind(this);
    }
    componentWillMount() {
        this.props.googleTracker('PEOPLE RECOMMENDATION:'+this.state.topevent.title);
        this.props.setCurrentScene('People i should meet');
        setTimeout(()=>{
          this.getData();
        },300)
    }
    showConnected = () => {
        var data = this.state.data;

    }
    showPeople = (id) => {
        Actions.PeopleData({showid:id});
    }
    getData = async () => {
      this.setState({animating:true})
     await fetch('https://api.eventonapp.com/api/randompeople/'+this.state.user.id+'/'+this.state.topevent.id+'/'+this.page, {
        method: 'GET'
       }).then((response) => response.json())
       .then((responseJson) => {
         let param = true;
         if(responseJson.data.length < 15)
         {
            param=false;
         }
         this.setState({
               data: this.page === 1 ? responseJson.data : [...this.state.data, ...responseJson.data],
               loading:false,
               showload:param,
               animating:false,
             },()=>{
               this.page = this.page + 1;
               responseJson.data.map((o,i) => {
                   if(o.is_fb_connected==null)
                   {
                       this.fetchConnection(this.state.user.id,o.id,'FACEBOOK',i);
                   }
                   if(o.is_tw_connected==null)
                   {
                       this.fetchConnection(this.state.user.id,o.id,'TWITTER',i);
                   }
               })
          })
       }).catch((error) => {   })
    }
    fetchConnection = (uid,toid,source,i) => {
      var data = this.state.data;
      fetch("https://api.eventonapp.com/api/connectedon/"+uid+"/"+toid+"/"+source, {
         method: 'GET'
      }).then((response) => response.json())
      .then((responseJson) => {
        if(responseJson.status) {
            if(source=='FACEBOOK')
            {
                data[i]['is_fb_connected'] = 1;
                this.setState({data});
            }
            if(source=='TWITTER')
            {
                data[i]['is_tw_connected'] = 1;
                this.setState({data});
            }
        }
      }).catch((error) => {  });
    }
    moveToChat = (touser) => {
      Actions.Chat({touser:touser,template:true});
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
                <Header openDrawer={this.props.openDrawer} currentScene={"People i should meet"} topevent={this.props.topevent} user={this.state.user} sudonav={this.props.sudonav}/>
                <View style={{flex:1,height:300,justifyContent:'center',alignItems:'center'}}>
                    <ActivityIndicator
                      style={styles.centering}
                      color="white"
                      size="large"
                    />
              </View>
            </LinearGradient>
          );
      }
      if(this.state.loading==false && this.state.data.length==0)
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
                    <Text style={{fontFamily:'Roboto-Thin',color:'#000',textAlign:'center',marginTop:15,fontSize:12}}>No one have joined the event yet</Text>
                  </View>
              </View>
            </LinearGradient>
          )
      }

      if(this.state.show)
      {
          return(
              <View><Peopledata showid={this.state.showid} /></View>
          );
      }
      let ld = this.state.data.length-1;
      let l = 1;
      return (
        <LinearGradient
            start={this.state.topevent.theme.bg_gradient.start}
            end={this.state.topevent.theme.bg_gradient.end}
            locations={this.state.topevent.theme.bg_gradient.locations}
            colors={this.state.topevent.theme.bg_gradient.colors}
            style={{ flex: 1 }}
        >
          <Header openDrawer={this.props.openDrawer} currentScene={"People i should meet"} topevent={this.props.topevent} sudonav={this.props.sudonav}/>
          <ScrollView
              removeClippedSubviews={true}
              contentContainerStyle={{paddingHorizontal:20,paddingBottom:40,paddingTop:20}}
              >
              <View>
                  <View style={{backgroundColor:'#FFF',padding:5,borderTopLeftRadius:10,borderTopRightRadius:10}}></View>
                  <View style={{backgroundColor:'#FFF',paddingHorizontal:5}}>
                  {
                      this.state.data.map((o,i) => {
                        l = (i==ld) ? 0 : 1;
                        return (
                              <TouchableOpacity onPress={()=>this.showPeople(o.id)} key={i} style={[styles.row,{borderBottomWidth:l}]}>
                                <View style={{flexDirection:'row'}}>
                                  <View style={styles.left}>
                                    { (o.image!='') ? <Image borderRadius={30} source={{uri:o.image}} style={{width:60,height:60,borderRadius:30}}/> : <Image borderRadius={30} source={imageSource.user_icon} style={{width:60,height:60,borderRadius:30}} /> }
                                    { (o.is_connect > 0) ? <View style={{alignItems:'flex-end'}}><Image source={imageSource.star_icon} style={{width:20,height:20,marginTop:-20}}/></View> : null }
                                  </View>
                                  <View style={styles.right}>
                                      <View style={{flexDirection:'row'}}>
                                          <Text style={styles.name}>{o.name}</Text>
                                      </View>
                                      {(o.profession.trim()!='') ? <Text style={styles.profession}>{o.profession}</Text> : null }
                                      {(o.location.trim()!='') ? <Text style={styles.location}>{o.location}</Text> : null }
                                      {(o.is_fb_connected || o.is_tw_connected) ?
                                          <View style={{flexDirection:'row',alignItems:'center',flexWrap:'wrap',marginTop:5}}>
                                              <Text style={styles.social}>Your are connected on</Text>
                                              { (o.is_fb_connected) ? <Text style={[styles.social,{color:'#333'}]}> Facebook</Text> :null }
                                              { (o.is_tw_connected) ? <Text style={[styles.social,{color:'#333'}]}> Twitter</Text> :null }
                                          </View>
                                          :
                                          null
                                      }
                                  </View>
                                  <View style={{flexDirection:'column',justifyContent:'space-between',paddingVertical:5}}>
                                       <View style={{flexDirection:'row',justifyContent:'flex-end',paddingVertical:5}}>
                                             <TouchableOpacity onPress={()=>{ this.moveToChat(o) }} style={{padding:3}}>
                                                <Image source={imageSource.chat_people_icon} style={{width:30,height:30}} />
                                             </TouchableOpacity>
                                       </View>
                                       {(o.role=='Admin' || o.role=='Sponsor') ? <Text style={styles.role}>{o.role}</Text> : null}
                                  </View>
                                </View>
                            </TouchableOpacity>
                        )
                      })
                  }
                </View>
                <View style={{backgroundColor:'#FFF',padding:5,borderBottomLeftRadius:10,borderBottomRightRadius:10,marginBottom:40}}></View>
            </View>
            {
                (this.state.showload  && (this.state.loading==false)) ?
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
const styles = StyleSheet.create({
  container: {
    borderRadius:10,
    margin:10,
    marginBottom:100,
    backgroundColor:'#FFF',
  },
  box:{
      padding:10,
      margin:10,
      borderRadius:10,
      backgroundColor:'#FFF',
  },
  centering: {
   alignItems: 'center',
   justifyContent: 'center',
   padding: 8,
 },
 row: {
   borderBottomWidth:1,
   borderBottomColor:'#cfcfcf',
   paddingVertical:10,
   paddingHorizontal:5,
 },
 left: {
   marginRight:10
 },
 right: {
   flex:1,
   justifyContent:'flex-start',
   alignItems:'flex-start'
 },
 name:{
  color: '#444',
  fontSize: 16,
  fontFamily:'Roboto-Medium',
 },
 location:{
  color: '#666',
  fontSize:12,
  fontFamily:'Roboto-Regular',
 },
 role:{
  color: '#000',
  fontSize:12,
  fontFamily:'Roboto-Regular',
  backgroundColor:'#eaeaea',
  alignSelf:'flex-start',
  paddingVertical:3,
  paddingHorizontal:5,
 },
 profession:{
  color: '#666',
  fontSize:12,
  fontFamily:'Roboto-Regular',
 },
 social:{
  color: '#666',
  fontSize:12,
  fontFamily:'Roboto-Regular',
 },
 btn_box:{
   flex:1,
   paddingTop:5,
   paddingBottom:5,
 },
 btn:{
  backgroundColor:'#6699ff',
  padding:10,
  alignSelf:'flex-end',
 },
 btnText:{
  backgroundColor:'#6699ff',
  color:'#FFF',
  fontFamily:'Roboto-Regular'
 },
 filterd:{
  padding:5,
  borderBottomWidth:0.3,
  borderBottomColor:'#EAEAEA',
  flexDirection:'row'
 },
 filterdt:{
  fontFamily:'Roboto-Regular',
  flex:1
 },
 fil_row_tick:{
  color:'#EAEAEA'
 }

});
