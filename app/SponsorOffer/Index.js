'use strict';
import React, { Component } from 'react';
import { View, Text,  ScrollView,  ActivityIndicator,AsyncStorage,Image,StyleSheet,TouchableOpacity,Dimensions  } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ToastAndroid from '@remobile/react-native-toast';
import Header from '.././Main/Header';
import { Actions,ActionConst } from 'react-native-router-flux';
var {height, width} = Dimensions.get('window');
export default class Index extends Component {
    constructor(props) {
      super(props);
      this.state = {
          user: this.props.user,
          topevent: this.props.topevent,
          data: [],
          loading:true,
      }
      this.getData = this.getData.bind(this);
    }
    componentWillMount() {
        this.props.googleTracker('Sponsors Offers');
        this.props.setCurrentScene('Sponsors Offers');
        setTimeout(()=>{
          this.getData(this.state.topevent.id);
        },300)
    }
    getData = async (eid) => {
     await fetch('https://api.eventonapp.com/api/sponsorOffer/'+eid, {
        method: 'GET'
       }).then((response) => response.json())
       .then((responseJson) => {
         this.setState({ data: responseJson.data, loading:false  });
       }).catch((error) => {  });
    }
    takeAction = (o) => {
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
    render () {
      return (
          <LinearGradient
            start={this.state.topevent.theme.bg_gradient.start}
            end={this.state.topevent.theme.bg_gradient.end}
            locations={this.state.topevent.theme.bg_gradient.locations}
            colors={this.state.topevent.theme.bg_gradient.colors}
            style={{ flex: 1 }}
          >
            <Header openDrawer={this.props.openDrawer} currentScene={"Sponsors Offers"} topevent={this.props.topevent} user={this.props.user} sudonav={this.props.sudonav}/>
                <ScrollView>
                    <View style={[styles.box,{marginBottom:80}]}>
                    {
                      this.state.data.map((o,i) => {
                          const ex = (i == (this.state.data.length-1)) ? { borderBottomWidth:0 } : {};
                          return (
                              <View key={i} style={[styles.offer_row,ex]}>
                                   <Text style={styles.offer_title}>{o.offer_title}</Text>
                                   <Text style={styles.title}>{o.title}</Text>
                                   <Text style={styles.offer_description}>{o.offer_description}</Text>
                                   <View style={styles.btn_box}>
                                       <TouchableOpacity onPress={()=>{this.takeAction(o)}} style={styles.btn}>
                                           <Text style={styles.btnText}>{o.button_title}</Text>
                                       </TouchableOpacity>
                                   </View>
                               </View>
                          )
                       })
                    }
                    </View>
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
 bigDescription: {
    fontFamily:'Roboto-Regular',
    padding:5,
    paddingHorizontal:10,
    color:'#333',
    fontSize:12,
 },
 title:{
   fontFamily:'Roboto-Regular',
   color:'#666',
   paddingHorizontal:5,
   fontSize:12,
 },
 offer_row:{
   borderBottomWidth:1,
   borderBottomColor:'#EAEAEA',
   margin:5,
 },
 offer_title:{
   fontFamily:'Roboto-Medium',
   paddingHorizontal:5,
   color:'#555',
   fontSize:14,
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
 }

});
