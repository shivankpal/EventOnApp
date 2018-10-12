'use strict';
import React, { Component } from 'react';
import { View, Text,  Image,  TouchableOpacity,  ScrollView, StatusBar,  ActivityIndicator,  AsyncStorage, Dimensions, Switch, Linking,TouchableWithoutFeedback} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './Style';
const imageSource = {
      tick_icon : require(".././Assets/Img/pfile_tick.png"),
      edit_icon : require(".././Assets/Img/pencil_white.png"),
      facebook_icon: require(".././Assets/Img/social_facebook_g.png"),
      twitter_icon: require(".././Assets/Img/social_twitter_g.png"),
      linkedin_icon: require(".././Assets/Img/social_linkedin_g.png"),
      arrow_left: require(".././Assets/Img/arrow_left.png")
};
const {height, width} = Dimensions.get('window');

export default class Tabview extends Component {
    constructor(props) {
      super(props);
      this.state = {
          user:this.props.user,
          prefer: [],
          interest:[],
          comment:[],
          page:this.props.page,
          code:this.props.code,
          showAnimate:false,
          facebookConnection:[],
          events:[],
      }
      this.readmore = [];
      this.readmorebtn = [];
    }
    componentWillMount(){
      AsyncStorage.getItem('USER').then((user) => {
        if(user!=null) {
          let t = JSON.parse(user);
            this.setState({user:t,facebook:t.isfbconnected,twitter:t.istwitterconnected,linkedin:t.islinkedinconnected})
        }
      })
      AsyncStorage.getItem('MYEVENTS').then((data) => {
          if(data!=null){
              this.setState({events:JSON.parse(data)});
          }
      })
    }
    componentWillReceiveProps(nextProps){
        AsyncStorage.getItem('USER').then((user) => {
          if(user!=null) {
            let t = JSON.parse(user);
              this.setState({user:t,facebook:t.isfbconnected,twitter:t.istwitterconnected,linkedin:t.islinkedinconnected})
          }
        })
        this.setState({prefer:nextProps.prefer,interest:nextProps.interest,comment:nextProps.comment,page:nextProps.page,code:nextProps.code});
    }
    showPeople = (id) => {
        this.props.navigator.push({id:'PeopleDetail',showid:id,user:this.state.user});
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
                (this.state.events.length > 0) ?
                <View style={{marginBottom:20}}>
                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={{flex: 1}}
                        automaticallyAdjustContentInsets={false}
                        contentContainerStyle={{justifyContent:'center',alignItems:'center'}} >
                          {
                              this.state.events.map((o,i)=>{
                                  return (
                                    <Image key={i} borderRadius={10} source={{uri:o.image_cover}} style={{width:(width-100),height:150,marginRight:10,resizeMode:'cover'}}>
                                          <LinearGradient
                                              start={{x: 0.5, y: 0.25}} end={{x: 0.5, y: 1}}
                                              locations={[0,1]}
                                              colors={['rgba(0,0,0,0)','rgba(0,0,0,1)']}
                                              style={{flex:1,borderRadius:10}}>
                                              <TouchableWithoutFeedback onPress={()=>this.props.getEvents(o.id)}>
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
                (this.state.prefer.length > 0) ?
                <View>
                  <View style={{flexDirection:'row',marginTop:10}}>
                      <Text style={{fontFamily:'Roboto-Regular',color:'#9c9fa6',marginBottom:10,fontSize:12,flex:1}}>Industries of Interest</Text>
                      <TouchableOpacity style={styles.edit} onPress={() => this.props.navigator.push({id:'Prefer',prefer:true,optionid:3,user:this.state.user})}><Text style={styles.btntext}>Add more ></Text></TouchableOpacity>
                  </View>
                  <View style={{alignItems: 'center',flexDirection:'row',justifyContent:'flex-start',flexWrap:'wrap',margin:10}}>
                    {
                      this.state.prefer.map((o,i) => {
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
                  (this.state.interest.length > 0) ?
                  <View>
                      <View style={{flexDirection:'row',marginTop:10}}>
                          <Text style={{fontFamily:'Roboto-Regular',color:'#9c9fa6',marginBottom:10,fontSize:12,flex:1}}>Event Interests</Text>
                          <TouchableOpacity style={styles.edit} onPress={() => this.props.navigator.push({id:'Prefer',prefer:true,optionid:4,user:this.state.user}) }><Text style={styles.btntext}>Add more ></Text></TouchableOpacity>
                      </View>
                      <View style={{alignItems: 'center',flexDirection:'row',justifyContent:'flex-start',flexWrap:'wrap',margin:10}}>
                        {
                          this.state.interest.map((o,i) => {
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
            <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                  <Text style={{fontFamily:'Roboto-Regular',fontSize:14,color:'#CCC'}}>{"You didn't make any post"}</Text>
            </View>
          )
        }
      }
    }
}
