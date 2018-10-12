'use strict';
import React, { Component } from 'react';
import { View, Text,  Image, Modal,  TouchableOpacity, TouchableWithoutFeedback,  ScrollView, StatusBar,  ActivityIndicator,  AsyncStorage, Dimensions, Switch, Linking} from 'react-native';
import styles from './Style';
import LinearGradient from 'react-native-linear-gradient';
import Swiper from 'react-native-swiper';
const imageSource = {
      tick_icon : require(".././Assets/Img/pfile_tick.png"),
      tick_icon_green : require(".././Assets/Img/pfile_tick_green.png"),
      edit_icon : require(".././Assets/Img/pencil_white.png"),
      facebook_icon: require(".././Assets/Img/social_facebook_g.png"),
      twitter_icon: require(".././Assets/Img/social_twitter_g.png"),
      linkedin_icon: require(".././Assets/Img/social_linkedin_g.png"),
      arrow_left: require(".././Assets/Img/arrow_left.png")
};
const {height, width} = Dimensions.get('window');

export default class PeopleTabview extends Component {
    constructor(props) {
      super(props);
      this.state = {
          data:this.props.data,
          common_interest: this.props.data.common_interest,
          other_interest:this.props.data.other_interest,
          comment:this.props.data.comment,
          common_events:this.props.data.common_events,
          other_events:this.props.data.other_events,
          common_people:this.props.data.common_people,
          page:this.props.page,
      }
      this.readmore = [];
      this.readmorebtn = [];
    }
    componentWillReceiveProps(nextProps){
        this.setState({
                      prefer:nextProps.data.prefer,
                      interest:nextProps.data.interest,
                      comment:nextProps.data.comment,
                      page:nextProps.page,
                      common_events:nextProps.data.common_events,
                      other_events:nextProps.data.other_events,
                      common_people:nextProps.data.common_people
                });
    }
    expandMore = (id) => {
      this.readmore[id].setNativeProps({
        numberOfLines:0
      })
      this.readmorebtn[id].setNativeProps({
          style:{
            width:0,
            height:0,
          }
      })
    }
    render () {
      if(this.state.page=='EVENTS')
      {
          return (
              <View style={{flex:1}}>
                {
                  (this.state.common_events.length > 0) ?
                  <View style={{marginBottom:20}}>
                        <Text style={{fontFamily:'Roboto-Regular',color:'#9c9fa6',marginBottom:20,fontSize:12}}>Common Events</Text>
                          <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            style={{flex: 1}}
                            automaticallyAdjustContentInsets={false}
                            contentContainerStyle={{justifyContent:'center',alignItems:'center'}} >
                              {
                                  this.state.common_events.map((o,i)=>{
                                      return (
                                        <Image key={i} borderRadius={10} source={{uri:o.image_cover}} style={{width:(width-100),height:150,marginRight:10,resizeMode:'cover'}}>
                                              <LinearGradient
                                                  start={{x: 0.5, y: 0.25}} end={{x: 0.5, y: 1}}
                                                  locations={[0,1]}
                                                  colors={['rgba(0,0,0,0)','rgba(0,0,0,1)']}
                                                  style={{flex:1,borderRadius:10}}>
                                                  <TouchableWithoutFeedback onPress={()=>this.props.getEvents(o)} >
                                                    <View style={{justifyContent:'flex-end',flex:1,borderBottomLeftRadius:10,borderBottomRightRadius:10}}>
                                                        <Text style={{borderBottomLeftRadius:10,borderBottomRightRadius:10,color:'#EAEAEA',padding:10,fontFamily:'Roboto-Regular',fontSize:14,backgroundColor:'transparent'}}>{o.title}</Text>
                                                    </View>
                                                  </TouchableWithoutFeedback>
                                              </LinearGradient>
                                        </Image>
                                      )
                                  })
                              }
                          </ScrollView>
                      </View>
                      :
                      null
                }
                {
                  (this.state.other_events.length > 0) ?
                  <View style={{marginBottom:20}}>
                        <Text style={{fontFamily:'Roboto-Regular',color:'#9c9fa6',marginBottom:20,fontSize:12}}>Other Events</Text>
                          <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            style={{flex: 1}}
                            automaticallyAdjustContentInsets={false}
                            contentContainerStyle={{justifyContent:'center',alignItems:'center'}} >
                              {
                                  this.state.other_events.map((o,i)=>{
                                      return (
                                        <Image key={i} borderRadius={10} source={{uri:o.image_cover}} style={{width:(width-100),height:150,marginRight:10,resizeMode:'cover'}}>
                                              <LinearGradient
                                                  start={{x: 0.5, y: 0.25}} end={{x: 0.5, y: 1}}
                                                  locations={[0,1]}
                                                  colors={['rgba(0,0,0,0)','rgba(0,0,0,1)']}
                                                  style={{flex:1,borderRadius:10}}>
                                                  <TouchableWithoutFeedback onPress={()=>this.props.getEvents(o)} >
                                                    <View style={{justifyContent:'flex-end',flex:1,borderBottomLeftRadius:10,borderBottomRightRadius:10}}>
                                                        <Text style={{borderBottomLeftRadius:10,borderBottomRightRadius:10,color:'#EAEAEA',padding:10,fontFamily:'Roboto-Regular',fontSize:14,backgroundColor:'transparent'}}>{o.title}</Text>
                                                    </View>
                                                  </TouchableWithoutFeedback>
                                              </LinearGradient>
                                        </Image>
                                      )
                                  })
                              }
                          </ScrollView>
                      </View>
                      :
                      null
                }
                </View>
          )
      }
      if(this.state.page=='TAGS')
      {
        return (
          <View>
            {
                (this.state.common_interest.length > 0) ?
                <View>
                  <View style={{flexDirection:'row',marginTop:10}}>
                      <Text style={{fontFamily:'Roboto-Regular',color:'#9c9fa6',marginBottom:10,fontSize:12,flex:1}}>Common Interest</Text>
                  </View>
                  <View style={{alignItems: 'center',flexDirection:'row',justifyContent:'flex-start',flexWrap:'wrap',marginHorizontal:10}}>
                    {
                      this.state.common_interest.map((o,i) => {
                        return (
                          <View key={i} style={{justifyContent:'center',alignItems:'center',padding:7,borderWidth:1,borderColor:'#27ccc0',backgroundColor:'#27ccc0',margin:5,borderRadius:5,flexDirection:'row'}}>
                              <Text style={{color:'#FFF',fontFamily:'Roboto-Regular',fontSize:12,marginRight:5}}>{o.parameter}</Text>
                              <Image ref={'TICK'+o.id} source={imageSource.tick_icon} style={{width:12,height:12}} />
                          </View>
                        )
                      })
                    }
                  </View>
                </View>
                : null
              }
              {
                  (this.state.other_interest.length > 0) ?
                  <View>
                      <View style={{flexDirection:'row',marginTop:10}}>
                          <Text style={{fontFamily:'Roboto-Regular',color:'#9c9fa6',marginBottom:10,fontSize:12,flex:1}}>Other Interests</Text>
                      </View>
                      <View style={{alignItems: 'center',flexDirection:'row',justifyContent:'flex-start',flexWrap:'wrap',marginHorizontal:10}}>
                        {
                          this.state.other_interest.map((o,i) => {
                            return (
                              <View key={i} style={{justifyContent:'center',alignItems:'center',padding:7,borderWidth:1,borderColor:'#27ccc0',margin:5,borderRadius:5,flexDirection:'row'}}>
                                  <Text style={{color:'#27ccc0',fontFamily:'Roboto-Regular',fontSize:12,marginRight:5}}>{o.parameter}</Text>
                                  <Image ref={'TICK'+o.id} source={imageSource.tick_icon_green} style={{width:12,height:12}} />
                              </View>
                            )
                          })
                        }
                      </View>
                  </View>
                  : null
              }
          </View>
        )
      }
      if(this.state.page=='POSTS')
      {
          if(this.state.comment.length > 0){
            return (
              <View>
                {
                   this.state.comment.map((o,i) => {
                        return (
                          <View key={i} style={{borderBottomWidth:1,borderBottomColor:'#3E4556',paddingVertical:10,flexDirection:'row'}}>
                              <Image source={{uri:o.image_small}} style={{width:60,height:60,borderRadius:30,marginRight:10}}/>
                              <View style={{flex:1}}>
                                    <View style={{flex:1,flexDirection:'row'}}>
                                        <Text style={{flex:1,fontFamily:'Roboto-Medium',fontSize:14,color:'#CCC'}}>{o.title}</Text>
                                        <Text style={{fontFamily:'Roboto-Thin',fontSize:10,color:'#999'}}>{o.ago}</Text>
                                    </View>
                                    <View>
                                        <Text style={{fontFamily:'Roboto-Regular',fontSize:11,color:'#9c9fa6'}} ref={e => (this.readmore[o.id] = e)}  numberOfLines={2}>{o.content}</Text>
                                        {
                                           ((o.content.match(new RegExp("\n", "g")) || []).length > 1 || o.content.length > 60 )  ?
                                           <View style={{alignItems:'flex-end'}} ref={e => (this.readmorebtn[o.id] = e)}>
                                               <TouchableOpacity onPress={()=>this.expandMore(o.id)} style={{justifyContent:'center',alignItems:'center'}}>
                                                   <Text style={{fontSize:11,fontFamily:'Roboto-Medium',color:'#9c9fa6'}}>Read More</Text>
                                               </TouchableOpacity>
                                           </View>
                                           :
                                           null
                                        }
                                        { (o.media!=null) ? <TouchableOpacity onPress={()=>this.props.showmap(o.media)}><Image source={{uri:o.media}} style={{height:150,width:undefined,flex:1,resizeMode:'cover'}}/></TouchableOpacity> : null }
                                    </View>
                              </View>
                          </View>
                        )
                   })
                }
              </View>
            )
        }
        else {
          return (
            <View style={{justifyContent:'center',alignItems:'center',flex:1,backgroundColor:'#FFF',margin:30,borderRadius:10}}>
                <Text style={{fontFamily:'Roboto-Medium',color:'#222',textAlign:'center',fontSize:16}}>Sigh... Its Empty!</Text>
                <Text style={{fontFamily:'Roboto-Thin',color:'#000',textAlign:'center',marginTop:15,fontSize:12}}>{"You haven't made any post yet."}</Text>
            </View>
          )
        }
      }
      return null;
    }
}
