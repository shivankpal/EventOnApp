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
  Modal,
  WebView,
  Alert
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import ToastAndroid from '@remobile/react-native-toast';
import LinearGradient from 'react-native-linear-gradient';

const imageSource = {
          twitter: require(".././Assets/Img/social_twitter.png"),
          arrow_left: require(".././Assets/Img/arrow_left_w.png"),
};
export default class TwitterFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
        user: this.props.user,
        topevent: this.props.topevent,
        data: [],
        isfetch:true,
        showlogin:false,
        twitteropen:false,
    };
    this.loginTwitter = this.loginTwitter.bind(this);
  }
  componentWillMount(){
    if(this.state.user===false)
    {
         this.setState({isfetch:true,showlogin:true});
    }
    else{
      this.props.googleTracker('FEED:'+this.state.topevent.title+':TWITTER');
      AsyncStorage.getItem('USER').then((user) => {
        var u = JSON.parse(user);
        if(u.istwitterconnected)
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
      AsyncStorage.getItem(this.state.topevent.id+'@TWITTERFEED').then((data) => {
          if(data!=null)
          {
              this.setState({data:JSON.parse(data)},()=>{
                  this.setState({showlogin:false,isfetch:false},()=>{
                    this.twitterFeed(this.state.user.id, this.state.topevent.id);
                  });
              });
          }
          else
          {
              this.twitterFeed(this.state.user.id, this.state.topevent.id);
          }
      })
  }
  pushToLogin = () => {
      if(typeof this.props.sudonav != 'undefined')
      {
          this.props.sudonav.resetTo({ id: 'SudoLogin'});
      }
  }
  loginTwitter = () => {
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
    else{
      this.setState({twitteropen:true})
    }
  }
  resolveData = async (url) => {
    await fetch(url, {
       method: 'GET'
    }).then((response) => response.json()).then((responseJson) => {
      AsyncStorage.setItem('USER', JSON.stringify(responseJson.user),() => {
            this.setState({showlogin:false},()=>{
               this.twitterFeed(this.state.user.id,this.state.topevent.id);
            })
      });
    }).catch((error) => { });
  }
  twitterFeed = (uid, eid) => {
       fetch('https://api.eventonapp.com/api/twitterFeed/'+uid+'/'+eid, { method: 'GET' }).then((response) => response.json())
       .then((responseJson) => {
         this.setState({
           data: responseJson.data,
           isfetch:false,
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
            <TouchableOpacity onPress={()=>this.loginTwitter()} style={{backgroundColor:'#51ABEF',paddingHorizontal:15,paddingVertical:10,flexDirection:'row',justifyContent:'center',alignItems:'center',borderRadius:5}}>
                <Image source={imageSource.twitter} style={{width:25,height:25,marginRight:5}}/>
                <Text style={{fontFamily:'Roboto-Regular',color:'#FFF'}}>Connect With Twitter</Text>
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
  changeInNavigation = (webViewState) => {
      var url = webViewState.url;
      if(webViewState.loading==false)
      {
        if(url.indexOf('api.eventonapp.com/api/twitterauthcallback') > 0)
        {
            this.setState({twitteropen:false},()=>{
                var oauth_token = this.getParameterByName('oauth_token',url);
                var oauth_verifier = this.getParameterByName('oauth_verifier',url);
                var url2 = "https://api.eventonapp.com/api/connectTwitter?uid="+this.state.user.id;
                this.setState({showAnimate:true});
                setTimeout(()=>{ this.resolveData(url2) },3000);
            });
        }
      }
  }
  resolveData = async (url) => {
    this.setState({showAnimate:true});
    await fetch(url, {
       method: 'GET'
    }).then((response) => response.json()).then((responseJson) => {
      AsyncStorage.setItem('USER', JSON.stringify(responseJson.user),() => {
          this.setState({showlogin:false},()=>{
             this.twitterFeed(this.state.user.id,this.state.topevent.id);
          })
      });
    }).catch((error) => { this.setState({showAnimate:false}) });
  }
  getParameterByName = (name, url) => {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  render() {
    return (
          <View style={styles.container}>
              { (this.state.isfetch) ? this.loader()  :  this.parseData() }
              <Modal
                  animationType={"fade"}
                  transparent={true}
                  visible={this.state.twitteropen}
                  onRequestClose={() => this.setState({ twitteropen: false} ) }
                  >
                  <LinearGradient
                    start={this.state.topevent.theme.bg_gradient.start}
                    end={this.state.topevent.theme.bg_gradient.end}
                    locations={this.state.topevent.theme.bg_gradient.locations}
                    colors={this.state.topevent.theme.bg_gradient.colors}
                    style={{ flex: 1,paddingTop:22 }}
                  >
                       <View style={styles.header}>
                          <View style={styles.header_left}>
                            <TouchableOpacity onPress={ ()=>this.setState({ twitteropen: false}) }>
                                <Image source={imageSource.arrow_left} style={{width:30,height:30}}></Image>
                            </TouchableOpacity>
                          </View>
                          <View style={styles.header_center}>

                          </View>
                          <View style={styles.header_right}>
                            <View style={{width:30,height:30}}>
                            </View>
                          </View>
                      </View>
                      <WebView
                        onNavigationStateChange={this.changeInNavigation.bind(this)}
                        source={{uri: 'https://api.eventonapp.com/api/twitterauth/'+this.state.user.id}}
                        onLoadEnd={()=>this.setState({loading:false})}
                        style={{backgroundColor:'#FFF',flex:1}}
                      />
                  </LinearGradient>
              </Modal>
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
    flex:1,
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
 }
});
