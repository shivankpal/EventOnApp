'use strict';
import React, { Component } from 'react';
import { View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  StyleSheet,
  AsyncStorage,
  ActivityIndicator,
  Dimensions
  } from 'react-native';
  import {
    GoogleAnalyticsTracker,
    GoogleTagManager,
    GoogleAnalyticsSettings
  } from 'react-native-google-analytics-bridge';
import LinearGradient from 'react-native-linear-gradient';
import {Actions} from 'react-native-router-flux';
import styles from '.././Assets/Styles/Home';
import Header from './Header';

import Info from '.././Home/Info.js';
import Schedule from '.././Home/Schedule.js';
import Sponsors from '.././Home/Sponsors.js';
import Feeds from '.././Home/Feeds.js';
import People from '.././Home/People.js';

const HEADER_MAX_HEIGHT = 60;
const HEADER_MIN_HEIGHT = 22;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const imageSource = {
        info : require(".././Assets/Img/wicon_1.png"),
        schedule : require(".././Assets/Img/wicon_2.png"),
        sponsors : require(".././Assets/Img/wicon_3.png"),
        feeds : require(".././Assets/Img/wicon_4.png"),
        people : require(".././Assets/Img/wicon_5.png"),
        d_info : require(".././Assets/Img/icon_1.png"),
        d_schedule : require(".././Assets/Img/icon_2.png"),
        d_sponsors : require(".././Assets/Img/icon_3.png"),
        d_feeds : require(".././Assets/Img/icon_4.png"),
        d_people : require(".././Assets/Img/icon_5.png"),
}
const {height, width} = Dimensions.get('window');
export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
        user:this.props.user,
        topevent:this.props.topevent,
        data: <Info topevent={this.props.topevent} user={this.props.user} googleTracker={this.props.googleTracker} setCurrentScene={this.props.setCurrentScene} sudonav={this.props.sudonav}  />,
        loading: false,
        activeTab:'Info',
        scrollY: new Animated.Value(0),
        ani: new Animated.Value(0),
        fabs: [
          new Animated.Value(0),
          new Animated.Value(0),
          new Animated.Value(0)
        ],
    }
    this.open = false;
    this.tabClick = this.tabClick.bind(this);
  }
  findAndReplace = (string, target, replacement) => {
       var i = 0, length = string.length;
       for (i; i < length; i++) {
         string = string.replace(target, replacement);
       }
       return string;
  }
  componentDidMount(){
    if(this.props.movetotab)
    {
        setTimeout(()=>{this.tabClick(this.props.movetotab)},800);
    }
    if(this.props.deeplink)
    {
        setTimeout(() => {
            var str = this.findAndReplace(this.props.deeplink[1],'_',' ');
            this.pushScreens(str);
        },800)
    }
  }
  pushScreens = (path) => {
    switch (path) {
      case 'Event_Home':
        this.tabClick('Event_Home')
        break;
      case 'Event Notes':
          Actions.Notes();
          break;
      case 'Event Business Cards':
          Actions.Businesscards();
          break;
      case 'Chats':
          Actions.Chats();
          break;
      case 'Pollsnsurveys':
          Actions.Pollsnsurveys();
          break;
      case 'Logistics':
          Actions.Logistics();
          break;
      case 'Photos':
          Actions.Photos();
          break;
      case 'Downloads':
          Actions.Downloads();
          break;
      case 'Notifications':
          Actions.Notifications();
          break;
      case 'ChatEvent':
          Actions.ChatEvent();
          break;
      case 'SponsorOffer':
          Actions.SponsorOffer();
          break;
      case 'Meetup':
          Actions.Meetup();
          break;
      case 'EventNetwork':
          Actions.EventNetwork();
          break;
      default:
          this.tabClick(path)
    }
  }
  tabClick = (v) => {
      //this.setState({ data: null});
      if(v=='Info'||v=='Event_Home'){
          this.setState({  data: <Info topevent={this.state.topevent} user={this.state.user} googleTracker={this.props.googleTracker} setCurrentScene={this.props.setCurrentScene}  sudonav={this.props.sudonav}/>,activeTab:'Info' });
      }
      else if (v=='Schedule') {
        this.setState({  data: <Schedule topevent={this.state.topevent} user={this.state.user} googleTracker={this.props.googleTracker}  setCurrentScene={this.props.setCurrentScene} sudonav={this.props.sudonav}/>,activeTab:'Schedule' });
      }
      else if (v=='Offers') {
        this.setState({  data: <Sponsors topevent={this.state.topevent} user={this.state.user} googleTracker={this.props.googleTracker} setCurrentScene={this.props.setCurrentScene} sudonav={this.props.sudonav}/>,activeTab:'Offers' });
      }
      else if (v=='Feeds') {
         this.setState({  data: <Feeds topevent={this.state.topevent} user={this.state.user} googleTracker={this.props.googleTracker} setCurrentScene={this.props.setCurrentScene} sudonav={this.props.sudonav}/>,activeTab:'Feeds' });
      }
      else if (v=='Network') {
         this.setState({  data: <People topevent={this.state.topevent} user={this.state.user}  googleTracker={this.props.googleTracker} setCurrentScene={this.props.setCurrentScene} sudonav={this.props.sudonav}/>,activeTab:'Network' });
      }
      else{
        this.setState({  data: <Info topevent={this.state.topevent} user={this.state.user} googleTracker={this.props.googleTracker} setCurrentScene={this.props.setCurrentScene}  sudonav={this.props.sudonav}/>,activeTab:'Info' });
      }
  }
  render() {
    const headerHeight = this.state.scrollY.interpolate({
       inputRange: [0, HEADER_SCROLL_DISTANCE],
       outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
       extrapolate: 'clamp',
    })
    const imageOpacity = this.state.scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
        outputRange: [1, 1, 0],
        extrapolate: 'clamp',
    })
    const imageTranslate = this.state.scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [0, -50],
        extrapolate: 'clamp',
    })
    const backgroundInterpolate = this.state.ani.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgb(90,34,153)','rgb(36,11,63)']
    })
    const backgroundStyle = {   backgroundColor: backgroundInterpolate  }
    const backgroundColorInterpolate = this.state.ani.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgb(90,34,153)','rgb(36,11,63)']
    })
    const buttonRotate = this.state.ani.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg','135deg']
    })
    const buttonStyle = {
        backgroundColor: backgroundColorInterpolate,
        transform: [{
          rotate: buttonRotate
        }]
    }
    if(this.state.loading){
      return (
          <View style={{flex:1,height:300,justifyContent:'center',alignItems:'center'}}>
              <Header openDrawer={this.props.openDrawer} currentScene={this.state.activeTab} topevent={this.props.topevent} user={this.state.user} sudonav={this.props.sudonav}/>
              <ActivityIndicator
                style={styles.centering}
                color="white"
                size="large"
              />
        </View>
      );
    }

    return (
        <LinearGradient
            start={this.state.topevent.theme.bg_gradient.start}
            end={this.state.topevent.theme.bg_gradient.end}
            locations={this.state.topevent.theme.bg_gradient.locations}
            colors={this.state.topevent.theme.bg_gradient.colors}
            style={{ flex: 1 }}
        >
        <Header openDrawer={this.props.openDrawer} currentScene={this.state.activeTab} topevent={this.props.topevent} user={this.state.user} sudonav={this.props.sudonav}/>
        <View style={styles.main} >
            <ScrollView
                removeClippedSubviews={true}
                scrollEventThrottle={30}
                keyboardShouldPersistTaps="always"
                onScroll={ Animated.event(
                  [{nativeEvent: {contentOffset: { y: this.state.scrollY }}}]
                )}
                style={{marginTop:20}}
            >
              {this.state.data}
            </ScrollView>
            <Animated.View style={{flexDirection:'row',height: headerHeight,position: 'absolute',top: 0,left: 0,right: 0,overflow: 'hidden',backgroundColor:'transparent'}}>

                  <TouchableOpacity style={{flex:1,alignItems:'center',justifyContent:'flex-end'}} onPress={() => { this.tabClick('Info') } }>
                      {(this.state.activeTab=='Info') ? <Animated.Image style={[nstyles.bgImage,{opacity: imageOpacity, transform: [{translateY: imageTranslate}]}]} source={imageSource.info}/> : <Animated.Image style={[nstyles.bgImage,{opacity: imageOpacity, transform: [{translateY: imageTranslate}]}]} source={imageSource.d_info}/>  }
                      {(this.state.activeTab=='Info') ? <Text style={{color:'#FFF',fontFamily:'Roboto-Medium',fontSize:11,marginBottom:5}}>INFO</Text> : <Text style={{color:'#808080',fontFamily:'Roboto-Medium',fontSize:11,marginBottom:5}}>INFO</Text> }
                  </TouchableOpacity>

                  <TouchableOpacity style={{flex:1,alignItems:'center',justifyContent:'flex-end'}} onPress={() => {this.tabClick('Schedule') } }>
                      {(this.state.activeTab=='Schedule') ? <Animated.Image style={[nstyles.bgImage,{opacity: imageOpacity, transform: [{translateY: imageTranslate}]}]} source={imageSource.schedule}/> : <Animated.Image style={[nstyles.bgImage,{opacity: imageOpacity, transform: [{translateY: imageTranslate}]}]} source={imageSource.d_schedule}/> }
                      {(this.state.activeTab=='Schedule') ? <Text style={{color:'#FFF',fontFamily:'Roboto-Medium',fontSize:11,marginBottom:5}}>SCHEDULE</Text> : <Text style={{color:'#808080',fontFamily:'Roboto-Medium',fontSize:11,marginBottom:5}}>SCHEDULE</Text> }
                  </TouchableOpacity>

                  <TouchableOpacity style={{flex:1,alignItems:'center',justifyContent:'flex-end'}}  onPress={() => {this.tabClick('Offers') } }>
                      {(this.state.activeTab=='Offers') ? <Animated.Image style={[nstyles.bgImage,{opacity: imageOpacity, transform: [{translateY: imageTranslate}]}]} source={imageSource.sponsors}/> : <Animated.Image style={[nstyles.bgImage,{opacity: imageOpacity, transform: [{translateY: imageTranslate}]}]} source={imageSource.d_sponsors}/> }
                      {(this.state.activeTab=='Offers') ? <Text style={{color:'#FFF',fontFamily:'Roboto-Medium',fontSize:11,marginBottom:5}}>OFFERS</Text> : <Text style={{color:'#808080',fontFamily:'Roboto-Medium',fontSize:11,marginBottom:5}}>OFFERS</Text> }
                  </TouchableOpacity>

                  <TouchableOpacity style={{flex:1,alignItems:'center',justifyContent:'flex-end'}}  onPress={() => {this.tabClick('Feeds') } }>
                    {(this.state.activeTab=='Feeds') ? <Animated.Image style={[nstyles.bgImage,{opacity: imageOpacity, transform: [{translateY: imageTranslate}]}]} source={imageSource.feeds}/> : <Animated.Image style={[nstyles.bgImage,{opacity: imageOpacity, transform: [{translateY: imageTranslate}]}]} source={imageSource.d_feeds}/> }
                    {(this.state.activeTab=='Feeds') ? <Text style={{color:'#FFF',fontFamily:'Roboto-Medium',fontSize:11,marginBottom:5}}>FEEDS</Text> : <Text style={{color:'#808080',fontFamily:'Roboto-Medium',fontSize:11,marginBottom:5}}>FEEDS</Text>}
                  </TouchableOpacity>

                  <TouchableOpacity style={{flex:1,alignItems:'center',justifyContent:'flex-end'}}  onPress={() => {this.tabClick('Network') } }>
                      {(this.state.activeTab=='Network') ? <Animated.Image style={[nstyles.bgImage,{opacity: imageOpacity, transform: [{translateY: imageTranslate}]}]} source={imageSource.people}/> : <Animated.Image style={[nstyles.bgImage,{opacity: imageOpacity, transform: [{translateY: imageTranslate}]}]} source={imageSource.d_people}/>}
                      {(this.state.activeTab=='Network') ? <Text style={{color:'#FFF',fontFamily:'Roboto-Medium',fontSize:11,marginBottom:5}}>NETWORK</Text> : <Text style={{color:'#808080',fontFamily:'Roboto-Medium',fontSize:11,marginBottom:5}}>NETWORK</Text> }
                  </TouchableOpacity>
            </Animated.View>
        </View>
      </LinearGradient>
    );
 }
}

const nstyles = StyleSheet.create({
  bgImage: {
     position: 'absolute',
     top: 0,
     width: 40,
     height: 40,
     padding:10,
     marginBottom:10,
     alignItems:'center',
   }
});
