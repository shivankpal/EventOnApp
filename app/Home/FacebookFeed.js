'use strict';
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  AsyncStorage,
  Alert
} from 'react-native';
import ToastAndroid from '@remobile/react-native-toast';
import FBSDK, { LoginManager,LoginButton,AccessToken } from 'react-native-fbsdk';
const imageSource = {
          facebook: require(".././Assets/Img/social_facebook.png"),
};
export default class FacebookFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
        user:this.props.user,
        topevent:this.props.topevent,
        data:[],
        isfetch:true,
        showlogin:false,
    };
  }
  pushToLogin = () => {
      if(typeof this.props.sudonav != 'undefined')
      {
          this.props.sudonav.resetTo({ id: 'SudoLogin'});
      }
  }
  componentWillMount(){
    if(this.state.user===false)
    {
         this.setState({isfetch:true,showlogin:true});
    }
    else{
        this.props.googleTracker('FEED:'+this.state.topevent.title+':FACEBOOK');
        AsyncStorage.getItem('USER').then((user) => {
          var u = JSON.parse(user);
          if(u.isfbconnected)
          {
             this.setState({showlogin:false},()=>{
                  this.prefetch();
             })
          }
          else
          {
              this.setState({isfetch:true,showlogin:true});
          }
        });
    }
  }
  prefetch = () => {
      AsyncStorage.getItem(this.state.topevent.id+'@FACEBOOKFEED').then((data) => {
          if(data!=null)
          {
              this.setState({data:JSON.parse(data)},()=>{
                  this.setState({showlogin:false,isfetch:false},()=>{
                    this.facebookFeed(this.state.user.id, this.state.topevent.id);
                  });
              });
          }
          else
          {
              this.facebookFeed(this.state.user.id, this.state.topevent.id);
          }
      })
  }
  loginfacebook = (value) => {
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
        LoginManager.logInWithReadPermissions(["public_profile","user_friends","email"]).then((result)=>{
           if(result.isCancelled)
           {
               ToastAndroid.show('User Cancelled', ToastAndroid.LONG);
           }
           else
           {
               AccessToken.getCurrentAccessToken().then((data) => {
                     const token = data.accessToken.toString();
                     var url = 'https://api.eventonapp.com/api/connectFacebook/?token='+token+"&uid="+this.state.user.id;
                     this.resolveData(url);
                   }
               )
           }
        },(error)=>{
           ToastAndroid.show('Error', ToastAndroid.LONG);
        })
    }
  }
  resolveData = async (url) => {
    await fetch(url, {
       method: 'GET'
    }).then((response) => response.json()).then((responseJson) => {
      AsyncStorage.setItem('USER', JSON.stringify(responseJson.user),() => {
            this.setState({showlogin:false},()=>{
               this.facebookFeed(this.state.user.id,this.state.topevent.id);
            })
      });
    }).catch((error) => { });
  }
  facebookFeed = (uid, eid) => {
        fetch('https://api.eventonapp.com/api/facebookFeed/'+uid+"/"+eid, {  method: 'GET' }).then((response) => response.json())
           .then((responseJson) => {
               this.setState({
                 data: responseJson.data,
               },()=>{
                 this.setState({isfetch:false},()=>{
                      AsyncStorage.setItem(eid+'@FACEBOOKFEED', JSON.stringify(responseJson.data));
                 })
               });
         }).catch((error) => {  });
  }

 parseData = () => {
   if(this.state.data.length==0){
        return (
          <View style={styles.container}>
              <View style={{height:250,justifyContent:'center',alignItems:'center',backgroundColor:'#FFF',padding:30,borderRadius:10}}>
                <Text style={{fontFamily:'Roboto-Medium',color:'#222',textAlign:'center',fontSize:18}}>Talking to Me???</Text>
                <Text style={{fontFamily:'Roboto-Thin',color:'#000',textAlign:'center',marginTop:15,fontSize:13}}>Post a message or photo to share with others.</Text>
              </View>
          </View>
        )
   }
   return  this.state.data.map((o,i) => {
        return (
              <View key={i} style={styles.row}>
                 <View style={styles.top}>
                    <View style={styles.left}>
                      <Image style={styles.profile} source = {{uri:o.image}}  />
                    </View>
                    <View style={styles.right}>
                        <Text style={styles.title}>{o.name}</Text>
                        <Text style={styles.date}>{o.ago}</Text>
                    </View>
                  </View>
                  <View style={styles.bottom}>
                      <Text style={styles.description}>{o.content}</Text>
                  </View>
              </View>
        )
    })
  }
  loader = () => {
    if(this.state.showlogin){
      return (
        <View style={{flex:1,height:300,justifyContent:'center',alignItems:'center'}}>
            <TouchableOpacity onPress={()=>this.loginfacebook()} style={{backgroundColor:'#3B5998',paddingHorizontal:15,paddingVertical:10,flexDirection:'row',justifyContent:'center',alignItems:'center',borderRadius:5}}>
                <Image source={imageSource.facebook} style={{width:25,height:25,marginRight:5}}/>
                <Text style={{fontFamily:'Roboto-Regular',color:'#FFF'}}>Connect With Facebook</Text>
            </TouchableOpacity>
       </View>
      );
    }
    else
    {
        return (
            <View style={{flex:1,height:300,justifyContent:'center',alignItems:'center'}}>
                <ActivityIndicator
                  style={styles.centering}
                  color="#6699ff"
                  size="large"
                />
           </View>
        );
    }
  }


  render() {
    return (
          <View style={styles.container}>
              { (this.state.isfetch) ? this.loader()  :  this.parseData() }
          </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius:10,
    margin:10,
    padding:10,
    backgroundColor:'#FFF',
  },
  centering: {
   alignItems: 'center',
   justifyContent: 'center',
   padding: 8,
 },
  row: {
    marginTop:5,
    marginBottom:5,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor:'#FFF',
    borderBottomWidth:1,
    borderBottomColor:'#e5e5e5'
  },
  top:{
    flexDirection:'row'
  },
  bottom:{
    flex:1,
    padding:5,
    paddingBottom:10,
    marginTop:5,
    marginBottom:5,
  },
  left: {
     marginRight:10,
   },
 right: {
    flex:1,
 },
 profile:{
   width:50,
   height:50,
   borderRadius:25,
 },
 title:{
   color: '#444',
   fontSize: 16,
   fontFamily:'Roboto-Medium',
 },
 description:{
   color: '#666',
   fontSize:12,
   fontFamily:'Roboto-Regular',
 },
 date:{
   fontFamily:'Roboto-Regular',
   fontSize:12,
   color:'#999',
 },
 icon_box : {
   flexDirection:'row',
   paddingTop:5,
   paddingBottom:5,
 },
 items:{
   flexDirection:'row',
   marginRight:10,
 }



});
