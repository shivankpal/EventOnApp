'use strict';
import React, { Component } from 'react';
import { View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  AsyncStorage,
  ToastAndroid
  } from 'react-native';
import { Actions,ActionConst } from 'react-native-router-flux';
const imageSource = {
          arrowfor_icon: require(".././Assets/Img/arrow_forward.png"),
};
export default class Schedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
        user:this.props.user,
        topevent:this.props.topevent,
        data:[],
        agendadata:[],
        loading:true,
        eid:0,
        uid:0,
        showdata:false,
        content:'Event Agenda',
    };
    this.eventById = this.eventById.bind(this);
    this.getAgenda = this.getAgenda.bind(this);
  }
  componentWillMount(){
    this.props.googleTracker('SCHEDULE:'+this.state.topevent.title);
    this.props.setCurrentScene('SCHEDULE');
    AsyncStorage.getItem(this.state.topevent.id+'@SCHEDULE').then((data) => {
        if(data!=null)
        {
            this.setState({data:JSON.parse(data)},()=>{
                this.setState({loading:false},()=>{
                    this.eventById(this.state.user.id, this.state.topevent.id);
                });
            });
        }
        else
        {
            this.eventById(this.state.user.id, this.state.topevent.id);
        }
    })
    AsyncStorage.getItem(this.state.topevent.id+'@MYAGENDA').then((data) => {
        if(data!=null)
        {
            this.setState({agendadata:JSON.parse(data)},()=>{
                this.setState({loading:false},()=>{
                    this.getAgenda(this.state.user.id, this.state.topevent.id);
                });
            });
        }
        else
        {
            this.getAgenda(this.state.user.id, this.state.topevent.id);
        }
    })
  }
  componentWillReceiveProps(nextProps){
    AsyncStorage.getItem(this.state.topevent.id+'@SCHEDULE').then((data) => {
        if(data!=null)
        {
            this.setState({data:JSON.parse(data)},()=>{
                this.setState({loading:false},()=>{
                    this.eventById(this.state.user.id, this.state.topevent.id);
                });
            });
        }
        else
        {
            this.setState({loading:false},()=>{
                this.eventById(this.state.user.id, this.state.topevent.id);
            })
        }
    })
    AsyncStorage.getItem(this.state.topevent.id+'@MYAGENDA').then((data) => {
        if(data!=null)
        {
            this.setState({agendadata:JSON.parse(data)},()=>{
                this.setState({loading:false},()=>{
                    this.getAgenda(this.state.user.id, this.state.topevent.id);
                });
            });
        }
        else
        {
            this.getAgenda(this.state.user.id, this.state.topevent.id);
        }
    })
  }
  eventById = async (uid, eid) => {
       await fetch('https://api.eventonapp.com/api/schedule/'+uid+"/"+eid, {
        method: 'GET'
       }).then((response) => response.json())
       .then((responseJson) => {
         this.setState({data: responseJson.data},()=>{
           this.setState({loading:false},()=>{
              AsyncStorage.setItem(eid+'@SCHEDULE', JSON.stringify(responseJson.data));
           })
         });
       }).catch((error) => {   });
  }

  pushToInfo = (showdata) =>{
      Actions.ScheduleInfo({showdata:showdata});
  }

  getAgenda = async (uid,eid) => {
   await fetch('https://api.eventonapp.com/api/agenda/'+uid+'/'+eid, {
      method: 'GET'
     }).then((response) => response.json())
     .then((responseJson) => {
       this.setState({ agendadata: responseJson.data  },()=>{
          AsyncStorage.setItem(eid+'@MYAGENDA', JSON.stringify(responseJson.data));
       });
     })
     .catch((error) => {

    });
  }
  setPage = (page) => {
    this.eventById(this.state.user.id, this.state.topevent.id);
    this.getAgenda(this.state.user.id, this.state.topevent.id);
    this.setState({content: page })
  }
  renderTabData = () => {
    if(this.state.content=='Event Agenda')
    {
      return(
          <View style={{flexDirection:'row',borderRadius:8,backgroundColor:'#FFF',overflow:'hidden'}}>
              <TouchableOpacity onPress={() => this.setPage('Event Agenda') }>
                  <View style={{overflow:'hidden',paddingHorizontal:30,paddingVertical:10,borderTopLeftRadius:5,borderBottomLeftRadius:5,backgroundColor:'#6699FF'}}>
                        <Text style={{color:'#FFF',fontFamily:'Roboto-Regular'}}>Event Agenda</Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setPage('My Agenda') }>
                  <View style={{ overflow: 'hidden',paddingHorizontal:30,paddingVertical:10,borderTopRightRadius:5,borderBottomRightRadius:5}}>
                    <Text style={{color:'#888',fontFamily:'Roboto-Regular'}}>My Agenda</Text>
                  </View>
              </TouchableOpacity>
          </View>
      )
    }
    else{
      return(
          <View style={{overflow:'hidden',flexDirection:'row',borderRadius:8,backgroundColor:'#FFF'}}>
              <TouchableOpacity onPress={() => this.setPage('Event Agenda') }>
                  <View style={{overflow:'hidden',paddingHorizontal:30,paddingVertical:10,borderTopLeftRadius:5,borderBottomLeftRadius:5}}>
                    <Text style={{color:'#888',fontFamily:'Roboto-Regular'}}>Event Agenda</Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setPage('My Agenda') }>
                  <View style={{ overflow: 'hidden',paddingHorizontal:30,paddingVertical:10,borderTopRightRadius:5,borderBottomRightRadius:5,backgroundColor:'#6699FF'}}>
                      <Text style={{color:'#FFF',fontFamily:'Roboto-Regular'}}>My Agenda</Text>
                  </View>
              </TouchableOpacity>
          </View>
      )
    }
  }
  myScheduleContent = () => {
    if(this.state.content=='Event Agenda')
    {
        if(this.state.data.length)
        {
          return this.state.data.map((o,i) => {
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
                                                  <Text style={styles.title} numberOfLines={1}>{s.title}</Text>
                                                  <Text style={styles.location} numberOfLines={1}>{s.location}</Text>
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
       else{
          return (
            <View style={{height:250,justifyContent:'center',alignItems:'center',backgroundColor:'#FFF',padding:30,borderRadius:10,marginTop:10}}>
              <Text style={{fontFamily:'Roboto-Medium',color:'#222',textAlign:'center',fontSize:16}}>Sigh… It's empty!</Text>
              <Text style={{fontFamily:'Roboto-Thin',color:'#000',textAlign:'center',marginTop:15,fontSize:12}}>The event creator hasn't added any schedule to this event yet. Please check back the section after sometime.</Text>
            </View>
          )
       }
    }
    if(this.state.content=='My Agenda')
    {
        if(this.state.agendadata.length)
        {
          return this.state.agendadata.map((o,i) => {
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
                                                  <Text style={styles.title} numberOfLines={1}>{s.title}</Text>
                                                  <Text style={styles.location} numberOfLines={1}>{s.location}</Text>
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
        else{
            return (
              <View style={{marginTop:10}}>
                  <View style={{height:250,justifyContent:'center',alignItems:'center',backgroundColor:'#FFF',padding:30,borderRadius:10}}>
                    <Text style={{fontFamily:'Roboto-Medium',color:'#222',textAlign:'center',fontSize:16}}>{"Hmm… It's empty"}</Text>
                    <Text style={{fontFamily:'Roboto-Regular',color:'#666',textAlign:'center',marginTop:15,fontSize:12}}>You have not added any schedule to your agenda yet.</Text>
                  </View>
              </View>
            )
        }
     }
  }

  render(){
    if(this.state.loading){
      return (
          <View style={{flex:1,height:300,justifyContent:'center',alignItems:'center'}}>
              <ActivityIndicator
                style={styles.centering}
                color="white"
                size="large"
              />
        </View>
      )
    }
    return (
          <View style={styles.container}>
                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                { this.renderTabData() }
                </View>
                { this.myScheduleContent()  }
          </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius:10,
    margin:10,
    marginTop:52,
    marginBottom:90,
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
     overflow:'hidden',
  },
 right: {
    flex:1,
    padding:10,
 },
 title:{
   color: '#444',
   fontSize: 14,
   fontFamily:'Roboto-Medium',
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
 },
 inrow:{
   borderBottomWidth:1,
   borderBottomColor:'#EAEAEA',
   paddingVertical:5
 }

});
