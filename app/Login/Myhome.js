'use strict';
import React, { Component } from 'react';
import { View,
  Text,
  Image,
  StatusBar,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  AsyncStorage,
  Dimensions,Alert } from 'react-native';
  import LinearGradient from 'react-native-linear-gradient';
  import * as Progress from 'react-native-progress';
  import CustomStatusBar from '.././Common/CustomStatusBar';

  const {height, width} = Dimensions.get('window');
  const imageSource = {
      plus_icon: require(".././Assets/Img/tac_7.png"),
      pro_icon: require(".././Assets/Img/tac_5.png"),
      chat: require(".././Assets/Img/head_chat.png"),
      event_default: require(".././Assets/Img/event_default_banner.png"),
  };
  export default class Myhome extends Component {
      constructor(props) {
        super(props);
        this.state = {
          user:this.props.user,
          events: [],
          topevent: this.props.topevent,
          modalVisible:false,
          progress:0,
          ncount:0,
          chatcount:0,
          loading:true,
        }
        this.execFunct;
      }
      componentWillMount(){

          AsyncStorage.getItem('MYEVENTS').then((data) => {
              if(data!=null)
              {
                  this.setState({events:JSON.parse(data)},()=>{
                      this.updateEvents()
                      this.getCount();
                      this.setState({loading:false})
                  });
              }
              else{
                this.setState({loading:false})
              }
          })
      }
      componentDidMount(){
        setTimeout(() => {
            if((typeof this.props.deeplink != 'undefined') && (this.props.deeplink) &&  (this.props.deeplink.length > 0) )
            {
                var r = this.props.deeplink;
                this.props.clearDeepLink();
                var event = this.state.events;
                if(parseInt(r[0]))
                {
                    var ind = event.map(function (o) { return o.id; }).indexOf(r[0]);
                    if(ind >= 0)
                    {
                        this.setState({topevent:event[ind]},() => {
                            this.props.navigator.resetTo({id:'SudoSplash', user:this.state.user, topevent:event[ind], deeplink:r })
                        })
                    }
                    else{
                        fetch('https://api.eventonapp.com/api/downloadEvent/'+r[0], { method: 'GET' }).then((response) => response.json()).then((responseJson) => {
                              this.props.navigator.push({id:'Search', user:this.state.user, sudotopevent:responseJson.data[0], deeplink:r })
                        }).catch((error) => { this.setState({loading:false})  })
                    }
                }
                else{
                    this.props.navigator.push({id:'ChatList', user:this.state.user, deeplink:r })
                }
            }
        },1000)
      }
      componentWillReceiveProps(nextProps){
          AsyncStorage.getItem('MYEVENTS').then((data) => {
              if(data!=null)
              {
                  this.setState({events:JSON.parse(data)},()=>{
                      this.updateEvents()
                  });
              }
          })
      }
      componentWillUnmount(){
        clearTimeout(this.execFunct);
      }
      updateEvents = async () => {
        await fetch('https://api.eventonapp.com/api/myEvents/?user_id='+this.state.user.id, {
           method: 'GET'
        }).then((response) => response.json())
        .then((responseJson) => {
            AsyncStorage.setItem('MYEVENTS', JSON.stringify(responseJson.data),()=>{
              this.setState({events:responseJson.data})
            });
        }).catch((error) => {  });
      }
      pushOf = (topevent) => {
          let progress = 0;
          let myvar;
          let cl;
          this.setState({ progress:progress,modalVisible:true },()=>{
                cl = setInterval(() => {
                    this.setState( {progress:parseFloat(this.state.progress)+0.2} )
                },500)
                myvar = setTimeout(()=>{
                    this.setState({modalVisible:false},()=>{
                        clearInterval(cl);
                        clearTimeout(myvar);
                        myvar = setTimeout(()=>{ clearTimeout(myvar); this.props.navigator.resetTo({id:'SudoSplash', user:this.state.user, topevent:topevent})
                      },300)
                    })
                },5200)
          })
      }
      getCount = async () => {
          await fetch('https://api.eventonapp.com/api/unreadCount/'+this.state.user.id+'/0', {
             method: 'GET'
            }).then((response) => response.json())
            .then((responseJson) => {
               this.setState({ ncount: responseJson.data.notify_count, chatcount:responseJson.data.chat_count },()=>{
                 this.execFunct = setTimeout(() => this.getCount() , 3000);
               })
            }).catch((error) => {   })
      }
      moveToProfile = () => {
        this.props.navigator.push({id:'Profile',user:this.state.user})
      }
      moveToPrewelcome = () => {
        this.props.navigator.push({id:'Prewelcome',user:this.state.user,isback:true})
      }
      moveToChatList = () => {
        this.props.navigator.push({id:'ChatList',user:this.state.user})
      }
      render(){
        if(this.state.loading)
        {
            return (
                <View style={styles.container}>
                      <CustomStatusBar backgroundColor="#292E39" barStyle="light-content"/>
                      <View style={styles.header}>
                          <View style={styles.header_left}>
                            <TouchableOpacity onPress={()=>this.moveToProfile()}>
                                <Image source={imageSource.pro_icon} style={{width:30,height:30}}></Image>
                            </TouchableOpacity>
                            <View style={{width:30,height:30}}></View>
                          </View>
                          <View style={styles.header_center}>
                              <Text style={{color:'#FFF',fontFamily:'Roboto-Medium',fontSize:14,textAlign:'center'}}>My Home</Text>
                          </View>
                          <View style={styles.header_right}>
                            <TouchableOpacity onPress={()=>this.moveToChatList()}>
                                <Image source={imageSource.chat} style={{width:30,height:30}}></Image>
                                { (this.state.chatcount > 0) ?
                                  <View borderRadius={10} style={{position:'absolute',right:0,top:0,backgroundColor:'red',paddingHorizontal:4,paddingVertical:2,minWidth:18,alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'#FFF',fontFamily:'Roboto-Bold',fontSize:10,textAlign:'center'}}>{(this.state.chatcount>99) ? this.state.chatcount+'+' :this.state.chatcount }</Text>
                                  </View>
                                    : null
                                }
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>this.moveToPrewelcome()}>
                                <Image source={imageSource.plus_icon} style={{width:30,height:30}}></Image>
                            </TouchableOpacity>
                          </View>
                      </View>
                  </View>
            )
        }
        if(this.state.events.length==0)
        {
            return (
                <View style={styles.container}>
                      <CustomStatusBar backgroundColor="#292E39" barStyle="light-content"/>
                      <View style={styles.header}>
                          <View style={styles.header_left}>
                            <TouchableOpacity onPress={()=>this.moveToProfile()}>
                                <Image source={imageSource.pro_icon} style={{width:30,height:30}}></Image>
                            </TouchableOpacity>
                            <View style={{width:30,height:30}}></View>
                          </View>
                          <View style={styles.header_center}>
                              <Text style={{color:'#FFF',fontFamily:'Roboto-Medium',fontSize:14,textAlign:'center'}}>My Home</Text>
                          </View>
                          <View style={styles.header_right}>
                            <TouchableOpacity onPress={()=>this.moveToChatList()}>
                                <Image source={imageSource.chat} style={{width:30,height:30}}></Image>
                                {
                                   (this.state.chatcount > 0) ?
                                  <View borderRadius={10} style={{position:'absolute',right:0,top:0,backgroundColor:'red',paddingHorizontal:4,paddingVertical:2,minWidth:18,alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'#FFF',fontFamily:'Roboto-Bold',fontSize:10,textAlign:'center'}}>{(this.state.chatcount>99) ? this.state.chatcount+'+' :this.state.chatcount }</Text>
                                  </View>
                                    : null
                                }
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>this.moveToPrewelcome()}>
                                <Image source={imageSource.plus_icon} style={{width:30,height:30}}></Image>
                            </TouchableOpacity>
                          </View>
                      </View>
                      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <View style={{width:'75%',marginTop:-100}}>
                                <Text style={{fontSize:16,fontFamily:'Roboto-Medium',color:'#EAEAEA',backgroundColor:'transparent',textAlign:'center'}}>You do not have any event added to your home.</Text>
                                <Text style={{fontSize:14,fontFamily:'Roboto-Regular',color:'#CCC',backgroundColor:'transparent',textAlign:'center',marginTop:10}}>Tap + add an event</Text>
                            </View>
                      </View>
                  </View>
            )
        }
        return(
              <View style={styles.container}>
                    <CustomStatusBar backgroundColor="#292E39" barStyle="light-content"/>
                    <View style={styles.header}>
                        <View style={styles.header_left}>
                          <TouchableOpacity onPress={()=>this.moveToProfile()}>
                              <Image source={imageSource.pro_icon} style={{width:30,height:30}}></Image>
                          </TouchableOpacity>
                          <View style={{width:30,height:30}}></View>
                        </View>
                        <View style={styles.header_center}>
                            <Text style={{color:'#FFF',fontFamily:'Roboto-Medium',fontSize:14,textAlign:'center'}}>My Home</Text>
                        </View>
                        <View style={styles.header_right}>
                          <TouchableOpacity onPress={()=>this.moveToChatList()}>
                              <Image source={imageSource.chat} style={{width:30,height:30}}></Image>
                              { (this.state.chatcount > 0) ?
                                <View borderRadius={10} style={{position:'absolute',right:0,top:0,backgroundColor:'red',paddingHorizontal:4,paddingVertical:2,minWidth:18,alignItems:'center',justifyContent:'center'}}>
                                  <Text style={{color:'#FFF',fontFamily:'Roboto-Bold',fontSize:10,textAlign:'center'}}>{(this.state.chatcount>99) ? this.state.chatcount+'+' :this.state.chatcount }</Text>
                                </View>
                                  : null
                              }
                          </TouchableOpacity>
                          <TouchableOpacity onPress={()=>this.moveToPrewelcome()}>
                              <Image source={imageSource.plus_icon} style={{width:30,height:30}}></Image>
                          </TouchableOpacity>
                        </View>
                    </View>
                    <ScrollView>
                        {
                             this.state.events.map((o,i) => {
                                let f = imageSource.event_default;
                                if(o.image_cover!='') { f = {uri:o.image_cover}; }
                                return(
                                        <Image key={i} borderRadius={10} source={f} style={styles.listrow}>
                                              <LinearGradient
                                                  start={{x: 0.5, y: 0.25}} end={{x: 0.5, y: 1}}
                                                  locations={[0,1]}
                                                  colors={['rgba(0,0,0,0)','rgba(0,0,0,1)']}
                                                  style={styles.listrowtop}>
                                                  <TouchableWithoutFeedback onPress={()=>this.pushOf(o)} key={i} >
                                                    <View style={styles.textboxrow}>
                                                        <Text style={styles.textboxtitle}>{o.title}</Text>
                                                        {(o.category) ? <Text style={styles.textboxsubtext}>{o.category}</Text> :  null }
                                                        {(o.str_date!='') ? <Text style={styles.textboxsubtext}>{o.str_date}</Text> : <Text style={styles.textboxsubtext}>{o.format_day, o.format_date}</Text>}
                                                        <Text style={[styles.textboxsubtext,{marginTop:15}]}>{o.location}</Text>
                                                    </View>
                                                  </TouchableWithoutFeedback>
                                              </LinearGradient>
                                        </Image>

                                )
                             })
                        }
                    </ScrollView>
                    <Modal
                        animationType={"slide"}
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => { this.setState({
                                modalVisible:!this.state.modalVisible
                            })
                        }}
                        >
                        <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'center',alignItems:'center',padding:20}} >
                            <View style={{backgroundColor:'#FFF',padding:20,borderRadius:10}}>
                                <Text style={{fontFamily:'Roboto-Medium',fontSize:15,color:'#292E39',textAlign:'center',margin:10}}>Opening Event....</Text>
                                <Progress.Bar progress={this.state.progress} width={(width-100)} height={5} color={'#27ccc0'} borderWidth={0} animated={true} unfilledColor={'#FFF'} borderRadius={5} />
                            </View>
                        </View>
                     </Modal>
            </View>
        )
    }
}
const styles = StyleSheet.create({
  container: {
      flex:1,
      backgroundColor:'#292E39'
  },
  header:{
     height:50,
     flexDirection:'row',
     alignItems:'center',
     borderBottomWidth:1,
     borderColor:'#363a4f'
  },
  header_left:{
    justifyContent: 'center',
    padding:10,
    flexDirection:'row',
  },
  header_center:{
     flex:1,
     justifyContent: 'center',
     alignItems: 'center',
     padding:5,
  },
  header_right:{
    justifyContent: 'center',
    padding:10,
    flexDirection:'row',
  },
  header_center_title:{
    color: 'white',
    margin: 10,
    fontSize: 16,
    fontFamily:'Roboto-Medium',
  },
  listrow:{
    margin:10,
    backgroundColor:'#FFF',
    borderRadius:10,
    height:225,
    width:width-20,
  },
  listrowtop:{
    flex:1,
    borderRadius:10,
  },
  textboxrow:{
    flex:1,
    flexDirection:'column',
    padding:20,
    justifyContent:'flex-end'
  },
  textboxtitle:{
    fontSize:16,
    fontFamily:'Roboto-Medium',
    color:'#EAEAEA',
    backgroundColor:'transparent'
  },
  textboxsubtext:{
    fontSize:12,
    fontFamily:'Roboto-Regular',
    color:'#CCC',
    backgroundColor:'transparent'
  }
});
