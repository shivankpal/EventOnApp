'use strict';
import React, { Component } from 'react';
import { View,
  Text,
  Image,
  StyleSheet,
  AsyncStorage,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ViewPagerAndroid,
  Linking,
  TouchableWithoutFeedback,
  Alert,
  Platform,
  CameraRoll
  } from 'react-native';
import Permissions from 'react-native-permissions';
import Swiper from 'react-native-swiper';
import RNFS from 'react-native-fs';
import ToastAndroid from '@remobile/react-native-toast';
import LinearGradient from 'react-native-linear-gradient';
import Popup from '.././Pollsnsurveys/Popup';
import { Actions,ActionConst } from 'react-native-router-flux';
const imageSource = {
          loc_icon : require(".././Assets/Img/ed-top-loc.png"),
          date_icon: require(".././Assets/Img/ed-top-dat.png"),
          XLS : require(".././Assets/Img/excel-xls-icon.png"),
          DOC: require(".././Assets/Img/word-doc-icon.png"),
          PPT: require(".././Assets/Img/ppt-icon.png"),
          PDF: require(".././Assets/Img/pdf-icon.png"),
          MP3: require(".././Assets/Img/mp3-icon.png"),
          RAR: require(".././Assets/Img/rar-icon.png"),
          user_icon : require(".././Assets/Img/pro_name.png"),
          event_default: require(".././Assets/Img/event_default_banner.png"),
          //close_icon: require(".././Assets/Img/postback_close.png"),
          //ico_downloads: require(".././Assets/Img/ico_downloads.png"),
          close_icon: require(".././Assets/Img/cancel-music.png"),
          ico_downloads: require(".././Assets/Img/download-tray.png"),
};
const {height, width} = Dimensions.get('window');
export default class Info extends Component {
  constructor(props) {
    super(props);
    this.state = {
        user:this.props.user,
        topevent:this.props.topevent,
        basic:[],
        media:[],
        comment:[],
        offer:[],
        download:[],
        polls:[],
        maps:[],
        loading:true,
        modalVisible:false,
        index:0,
        popdata:[],
        showpop:false,
        showmap:false,
        image:''
    };
    this.galleryRefs = [];
    this.eventById = this.eventById.bind(this);
  }
  componentWillMount(){
    this.props.googleTracker('INFO:'+this.state.topevent.title);
    this.props.setCurrentScene('Info');
    AsyncStorage.getItem(this.state.topevent.id+'@INFO').then((data) => {
        if(data!=null)
        {
            let t = JSON.parse(data);
            this.setState({basic:t.basic,media:t.media,comment:t.comment,offer:t.offer, download: t.download, polls: t.polls, maps: t.maps,},()=>{
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
  }
  componentWillReceiveProps(nextProps){
      this.setState({loading:false});
  }
  showmap = (url) => {
      this.setState({image:url},()=>{
          this.setState({showmap:true})
      })
  }
  eventById = async (uid, id) => {
       await fetch('https://api.eventonapp.com/api/eventById/'+uid+"/"+id, {
          method: 'GET'
       }).then((response) => response.json())
       .then((responseJson) => {
         this.setState({
           basic: responseJson.basic,
           media: responseJson.media,
           comment: responseJson.comment,
           offer: responseJson.offer,
           download: responseJson.download,
           polls: responseJson.polls,
           maps: responseJson.maps,
         },() => {
           this.setState({loading:false},()=>{
                AsyncStorage.setItem(id+'@INFO', JSON.stringify(responseJson));
           })
         })
       })
  }
  showGallery = (i) => {
    this.setState({ index: i},() => {
          this.setState({modalVisible:true})
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
                    {text: 'Continue Login', onPress: () => {this.pushToLogin()}},
                  ],
                  { cancelable: false }
                )
                return false;
            }
        })
     }
     else{
         await fetch('https://api.eventonapp.com/api/savePoll/'+this.state.user.id+"/"+this.state.topevent.id+"/"+pollid+"/"+optionid, {
            method: 'GET'
         }).then((response) => response.json())
         .then((responseJson) => {
            this.setState({modalVisible:false},()=>{
                this.eventById(this.state.user.id, this.state.topevent.id);
            })
         })
     }
  }
  openUrl = (url) => {
    Linking.canOpenURL(url).then(supported => {
        if (!supported) {

        } else {
          return Linking.openURL(url);
        }
        }).catch(err => console.error('An error occurred', err));
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
  expandMore = () => {
    this.refs['description'].setNativeProps({
      numberOfLines:0
    })
    this.refs['readmore'].setNativeProps({
        style:{
          width:0,
          height:0,
        }
    })
  }
  showPeople = (id) => {
      if(this.state.user.id==id)
      {
        Alert.alert('',
          'This action is taking you off the event - are you sure?',
          [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: 'OK', onPress: () => this.props.sudonav.resetTo({id:'Profile', user:this.state.user, ishome:true})},
          ],
          { cancelable: false }
        )
      }
      else{
          Actions.PeopleData({showid:id});
      }
  }
  ext = (url) => {
    return (url = url.substr(1 + url.lastIndexOf("/")).split('?')[0]).split('#')[0].substr(url.lastIndexOf("."))
  }
  downloadFile = async (file) => {
    let ext = this.ext(file);
    let name = new Date().getUTCMilliseconds();
    let os = await Platform.OS;
    if(os==='ios')
    {
      Permissions.request('photo').then(response => {
        if(response=='authorized')
        {
          CameraRoll.saveToCameraRoll(file).then(
            ToastAndroid.show('Photo added to camera roll!', ToastAndroid.LONG)
          )
        }
      })
    }
    else
    {
        Permissions.request('storage').then(response => {
          if(response=='authorized')
          {
              let path = RNFS.PicturesDirectoryPath+'/'+name+ext;
              RNFS.downloadFile({fromUrl:file, toFile: path}).promise.then(res => {
                  ToastAndroid.show("Image Downloaded Successfully\n"+path, ToastAndroid.LONG)
              }).catch((err) => {
                ToastAndroid.show(err.message, ToastAndroid.LONG)
              })
          }
        })
    }
  }
  render(){

    if(this.state.loading){
      return (
        <View style={{flex:1,height:300,justifyContent:'center',alignItems:'center'}}>

        </View>
      );
    }

    let f = imageSource.event_default;
    if(this.state.basic.image_cover!='') { f = {uri:this.state.basic.image_cover}; }
    return (
          <View style={styles.container}>
              <View style={{backgroundColor:'#FFF',borderRadius:10,marginBottom:10,overflow:'hidden'}}>
                    <Image style={styles.coverImage} borderTopLeftRadius={10} borderTopRightRadius={10} source={f} >
                        <LinearGradient
                            start={{x: 0.5, y: 0.25}} end={{x: 0.5, y: 1}}
                            locations={[0,1]}
                            colors={['rgba(0,0,0,0)','rgba(0,0,0,1)']}
                            style={{flex:1,justifyContent:'flex-end'}}
                          >
                            <Text style={styles.title}>{this.state.basic.title}</Text>
                        </LinearGradient>
                    </Image>
                    <View style={{flexDirection:'row',margin:10,justifyContent:'center',alignItems:'center'}}>
                        <View style={{flex:1,padding:5,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                            <Image style={{width:25,height:25,marginRight:10}} source={imageSource.loc_icon} />
                            <Text style={styles.location}>{this.state.basic.location}</Text>
                        </View>
                        <View style={{flex:1,padding:5,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                            <Image style={{width:25,height:25,marginRight:10}} source={imageSource.date_icon} />
                              {
                                 (this.state.basic.str_date=='') ?
                                  <View>
                                      <Text style={styles.date}>{this.state.basic.format_day}</Text>
                                      <Text style={styles.date}>{this.state.basic.format_date}</Text>
                                  </View>
                                  :
                                  <Text style={styles.date}>{this.state.basic.str_date}</Text>
                              }
                        </View>
                    </View>
                    <View style={styles.description}>
                        <Text style={[styles.descriptionText]} ref="description" ellipsizeMode={'tail'} numberOfLines={3}>{this.state.basic.description}</Text>
                        { ((typeof this.state.basic.description != 'undefined') && (this.state.basic.description.length > 130)) ? <TouchableOpacity ref="readmore" onPress={()=> this.expandMore() }><Text style={{alignSelf:'flex-end',alignItems:'flex-end',color:'#292E39',fontFamily:'Roboto-Bold',fontSize:12,fontWeight:'900'}}>Read more</Text></TouchableOpacity> : null }
                        {
                          (this.state.basic.ticket_link!='') ? <View style={{justifyContent:'center',marginVertical:20,marginHorizontal:10}}>
                                <TouchableOpacity onPress={()=>  Actions.Web({url:this.state.basic.ticket_link}) } style={{paddingHorizontal:15,paddingVertical:10,borderRadius:5,backgroundColor:'#6699FF'}}><Text style={{color:'#FFF',fontFamily:'Roboto-Regular',textAlign:'center'}}>Buy Tickets</Text></TouchableOpacity>
                          </View> :
                          null
                        }
                    </View>
                    {
                      (this.state.media.length > 0) ?
                          <View style={{flexDirection:'column', padding:10,marginLeft:10,marginRight:10, borderBottomWidth:1, borderBottomColor:'#EAEAEA'}}>
                              <Text style={{fontFamily:'Roboto-Medium',color:'#999',fontSize:12}}>PHOTOS & VIDEOS</Text>
                              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                {
                                   this.state.media.map((o,i) => {
                                     if(i < 4){
                                       return (
                                          <TouchableOpacity style={{marginVertical:5}}  key={i}  onPress={()=> this.showGallery(i)   }>
                                                <Image borderRadius={3} source={{uri:o.path}} style={{width:((width-110)/4),height:((width-110)/4),margin:5,justifyContent:'flex-end',alignItems:'flex-end'}}>
                                                      {(i==3 && (parseInt(this.state.media.length) - 4)) ? <Text style={{textAlign:'center',fontSize:10,color:'#FFF',backgroundColor:'rgba(0,0,0,0.9)',padding:3,fontFamily:'Roboto-Medium',borderBottomLeftRadius:3,borderBottomRightRadius:3,width:'100%'}}>+{(parseInt(this.state.media.length) - 4)} Photos</Text> :null }
                                                </Image>
                                          </TouchableOpacity>
                                       )
                                     }
                                   })
                                }
                              </ScrollView>
                          </View>
                        :
                        null
                    }
              </View>
              {
                (this.state.offer.length > 0) ?
                  <View style={{backgroundColor:'#FFF',borderRadius:10,marginBottom:10}}>
                      <Text  style={{marginLeft:20,fontFamily:'Roboto-Medium',color:'#999',fontSize:12,marginTop:10}}>SPONSOR OFFERS</Text>
                      <View style={{padding:10,marginHorizontal:10}}>
                          {
                              this.state.offer.map((o,i) => {
                                    return (
                                      <View key={i} style={[styles.offer_row]}>
                                           <Text style={styles.offer_title}>{o.offer_title}</Text>
                                           <Text style={styles.offer_sponsor_title}>{o.title}</Text>
                                           <Text style={styles.offer_description}>{o.offer_description}</Text>
                                           <View style={[styles.btn_box,{justifyContent:'flex-start',flexDirection:'row'}]}>
                                               <TouchableOpacity onPress={()=>{this.takeAction(o)}} style={[styles.btn,{borderRadius:5}]}>
                                                   <Text style={styles.btnText}>{o.button_title}</Text>
                                               </TouchableOpacity>
                                           </View>
                                       </View>
                                    )
                              })
                          }
                      </View>
                      <View style={{justifyContent:'flex-end',flexDirection:'row',borderTopWidth:1,borderTopColor:'#EAEAEA',paddingVertical:10}}>
                            <TouchableOpacity onPress={()=> Actions.SponsorOffer() } style={{paddingHorizontal:10,paddingVertical:5}}><Text style={{color:'#292E39',fontFamily:'Roboto-Bold',fontSize:12,fontWeight:'900'}}>All Offers ></Text></TouchableOpacity>
                      </View>
                  </View>
                  :
                  null
              }
              {

                (this.state.download.length > 0) ?
                  <View style={{backgroundColor:'#FFF',borderRadius:10,marginBottom:10}}>
                      <Text style={{marginLeft:20,fontFamily:'Roboto-Medium',color:'#999',fontSize:12,marginTop:10}}>DOWNLOADS</Text>
                      <View style={{padding:10,marginHorizontal:10}}>
                            {
                                this.state.download.map((o,i) => {
                                if(o.link!=''){
                                  return (
                                    <TouchableOpacity onPress={()=>this.openUrl(o.link)} key={i} style={{flexDirection:'row',alignItems:'center',marginVertical:5}}>
                                        <Image source={imageSource[o.type]} style={{width:60,height:60,marginRight:10}} />
                                        <View style={{justifyContent:'center',flex:1}}>
                                          <Text style={{fontFamily:'Roboto-Regular',fontSize:14,color:'#222'}}>{o.title}</Text>
                                          <Text style={{fontFamily:'Roboto-Regular',fontSize:12,color:'#666'}}>{o.description}</Text>
                                        </View>
                                    </TouchableOpacity>
                                  )
                                }
                              })
                            }
                      </View>
                      <View  style={{justifyContent:'flex-end',flexDirection:'row',borderTopWidth:1,borderTopColor:'#EAEAEA',paddingVertical:10}}>
                            <TouchableOpacity onPress={()=> Actions.Downloads() } style={{paddingHorizontal:10,paddingVertical:5}}><Text style={{color:'#292E39',fontFamily:'Roboto-Bold',fontSize:12,fontWeight:'900'}}>All Downloads ></Text></TouchableOpacity>
                      </View>
                  </View>
                :
                null

              }
              {
                (this.state.polls.length > 0) ?
                  <View style={{backgroundColor:'#FFF',borderRadius:10,marginBottom:10}}>
                      <Text style={{marginLeft:20,fontFamily:'Roboto-Medium',color:'#999',fontSize:12,marginTop:10}}>POLLS/SURVEYS</Text>
                      <View style={{padding:10,marginHorizontal:10}}>
                            {  this.state.polls.map((o,i)=>{
                                var id = o.id;
                                return (
                                  <View key={i} style={styles.row}>
                                      <Text style={{color: '#222',fontSize:16,fontFamily:'Roboto-Regular'}}>{o.poll_question}</Text>
                                      <View style={{flexDirection:'row',marginBottom:10,marginTop:3}}>
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
                                      <View style={[styles.respondbox,{flexDirection:'row',justifyContent:'flex-start'}]}>
                                          <TouchableOpacity style={styles.respondbtn} onPress={()=>{ ToastAndroid.show('You have already voted for this poll.', ToastAndroid.LONG);  }}>
                                              <Text style={styles.respondbtntext}>Responded</Text>
                                          </TouchableOpacity>
                                      </View>
                                      :
                                      <View style={[styles.respondbox,{flexDirection:'row',justifyContent:'flex-start'}]}>
                                          <TouchableOpacity style={styles.respondbtn} onPress={()=>{ this.setState({popdata:o, showpop:true }) }}>
                                              <Text style={styles.respondbtntext}>Respond</Text>
                                          </TouchableOpacity>
                                      </View>
                                     }
                                  </View>
                                )
                              })
                            }
                      </View>
                      <View style={{justifyContent:'flex-end',flexDirection:'row',borderTopWidth:1,borderTopColor:'#EAEAEA',paddingVertical:10}}>
                          <TouchableOpacity onPress={()=> Actions.Pollsnsurveys() } style={{paddingHorizontal:10,paddingVertical:5}}><Text style={{color:'#292E39',fontFamily:'Roboto-Bold',fontSize:12,fontWeight:'900'}}>All Polls ></Text></TouchableOpacity>
                      </View>
                  </View>
                  : null
              }
              {

                (this.state.maps.length > 0) ?
                    <View style={{backgroundColor:'#FFF',borderRadius:10,marginBottom:10}}>
                        <Text style={{marginLeft:20,fontFamily:'Roboto-Medium',color:'#999',fontSize:12,marginTop:10}}>Event Maps</Text>
                        <View style={{width:'100%',height:200}}>
                        <Swiper animated={true}
                                showsButtons={true}
                                index={1}
                                loop={false}
                                nextButton={<Text style={styles.buttonText}>›</Text>}
                                prevButton={<Text style={styles.buttonText}>‹</Text>}
                                dotColor={'#EAEAEA'}
                                style={{}}
                                dot={<View style={{width: 0, height: 0}} />}
                                activeDot={<View style={{width: 0, height: 0}} />}>
                                {
                                    this.state.maps.map((o,i) => {
                                      return (
                                        <View key={i} style={{flex:1,justifyContent: 'center',alignItems: 'center'}}>
                                          <TouchableWithoutFeedback style={{justifyContent: 'center',alignItems: 'center'}} onPress={()=>this.showmap(o.image)}>
                                              <Image source={{uri:o.image}} style={{width:'80%',height:150,resizeMode:'contain'}} />
                                          </TouchableWithoutFeedback>
                                        </View>
                                      )
                                    })
                                }
                        </Swiper>
                        </View>
                    </View>
                :
                null

              }
              {
                (this.state.comment.length)?
                <View style={{backgroundColor:'#FFF',borderRadius:10,marginBottom:10}}>
                    <View style={{padding:10,marginLeft:10,marginRight:10 , borderBottomWidth:1, borderBottomColor:'#EAEAEA'}}>
                        <Text style={{fontFamily:'Roboto-Medium',color:'#999',fontSize:12,marginVertical:5}}>COMMENTS</Text>
                        <View style={{flexDirection:'column',marginBottom:10}}>
                          {
                             this.state.comment.map((o,i) => {
                               let w = 1;
                               if(2==i){
                                 w = 0;
                               }
                               return (
                                    <View key={i} style={{flexDirection:'row',paddingVertical:10,borderBottomWidth:w,borderBottomColor:'#ddd'}}>
                                        { (o.image!='' && o.image != null) ? <TouchableOpacity onPress={()=>{ this.showPeople(o.user_id) } }><Image source={{uri:o.image}} resizeMode={'cover'} style={{width:40, height:40,marginRight:10}} /></TouchableOpacity> : <TouchableOpacity onPress={()=>{ this.showPeople(o.user_id) } }><Image source={imageSource.user_icon} resizeMode={'cover'} style={{width:40, height:40,marginRight:10}} /></TouchableOpacity> }
                                        <View style={{flex:1}}>
                                            <TouchableOpacity onPress={()=>{ this.showPeople(o.user_id) } }>
                                                <Text style={{fontFamily:'Roboto-Regular',fontSize:13,color:'#222'}}>{o.name}</Text>
                                                <Text style={{fontFamily:'Roboto-Regular',fontSize:11,color:'#666'}}>{o.content}</Text>
                                            </TouchableOpacity>
                                            { (o.path != null && o.path != '' ) ? <TouchableOpacity onPress={()=>this.showmap(o.path)}><Image source={{uri:o.path}} style={{width:undefined,height:150,flex:1,marginVertical:10}}/></TouchableOpacity> : null }
                                        </View>
                                    </View>
                                )
                             })

                          }
                        </View>
                    </View>
                </View>
                : null
              }
              <Modal
                  animationType={"fade"}
                  transparent={true}
                  visible={this.state.showmap}
                  onRequestClose={() => { this.setState({ showmap: !this.state.showmap} ) }}
                  >
                 <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.8)',paddingVertical:60,paddingHorizontal:20}}>
                    <TouchableOpacity style={{position:'absolute',top:20,right:20,zIndex:20,padding:5}} onPress={()=>this.setState({ showmap: !this.state.showmap })}>
                        <Image source={imageSource.close_icon} style={{width:20,height:20}}  />
                    </TouchableOpacity>
                    <TouchableOpacity style={{position:'absolute',top:20,left:20,zIndex:20,padding:5}} onPress={()=>{ this.downloadFile(this.state.image) }}>
                        <Image source={imageSource.ico_downloads} style={{width:20,height:20}}  />
                    </TouchableOpacity>
                    <Image source={{uri:this.state.image}} style={{width:undefined,height:undefined,flex:1,resizeMode:'contain'}}/>
                 </View>
              </Modal>
              <Modal
                  animationType={"fade"}
                  transparent={true}
                  visible={this.state.modalVisible}
                  onRequestClose={() => { this.setState({ modalVisible: !this.state.modalVisible} ) }}
                  >
                 <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.8)'}}>
                        <TouchableOpacity style={{position:'absolute',top:20,right:20,zIndex:20,padding:5}} onPress={()=>this.setState({ modalVisible: !this.state.modalVisible })}>
                            <Image source={imageSource.close_icon} style={{width:20,height:20,alignSelf:'flex-end'}}  />
                        </TouchableOpacity>
                        <View style={{margin:10,flex:1}}>
                        <Swiper animated={true}
                                showsButtons={true}
                                index={this.state.index}
                                loop={false}
                                nextButton={<Text style={styles.buttonText}>›</Text>}
                                prevButton={<Text style={styles.buttonText}>‹</Text>}
                                dotColor={'#EAEAEA'}
                                style={{}}
                                dot={<View style={{width: 0, height: 0}} />}
                                activeDot={<View style={{width: 0, height: 0}} />}>
                                {
                                   this.state.media.map((o,i) => {
                                       return (
                                              <View key={i} style={{flex:1,justifyContent: 'center',alignItems: 'center'}} >
                                                  <Image source={{uri:o.path}} style={{resizeMode: 'contain',flex:1,width:width-60,height:null,margin:10,position:'relative'}}>
                                                        <TouchableOpacity style={{width:20,height:20,position:'absolute',left:0,top:5}} onPress={()=>{ this.downloadFile(o.path) }}><Image source={imageSource.ico_downloads} style={{width:20,height:20}}/></TouchableOpacity>
                                                  </Image>
                                              </View>
                                       )
                                    })
                                }
                      </Swiper>
                      </View>
                 </View>
            </Modal>
            <Modal
                animationType={'slide'}
                transparent={true}
                visible={this.state.showpop}
                onRequestClose={() => { this.setState({
                    showpop:!this.state.showpop
                });}}
                >
                <View style={styles.popup}>
                    <View style={styles.popupin}>
                          <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                                <TouchableOpacity style={{padding:5}} onPress={ ()=>{ this.setState({popdata:[], showpop: false }) } }><Image source={imageSource.close_icon} style={{width:15,height:15}}/></TouchableOpacity>
                          </View>
                          <Popup popdata = {this.state.popdata} savePoll={this.savePoll} />
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
    borderRadius:10,
    marginTop:52,
    marginBottom:90,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  centering: {
   alignItems: 'center',
   justifyContent: 'center',
   padding: 8,
 },
 coverImage: {
    width:null,
    height:150,
    justifyContent:'flex-end',
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    borderBottomLeftRadius:0,
    borderBottomRightRadius:0,
 },
 title:{
   color: '#FFF',
   padding:10,
   fontFamily:'Roboto-Regular',
   textShadowColor : '#000',
   backgroundColor:'transparent',
 },
 location:{
   color: '#666',
   fontSize:12,
   fontFamily:'Roboto-Regular',
   borderRightWidth: 1,
   borderRightColor: '#EAEAEA',
   flex:1,
 },
 date:{
   color: '#666',
   fontSize:12,
   fontFamily:'Roboto-Regular',
   flex:1,
 },
 description:{
   padding:10,
   marginLeft:10,
   marginRight:10,
   borderBottomWidth:1,
   borderBottomColor:'#EAEAEA',
 },
 descriptionText:{
   color: '#666',
   fontSize:13,
   fontFamily:'Roboto-Regular',
   flex:1,
 },
 buttonText:{
   fontSize:50,
   color:'#EAEAEA'
 },
 offer_row:{

 },
 offer_title:{
   fontFamily:'Roboto-Bold',
   color:'#555',
   fontSize:15,
   marginBottom:3,
 },
 offer_description:{
   fontFamily:'Roboto-Regular',
   color:'#777',
   fontSize:11,
 },
 offer_sponsor_title:{
   color: '#444',
   fontSize: 16,
   fontFamily:'Roboto-Regular',
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
 },
 comtext:{
   color: '#666',
   fontSize:12,
   fontFamily:'Roboto-Regular',
   flex:1,
 },
 pollrow:{
   height:30,
   marginBottom:5,
   marginTop:5,
   justifyContent:'center',
   paddingLeft:10,
   alignItems:'flex-start',
},
respondbox:{
  flexDirection:'row',
  flex:1,
  justifyContent:'flex-end',
},
respondbtn:{
  alignItems:'center',
  justifyContent:'center',
  backgroundColor:'#6699ff',
  padding:10,
  borderRadius:5,
},
respondbtntext:{
  color:'#FFF',
  fontFamily:'Roboto-Regular',
},
popup:{
    flex:1,
    backgroundColor:'rgba(0,0,0,0.5)',
    justifyContent:'center',
    alignItems:'center',
},
popupin: {
    margin:20,
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:10,
    paddingRight:10,
    backgroundColor:'#FFF',
    borderRadius:10,
},
textf:{
  fontFamily:'Roboto-Regular',
  fontSize:12,
}

});
