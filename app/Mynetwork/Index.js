'use strict';
import React, { Component } from 'react';
import { View,  Text,  Image,  ScrollView,  TextInput,  ActivityIndicator, TouchableOpacity, AsyncStorage,Dimensions,BackHandler,TouchableWithoutFeedback,Modal  } from 'react-native';
import { Actions,ActionConst } from 'react-native-router-flux';
import styles from  './Style';
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

export default class Index extends Component {
    constructor(props) {
      super(props);
      this.state = {
          user:this.props.user,
          data: [],
          loading:true,
          isModalVisible:false,
          filterTag:this.props.filterTag,
          ouser:[],
          showload:true,
          animating:false,
      }
      this.page = 1;
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
       this.setState({isModalVisible:false,animating:true});
       await fetch('https://api.eventonapp.com/api/mynetwork/'+this.state.user.id+'/'+this.page+'?filterTag='+this.state.filterTag, {
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
    blockPeople = async (uid,toid) => {
      await fetch('https://api.eventonapp.com/api/blockpeople/'+uid+"/"+toid, {
         method: 'GET'
      }).then((response) => this.getData() )
    }

    showPeople = (id) => {
       if(this.state.ouser.id == id){
         this.props.navigator.push({id:'Profile',user:this.state.user})
       }
       else{
          this.props.navigator.push({id:'PeopleDetail',showid:id,user:this.state.user});
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
                          <Text style={[styles.header_center_title,{color:'#9c9fa6'}]} ellipsizeMode={'tail'}  numberOfLines={1}>My Network</Text>
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
        );
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
                      <Text style={[styles.header_center_title,{color:'#9c9fa6'}]} ellipsizeMode={'tail'}  numberOfLines={1}>My Network</Text>
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
                            {this.renderRows()}
                         </View>
                      <View style={{backgroundColor:'#FFF',padding:10,borderBottomLeftRadius:10,borderBottomRightRadius:10,marginBottom:40}}></View>
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
        </View>
      )
    }
}
