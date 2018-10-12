'use strict';
import React, { Component } from 'react';
import { View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  AsyncStorage,
  TextInput,
  TouchableWithoutFeedback,
  Alert,
  CameraRoll,
  Platform
  } from 'react-native';
import Permissions from 'react-native-permissions';
import RNFS from 'react-native-fs';
import Comment from './Comment';
import ToastAndroid from '@remobile/react-native-toast';
import ModalDropdown from 'react-native-modal-dropdown';
import { Actions,ActionConst } from 'react-native-router-flux';
const imageSource = {
        heart_icon: require(".././Assets/Img/feed_like.png"),
        comment_icon: require(".././Assets/Img/feed_comment.png"),
        //close_icon: require(".././Assets/Img/postback_close.png"),
        //ico_downloads: require(".././Assets/Img/ico_downloads.png"),
        close_icon: require(".././Assets/Img/cancel-music.png"),
        ico_downloads: require(".././Assets/Img/download-tray.png"),
};
export default class BasicFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
        user:this.props.user,
        topevent:this.props.topevent,
        data:[],
        isfetch:true,
        modalVisible:false,
        feeddata:[],
        userinfo:[],
        showActionFeed:false,
        editForm:false,
        editText:'',
        showload:true,
        animating:false,
        showFullImage:false,
        showFullImagePath:'',
    };
    this.likes = [];
    this.likescount = [];
    this.likesimage = [];
    this.togglelike = this.togglelike.bind(this);
    this.updateCommentCount = this.updateCommentCount.bind(this);
    this.hideCommentPopup = this.hideCommentPopup.bind(this);
    this.page = 1;
    this.readmore = [];
    this.readmorebtn = [];
  }
  componentWillMount(){
    this.props.googleTracker('FEEDS:'+this.state.topevent.title+':BASIC');
    AsyncStorage.getItem(this.state.topevent.id+'@BASICFEED').then((data) => {
        if(data!=null)
        {
            this.setState({data:JSON.parse(data),isfetch:false},()=>{
                this.basicFeed()
            })
        }
        else
        {
          this.basicFeed();
        }
    })
  }
  componentWillReceiveProps(nextProps){
     this.recentFeed()
  }
  basicFeed = () => {
      this.setState({animating:true});
      fetch('https://api.eventonapp.com/api/feeds/'+this.state.user.id+'/'+this.state.topevent.id+'/'+this.page, { method: 'GET' }).then((response) => response.json())
        .then((responseJson) => {
          let param = true;
          if(responseJson.data.length < 15)
          {
             param=false;
          }
          this.setState({
                data: this.page === 1 ? responseJson.data : [...this.state.data, ...responseJson.data],
                isfetch:false,
                showload:param,
                animating:false,
              },()=>{
                if(this.page==1)
                {
                    AsyncStorage.setItem(this.state.topevent.id+'@BASICFEED', JSON.stringify(responseJson.data));
                }
                this.page = this.page + 1;
           })
     }).catch((error) => {
          this.setState({isfetch:false,showload:false})
     });
  }
  recentFeed = async () => {
    await fetch('https://api.eventonapp.com/api/recentFeed/'+this.state.user.id+'/'+this.state.topevent.id+'/1', { method: 'GET' }).then((response) => response.json())
        .then((responseJson) => {
            let data = this.state.data;
            let fdata = responseJson.data;
            fdata.map((o,i) => {
                var index = data.map(function (j) { return j.id; }).indexOf(o.id);
                if(index < 0 )
                {
                    console.log(index);
                    data.splice(0,0,o)
                }
            })
            this.setState({data:data});
     }).catch((error) => {  });
  }
  showComment = (d) => {
    this.setState({feeddata:d},() => {
          this.setState({modalVisible:!this.state.modalVisible})
    })
  }
  updateCommentCount = (id,count) => {
      var d = this.state.data;
      d.map((o,i)=>{
          if(o['id']==id)
          {
              d[i]['comment_count'] = count;
          }
      })
      this.setState({ data: d  })
  }
  pushToLogin = () => {
      if(typeof this.props.sudonav != 'undefined')
      {
          this.props.sudonav.resetTo({ id: 'SudoLogin'});
      }
  }
  togglelike = (i,id,islike) => {
    if(this.state.user===false)
    {
       AsyncStorage.getItem('DEMOERRORMSG').then((msg) => {
           if(msg!=null){
               Alert.alert('',
                 msg,
                 [
                   {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                   {text: 'Continue Login', onPress: () => this.pushToLogin() },
                 ],
                 { cancelable: false }
               )
               return false;
           }
       })
    }
    else{
        let d = this.state.data;
        if(parseInt(islike))
        {
            d[i]['islike'] = 0;
            d[i]['like_count'] = (parseInt(d[i].like_count)-1).toString();
            this.setState({data:d});
        }
        else
        {
            d[i]['islike'] = 1;
            d[i]['like_count'] = (parseInt(d[i].like_count)+1).toString();
            this.setState({data:d});
        }
        fetch('https://api.eventonapp.com/api/addLike/'+this.state.user.id+"/"+id, { method: 'GET' })
    }
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
  showPeople = (id) => {
      if(this.state.user.id==id)
      {
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
  parseData = () => {
        let len = this.state.data.length;
        let w = 1;
        if(len==0 && this.state.isfetch==false){
            return (
              <View style={styles.container}>
                  <View style={{height:250,justifyContent:'center',alignItems:'center',backgroundColor:'#FFF',padding:30,borderRadius:10}}>
                    <Text style={{fontFamily:'Roboto-Medium',color:'#222',textAlign:'center',fontSize:18}}>{"Sigh… It's empty!"}</Text>
                    <Text style={{fontFamily:'Roboto-Thin',color:'#000',textAlign:'center',marginTop:15,fontSize:13}}>Be the first one to post a message or photo to share with others.</Text>
                  </View>
              </View>
            )
       }
       return (this.state.data.map((o,i) => {
            if((len-1)==i)
            {
               w = 0;
            }
            return (
                  <View key={i} style={[styles.row,{borderBottomWidth:w}]}>
                     <View style={styles.top}>
                        <View style={styles.left}>
                          <TouchableOpacity onPress={()=>{ this.showPeople(o.user_id) } }><Image style={styles.profile} source = {{uri:o.image}}  /></TouchableOpacity>
                        </View>
                        <View style={styles.right}>
                            <TouchableOpacity onPress={()=>{ this.showPeople(o.user_id) } }>
                                <Text style={styles.title}>{o.name}</Text>
                                <Text style={styles.date}>{o.ago}</Text>
                            </TouchableOpacity>
                        </View>
                        {
                           (this.state.user.id==o.user_id) ?
                            <TouchableOpacity onPress={()=>this.showActionFeed(o.id)}>
                                <Text style={{fontSize:28,fontFamily:'Roboto-Regular',color:'#000'}}>...</Text>
                            </TouchableOpacity>
                            :
                            null
                        }
                      </View>
                      <View style={styles.bottom}>
                          <Text style={styles.description} ref={e => (this.readmore[o.id] = e)} numberOfLines={2}>{o.content}</Text>
                          {
                             ((o.content.match(new RegExp("\n", "g")) || []).length > 1 || o.content.length > 60 )  ? <View style={{alignItems:'flex-end'}} ref={e => (this.readmorebtn[o.id] = e)}>
                                 <TouchableOpacity onPress={()=>this.expandMore(o.id)} style={{justifyContent:'center',alignItems:'center'}}>
                                     <Text style={{fontSize:11,fontFamily:'Roboto-Medium',color:'#333'}}>Read More</Text>
                                 </TouchableOpacity>
                             </View>
                             :
                             null
                          }
                          {(o.path!= null && o.type=='IMAGE') ? <TouchableWithoutFeedback onPress={ () => this.showFullImage(o.path) } ><Image source={{uri:o.path}} borderRadius={5} style={{height:150,width:undefined,resizeMode:'cover',flex:1}} /></TouchableWithoutFeedback> : null }
                      </View>
                      <View style={styles.icon_box}>
                          <TouchableOpacity ref={e => (this.likes[o.id] = e)} onPress={()=>this.togglelike(i,o.id,o.islike)} style={styles.items}>
                            {
                              (o.islike > 0) ?
                              <Image ref={eq => (this.likesimage[o.id] = eq)} style={{width:20,height:20,marginRight:5}} source={{uri:'http://onspond.zootout.com/images/svg/user_like/'+this.state.user.id}} />
                              :
                              <Image ref={eq => (this.likesimage[o.id] = eq)} style={{width:20,height:20,marginRight:5}} source={imageSource.heart_icon} />
                            }
                            <Text style={{fontFamily:'Roboto-Regular',color:'#666'}}>{o.like_count}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={()=>this.showComment(o)} style={styles.items}>
                            <Image style={{width:20,height:20,marginRight:5,resizeMode:'contain'}} source={imageSource.comment_icon} />
                            <Text style={{fontFamily:'Roboto-Regular',color:'#666'}}>{o.comment_count}</Text>
                          </TouchableOpacity>
                      </View>
                  </View>
            )
        })
    )
  }
  showActionFeed = (postid) => {
      this.setState({postid:postid},()=>{
          this.setState({showActionFeed:true})
      })
  }
  loader = () => {
    return (
        <View style={{flex:1,height:300,justifyContent:'center',alignItems:'center'}}>
            <ActivityIndicator
              style={styles.centering}
              color="#6699ff"
              size="large"
            />
       </View>
    );
  }
  hideCommentPopup = (id)=> {
    this.setState({modalVisible:false},() => {
         Actions.PeopleData({showid:id});
    })
  }
  onlyHideCommentPopup = () => {
    this.setState({modalVisible:false});
  }
  deletePost = () => {
    Alert.alert('',
      'Do you want delete this post?',
      [
        {text: 'Cancel', onPress: () => {
          this.setState({postid:0,showActionFeed:false,editForm:false,editText:''})
        }, style: 'cancel'},
        {text: 'Yes', onPress: () => {

              if(this.state.postid)
              {
                    let post = this.state.data;
                    let postid = this.state.postid;
                    var index = post.map(function (o) { return o.id; }).indexOf(this.state.postid);
                    if(index >= 0)
                    {
                        post.splice(index,1);
                        this.setState({data:post},()=>{
                            this.setState({postid:0,showActionFeed:false},()=>{
                                fetch('https://api.eventonapp.com/api/deletePost/'+postid, { method: 'GET' }).then((response) => response.json())
                                    .then((responseJson) => {
                                       if(responseJson.status)
                                       {
                                          ToastAndroid.show('Delete Successfully', ToastAndroid.SHORT);
                                       }
                                       else{
                                         ToastAndroid.show('Error.....', ToastAndroid.SHORT);
                                       }
                                 })

                            })
                        })
                    }
              }

        } },
      ],
      { cancelable: false }
    )

  }
  moveToEditPost = () => {
      if(this.state.postid)
      {
          let post = this.state.data;
          var index = post.map(function (o) { return o.id; }).indexOf(this.state.postid);
          if(index >= 0)
          {
              this.setState({showActionFeed:false,editText:post[index].content},()=>{
                  this.setState({editForm:true})
              });
          }
      }
  }

  updatePost = () => {
      if(this.state.user===false)
      {
         AsyncStorage.getItem('DEMOERRORMSG').then((msg) => {
             if(msg!=null){
                 Alert.alert('',
                   msg,
                   [
                     {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                     {text: 'Continue Login', onPress: () => { this.pushToLogin() }},
                   ],
                   { cancelable: false }
                 )
                 return false;
             }
         })
      }
      else {
        if(this.state.postid)
        {
          let post = this.state.data;
          let postid = this.state.postid;
          let editText = this.state.editText;
          var index = post.map(function (o) { return o.id; }).indexOf(this.state.postid);
          if(index >= 0)
          {
              post[index]['content'] = editText;
              this.setState({data:post},() => {
                    this.setState({postid:0,showActionFeed:false,editForm:false,editText:''},()=>{

                          var body = new FormData();
                          body.append('post_id', postid);
                          body.append('content', editText);
                          var xhttp = new XMLHttpRequest();
                          xhttp.onreadystatechange = function() {
                            if(xhttp.readyState == 4 && xhttp.status == 200) {
                                var ct =  JSON.parse(xhttp.responseText);
                                if(ct.status){
                                    ToastAndroid.show('Update Successfully', ToastAndroid.SHORT);
                                }
                                else{
                                    ToastAndroid.show('Error....', ToastAndroid.SHORT);
                                }
                            }
                          };
                          xhttp.open("POST", "https://api.eventonapp.com/api/editPost", true);
                          xhttp.setRequestHeader("Content-type", "multipart/form-data");
                          xhttp.send(body);
                    })
              })
          }
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
  showFullImage = (image) => {
      this.setState({showFullImagePath:image,showFullImage:true})
  }
  ext = (url) => {
    return (url = url.substr(1 + url.lastIndexOf("/")).split('?')[0]).split('#')[0].substr(url.lastIndexOf("."))
  }
  downloadFile = async (file) => {
    let ext = this.ext(file);
    let name = new Date().getUTCMilliseconds();
    let os = await Platform.OS;
    if(os==='ios')
    {
      Permissions.request('photo').then(response => {
        if(response=='authorized')
        {
          CameraRoll.saveToCameraRoll(file).then(
            ToastAndroid.show('Photo added to camera roll!', ToastAndroid.LONG)
          )
        }
      })
    }
    else
    {
        Permissions.request('storage').then(response => {
          if(response=='authorized')
          {
              let path = RNFS.PicturesDirectoryPath+'/'+name+ext;
              RNFS.downloadFile({fromUrl:file, toFile: path}).promise.then(res => {
                  ToastAndroid.show("Image Downloaded Successfully\n"+path, ToastAndroid.LONG)
              }).catch((err) => {
                ToastAndroid.show(err.message, ToastAndroid.LONG)
              })
          }
        })
    }
  }
  render() {
    return (
          <View>
              { (this.state.isfetch) ? this.loader()  :  this.parseData() }
              {
                  (this.state.showload  && (this.state.isfetch==false)) ?
                    <View style={{justifyContent:'center',alignItems:'center',marginTop:40}}>
                      {
                          (this.state.animating) ? this.showAnimating() :
                          <TouchableOpacity style={{backgroundColor:'#6699ff',paddingHorizontal:35,paddingVertical:10,borderRadius:20}} onPress={()=>this.basicFeed()} >
                              <Text style={{textAlign:'center',color:'#FFF'}}>Load More</Text>
                          </TouchableOpacity>
                      }
                    </View>
                    :
                    null
              }
              <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.state.modalVisible}
                style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)'}}
                onRequestClose={() => { this.setState({modalVisible:!this.state.modalVisible}) }}
                >
                <Comment user={this.state.user} feeddata={this.state.feeddata} updateCommentCount={this.updateCommentCount} hideCommentPopup={this.hideCommentPopup}  onlyHideCommentPopup={this.onlyHideCommentPopup.bind(this)} sudonav={this.props.sudonav} />
              </Modal>
              <Modal
                animationType={"slide"}
                transparent={true}
                style={{borderRadius:10}}
                visible={this.state.editForm}
                onRequestClose={() => { this.setState({editForm:!this.state.editForm}) }}
                >
                  <TouchableWithoutFeedback onPress={()=>{ this.setState({postid:0, showActionFeed:false}) } }>
                      <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'center',alignItems:'center',padding:30}}>
                          <View style={{backgroundColor:'#FFF',borderRadius:10,width:'100%'}}>
                              <View style={{flexDirection:'row',backgroundColor:'#6699ff',justifyContent:'center',borderTopLeftRadius:10,borderTopRightRadius:10,alignItems:'center',overflow:'hidden'}}>
                                  <Text style={{flex:1,color:'#FFF',padding:10,fontFamily:'Roboto-Bold'}} >Edit Post</Text>
                                  <TouchableOpacity style={{padding:10}} onPress={()=>{ this.setState({postid:0,showActionFeed:false,editForm:false,editText:''}) }} >
                                      <Text style={{color:'#FFF',fontFamily:'Roboto-Bold'}}>X</Text>
                                  </TouchableOpacity>
                              </View>
                              <View style={{padding:10}}>
                                <TextInput
                                  textAlignVertical = {'top'}
                                  multiline={true}
                                  underlineColorAndroid={'transparent'}
                                  style = {{borderWidth:1,backgroundColor:'#EAEAEA',borderColor:'#FAFAFA',width:'100%',borderRadius:10,color:'#333',height:130,padding:10}}
                                  value = {this.state.editText}
                                  onChangeText = {(editText) => this.setState({editText})}
                                />
                              </View>
                              <View style={{alignItems:'flex-end',flexDirection:'row',marginBottom:10,paddingHorizontal:10,justifyContent:'flex-end'}}>
                                    <TouchableOpacity onPress={()=>this.updatePost()} style={{flexWrap:'wrap',paddingVertical:5,paddingHorizontal:15,borderRadius:5,backgroundColor:'#6699ff',alignSelf:'flex-end'}}>
                                        <Text style={{color:'#FFF'}}>Send</Text>
                                    </TouchableOpacity>
                              </View>
                          </View>
                      </View>
                  </TouchableWithoutFeedback>
              </Modal>
              <Modal
                animationType={"slide"}
                transparent={true}
                style={{borderRadius:10}}
                visible={this.state.showActionFeed}
                onRequestClose={() => { this.setState({showActionFeed:!this.state.showActionFeed}) }}
                >
                  <TouchableWithoutFeedback onPress={()=>{ this.setState({postid:0, showActionFeed:false}) } }>
                      <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'flex-end'}}>
                            <View style={{backgroundColor:'#FFF',flexDirection:'row'}}>
                                  <TouchableOpacity onPress={()=>this.moveToEditPost()} style={{flex:1,borderRightWidth:1,borderRightColor:'#EAEAEA',padding:20}}>
                                      <Text style={{textAlign:'center',fontFamily:'Roboto-Medium',color:'#333'}}>Edit</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity onPress={()=>this.deletePost()} style={{flex:1,padding:20}}>
                                      <Text style={{textAlign:'center',fontFamily:'Roboto-Medium',color:'#333'}}>Delete</Text>
                                  </TouchableOpacity>
                            </View>
                      </View>
                  </TouchableWithoutFeedback>
              </Modal>
              <Modal
                animationType={"fade"}
                transparent={true}
                visible={this.state.showFullImage}
                onRequestClose={() => { this.setState({showFullImage:!this.state.showFullImage}) }}>
                <TouchableWithoutFeedback onPress={()=>this.setState({showFullImage:false,showFullImagePath:''}) }>
                    <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)',padding:20,elevation:5}}>
                        <TouchableOpacity style={{position:'absolute',top:20,left:20,zIndex:20,padding:5}} onPress={()=>{ this.downloadFile(this.state.showFullImagePath) }}>
                            <Image source={imageSource.ico_downloads} style={{width:20,height:20}}  />
                        </TouchableOpacity>
                        <TouchableOpacity style={{position:'absolute',top:20,right:20,zIndex:20,padding:5}} onPress={()=>this.setState({showFullImage:false,showFullImagePath:''})}>
                            <Image source={imageSource.close_icon} style={{width:20,height:20}}  />
                        </TouchableOpacity>
                        <Image source={{uri:this.state.showFullImagePath}} style={{resizeMode:'contain',flex:1,width:undefined,height:undefined}} />
                    </View>
                </TouchableWithoutFeedback>
              </Modal>
          </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius:10,
    margin:10,
    padding:10,
  },
  centering: {
   alignItems: 'center',
   justifyContent: 'center',
   padding: 8,
 },
  row: {
    marginTop:5,
    marginBottom:5,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor:'#FFF',
    borderBottomWidth:1,
    borderBottomColor:'#e5e5e5'
  },
  top:{
    flexDirection:'row',
  },
  bottom:{
    flex:1,
    padding:5,
    paddingBottom:10,
    marginTop:5,
    marginBottom:5,
    borderBottomWidth:0.2,
    borderBottomColor:'#e5e5e5'
  },
  left: {
     marginRight:10,
   },
 right: {
    flex:1,
 },
 profile:{
   width:50,
   height:50,
   borderRadius:25,
 },
 title:{
   color: '#444',
   fontSize: 16,
   fontFamily:'Roboto-Medium',
 },
 description:{
   color: '#666',
   fontSize:12,
   fontFamily:'Roboto-Regular',
   paddingVertical:10,
 },
 date:{
   fontFamily:'Roboto-Regular',
   fontSize:12,
   color:'#999',
 },
 icon_box : {
   flexDirection:'row',
   paddingTop:5,
   paddingBottom:5,
   //justifyContent:'center',
   alignItems:'center',
 },
 items:{
   flexDirection:'row',
   marginRight:10,
   alignItems:'center',
 }

});
