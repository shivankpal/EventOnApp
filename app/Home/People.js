'use strict';
import React, { Component } from 'react';
import { View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  TouchableWithoutFeedback,
  TouchableHighlight,
  AsyncStorage,
  Keyboard,
  Alert,
  Modal
  } from 'react-native';
import { Actions } from 'react-native-router-flux';
import ToastAndroid from '@remobile/react-native-toast';

const imageSource = {
        user_icon : require(".././Assets/Img/default_p.png"),
        add_people_icon : require(".././Assets/Img/people_network.png"),
        chat_people_icon : require(".././Assets/Img/tac_3_2.png"),
        filter_icon : require(".././Assets/Img/filter.png"),
        search_icon : require(".././Assets/Img/search.png"),
        f_icon : require(".././Assets/Img/so_fa_t.png"),
        t_icon : require(".././Assets/Img/so_tw_t.png"),
        l_icon : require(".././Assets/Img/so_ln_t.png"),
        star_icon : require(".././Assets/Img/badge_star.png"),
        tick_icon : require(".././Assets/Img/tick_my_life_away.png"),
};
export default class People extends Component {
  constructor(props) {
    super(props);
    this.state = {
        user:this.props.user,
        topevent:this.props.topevent,
        data:[],
        loading:true,
        modalVisible:false,
        search:'',
        filterTag:'',
        showload:true,
        animating:false,
    };
    this.page = 1;
    this.getData = this.getData.bind(this);
  }
  componentWillMount(){
      this.props.googleTracker('NETWORK:'+this.state.topevent.title);
      this.props.setCurrentScene('People');
      AsyncStorage.getItem(this.state.topevent.id+'@PEOPLE').then((data) => {
        if(data!=null)
        {
            this.setState({data:JSON.parse(data)},()=>{
                this.setState({loading:false});
                this.getData();
            });
        }
        else
        {
            this.getData();
        }
      });
  }
  getData = async () => {
      this.setState({modalVisible:false,animating:true});
       await fetch('https://api.eventonapp.com/api/people/'+this.state.user.id+'/'+this.state.topevent.id+'/'+this.page+'?search='+this.state.search+"&filterTag="+this.state.filterTag, {
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
                   if(this.page==1)
                   {
                      AsyncStorage.setItem(this.state.topevent.id+'@PEOPLE', JSON.stringify(responseJson.data));
                   }
                   this.page = this.page + 1;
                   this.showConnected();
              })
       }).catch((error) => {
            this.setState({loading:false,animating:false});
       });
  }
  searchPeople = async () => {
    this.setState({modalVisible:false, loading:true});
       await fetch('https://api.eventonapp.com/api/people/'+this.state.user.id+'/'+this.state.topevent.id+'?search='+this.state.search+"&filterTag="+this.state.filterTag, {
          method: 'GET'
       }).then((response) => response.json())
       .then((responseJson) => {
             this.setState({ data: responseJson.data },()=>{
                 this.setState({loading: false},()=>{
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
             })
       }).catch((error) => { });
  }
  tickAction = (tag) => {
      if(this.state.filterTag.length)
      {
          this.refs[this.state.filterTag].setNativeProps({
            style: {
              color: "transparent"
            }
          });
      }
      this.setState({filterTag:tag},()=>{
        this.refs[tag].setNativeProps({
          style: {
            color: "#6699FF"
          }
        });
      });
  }
  showPeople = (id) => {
      Actions.PeopleData({showid:id});
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
      }).catch((error) => { });
  }
  moveToChat = (touser) => {
      Actions.Chat({touser:touser,template:true});
  }
  resetFilter = () => {
    if(this.state.filterTag.length)
    {
        this.refs[this.state.filterTag].setNativeProps({
          style: {
            color: "transparent"
          }
        });
    }
    this.setState({filterTag:'',loading:true},()=>{
        this.searchPeople();
    });
  }
  renderRows = () => {
    let len = this.state.data.length;
    if(this.state.loading){
      return (
          <View style={{flex:1,height:300,justifyContent:'center',alignItems:'center'}}>
              <ActivityIndicator
                style={styles.centering}
                color="#6699FF"
                size="large"
              />
          </View>
      );
    }
    if((len==0) && (this.state.loading==false) ) {
      return(
        <View style={{height:250,justifyContent:'center',alignItems:'center',backgroundColor:'#FFF',padding:30,borderRadius:10}}>
          <Text style={{fontFamily:'Roboto-Medium',color:'#222',textAlign:'center',fontSize:18}}>Calm Crowd</Text>
          <Text style={{fontFamily:'Roboto-Thin',color:'#000',textAlign:'center',marginTop:15,fontSize:13}}>{"The app creator have not added anyone to this page yet."}</Text>
        </View>
       )
    }
    else {
       return this.state.data.map((o,i) => {
               let w = 1;
               if((len-1)==i)
               {
                 w = 0;
               }
               return (
                     <TouchableOpacity onPress={()=>this.showPeople(o.id)} key={i} style={[styles.row,{borderBottomWidth:w}]}>
                       <View style={{flexDirection:'row'}}>
                             <View style={styles.left}>
                               { (o.image!='') ? <Image borderRadius={30} source={{uri:o.image}} style={{width:60,height:60,borderRadius:30}}/> : <Image borderRadius={30} source={imageSource.user_icon} style={{width:60,height:60,borderRadius:30}} /> }
                               { (o.is_connect > 0) ? <View style={{alignItems:'flex-end'}}><Image source={imageSource.star_icon} style={{width:20,height:20,marginTop:-20}}/></View> : null }
                             </View>
                             <View style={styles.right}>
                                  <View style={{flexDirection:'row'}}>
                                      <Text style={styles.name}>{o.name}</Text>
                                      {/* (o.is_connect > 0) ? <Text style={{color: '#27ccc0',fontSize:15,fontFamily:'Roboto-Bold',textAlign:'center',marginLeft:5}}>✓</Text> :  null */}
                                  </View>
                                   <Text style={styles.profession} numberOfLines={1}>{o.profession}</Text>
                                   <Text style={styles.location}>{o.location}</Text>
                                   <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                     {
                                       (o.fb_id) ?
                                         <View style={{flexDirection:'row',padding:5,paddingHorizontal:10,backgroundColor:'#4267B2',justifyContent:'center',alignItems:'center',borderRadius:15,marginVertical:5,marginRight:5}}>
                                              <Image source={imageSource.f_icon} style={{width:13,height:13}} />
                                              { (o.is_fb_connected) ? <Text style={{color: '#FFF',fontSize:10,fontFamily:'Roboto-Medium',textAlign:'center'}}>✓</Text> : null }
                                         </View>
                                      :
                                        <View style={{flexDirection:'row',padding:5,paddingHorizontal:10,backgroundColor:'#7D7D7D',justifyContent:'center',alignItems:'center',borderRadius:15,marginVertical:5,marginRight:5}}>
                                            <Image source={imageSource.f_icon} style={{width:13,height:13}} />
                                            { (o.is_fb_connected) ? <Text style={{color: '#FFF',fontSize:10,fontFamily:'Roboto-Medium',textAlign:'center'}}>✓</Text> : null }
                                       </View>
                                    }
                                    { (o.tw_id) ?
                                       <View style={{flexDirection:'row',padding:5,paddingHorizontal:10,backgroundColor:'#1DA1F2',justifyContent:'center',alignItems:'center',borderRadius:15,marginVertical:5,marginRight:5}}>
                                            <Image source={imageSource.t_icon} style={{width:13,height:13}} />
                                            { (o.is_tw_connected) ? <Text style={{color: '#FFF',fontSize:10,fontFamily:'Roboto-Medium',textAlign:'center'}}>✓</Text> : null }
                                       </View>
                                       :
                                       <View style={{flexDirection:'row',padding:5,paddingHorizontal:10,backgroundColor:'#7D7D7D',justifyContent:'center',alignItems:'center',borderRadius:15,marginVertical:5,marginRight:5}}>
                                          <Image source={imageSource.t_icon} style={{width:13,height:13}} />
                                      </View>
                                    }
                                    { (o.ln_id) ?
                                       <View style={{flexDirection:'row',padding:5,paddingHorizontal:10,backgroundColor:'#0084bf',justifyContent:'center',alignItems:'center',borderRadius:15,marginVertical:5}}>
                                            <Image source={imageSource.l_icon} style={{width:13,height:13}} />
                                       </View>
                                      :
                                      <View style={{flexDirection:'row',padding:5,paddingHorizontal:10,backgroundColor:'#7D7D7D',justifyContent:'center',alignItems:'center',borderRadius:15,marginVertical:5}}>
                                           <Image source={imageSource.l_icon} style={{width:13,height:13}} />
                                      </View>
                                    }
                                   </View>
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
  }
  resetSearch = () => {
      if(this.state.search.length)
      {
        Keyboard.dismiss();
        this.setState({search:'',loading:true},()=>{
            this.searchPeople();
        })
      }
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
  pushToLogin = () => {
      if(typeof this.props.sudonav != 'undefined')
      {
          this.props.sudonav.resetTo({ id: 'SudoLogin'});
      }
  }
  showFilter = () => {
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
        this.setState({modalVisible:true})
    }
  }
  render() {
    return (
          <View style={styles.container}>
                <View style={{backgroundColor:'#FFF',padding:5,borderTopLeftRadius:10,borderTopRightRadius:10}}></View>
                <View style={{backgroundColor:'#FFF'}}>
                      <View style={{flexDirection:'row',padding:5,margin:5}}>
                          <View style={{flex:1,height:40,flexDirection:'row',borderWidth:0.3,borderColor:'#999',alignItems:'center',paddingLeft:5,borderRadius:5,backgroundColor:'#f0f0f0',marginRight:5}}>
                              <Image source={imageSource.search_icon} style={{width:20,height:20}}/>
                              <TextInput
                                   placeholder={"Search People"}
                                   underlineColorAndroid="transparent"
                                   style={{flex:1,height:40,fontFamily:'Roboto-Regular'}}
                                   returnKeyType={"search"}
                                   ref={'searchtext'}
                                   onChangeText={(search) =>  this.setState({search})   }
                                   onSubmitEditing={()=>{this.searchPeople()}}
                                   value={this.state.search}
                               />
                               <TouchableWithoutFeedback onPress={ ()=> this.resetSearch() }>
                                    <Text style={{margin:5,padding:5,fontSize:15}} >✕</Text>
                               </TouchableWithoutFeedback>
                          </View>
                          <TouchableOpacity ref={ref => this.filter = ref } onPress={() => { this.showFilter() }} style={{backgroundColor:'#cfcfcf',width:40,height:40,justifyContent:'center',alignItems:'center',borderRadius:5}}>
                              <Image source={imageSource.filter_icon} style={{width:20,height:20}}/>
                          </TouchableOpacity>

                      </View>
                        {
                            (this.state.filterTag.length > 0) ?
                            <View style={{flexDirection:'row',paddingHorizontal:10}}>
                                <TouchableOpacity onPress={()=>{ this.setState({filterTag:''},()=>{ this.getData() }) }} style={{paddingHorizontal:5,paddingVertical:2,borderWidth:0.5,borderColor:'#888',flexDirection:'row',borderRadius:5,justifyContent:'center',alignItems:'center'}}>
                                    <Text style={{textAlign:'center',fontSize:12,marginRight:5}}>{(this.state.filterTag=='Attendee') ? 'Attendees' : this.state.filterTag }</Text>
                                    <Text style={{textAlign:'center',fontSize:12}}>&#x2716;</Text>
                                </TouchableOpacity>
                            </View>
                            : null
                        }
                      <View style={{marginTop:10}}>
                        {  this.renderRows()  }
                      </View>
                </View>
                <View style={{backgroundColor:'#FFF',padding:5,borderBottomLeftRadius:10,borderBottomRightRadius:10,marginBottom:40}}></View>
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
                <Modal
                      animationType={"slide"}
                      transparent={true}
                      visible={this.state.modalVisible}
                      style={{justifyContent:'center',flex:1}}
                      onRequestClose={() => { this.setState({modalVisible:!this.state.modalVisible}) }}
                >
                  <View style={{backgroundColor:'#FFF',marginVertical:20,marginHorizontal:10,borderRadius:5,marginTop:150}}>
                     <View>
                           <View style={{borderBottomWidth:1,borderBottomColor:'#EAEAEA',padding:15,flexDirection:'row'}}>
                              <Text style={{color:'#6699FF',fontFamily:'Roboto-Medium',fontSize:15,flex:1}}>Filter Search Results</Text>
                              <TouchableOpacity onPress={()=>this.resetFilter()}>
                                  <Text style={{color:'#e85151',fontFamily:'Roboto-Regular',fontSize:13}}>Clear</Text>
                              </TouchableOpacity>
                           </View>
                           <View style={{padding:15}}>

                                 <TouchableWithoutFeedback onPress={()=>this.tickAction('My Network')}>
                                    <View style={{flexDirection:'row',justifyContent:'center',padding:5,margin:10}}>
                                       <Text style={{color:'#666',fontFamily:'Roboto-Regular',flex:1}}>My Network</Text>
                                       <View style={{borderWidth:0.5,paddingHorizontal:3,paddingVertical:0}}>
                                          { (this.state.filterTag=='My Network') ? <Text ref={"My Network"} style={{color:'#6699FF'}}>✔</Text> : <Text ref={"My Network"} style={{color:'transparent'}}>✔</Text> }
                                       </View>
                                    </View>
                                 </TouchableWithoutFeedback>
                                 <TouchableWithoutFeedback onPress={()=>this.tickAction('Social Media Connections')}>
                                    <View style={{flexDirection:'row',justifyContent:'center',padding:5,margin:10}}>
                                       <Text style={{color:'#666',fontFamily:'Roboto-Regular',flex:1}}>Social Media Connections</Text>
                                       <View style={{borderWidth:0.5,paddingHorizontal:3,paddingVertical:0}}>
                                          { (this.state.filterTag=='Social Media Connections') ? <Text ref={"Social Media Connections"} style={{color:'#6699FF'}}>✔</Text> : <Text ref={"Social Media Connections"} style={{color:'transparent'}}>✔</Text> }
                                       </View>
                                    </View>
                                 </TouchableWithoutFeedback>

                                 <TouchableWithoutFeedback onPress={()=>this.tickAction('Attendee')}>
                                    <View style={{flexDirection:'row',justifyContent:'center',padding:5,margin:10}}>
                                         <Text style={{color:'#666',fontFamily:'Roboto-Regular',flex:1}}>Attendees</Text>
                                         <View style={{borderWidth:0.5,paddingHorizontal:3,paddingVertical:0}}>
                                             { (this.state.filterTag=='Attendee') ? <Text ref={"Attendee"} style={{color:'#6699FF'}}>✔</Text> : <Text ref={"Attendee"} style={{color:'transparent'}}>✔</Text> }
                                         </View>
                                    </View>
                                 </TouchableWithoutFeedback>
                                 <TouchableWithoutFeedback onPress={()=>this.tickAction('Exhibitor')}>
                                    <View style={{flexDirection:'row',justifyContent:'center',padding:5,margin:10}}>
                                         <Text style={{color:'#666',fontFamily:'Roboto-Regular',flex:1}}>Exhibitor</Text>
                                         <View style={{borderWidth:0.5,paddingHorizontal:3,paddingVertical:0}}>
                                             { (this.state.filterTag=='Exhibitor') ? <Text ref={"Exhibitor"} style={{color:'#6699FF'}}>✔</Text> : <Text ref={"Exhibitor"} style={{color:'transparent'}}>✔</Text> }
                                         </View>
                                    </View>
                                 </TouchableWithoutFeedback>

                           </View>
                           <TouchableOpacity onPress={()=>this.searchPeople()} style={{backgroundColor:'#6699FF',padding:15,borderBottomLeftRadius:5,borderBottomRightRadius:5}}>
                               <Text style={{color:'#FFF',fontFamily:'Roboto-Medium',textAlign:'center',fontSize:15}}>Apply</Text>
                           </TouchableOpacity>
                     </View>
                  </View>
            </Modal>
          </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin:10,
    padding:5,
    marginTop:52,
    marginBottom:30,
  },
  container2: {
    backgroundColor:'#FFF',
  }
  ,
  centering: {
   alignItems: 'center',
   justifyContent: 'center',
   padding: 8,
 },
  row: {
    borderBottomWidth:1,
    borderBottomColor:'#EEE',
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
   color: '#000',
   fontSize: 16,
   fontFamily:'Roboto-Regular',
 },
 location:{
   color: '#666',
   fontSize:12,
   fontFamily:'Roboto-Regular',
   height:15,
   lineHeight:15
 },
 role:{
   color: '#666',
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
   fontFamily:'Roboto-Medium',
   height:15,
   lineHeight:15
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
