'use strict';
import React, { Component } from 'react';
import { View,
  Text,
  Image,
  StatusBar,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  AsyncStorage
  } from 'react-native';
import {Actions} from 'react-native-router-flux';
import ToastAndroid from '@remobile/react-native-toast';
import LinearGradient from 'react-native-linear-gradient';
import Header from '.././Main/Header';
var imageSource = {
          loc_icon : require(".././Assets/Img/ico_loc.png"),
          date_icon: require(".././Assets/Img/ico_clock.png"),
};
var {height, width} = Dimensions.get('window');
export default class SponsorInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
        showid : this.props.showid,
        topevent: this.props.topevent,
        user: this.props.user,
        data: [],
        loading:true,
    }

  }
  componentWillMount(){
    this.getData();
  }
  getData = async () => {
    await fetch('https://api.eventonapp.com/api/sponsersById/'+this.state.user.id+'/'+this.state.topevent.id+'/'+this.state.showid, {
       method: 'GET'
    }).then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        data: responseJson.data,
        loading: false,
      });
    }).catch((error) => { });
  }
  record = (id) => {
    if(this.state.user===false)
    {
       return false;
    }
    else{
        fetch('https://api.eventonapp.com/api/recordOffer/'+this.state.user.id+'/'+this.state.topevent.id+'/'+id, {
           method: 'GET'
        })
    }
  }
  takeAction = (o) => {
      this.record(o.id);
      if(o.action_type=='URL')
      {
          Actions.Web({url:o.action_data});
      }
      if(o.action_type=='POLL')
      {
          Actions.Pollsnsurveys({pollid:o.action_id});
      }
      if(o.action_type=='CHAT')
      {
          Actions.Chat({touser:o.touser});
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
             <Header openDrawer={this.props.openDrawer} currentScene={"Offers"} topevent={this.props.topevent} isback={true} sudonav={this.props.sudonav}/>
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
      return (
        <LinearGradient
          start={this.state.topevent.theme.bg_gradient.start}
          end={this.state.topevent.theme.bg_gradient.end}
          locations={this.state.topevent.theme.bg_gradient.locations}
          colors={this.state.topevent.theme.bg_gradient.colors}
          style={{ flex: 1 }}
        >
        <View style={{flex:1}}>
          <Header openDrawer={this.props.openDrawer} currentScene={"Offers"} topevent={this.props.topevent} isback={true} sudonav={this.props.sudonav}/>
              <ScrollView>
                <View style={styles.container}>
                    <Image source={{uri: this.state.data.logo}} style={{width:'100%',height:200,borderTopLeftRadius:10,borderTopRightRadius:10}} />
                    <Text style={styles.bigDescription}>{this.state.data.description}</Text>
                    <View>
                        <Text style={styles.title}>Offers</Text>
                        { this.state.data.offers.map((o,i)=>{
                          const ex = (i == (this.state.data.offers.length-1)) ? {borderBottomWidth:0} : {};
                          return (
                              <View key={i} style={[styles.offer_row,ex]}>
                                   <Text style={styles.offer_title}>{o.offer_title}</Text>
                                   <Text style={styles.offer_description}>{o.offer_description}</Text>
                                   <View style={styles.btn_box}>
                                       <TouchableOpacity onPress={()=>{this.takeAction(o)}} style={styles.btn}>
                                           <Text style={styles.btnText}>{o.button_title}</Text>
                                       </TouchableOpacity>
                                   </View>
                               </View>
                             )
                        }) }

                    </View>
                </View>
              </ScrollView>
          </View>
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
    overflow:'hidden'
  },
  centering: {
   alignItems: 'center',
   justifyContent: 'center',
   padding: 8,
 },
 bigDescription: {
    fontFamily:'Roboto-Regular',
    padding:5,
    paddingHorizontal:10,
    color:'#333',
    fontSize:12,
 },
 title:{
   fontFamily:'Roboto-Medium',
   padding:5,
   paddingHorizontal:10,
   color:'#333',
   fontSize:13,
 },
 offer_row:{
   borderBottomWidth:1,
   borderBottomColor:'#EAEAEA',
   margin:5,
 },
 offer_title:{
   fontFamily:'Roboto-Regular',
   paddingHorizontal:5,
   color:'#555',
   fontSize:12,
 },
 offer_description:{
   fontFamily:'Roboto-Regular',
   paddingHorizontal:5,
   color:'#777',
   fontSize:11,
 },
 btn_box:{
    paddingHorizontal:5,
    marginVertical:10,
    overflow:'hidden',
 },
 btn:{
   backgroundColor:'#6699ff',
   paddingHorizontal:20,
   paddingVertical:10,
   alignSelf:'flex-end',
   borderRadius:5,
   overflow:'hidden',
 },
 btnText:{
   backgroundColor:'#6699ff',
   color:'#FFF',
   fontFamily:'Roboto-Regular'
 }

});
