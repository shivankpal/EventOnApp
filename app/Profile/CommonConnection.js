'use strict';
import React, { Component } from 'react';
import { View,  Text,  Image,  ScrollView, StyleSheet,  TextInput,  ActivityIndicator, TouchableOpacity, AsyncStorage,Dimensions,BackHandler,TouchableWithoutFeedback,Modal  } from 'react-native';
import { Actions,ActionConst } from 'react-native-router-flux';
import CustomStatusBar from '.././Common/CustomStatusBar';
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
          data: [],
          loading:true,
          ouser:[],
          showload:true,
          animating:false,
      }
      this.getData = this.getData.bind(this);
      this.page = 1;
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
      this.setState({animating:true});
       await fetch('https://api.eventonapp.com/api/commonConnection/'+this.state.user.id+'/'+this.state.ouser.id+'/'+this.page, {
          method: 'GET'
       }).then((response) => response.json())
       .then((responseJson) => {
         let param = true;
         if(responseJson.data.length < 15)
         {
            param=false;
         }
         this.setState({
               data: this.page === 1 ? responseJson.data : [...this.state.data, ...responseJson.data],
               loading:false,
               showload:param,
               animating:false,
             },()=>{
               this.page = this.page + 1;
         })
       }).catch((error) => { });
    }
    moveToChat = (touser) => {
      this.props.navigator.push({id:'Chat',user:this.state.user,touser:touser,template:false});
    }
    showPeople = (id) => {
       if(this.state.ouser.id == id){
         this.props.navigator.push({id:'Profile',user:this.state.user})
       }
       else{
          this.props.navigator.push({id:'PeopleDetail',showid:id,user:this.state.user});
       }
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
      if(this.state.loading)
      {
        return (
            <View style={{flex:1,backgroundColor:'#292E39'}}>
                  <CustomStatusBar backgroundColor="#292E39" barStyle="light-content"/>
                  <View style={styles.header}>
                      <View style={styles.header_left}>
                        <TouchableOpacity onPress={()=>this.pushBack()}>
                            <Image source={imageSource.arrow_left} style={{width:30,height:30}}></Image>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.header_center}>
                          <Text style={[styles.header_center_title,{color:'#9c9fa6'}]} ellipsizeMode={'tail'}  numberOfLines={1}>Common Connections</Text>
                      </View>
                      <View style={styles.header_right}>
                        <View style={{width:30,height:30}}>
                        </View>
                      </View>
                  </View>
                  <View style={[styles.box,{flex:1,justifyContent:'center',alignItems:'center'}]}>
                      <ActivityIndicator
                        style={styles.centering}
                        color="#487597"
                        size="large"
                      />
                </View>
            </View>
        )
      }
      return (
        <View style={{flex:1,backgroundColor:'#292E39'}}>
            <CustomStatusBar backgroundColor="#292E39" barStyle="light-content"/>
              <View style={styles.header}>
                  <View style={styles.header_left}>
                    <TouchableOpacity onPress={()=>this.pushBack()}>
                        <Image source={imageSource.arrow_left} style={{width:30,height:30}}></Image>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.header_center}>
                      <Text style={[styles.header_center_title,{color:'#9c9fa6'}]} ellipsizeMode={'tail'}  numberOfLines={1}>Common Connections</Text>
                  </View>
                  <View style={styles.header_right}>
                    <View style={{width:30,height:30}}>
                    </View>
                  </View>
              </View>
              <ScrollView
                removeClippedSubviews={true}
                contentContainerStyle={{paddingHorizontal:10,paddingBottom:40,paddingTop:20}}
              >
                <View>
                    <View style={{backgroundColor:'#FFF',padding:5,borderTopLeftRadius:10,borderTopRightRadius:10}}></View>
                      <View style={{backgroundColor:'#FFF'}}>
                          {this.renderRows()}
                      </View>
                    <View style={{backgroundColor:'#FFF',padding:5,borderBottomLeftRadius:10,borderBottomRightRadius:10,marginBottom:40}}></View>
                </View>
                {
                    (this.state.showload && (this.state.loading==false) ) ?
                      <View style={{justifyContent:'center',alignItems:'center'}}>
                        {
                            (this.state.animating) ? this.showAnimating() :
                            <TouchableOpacity style={{backgroundColor:'#FFF',paddingHorizontal:35,paddingVertical:10,borderRadius:20}} onPress={()=>this.getData()} >
                                <Text style={{textAlign:'center',color:'#555'}}>Load More</Text>
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
