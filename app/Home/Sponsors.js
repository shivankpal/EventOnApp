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
  AsyncStorage,
  BackHandler
  } from 'react-native';
import { Actions,ActionConst } from 'react-native-router-flux';
import ToastAndroid from '@remobile/react-native-toast';
var imageSource = {
          platinum : require(".././Assets/Img/sponsor_banner_platinum.png"),
          gold: require(".././Assets/Img/sponsor_banner_gold.png"),
          silver: require(".././Assets/Img/sponsor_banner_silver.png"),
          bronze: require(".././Assets/Img/sponsor_banner_bronze.png"),
};
export default class Sponsors extends Component {
  constructor(props) {
    super(props);
    this.state = {
        user:this.props.user,
        topevent:this.props.topevent,
        data:[],
        offers:[],
        loading:true,
        content:'Sponsors'
    };
    this.getSponsors = this.getSponsors.bind(this);
    this.getOffers = this.getOffers.bind(this);
  }
  componentWillMount(){
    this.props.googleTracker('OFFERS:'+this.state.topevent.title);
    this.props.setCurrentScene('Sponsors');
    AsyncStorage.getItem(this.state.topevent.id+'@SPONSORS').then((data) => {
        if(data!=null)
        {
            this.setState({data:JSON.parse(data)},()=>{
                this.setState({loading:false});
                this.getSponsors(this.state.topevent.id);
            });
        }
        else
        {
            this.getSponsors(this.state.topevent.id);
        }
    })
    AsyncStorage.getItem(this.state.topevent.id+'@MYOFFERS').then((data) => {
        if(data!=null)
        {
            this.setState({offers:JSON.parse(data)},()=>{
                this.setState({loading:false},()=>{
                    this.getOffers(this.state.topevent.id);
                });
            });
        }
        else
        {
            this.getOffers(this.state.topevent.id);
        }
    })
  }
  componentWillReceiveProps(nextProps){
    AsyncStorage.getItem(this.state.topevent.id+'@SPONSORS').then((data) => {
        if(data!=null)
        {
            this.setState({data:JSON.parse(data)},() => {
                this.setState({loading:false},() => {
                    this.getSponsors(this.state.topevent.id);
                })
            })
        }
        else
        {
            this.getSponsors(this.state.topevent.id);
        }
    })
    AsyncStorage.getItem(this.state.topevent.id+'@MYOFFERS').then((data) => {
        if(data!=null)
        {
            this.setState({offers:JSON.parse(data)},()=>{
                    this.getOffers(this.state.topevent.id);
            });
        }
        else
        {
            this.getOffers(this.state.topevent.id);
        }
    })
  }
  getSponsors = async (id) => {
         await fetch('https://api.eventonapp.com/api/sponsers/'+id, {
            method: 'GET'
         }).then((response) => response.json())
         .then((responseJson) => {
           this.setState({data: responseJson.data},()=>{
                this.setState({loading:false},()=>{
                    AsyncStorage.setItem(id+'@SPONSORS', JSON.stringify(responseJson.data));
                })
           });
         }).catch((error) => { });
  }
  getOffers = async (id) => {
   await fetch('https://api.eventonapp.com/api/sponsorOffer/'+id, {
      method: 'GET'
     }).then((response) => response.json())
     .then((responseJson) => {
       this.setState({ offers: responseJson.data },()=>{
         AsyncStorage.setItem(id+'@MYOFFERS', JSON.stringify(responseJson.data));
       });
     }).catch((error) => {  });
  }
  showInfo = (id) => {
      Actions.SponsorInfo({showid:id});
  }
  setPage = (page) => {
    this.getSponsors(this.state.topevent.id);
    this.getOffers(this.state.topevent.id);
    this.setState({content: page })
  }
  renderTabs = () => {
    if(this.state.content=='Sponsors')
    {
      return(
          <View style={{overflow:'hidden',flexDirection:'row',borderRadius:8,backgroundColor:'#FFF'}}>
              <TouchableOpacity onPress={() => this.setPage('Sponsors') } >
                  <View style={{ overflow: 'hidden',paddingHorizontal:30,paddingVertical:10,borderTopLeftRadius:5,borderBottomLeftRadius:5,backgroundColor:'#6699FF'}}>
                    <Text style={{color:'#FFF',fontFamily:'Roboto-Regular'}}>Sponsors</Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setPage('Offers') } >
                  <View style={{ overflow: 'hidden',paddingHorizontal:30,paddingVertical:10,borderTopRightRadius:5,borderBottomRightRadius:5}}>
                    <Text style={{color:'#888',fontFamily:'Roboto-Regular'}}>Offers</Text>
                  </View>
              </TouchableOpacity>
          </View>
      )
    }
    else{
      return(
          <View style={{overflow:'hidden', flexDirection:'row',borderRadius:8,backgroundColor:'#FFF'}}>
              <TouchableOpacity onPress={() => this.setPage('Sponsors') }>
                  <View style={{paddingHorizontal:30,paddingVertical:10,borderTopLeftRadius:5,borderBottomLeftRadius:5}}>
                    <Text style={{color:'#888',fontFamily:'Roboto-Regular'}}>Sponsors</Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setPage('Offers') }>
                  <View style={{paddingHorizontal:30,paddingVertical:10,borderTopRightRadius:5,borderBottomRightRadius:5,backgroundColor:'#6699FF'}}>
                    <Text style={{color:'#FFF',fontFamily:'Roboto-Regular'}}>Offers</Text>
                  </View>
              </TouchableOpacity>
          </View>
      )
    }
  }
  renderTabData = () => {
    if(this.state.content=='Sponsors')
    {
        if(this.state.data.length > 0)
        {
            return this.state.data.map((o,i) => {
                  return (
                        <View key={i} style={styles.row}>
                          <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                            <View style={styles.left}>
                              <Image source={{uri:o.logo}} style={{width:100,height:100,resizeMode:'center'}}>
                                  <Image source={imageSource[o.type.toLowerCase()]} style={{alignSelf:'flex-start',width:60,height:60,resizeMode:'cover'}}/>
                              </Image>
                            </View>
                            <View style={styles.right}>
                                <Text style={styles.title} numberOfLines={1}>{o.title}</Text>
                                <Text style={styles.location} numberOfLines={1}>{o.location}</Text>
                                <Text style={styles.description} numberOfLines={3}>{o.description}</Text>
                            </View>
                          </View>
                          {
                            o.offer_cnt > 0 &&
                            <View style={styles.btn_box}>
                                <TouchableOpacity onPress={()=> this.showInfo(o.id) } style={styles.btn}>
                                  { (o.offer_cnt > 1) ? <Text style={styles.btnText}>{o.offer_cnt} Offers</Text> : <Text style={styles.btnText}>{o.offer_cnt} Offer</Text> }
                                </TouchableOpacity>
                            </View>
                          }
                        </View>
                  )
              })
        }
        else{
            return (
              <View style={{height:250,justifyContent:'center',alignItems:'center',backgroundColor:'#FFF',padding:30,borderRadius:10}}>
                <Text style={{fontFamily:'Roboto-Medium',color:'#222',textAlign:'center',fontSize:18}}>{"Sigh… It's empty!"}</Text>
                <Text style={{fontFamily:'Roboto-Thin',color:'#000',textAlign:'center',marginTop:15,fontSize:13}}>{"The event creator hasn't added any sponsors to this event yet."}</Text>
              </View>
            )
        }
    }
    else{
      if(this.state.offers.length > 0)
      {
          return (
            <View style={{backgroundColor:'#FFF',borderRadius:10}}>
            {
              this.state.offers.map((o,i) => {
                  const ex = (i == (this.state.data.length-1)) ? { borderBottomWidth:0 } : {};
                  return (
                      <View key={i} style={[styles.offer_row,ex]}>
                          <Text style={styles.offer_sponsor_title} numberOfLines={1}>{o.title}</Text>
                          <Text style={styles.offer_title} numberOfLines={1}>Offer: {o.offer_title}</Text>
                          <Text style={styles.offer_description} numberOfLines={3}>{o.offer_description}</Text>
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
          )
      }
      else
      {
          return (
            <View style={{height:250,justifyContent:'center',alignItems:'center',backgroundColor:'#FFF',padding:30,borderRadius:10}}>
              <Text style={{fontFamily:'Roboto-Medium',color:'#222',textAlign:'center',fontSize:18}}>{"Sigh… It's empty!"}</Text>
              <Text style={{fontFamily:'Roboto-Thin',color:'#000',textAlign:'center',marginTop:15,fontSize:13}}>Check out this space later for exciting offers</Text>
            </View>
          )
      }
    }
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
  render(){
    if(this.state.loading){
      return (
        <View style={{flex:1,height:300,justifyContent:'center',alignItems:'center'}}>

        </View>
      );
    }
    return (
          <View style={styles.container}>
              <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginBottom:10}}>
                  { this.renderTabs() }
              </View>
              <View style={styles.box}>
                  { this.renderTabData() }
              </View>
      </View>
    );

  }
}

const styles = StyleSheet.create({
  container: {
    margin:10,
    marginTop:52,
  },
  tab:{

  },
  box:{
    borderRadius:10,

    marginBottom:90,
  },
  centering: {
   alignItems: 'center',
   justifyContent: 'center',
   padding: 8,
 },
  row: {
    marginTop: 5,
    marginBottom: 5,
    backgroundColor:'#FFF',
    borderRadius:10,
    padding:10,
 },
  left: {
    marginRight:10,
  },
 right: {
   flex:1,
 },
 title:{
   color: '#444',
   fontSize: 16,
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
 offer_sponsor_title:{
   color: '#444',
   fontSize: 16,
   fontFamily:'Roboto-Medium',
   paddingHorizontal:5,
 },
 offer_description:{
   fontFamily:'Roboto-Regular',
   paddingHorizontal:5,
   color:'#777',
   fontSize:11,
 },
 btn_box:{
    flex:1,
    marginTop:5,
    paddingTop:5,
    paddingBottom:5,
 },
 btn:{
   backgroundColor:'#6699ff',
   padding:10,
   alignSelf:'flex-end',
   borderRadius:5,
 },
 btnText:{
   backgroundColor:'#6699ff',
   color:'#FFF',
   fontFamily:'Roboto-Regular'
 }

});
