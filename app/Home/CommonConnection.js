'use strict';
import React, { Component } from 'react';
import { View,  Text,  Image,  ScrollView, StyleSheet,  TextInput,  ActivityIndicator, TouchableOpacity, AsyncStorage,Dimensions,BackHandler,TouchableWithoutFeedback,Modal  } from 'react-native';
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

export default class CommonConnection extends Component {
    constructor(props) {
      super(props);
      this.state = {
          user:this.props.user,
          topevent:this.props.topevent,
          data: [],
          loading:true,
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
    getData = async (id) => {
       await fetch('https://api.eventonapp.com/api/commonConnection/'+this.state.user.id+'/'+this.state.ouser.id, {
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
      this.props.navigator.push({id:'Chat',user:this.state.user,touser:touser,template:false});
    }
    showPeople = (id) => {
        Actions.PeopleData({showid:id,user:this.state.user});
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
         return (
             <View style={{height:250,justifyContent:'center',alignItems:'center',backgroundColor:'#FFF',padding:30,borderRadius:10}}>
               <Text style={{fontFamily:'Roboto-Medium',color:'#222',textAlign:'center',fontSize:16}}>No Common Connection</Text>
               <Text style={{fontFamily:'Roboto-Thin',color:'#000',textAlign:'center',marginTop:15,fontSize:12}}>You do not share any common connections!</Text>
             </View>
         )
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
              <Header openDrawer={this.props.openDrawer} currentScene={"Common Connection"} topevent={this.props.topevent} isback={true} sudonav={this.props.sudonav}/>
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
            <Header openDrawer={this.props.openDrawer} currentScene={"Common Connection"} topevent={this.props.topevent} isback={true} sudonav={this.props.sudonav}/>
              <ScrollView>
                  <View style={[styles.box,{marginBottom:90}]}>
                      <View style={{marginTop:10}}>
                          {this.renderRows()}
                      </View>
                  </View>
              </ScrollView>
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
