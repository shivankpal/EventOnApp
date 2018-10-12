'use strict';
import React, { Component } from 'react';
import { WebView,View,Dimensions,Image,StyleSheet,TouchableOpacity,Text,AsyncStorage } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Progress from 'react-native-progress';
import {Actions} from 'react-native-router-flux';
const imageSource = {
        arrow_left: require(".././Assets/Img/arrow_left_w.png"),
};
const {height, width} = Dimensions.get('window');
export default class Web extends Component {
    constructor(props){
      super(props);
      this.state = {
        loading:true,
        topevent:this.props.topevent,
      }
      this.changeInNavigation = this.changeInNavigation.bind(this);
      this.props.hideShowFloatBtn(false);
    }
    componentWillUnmount(){
      this.props.hideShowFloatBtn(true);
    }
    changeInNavigation = (webViewState) => {
      var url = webViewState.url;
      if(webViewState.loading==false)
      {
        if(url.indexOf('api.eventonapp.com/api/twitterauthcallback') > 0)
        {
            AsyncStorage.getItem('USER').then((user) => {
              var oauth_token = this.getParameterByName('oauth_token',url);
              var oauth_verifier = this.getParameterByName('oauth_verifier',url);
              if(this.props.backpage=='Post')
              {
                  setTimeout(()=>{  Actions.Post({oauth_token:oauth_token,oauth_verifier:oauth_verifier,user:JSON.parse(user)}) },3000);
              }
            })
        }
      }
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
    pushBack = () => {
      Actions.pop();
    }
    render (){
      return (
        <LinearGradient
          start={this.state.topevent.theme.bg_gradient.start}
          end={this.state.topevent.theme.bg_gradient.end}
          locations={this.state.topevent.theme.bg_gradient.locations}
          colors={this.state.topevent.theme.bg_gradient.colors}
          style={{ flex: 1 }}
        >
            <View style={styles.header}>
                <View style={styles.header_left}>
                  <TouchableOpacity onPress={()=>this.pushBack()}>
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
              source={{uri: this.props.url}}
              onLoadEnd={()=>this.setState({loading:false})}
              style={{backgroundColor:'#FFF',flex:1}}
            />
            { (this.state.loading) ? <Progress.Bar style={{position:'absolute',top:0,left:0,right:0}} progress={0.3} width={width} height={3} color={'#27ccc0'} indeterminate={true} borderWidth={0} animated={true} unfilledColor={'#FFF'} borderRadius={0} /> : null }
        </LinearGradient>
      )
    }
}
const styles = StyleSheet.create({
  container: {
      flex:1,
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
  centering: {
   alignItems: 'center',
   justifyContent: 'center',
   padding: 8,
 },
 box: {
    marginVertical:10,
    marginHorizontal:5
 },
 row:{
   margin:10,
   padding:10,
   backgroundColor:'#FFF',
   borderRadius:5
 },
 title:{
   color: '#222',
   fontSize:16,
   fontFamily:'Roboto-Medium',
 },
 date:{
   color: '#888',
   fontSize:12,
   fontFamily:'Roboto-Regular',
 },
 description:{
   color: '#444',
   fontSize:13,
   fontFamily:'Roboto-Regular',
 },
});
