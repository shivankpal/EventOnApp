'use strict';
import React, { Component } from 'react';
import { View,  Text,  Image,  TouchableOpacity,AsyncStorage,StyleSheet } from 'react-native';
import {Actions,ActionConst} from 'react-native-router-flux';
var imageSource = {
        home_icon : require(".././Assets/Img/head_hamburger.png"),
        chat_icon: require(".././Assets/Img/head_chat.png"),
        search_icon: require(".././Assets/Img/head_search.png"),
        notify: require(".././Assets/Img/head_nitifications.png"),
        back_icon: require(".././Assets/Img/arrow_left.png"),
        plus_icon: require(".././Assets/Img/head_plus.png"),
        arrow_left: require(".././Assets/Img/arrow_left_w.png"),
};
var ScreenList = new Array('My Event Assistant','My Agenda','Sponsor Offers','Event Photos','Downloads','FAQ','Polls/Surveys','Tickets','Event Notes','Event Business Cards');
var hometab = new Array('Info','Schedule','Offers','Feeds','Network');
export default class Header extends Component {
    constructor(props) {
      super(props);
      this.state = {
          user:[],
          topevent:this.props.topevent,
          currentScene:this.props.currentScene,
          ncount:0,
          chatcount:0,
      }
      this.eventfunc;
    }
    componentWillMount(){
        AsyncStorage.getItem('USER').then((user) => {
            if(user!=null)
            {
                this.setState({user:JSON.parse(user)},()=>{
                    this.getCount()
                } )
            }
        })
    }
    componentWillUnmount(){
        clearTimeout(this.eventfunc);
    }

    getCount = async () => {
        await fetch('https://api.eventonapp.com/api/unreadCount/'+this.state.user.id+'/'+this.state.topevent.id, {
           method: 'GET'
          }).then((response) => response.json())
          .then((responseJson) => {
             this.setState({ ncount: responseJson.data.notify_count, chatcount:responseJson.data.chat_count },()=>{
                this.eventfunc = setTimeout(() => this.getCount() , 3000)
             })
          }).catch((error) => {   })
    }

    pushToChat = () => {
        Actions.Chats();
    }

    pushToNotify = () => {
        Actions.Notifications();
    }
    pushBack = () => {
      Actions.pop();
    }
    pushToLogin = () => {
        if(typeof this.props.sudonav != 'undefined')
        {
            this.props.sudonav.resetTo({ id: 'SudoLogin'});
        }
    }

    render () {
      return (
        <View style={styles.header}>
            <View style={styles.header_left}>
                {
                  ( this.props.isback ) ?
                    <View style={{flexDirection:'row'}}>
                        <TouchableOpacity onPress={()=>this.pushBack()}>
                            <Image source={imageSource.arrow_left} style={{width:30,height:30}}></Image>
                        </TouchableOpacity>
                        <View style={{width:30,height:30}}></View>
                    </View>
                    :
                    (typeof this.state.user.id != 'undefined') ?
                    <View style={{flexDirection:'row'}}>
                        <TouchableOpacity onPress={this.props.openDrawer}>
                            <Image source={imageSource.home_icon} style={{width:30,height:30}}></Image>
                        </TouchableOpacity>
                        <View style={{width:30,height:30}}></View>
                    </View>
                    :
                    <View style={{flexDirection:'row'}}>
                        <TouchableOpacity onPress={()=>this.pushToLogin()}>
                            <Image source={imageSource.back_icon} style={{width:20,height:25,marginVertical:2.5,marginHorizontal:5}}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.props.openDrawer}>
                            <Image source={imageSource.home_icon} style={{width:30,height:30}}/>
                        </TouchableOpacity>
                    </View>
                }
            </View>
            <View style={styles.header_center}>
                  <Text style={{color:'#FFF',fontFamily:'Roboto-Medium',fontSize:14,textAlign:'center'}} ellipsizeMode={'tail'}  numberOfLines={1}>{this.state.topevent.title}</Text>
                 { (hometab.indexOf(this.state.currentScene) < 0) ? <Text style={{color:'#EFEFEF',fontFamily:'Roboto-Regular',fontSize:11,textAlign:'center'}}>{this.state.currentScene}</Text> : null}
            </View>
            <View style={styles.header_right}>
                <TouchableOpacity onPress={ () => this.pushToNotify() }>
                    <Image source={imageSource.notify} style={{width:30,height:30}}></Image>
                   { (this.state.ncount > 0) ?
                      <View borderRadius={10} style={{position:'absolute',right:0,top:0,backgroundColor:'red',paddingHorizontal:4,paddingVertical:2,minWidth:18,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{color:'#FFF',fontFamily:'Roboto-Bold',fontSize:10,textAlign:'center'}}>{(this.state.ncount>99) ? this.state.ncount+'+' :this.state.ncount }</Text>
                      </View>
                       : null
                   }
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> { this.pushToChat() }}>
                        <Image source={imageSource.chat_icon} style={{width:30,height:30}} />
                        { (this.state.chatcount > 0) ?
                          <View borderRadius={10} style={{position:'absolute',right:0,top:0,backgroundColor:'red',paddingHorizontal:4,paddingVertical:2,minWidth:18,justifyContent:'center',alignItems:'center'}}>
                            <Text style={{color:'#FFF',fontFamily:'Roboto-Bold',fontSize:10,textAlign:'center'}}>{(this.state.chatcount>99) ? this.state.chatcount+'+' :this.state.chatcount }</Text>
                          </View>
                          : null
                        }
                </TouchableOpacity>
            </View>
        </View>
      );
    }
}
const styles = StyleSheet.create({
     header:{
        height:50,
        flexDirection:'row',
        backgroundColor:'transparent',
        alignItems:'center',
        paddingHorizontal:10,
     },
     header_left:{
       justifyContent: 'center',
       alignItems: 'center',
       flexDirection:'row',
     },
     header_center:{
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection:'column',
        flex:1,
     },
     header_right:{
       justifyContent: 'center',
       alignItems: 'center',
       flexDirection:'row',
     },
     header_center_title:{
       color: 'white',
       fontSize: 16,
       fontFamily:'Roboto-Medium',
     }
});
