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
  FlatList,
  StyleSheet,
  } from 'react-native';
import { Actions } from 'react-native-router-flux';
import CustomStatusBar from '.././Common/CustomStatusBar';
const imageSource = {
        profile_icon : require(".././Assets/Img/default_p.png"),
        arrow_left: require(".././Assets/Img/arrow_left.png"),
        home: require(".././Assets/Img/ico_home.png"),
};
const {height, width} = Dimensions.get('window');
export default class ChatList extends Component {
    constructor(props) {
      super(props);
      this.state = {
          user:this.props.user,
          data: [],
          loading:true,
          showload: true,
          animating: false,
      }
      this.page = 1;
      this.execFunct;
      this.contentHeight = 0;
    }
    componentWillMount() {
        setTimeout(()=>{ this.getData() },3000)
    }
    componentWillUnmount(){
      clearTimeout(this.execFunct);
    }
    componentWillReceiveProps(nextProps){
        this.firstData();
    }
    pushBack = () => {
      this.props.navigator.pop();
    }
    getData = async () => {
      this.setState({animating:true});
       await fetch('https://api.eventonapp.com/api/chats/'+this.state.user.id+'/0/'+this.page, {
          method: 'GET'
       }).then((response) => response.json())
       .then((responseJson) => {
         let param = true;
         if (responseJson.data.others.length < 15) {
           param = false;
         }
         this.setState({
           data: this.page === 1 ? responseJson.data.others : [...this.state.data, ...responseJson.data.others],
           loading: false,
           showload: param,
           animating: false,
         }, () => {
           this.page = this.page + 1;
           this.execFunct = setTimeout(() => { this.firstData() }, 5000);
         })
       }).catch((error) => {  })
    }
    firstData = async () => {
      await fetch('https://api.eventonapp.com/api/reloadChat/'+this.state.user.id+'/0', {
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
                 data: responseJson.data.others.concat(chat)
         });
       }).catch((error) => {  })
    }
    refreshChat = (toid) => {
        let chats = this.state.data;
        var index = chats.map(function (o) { return o.id; }).indexOf(toid);
        if(index >= 0)
        {
            chats.splice(index,1);
            this.setState({data:chats});
        }
    }
    moveToChat = (touser) => {
        this.props.navigator.push({id:'Chat',user:this.state.user,touser:touser,template:false,refreshChat:this.refreshChat.bind(this)});
    }
    renderRows = () => {
      return this.state.data.map((o,i)=>{
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
    moveToHome = () => {
      this.props.navigator.push({id:'Myhome', user:this.state.user,events:this.props.events});
    }
    render() {
      if(this.state.loading){
        return (
            <View style={{flex:1,backgroundColor:'#292E39'}}>
                <CustomStatusBar backgroundColor="#292E39" barStyle="light-content"/>
                  <View style={styles.header}>
                      <View style={styles.header_left}>
                        {
                          (this.props.ishome) ?
                            <TouchableOpacity onPress={()=>this.moveToHome()}>
                                <Image source={imageSource.home} style={{width:30,height:30}}></Image>
                            </TouchableOpacity>
                          :
                            <TouchableOpacity onPress={()=>this.pushBack()}>
                                <Image source={imageSource.arrow_left} style={{width:30,height:30}}></Image>
                            </TouchableOpacity>
                        }
                      </View>
                      <View style={styles.header_center}>
                          <Text style={[styles.header_center_title,{color:'#9c9fa6'}]} ellipsizeMode={'tail'}  numberOfLines={1}>Chats</Text>
                      </View>
                      <View style={styles.header_right}>
                        <View style={{width:30,height:30}}>
                        </View>
                      </View>
                  </View>
                  <View style={{height:250,justifyContent:'center',alignItems:'center',backgroundColor:'#FFF',padding:30,borderRadius:10,margin:10}}>
                      <ActivityIndicator
                        style={styles.centering}
                        color="#487597"
                        size="large"
                      />
                </View>
          </View>
        )
      }
      if(this.state.data.length==0){
        return (
            <View style={{flex:1,backgroundColor:'#292E39'}}>
                <CustomStatusBar backgroundColor="#292E39" barStyle="light-content"/>
                  <View style={styles.header}>
                      <View style={styles.header_left}>
                          {
                            (this.props.ishome) ?
                              <TouchableOpacity onPress={()=>this.moveToHome()}>
                                  <Image source={imageSource.home} style={{width:30,height:30}}></Image>
                              </TouchableOpacity>
                            :
                              <TouchableOpacity onPress={()=>this.pushBack()}>
                                  <Image source={imageSource.arrow_left} style={{width:30,height:30}}></Image>
                              </TouchableOpacity>
                          }
                      </View>
                      <View style={styles.header_center}>
                          <Text style={[styles.header_center_title,{color:'#9c9fa6'}]} ellipsizeMode={'tail'}  numberOfLines={1}>Chats</Text>
                      </View>
                      <View style={styles.header_right}>
                        <View style={{width:30,height:30}}>
                        </View>
                      </View>
                  </View>
                  <View style={{height:250,justifyContent:'center',alignItems:'center',backgroundColor:'#FFF',padding:30,borderRadius:10,margin:10}}>
                      <Text style={{fontFamily:'Roboto-Medium',color:'#222',textAlign:'center',fontSize:16}}>Sigh... Its Empty!</Text>
                      <Text style={{fontFamily:'Roboto-Thin',color:'#000',textAlign:'center',marginTop:15,fontSize:12}}>You have not added/made any chat</Text>
                  </View>
          </View>
        )
      }

      return (
            <View style={{flex:1,backgroundColor:'#292E39'}}>
                <CustomStatusBar backgroundColor="#292E39" barStyle="light-content"/>
                <View style={styles.header}>
                    <View style={styles.header_left}>
                        {
                          (this.props.ishome) ?
                            <TouchableOpacity onPress={()=>this.moveToHome()}>
                                <Image source={imageSource.home} style={{width:30,height:30}}></Image>
                            </TouchableOpacity>
                          :
                            <TouchableOpacity onPress={()=>this.pushBack()}>
                                <Image source={imageSource.arrow_left} style={{width:30,height:30}}></Image>
                            </TouchableOpacity>
                        }
                    </View>
                    <View style={styles.header_center}>
                        <Text style={[styles.header_center_title,{color:'#9c9fa6'}]} ellipsizeMode={'tail'}  numberOfLines={1}>Chats</Text>
                    </View>
                    <View style={styles.header_right}>
                      <View style={{width:30,height:30}}>
                      </View>
                    </View>
                </View>
                <ScrollView
                  ref={ref => this.chat_box = ref}
                  removeClippedSubviews={true}
                  contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 40, paddingTop: 20 }}
                  >
                    <View>
                      <View style={{ backgroundColor: '#FFF', padding: 5, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}></View>
                        <View style={{ backgroundColor: '#FFF' }}>
                        { this.renderRows() }
                        </View>
                      <View style={{ backgroundColor: '#FFF', padding: 5, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, marginBottom: 40 }}></View>
                    </View>
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
                </ScrollView>
            </View>
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
    margin:10,
    borderRadius:10,
    backgroundColor:'#FFF',
 },
 row:{
   marginRight:10,
   marginLeft:10,
   paddingTop:10,
   paddingBottom:10,
   borderBottomWidth:1,
   borderBottomColor:'#EAEAEA',
   flexDirection:'row',
 },
 left:{
   width:80,
 },
 right:{
   flex:1,
 },
 title:{
   color: '#222',
   fontSize:14,
   fontFamily:'Roboto-Bold',
 },
 date:{
   color: '#666',
   fontSize:12,
   fontFamily:'Roboto-Regular',
 },
 description:{
   color: '#666',
   fontSize:12,
   marginTop:5,
   fontFamily:'Roboto-Regular',
 },
});
