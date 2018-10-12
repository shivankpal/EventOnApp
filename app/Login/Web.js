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
  WebView,
  AsyncStorage
} from 'react-native';
import ToastAndroid from '@remobile/react-native-toast';
import * as Progress from 'react-native-progress';
import CustomStatusBar from '.././Common/CustomStatusBar';
const {height, width} = Dimensions.get('window');
const imageSource = {
      arrow_left: require(".././Assets/Img/arrow_left.png")
}
export default class Web extends Component {
    constructor(props){
      super(props);
      this.state = {
        loading:true
      }
      this.changeInNavigation = this.changeInNavigation.bind(this);
    }
    pushBack = () => {
      AsyncStorage.getItem('USER').then((data) => {
          if(data!=null)
          {
              if(this.props.backpage)
              {
                  this.props.navigator.replace({id:this.props.backpage,user:JSON.parse(data)});
              }
              else{
                this.props.navigator.pop();
              }

          }
      })
    }
    changeInNavigation = (webViewState) => {
      var url = webViewState.url;
      var backpage = this.props.backpage;
      if(webViewState.loading==false)
      {
          if(url.indexOf('api.eventonapp.com/api/linkedin?code=') > 0)
          {
            AsyncStorage.getItem('USER').then((user) => {
              var code = this.getParameterByName('code',url);
              this.props.navigator.replace({id:backpage,code:code,user:JSON.parse(user) });
            })
          }
          if(url.indexOf('api.eventonapp.com/api/linkedin?error=user_cancelled_login') > 0)
          {
              ToastAndroid.show('Login Cancelled', ToastAndroid.LONG);
              if(backpage)
              {
                  AsyncStorage.getItem('USER').then((user) => {
                    this.props.navigator.replace({id:backpage,user:JSON.parse(user) });
                  })
              }
              else{
                this.props.navigator.pop();
              }
          }

          if(url.indexOf('api.eventonapp.com/api/twitterauthcallback') > 0)
          {
              AsyncStorage.getItem('USER').then((user) => {
                var oauth_token = this.getParameterByName('oauth_token',url);
                var oauth_verifier = this.getParameterByName('oauth_verifier',url);
                setTimeout(()=>{ this.props.navigator.replace({id:backpage,oauth_token:oauth_token,oauth_verifier:oauth_verifier,user:JSON.parse(user) }) },3000);
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
    render (){
      return (
        <View style={{flex:1,backgroundColor:'transparent',justifyContent:'center'}}>
          <CustomStatusBar backgroundColor="#292E39" barStyle="light-content"/>
            <View style={styles.header}>
                <View style={styles.header_left}>
                    <TouchableOpacity onPress={()=>this.pushBack()}>
                        <Image source={imageSource.arrow_left} style={{width:30,height:30}}></Image>
                    </TouchableOpacity>
                </View>
                <View style={styles.header_center}>
                    <Text style={[styles.header_center_title,{color:'#9c9fa6'}]} ellipsizeMode={'tail'}  numberOfLines={1}></Text>
                </View>
                <View style={styles.header_right}>
                    <View style={{width:25,height:25,margin:3}}></View>
                </View>
            </View>
            <WebView
              onNavigationStateChange={this.changeInNavigation.bind(this)}
              onLoadEnd={()=>this.setState({loading:false})}
              source={{uri: this.props.url}}
              style={{padding:10}}
              automaticallyAdjustContentInsets={false}
            />
            { (this.state.loading) ? <Progress.Bar style={{position:'absolute',top:60,left:0,right:0,zIndex:10}} progress={0.3} width={width} height={3} color={'#27ccc0'} indeterminate={true} borderWidth={0} animated={true} unfilledColor={'#FFF'} borderRadius={0} /> : null }
        </View>
      )
    }
}

const styles = StyleSheet.create({
  header:{
     height:50,
     flexDirection:'row',
     alignItems:'center',
     borderBottomWidth:1,
     borderColor:'#363a4f'
  },
  header_left:{
    justifyContent: 'center',
    height:50,
    padding:10,
  },
  header_center:{
     flex:1,
     justifyContent: 'center',
     alignItems: 'center',
  },
  header_right:{
    justifyContent: 'center',
    height:50,
    padding:10,
  },
  header_center_title:{
    color:'#FFF',
    fontFamily:'Roboto-Medium',
    fontSize:18,
    textAlign:'center'
  }
})
