'use strict';
import React, { Component } from 'react';
import { View, Text,  ScrollView,  ActivityIndicator, Image, Dimensions,AsyncStorage,TouchableOpacity  } from 'react-native';
import styles from './Style';
import Header from '.././Main/Header';
import { Actions,ActionConst } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';
import ToastAndroid from '@remobile/react-native-toast';
const imageSource = {
          arrowfor_icon: require(".././Assets/Img/arrow_forward.png"),
};
const {height, width} = Dimensions.get('window');

export default class Index extends Component {
    constructor(props) {
      super(props);
      this.state = {
          user: this.props.user,
          topevent: this.props.topevent,
          data: [],
          loading:true,
      }
      this.getEvents = this.getEvents.bind(this);
    }
    componentWillMount() {
        this.props.googleTracker('MY AGENDA');
        this.props.setCurrentScene('My Agenda');
        setTimeout(()=>{
          this.getEvents(this.state.user.id,this.state.topevent.id);
        },300)
    }
    getEvents = async (uid,eid) => {
     await fetch('https://api.eventonapp.com/api/agenda/'+uid+'/'+eid, {
        method: 'GET'
       }).then((response) => response.json())
       .then((responseJson) => {
         this.setState({ data: responseJson.data, loading:false  });
       })
       .catch((error) => {
          console.error(error);
      });
    }
    pushToInfo = (showdata) =>{
        Actions.ScheduleInfo({showdata:showdata});
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
                    <Header openDrawer={this.props.openDrawer} currentScene={"My Agenda"} topevent={this.props.topevent} user={this.props.user} sudonav={this.props.sudonav}/>
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
              <Header openDrawer={this.props.openDrawer} currentScene={"My Agenda"} topevent={this.props.topevent} user={this.props.user} sudonav={this.props.sudonav}/>
              <View style={styles.box}>
                  <View style={{height:250,justifyContent:'center',alignItems:'center',backgroundColor:'#FFF',padding:30,borderRadius:10}}>
                    <Text style={{fontFamily:'Roboto-Medium',color:'#222',textAlign:'center',fontSize:16}}>{"Sign… It's empty"}</Text>
                    <Text style={{fontFamily:'Roboto-Thin',color:'#000',textAlign:'center',marginTop:15,fontSize:12}}>You have not added any schedule to your agenda yet.</Text>
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
                <Header openDrawer={this.props.openDrawer} currentScene={"My Agenda"} topevent={this.props.topevent} user={this.props.user} sudonav={this.props.sudonav}/>
                <ScrollView>
                    <View style={[styles.box,{marginBottom:80}]}>
                        {
                            this.state.data.map((o,i) => {
                              if(o.schedules.length){
                                  return (
                                        <View key={i} style={styles.row}>
                                            <View style={styles.left}>
                                              <Text style={styles.date}>{o.header}</Text>
                                            </View>
                                            <View style={styles.right}>
                                              {
                                                 o.schedules.map((s,j) => {
                                                    var w = ((o.schedules.length - 1)===j) ? 0 : 1;
                                                    var timestr = s.time_string.split('-');
                                                    if(s.title!=''){
                                                        return (
                                                            <TouchableOpacity onPress={()=>this.pushToInfo(s)} key={j} style={[styles.inrow,{borderBottomWidth:w}]}>
                                                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                                                    <View style={{marginRight:10}}>
                                                                       <Text style={{fontSize:11}}>{timestr[0].trim()}</Text>
                                                                       <Text style={{fontSize:11}}>{timestr[1].trim()}</Text>
                                                                    </View>
                                                                    <View style={{flex:1}}>
                                                                      <Text style={styles.title}>{s.title}</Text>
                                                                      <Text style={styles.location}>{s.location}</Text>
                                                                    </View>
                                                                    <View>
                                                                        <Image source={imageSource.arrowfor_icon} style={{width:20,height:20,opacity:0.5}} />
                                                                    </View>
                                                                </View>
                                                            </TouchableOpacity>
                                                        )
                                                    }
                                                })
                                              }
                                            </View>
                                        </View>
                                    )
                               }
                            })
                        }
                    </View>
                </ScrollView>
            </LinearGradient>
      )
    }
}
