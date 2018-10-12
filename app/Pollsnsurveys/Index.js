'use strict';
import React, { Component } from 'react';
import { View,  Text,  ScrollView,  ActivityIndicator, TouchableOpacity, Modal, Image, AsyncStorage,Dimensions,Alert  } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ToastAndroid from '@remobile/react-native-toast';
import styles from './Style';
import Popup from './Popup';
import Header from '.././Main/Header';
const imageSource = {
      close_icon: require(".././Assets/Img/postback_close.png"),
};
const {height, width} = Dimensions.get('window');
export default class Index extends Component {
    constructor(props) {
      super(props);
      this.state = {
          user:this.props.user,
          topevent:this.props.topevent,
          data: [],
          loading:true,
          modalVisible:false,
          popdata:[],
          width:0,
      }
      this.getEvents = this.getEvents.bind(this);
      this.moveToPos = this.moveToPos.bind(this);
      this.savePoll = this.savePoll.bind(this);
      this.inputRefs = [];
    }
    componentDidMount () {
        this.props.googleTracker('POLLS/SURVEYS:'+this.state.topevent.title);
        this.props.setCurrentScene('Polls/Surveys');
        this.getEvents(this.state.user.id,this.state.topevent.id);
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            user:nextProps.user,
            topevent:nextProps.topevent,
        })
    }
    pushToLogin = () => {
        if(typeof this.props.sudonav != 'undefined')
        {
            this.props.sudonav.resetTo({ id: 'SudoLogin'});
        }
    }
    savePoll = async (pollid,optionid) => {
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
      else {
         await fetch('https://api.eventonapp.com/api/savePoll/'+this.state.user.id+"/"+this.state.topevent.id+"/"+pollid+"/"+optionid, {
            method: 'GET'
         }).then((response) => response.json())
         .then((responseJson) => {
            this.setState({modalVisible:false},()=>{
              this.getEvents(this.state.user.id, this.state.topevent.id);
             })
         })
      }
    }
    getEvents = async (uid,eid) => {
       await fetch('https://api.eventonapp.com/api/pollsNSurveys/'+uid+"/"+eid, {
          method: 'GET'
       }).then((response) => response.json())
       .then((responseJson) => {
         this.setState({
           data: responseJson.data,
           loading:false
         },()=>{
            if(this.props.pollid)
            {
                this.moveToPos(this.props.pollid);
            }
         });
       }).catch((error) => {   });
    }
    moveToPos = (id) => {
      setTimeout(()=>{
        this.inputRefs[id].measure((ox, oy, width, height, px, py) => {
          console.log(ox, oy, width, height, px, py);
            this.scrollview.scrollTo({y:py+height});
        });
      },100)
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
                  <Header openDrawer={this.props.openDrawer} currentScene={"Polls/Surveys"} topevent={this.props.topevent} user={this.props.user} sudonav={this.props.sudonav}/>
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
              <View style={{height:250,justifyContent:'center',alignItems:'center',backgroundColor:'#FFF',padding:30,borderRadius:10,margin:20}}>
                <Text style={{fontFamily:'Roboto-Medium',color:'#222',textAlign:'center',fontSize:16}}>Sigh… It's empty!</Text>
                <Text style={{fontFamily:'Roboto-Thin',color:'#000',textAlign:'center',marginTop:15,fontSize:12}}>The event creator hasn't created any poll to this event yet. Please check back the section after sometime.</Text>
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
                  <Header openDrawer={this.props.openDrawer} currentScene={"Polls/Surveys"} topevent={this.props.topevent} user={this.props.user} sudonav={this.props.sudonav}/>
                  <ScrollView ref={e => (this.scrollview = e)}>
                    <View style={[styles.box,{marginBottom:90}]}>
                        {  this.state.data.map((o,i)=>{
                            let id = o.id;
                            return (
                              <View ref={ref => this.inputRefs[id] = ref} key={i} style={styles.row}>
                                  <Text style={styles.title}>{o.poll_question}</Text>
                                  <View style={{flexDirection:'row',marginBottom:10}}>
                                    <Text style={styles.comtext}>{o.total_votes} votes</Text>
                                    <Text style={[styles.comtext,{color:'#888',textAlign:'right'}]}>{o.ago}</Text>
                                  </View>
                                  <View>
                                    {o.ispoll &&
                                       o.answers.map((r,n)=>{
                                         var perwidth = 0;
                                          if(o.total_votes > 0){
                                              var perwidth = Math.round(((r.votes*100)/o.total_votes));
                                          }
                                          return (
                                            <View  key={n} style={{flexDirection:'column',marginVertical:5,paddingVertical:5}}>
                                                <Text style={{color:'#333',fontFamily:'Roboto-Regular',fontSize:12}}>{r.answer}</Text>
                                                <View style={{flexDirection:'row',alignItems:'center',flex:1}}>
                                                    <View style={{flex:1,borderColor:'#e2f3ff',borderWidth:0.1,borderRadius:10,backgroundColor:'#e2f3ff',marginRight:10}}><View style={{height:10,backgroundColor:'#6699ff',borderRadius:10,width:perwidth+'%'}}></View></View>
                                                    <Text style={{width:30,height:20,color:'#666',fontSize:12,textAlign:'center'}}>{perwidth}%</Text>
                                                </View>
                                            </View>
                                          )
                                       })
                                    }
                                  </View>
                                { (o.ispoll) ?
                                  <View style={styles.respondbox}>
                                      <TouchableOpacity style={styles.respondbtn} onPress={()=>{ ToastAndroid.show('You have already voted for this poll.', ToastAndroid.LONG);  }}>
                                          <Text style={styles.respondbtntext}>Responded</Text>
                                      </TouchableOpacity>
                                  </View>
                                  :
                                  <View style={styles.respondbox}>
                                      <TouchableOpacity style={styles.respondbtn} onPress={()=>{ this.setState({popdata:o, modalVisible:true },()=>{

                                       }) }}>
                                          <Text style={styles.respondbtntext}>Respond</Text>
                                      </TouchableOpacity>
                                  </View>
                                 }
                              </View>
                            )
                          })
                        }
                    </View>
                </ScrollView>
                <Modal
                    animationType={'slide'}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => { this.setState({
                        modalVisible:!this.state.modalVisible
                    });}}
                    >
                    <View style={styles.popup}>
                        <View style={styles.popupin}>
                              <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                                    <TouchableOpacity style={{padding:5}} onPress={ ()=>{ this.setState({popdata:[], modalVisible: false }) } }><Image source={imageSource.close_icon} style={{width:15,height:15}}/></TouchableOpacity>
                              </View>
                              <Popup popdata = {this.state.popdata} savePoll={this.savePoll} />
                        </View>
                    </View>
                </Modal>
        </LinearGradient>
      );
    }
}
