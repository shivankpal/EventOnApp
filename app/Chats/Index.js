'use strict';
import React, { Component } from 'react';
import { View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  AsyncStorage,
  TouchableOpacity,
  Dimensions,
  FlatList
  } from 'react-native';
import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';
import styles from './Style';
import Header from '.././Main/Header';
const imageSource = {
        profile_icon : require(".././Assets/Img/default_p.png"),
};
const {height, width} = Dimensions.get('window');
export default class Index extends Component {
    constructor(props) {
      super(props);
      this.state = {
          user:this.props.user,
          topevent:this.props.topevent,
          data: [],
          bot:[],
          loading:true,
          showload: true,
          animating: false,
      }
      this.execFunct;
      this.contentHeight = 0;
      this.page = 1;
    }
    componentWillMount() {
        this.props.googleTracker('CHATS');
        this.props.setCurrentScene('CHATS');
        setTimeout(()=>{ this.getData() },3000)
    }

    componentWillUnmount(){
      clearTimeout(this.execFunct);
    }

    getData = async () => {
      this.setState({animating:true});
      await fetch('https://api.eventonapp.com/api/chats/' + this.state.user.id+'/'+this.state.topevent.id+'/'+this.page, {
          method: 'GET'
       }).then((response) => response.json())
       .then((responseJson) => {
          let param = true;
          if (responseJson.data.others.length < 15) {
            param = false;
          }
          this.setState({
            bot: responseJson.data.bot,
            data: this.page === 1 ? responseJson.data.others : [...this.state.data, ...responseJson.data.others],
            loading: false,
            showload: param,
            animating: false,
          }, () => {
            this.page = this.page + 1;
            this.execFunct = setTimeout(() => { this.firstData() },5000);
          })
        }).catch((error) => { this.setState({ animating: false })  })
    }
    firstData = async () => {
       await fetch('https://api.eventonapp.com/api/reloadChat/'+this.state.user.id+'/'+this.state.topevent.id, {
          method: 'GET'
       }).then((response) => response.json())
       .then((responseJson) => {
         let chat = this.state.data;
         responseJson.data.others.map((o,i)=>{
            var index =  chat.findIndex(item => item.id === o.id);
            if(index >= 0)
            {
                chat.splice(index,1);
            }
         })
         this.setState({
                 data: responseJson.data.others.concat(chat),
                 bot: responseJson.data.bot
         });
         this.execFunct =  setTimeout(()=>{ this.firstData() },5000);
       }).catch((error) => {  })
    }
    moveToChat = (touser) => {
        Actions.Chat({touser: touser});
    }
    pushToChat = () => {
        Actions.ChatEvent({topevent: this.state.topevent});
    }
    renderRows = () => {
      return this.state.data.map((o,i) => {
          return (
            <TouchableOpacity key={o.id} onPress={() => { this.moveToChat(o) }} style={styles.row}>
              <View style={styles.left}>
                { (o.image!='') ? <Image borderRadius={5} source={{uri:o.image}} style={{width:70,height:70}}/> : <Image borderRadius={5} source={imageSource.profile_icon} style={{width:70,height:70}}/>}
              </View>
              <View style={styles.right}>
                <View style={{flexDirection:'row'}}>
                  <Text style={[styles.title,{flex:1}]}>{o.name}</Text>
                  <Text style={styles.date}>{o.ago}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                  <Text style={[styles.description,{flex:1}]}>{o.message}</Text>
                  {(o.unread > 0) ?
                  <View>
                      <View style={{backgroundColor:'red',borderRadius:20,overflow:'hidden'}}>
                          <Text style={{color:'#FFF',minWidth:20,fontSize:12,fontFamily:'Roboto-Medium',textAlign:'center',paddingVertical:3,paddingHorizontal:4}}>{o.unread}</Text>
                      </View>
                  </View>
                  :
                  null
                  }
                </View>
              </View>
            </TouchableOpacity>
          )
        })
    }
    showAnimating = () => {
      return (
        <ActivityIndicator
          style={styles.centering}
          color="#487597"
          size="large"
        />
      )
    }
    render () {
      if(this.state.loading){
        return (
            <LinearGradient
                start={this.state.topevent.theme.bg_gradient.start}
                end={this.state.topevent.theme.bg_gradient.end}
                locations={this.state.topevent.theme.bg_gradient.locations}
                colors={this.state.topevent.theme.bg_gradient.colors}
                style={{ flex: 1 }}
            >
                  <Header openDrawer={this.props.openDrawer} currentScene={"Chats"} topevent={this.props.topevent} user={this.props.user} sudonav={this.props.sudonav}/>
                  <View style={[styles.box,{flex:1,justifyContent:'center',alignItems:'center'}]}>
                      <ActivityIndicator
                        style={styles.centering}
                        color="#487597"
                        size="large"
                      />
                </View>
          </LinearGradient>
        )
      }

      return (
            <LinearGradient
                start={this.state.topevent.theme.bg_gradient.start}
                end={this.state.topevent.theme.bg_gradient.end}
                locations={this.state.topevent.theme.bg_gradient.locations}
                colors={this.state.topevent.theme.bg_gradient.colors}
                style={{ flex: 1 }}
            >
                <Header openDrawer={this.props.openDrawer} currentScene={"Chats"} topevent={this.props.topevent} user={this.props.user} sudonav={this.props.sudonav}/>
                <ScrollView
                  ref={ref => this.chat_box = ref}
                  removeClippedSubviews={true}
                  contentContainerStyle={{paddingBottom: 40, paddingTop: 20 }}
                >
                <Text style={{paddingHorizontal:20,paddingVertical:10,color:'#EAEAEA',backgroundColor:'rgba(9,9,9,0.2)'}}>Organizer</Text>
                <View style={styles.box}>
                      <TouchableOpacity onPress={() => { this.pushToChat() }} style={styles.row}>
                        <View style={styles.left}>
                          { (this.state.bot.image_small!='') ? <Image borderRadius={5} source={{uri:this.state.bot.image_small}} style={{width:70,height:70}}/> : <Image borderRadius={5} source={imageSource.profile_icon} style={{width:70,height:70}}/>}
                        </View>
                        <View style={styles.right}>
                          <View style={{flexDirection:'row'}}>
                            <Text style={[styles.title,{flex:1}]}>{this.state.bot.title}</Text>
                            <Text style={styles.date}>{this.state.bot.ago}</Text>
                          </View>
                          <View style={{flexDirection:'row'}}>
                            <Text style={[styles.description,{flex:1}]}>{this.state.bot.message}</Text>
                            {
                              (this.state.bot.unread > 0) ?
                              <View>
                                  <View style={{backgroundColor:'red',borderRadius:20,overflow:'hidden'}}>
                                      <Text style={{color:'#FFF',minWidth:20,fontSize:12,fontFamily:'Roboto-Medium',textAlign:'center',paddingVertical:3,paddingHorizontal:4}}>{this.state.bot.unread}</Text>
                                  </View>
                              </View>
                              :
                              null
                            }
                          </View>
                        </View>
                      </TouchableOpacity>
                </View>
                { (this.state.data.length>0) ?
                    <View>
                          <Text style={{paddingHorizontal:20,paddingVertical:10,color:'#EAEAEA',backgroundColor:'rgba(9,9,9,0.2)',marginBottom:10}}>Others</Text>

                          <View style={{paddingHorizontal:10}}>
                              <View style={{ backgroundColor: '#FFF', padding: 5, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}></View>
                              <View style={{ backgroundColor: '#FFF' }}>
                                  { this.renderRows() }
                              </View>
                              <View style={{ backgroundColor: '#FFF', padding: 5, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, marginBottom: 40 }}></View>
                              {
                                (this.state.showload && (this.state.loading == false)) ?
                                  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    {
                                      (this.state.animating) ? this.showAnimating() :
                                        <TouchableOpacity style={{ backgroundColor: '#FFF', paddingHorizontal: 35, paddingVertical: 10, borderRadius: 20 }} onPress={() => this.getData()} >
                                          <Text style={{ textAlign: 'center', color: '#555' }}>Load More</Text>
                                        </TouchableOpacity>
                                    }
                                  </View>
                                  :
                                  null
                              }
                            </View>
                      </View>
                  : null }
                  </ScrollView>
            </LinearGradient>
      );
    }
}
