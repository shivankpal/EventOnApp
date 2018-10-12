'use strict';
import React, { Component } from 'react';
import { View,  Text,  Image,  ScrollView, StyleSheet, TextInput,  ActivityIndicator, TouchableOpacity, AsyncStorage,Dimensions,BackHandler,TouchableWithoutFeedback,Modal,Alert  } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Actions,ActionConst } from 'react-native-router-flux';
import Header from '.././Main/Header';
const imageSource = {
          user_icon : require(".././Assets/Img/default_p.png"),
          chat_people_icon : require(".././Assets/Img/tac_3_2.png"),
          filter_icon : require(".././Assets/Img/filter.png"),
          search_icon : require(".././Assets/Img/search.png"),
          block_icon : require(".././Assets/Img/tac_10.png"),
          arrow_left: require(".././Assets/Img/arrow_left.png"),
};
const {height, width} = Dimensions.get('window');

export default class Index extends Component {
    constructor(props) {
      super(props);
      this.state = {
          user:this.props.user,
          topevent:this.props.topevent,
          data: [],
          loading:true,
          isModalVisible:false,
          filterTag:this.props.filterTag,
          ouser:[],
      }
      this.getData = this.getData.bind(this);
    }
    componentWillMount () {
      AsyncStorage.getItem('USER').then((ouser) => {
          if(ouser!=null)
          {
              this.setState({ouser:JSON.parse(ouser)});
          }
      })
      setTimeout(()=>{this.getData()},1000);
    }
    componentWillReceiveProps(){
        this.getData()
    }
    getData = async () => {
       this.setState({isModalVisible:false});
       await fetch('https://api.eventonapp.com/api/eventnetwork/'+this.state.user.id+"/"+this.state.topevent.id+'?filterTag='+this.state.filterTag+'&ouserid='+this.state.ouser.id, {
          method: 'GET'
       }).then((response) => response.json())
       .then((responseJson) => {
         this.setState({
           data: responseJson.data,
           loading:false
         });
       }).catch((error) => { });
    }
    moveToChat = (touser) => {
        Actions.Chat({touser: touser});
    }
    blockPeople = async (uid,toid) => {
      await fetch('https://api.eventonapp.com/api/blockpeople/'+uid+"/"+toid, {
         method: 'GET'
      }).then((response) => this.getData() )
      .catch((error) => {  });
    }

    showPeople = (id) => {
       if(this.state.ouser.id == id){
           Alert.alert('',
             'This action is taking you off the event - are you sure?',
             [
               {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
               {text: 'OK', onPress: () => this.props.sudonav.resetTo({id:'Profile', user:this.state.user, ishome:true})},
             ],
             { cancelable: false }
           )
       }
       else{
           Actions.PeopleData({showid:id});
       }
    }
    ChangeFilter = (tag) => {
      if(this.state.filterTag.length)
      {
          this.refs[this.state.filterTag].setNativeProps({
            style: {
              color: "transparent"
            }
          });
      }
      this.setState({filterTag:tag},()=>{
        this.refs[tag].setNativeProps({
          style: {
            color: "#6699FF"
          }
        });
      });
    }
    resetFilter = () => {
      if(this.state.filterTag.length)
      {
          this.refs[this.state.filterTag].setNativeProps({
            style: {
              color: "transparent"
            }
          });
      }
      this.setState({filterTag:''},()=>{
          this.getData();
      });
    }
    pushBack = () => {
      this.props.navigator.pop();
    }
    renderRows = () => {
      let len = this.state.data.length;
      if(len > 0 )
      {
        return this.state.data.map((o,i) => {
            let w = 1;
            if((len-1)==i)
            {
              w = 0;
            }
            return (
              <TouchableOpacity key={i} style={[styles.row,{borderBottomWidth:w}]} onPress={()=>this.showPeople(o.id)}>
                <View style={styles.left}>
                  { (o.image!='') ? <Image borderRadius={5} source={{uri:o.image}} style={{width:60,height:60}}/> : <Image borderRadius={5} source={imageSource.user_icon} style={{width:60,height:60}} /> }
                </View>
                <View style={styles.right}>
                    <View style={{flexDirection:'row'}}>
                        <View style={{flex:1}}>
                            <Text style={styles.name}>{o.name}</Text>
                            {(o.profession.trim()!='') ? <Text style={styles.profession}>{o.profession}</Text> : null }
                            {(o.location.trim()!='') ? <Text style={styles.location}>{o.location}</Text> : null }
                        </View>
                        { (this.props.hideaction) ? null :
                        <View style={{flexDirection:'row'}}>
                              <TouchableOpacity onPress={()=>{ this.blockPeople(this.state.user.id, o.id) }}>
                                <Image source={imageSource.block_icon} style={{width:30,height:30,marginRight:5,resizeMode:'contain'}} />
                              </TouchableOpacity>
                              <TouchableOpacity onPress={()=>{ this.moveToChat(o) }}>
                                <Image source={imageSource.chat_people_icon} style={{width:30,height:30,marginRight:5}} />
                              </TouchableOpacity>
                        </View>
                       }
                    </View>


                </View>
              </TouchableOpacity>
            )
          })
       }
       else{
         if(this.state.filterTag=='Following')
         {
           return (
             <View style={{height:250,justifyContent:'center',alignItems:'center',backgroundColor:'#FFF',padding:30,borderRadius:10}}>
               <Text style={{fontFamily:'Roboto-Medium',color:'#222',textAlign:'center',fontSize:16}}>Sigh Its Empty!</Text>
               <Text style={{fontFamily:'Roboto-Thin',color:'#000',textAlign:'center',marginTop:15,fontSize:12}}>You are not following anyone yet. </Text>
             </View>
           )
         }
         else if(this.state.filterTag=='Followers'){
            return (
              <View style={{height:250,justifyContent:'center',alignItems:'center',backgroundColor:'#FFF',padding:30,borderRadius:10}}>
                <Text style={{fontFamily:'Roboto-Medium',color:'#222',textAlign:'center',fontSize:16}}>No Followers</Text>
                <Text style={{fontFamily:'Roboto-Thin',color:'#000',textAlign:'center',marginTop:15,fontSize:12}}>You do not have anyone following you yet. </Text>
              </View>
            )
         }
         else{
           <View style={{height:250,justifyContent:'center',alignItems:'center',backgroundColor:'#FFF',padding:30,borderRadius:10}}>
             <Text style={{fontFamily:'Roboto-Medium',color:'#222',textAlign:'center',fontSize:16}}>No Connection</Text>
           </View>
         }
       }
    }
    render () {
      if(this.state.loading)
      {
          return (
            <LinearGradient
              start={this.state.topevent.theme.bg_gradient.start}
              end={this.state.topevent.theme.bg_gradient.end}
              locations={this.state.topevent.theme.bg_gradient.locations}
              colors={this.state.topevent.theme.bg_gradient.colors}
              style={{ flex: 1 }}
            >
                    <Header openDrawer={this.props.openDrawer} currentScene={"Event Network"} topevent={this.props.topevent} isback={true} sudonav={this.props.sudonav}/>
                    <View style={[styles.box,{flex:1,justifyContent:'center',alignItems:'center'}]}>
                        <ActivityIndicator
                          style={styles.centering}
                          color="#487597"
                          size="large"
                        />
                  </View>
              </LinearGradient>
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
            <Header openDrawer={this.props.openDrawer} currentScene={"Event Network"} topevent={this.props.topevent} isback={true} sudonav={this.props.sudonav}/>
              <ScrollView>
                  <View style={[styles.box,{marginBottom:90,backgroundColor:'#FFF'}]}>
                      <View style={{flexDirection:'row',padding:5,margin:5}}>
                          <View style={{flex:1,height:40,flexDirection:'row',borderWidth:0.3,borderColor:'#999',alignItems:'center',paddingLeft:5,borderRadius:5,backgroundColor:'#f0f0f0'}}>
                              <Image source={imageSource.search_icon} style={{width:20,height:20}}/>
                              <TextInput placeholder={"Search People"} underlineColorAndroid="transparent" style={{flex:1,height:40,fontFamily:'Roboto-Regular'}} />
                          </View>
                          <TouchableOpacity onPress={()=>this.setState({isModalVisible:true})} style={{backgroundColor:'#cfcfcf',width:40,height:40,justifyContent:'center',alignItems:'center',borderRadius:5,marginLeft:5}}>
                              <Image source={imageSource.filter_icon} style={{width:20,height:20}}/>
                          </TouchableOpacity>
                      </View>
                      {
                          (this.state.filterTag.length > 0) ?
                          <View style={{flexDirection:'row',paddingHorizontal:10}}>
                              <TouchableOpacity onPress={()=>{ this.setState({filterTag:''},()=>{ this.getData() }) }} style={{paddingHorizontal:5,paddingVertical:2,borderWidth:0.5,borderColor:'#888',flexDirection:'row',borderRadius:5,justifyContent:'center',alignItems:'center'}}>
                                  <Text style={{textAlign:'center',fontSize:12,marginRight:5}}>{this.state.filterTag}</Text>
                                  <Text style={{textAlign:'center',fontSize:12}}>&#x2716;</Text>
                              </TouchableOpacity>
                          </View>
                          : null
                      }
                      <View style={{marginTop:10}}>
                          {this.renderRows()}
                      </View>
                  </View>
              </ScrollView>
              <Modal
                  animationType={'slide'}
                  transparent={true}
                  visible={this.state.isModalVisible}
                  onRequestClose={() => { this.setState({
                      isModalVisible:!this.state.isModalVisible
                  });}}
                  >
                 <View style={{justifyContent:'center',alignItems:'center',flex:1,backgroundColor:'rgba(0,0,0,0.1)'}}>
                    <View style={{backgroundColor:'#FFF',borderRadius:5,width:width-60,elevation:3}}>
                          <View style={{borderBottomWidth:1,borderBottomColor:'#EAEAEA',padding:15,flexDirection:'row'}}>
                             <Text style={{color:'#6699FF',fontFamily:'Roboto-Medium',fontSize:15,flex:1}}>Filter Search Results</Text>
                             <TouchableOpacity onPress={()=>this.resetFilter()}>
                                 <Text style={{color:'#e85151',fontFamily:'Roboto-Regular',fontSize:13}}>Clear</Text>
                             </TouchableOpacity>
                          </View>
                          <View style={{padding:15}}>
                                <TouchableWithoutFeedback onPress={()=>this.ChangeFilter('Followers')}>
                                    <View style={{flexDirection:'row',justifyContent:'center',padding:5,margin:10}}>
                                        <Text style={{color:'#666',fontFamily:'Roboto-Regular',flex:1}}>Followers</Text>
                                        <View style={{borderWidth:0.5,paddingHorizontal:3,paddingVertical:0}}>
                                            { (this.state.filterTag=='Followers') ? <Text ref={"Followers"} style={{color:'#6699FF'}}>✔</Text> : <Text ref={"Followers"} style={{color:'transparent'}}>✔</Text> }
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={()=>this.ChangeFilter('Following')}>
                                    <View style={{flexDirection:'row',justifyContent:'center',padding:5,margin:10}}>
                                        <Text style={{color:'#666',fontFamily:'Roboto-Regular',flex:1}}>Following</Text>
                                        <View style={{borderWidth:0.5,paddingHorizontal:3,paddingVertical:0}}>
                                           { (this.state.filterTag=='Following') ? <Text ref={"Following"} style={{color:'#6699FF'}}>✔</Text> :  <Text ref={"Following"} style={{color:'transparent'}}>✔</Text> }
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                          </View>
                          <TouchableOpacity onPress={()=>this.getData()} style={{backgroundColor:'#6699FF',padding:15,borderBottomLeftRadius:5,borderBottomRightRadius:5}}>
                              <Text style={{color:'#FFF',fontFamily:'Roboto-Medium',textAlign:'center',fontSize:15}}>Apply</Text>
                          </TouchableOpacity>
                    </View>
                 </View>
              </Modal>
        </LinearGradient>
      )
    }
}
const styles = StyleSheet.create({
  container: {
      flex:1,
      backgroundColor:'#292E39'
  },
  centering: {
   alignItems: 'center',
   justifyContent: 'center',
   padding: 8,
 },
 header:{
    height:50,
    flexDirection:'row',
    backgroundColor:'transparent',
    paddingLeft:10,
    paddingRight:10,
    alignItems:'center',
 },
 header_left:{
   justifyContent: 'center',
   position:'absolute',
   top:0,
   left:0,
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
   position:'absolute',
   top:0,
   right:0,
   height:50,
   padding:10,
   flexDirection:'row',
 },
 header_center_title:{
   color:'#FFF',
   fontFamily:'Roboto-Medium',
   fontSize:18,
   textAlign:'center'
 },
 box: {
    margin:20,
    borderRadius:10,
    backgroundColor:'#FFF',
    padding:5,
 },
 row:{
   marginRight:10,
   marginLeft:10,
   paddingTop:10,
   paddingBottom:10,
   borderBottomWidth:1,
   borderBottomColor:'#EAEAEA',
   flexDirection:'row'
 },
 left:{
   marginRight:10
 },
 right:{
    flex:1
 },
 name:{
   color: '#000',
   fontSize: 16,
   fontFamily:'Roboto-Regular',
 },
 location:{
   color: '#666',
   fontSize:12,
   fontFamily:'Roboto-Regular',
 },
 role:{
   color: '#666',
   fontSize:12,
   fontFamily:'Roboto-Regular',
   backgroundColor:'#eaeaea',
   alignSelf:'flex-start',
   paddingVertical:3,
   paddingHorizontal:5,
 },
 profession:{
   color: '#666',
   fontSize:12,
   fontFamily:'Roboto-Medium',
 },
 btn_box:{
    flex:1,
    paddingTop:5,
    paddingBottom:5,
 },
 btn:{
   backgroundColor:'#6699ff',
   padding:10,
   alignSelf:'flex-end',
 },
 btnText:{
   backgroundColor:'#6699ff',
   color:'#FFF',
   fontFamily:'Roboto-Regular'
 }
});
