'use strict';
import React, { Component } from 'react';
import { View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
  AsyncStorage,
  Alert
  } from 'react-native';
import { Actions,ActionConst } from 'react-native-router-flux';
import ToastAndroid from '@remobile/react-native-toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
const imageSource = {
          heart_icon: require(".././Assets/Img/feed_like.png"),
          comment_icon: require(".././Assets/Img/feed_comment.png"),
          close_icon: require(".././Assets/Img/postback_close.png"),
};
const {height, width} = Dimensions.get('window');
export default class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
        data:[],
        isfetch:true,
        text:'',
        user: this.props.user,
    };
    this.likes = [];
    this.likescount = [];
    this.likesimage = [];
    this.page = 1;
    this.readmore = [];
    this.readmorebtn = [];
  }
  componentDidMount(){
      setTimeout(()=>{
        this.fetchComments(this.props.feeddata.id);
      },100)
  }


  fetchComments = async (id) => {
    fetch('https://api.eventonapp.com/api/feedcomments/'+id, { method: 'GET' }, 1).then((response) => response.json())
     .then((responseJson) => {
       this.setState({
         data: responseJson.data,
         isfetch:false,
       });
     })
     .catch((error) => {
        console.error(error);
     });
  }
  pushToLogin = () => {
      if(typeof this.props.sudonav != 'undefined')
      {
          this.props.sudonav.resetTo({ id: 'SudoLogin'});
      }
  }
  addComment = () => {
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
    else{
      this.refs.message.setNativeProps({text: ''});
      if(this.state.text.length==0)
      {
          ToastAndroid.show('Please type comment...',ToastAndroid.SHORT)
      }
      if(this.state.text.length)
      {
          let t = [];
          t['user_id'] = 1;
          t['text'] = this.state.text;
          t['timestamp'] = Math.floor(Date.now()/1000);
          t['name'] = this.state.user.name;
          t['image'] = this.state.user.image;
          t['ago'] = 'now';
          let d = this.state.data;
          d.push(t);
          this.setState({data:d},() => {
            fetch('https://api.eventonapp.com/api/addComment/'+this.state.user.id+'/'+this.props.feeddata.id+'?message='+encodeURIComponent(this.state.text), { method: 'GET' }, 2).then((response) => response.json())
             .then((responseJson) => {
                 this.setState({text:''})
                 this.props.updateCommentCount(this.props.feeddata.id,this.state.data.length);
             }).catch((error) => {  });
          });
      }
    }
  }
  render() {
    if(this.state.isfetch){
        return (
          <View style={{flex:1,height:300,justifyContent:'center',alignItems:'center'}}>
              <ActivityIndicator
                style={styles.centering}
                color="#6699ff"
                size="large"
              />
         </View>
        )
    }
    let len = this.state.data.length;
    return(
      <KeyboardAwareScrollView
            keyboardShouldPersistTaps={'always'}
            bounces={false}
            keyboardOpeningTime={400}
            style={{flex:1}}
            extraScrollHeight={0}
            extraHeight={0}
            >
          <View style={styles.container}>
              <TouchableOpacity style={{position:'absolute',top:20,right:20,zIndex:20,padding:5}} onPress={()=>this.props.onlyHideCommentPopup() }>
                  <Image source={imageSource.close_icon} style={{width:20,height:20,alignSelf:'flex-end'}}  />
              </TouchableOpacity>
                    <View style={{flex:1}}>
                      <View style={{flexDirection:'column',padding:10,borderBottomWidth:2,borderBottomColor:'#EFEFEF'}}>
                          <View style={styles.top}>
                              <View style={styles.left}>
                                <Image style={styles.profile} source = {{uri:this.props.feeddata.image}}  />
                              </View>
                              <View style={styles.right}>
                                  <Text style={styles.title}>{this.props.feeddata.name}</Text>
                                  <Text style={styles.date}>{this.props.feeddata.ago}</Text>
                              </View>
                          </View>
                          <View style={styles.bottom}>
                              <Text style={styles.description}>{this.props.feeddata.content}</Text>
                              {(this.props.feeddata.path!= null && this.props.feeddata.type=='IMAGE') ? <TouchableWithoutFeedback onPress={ () => this.showFullImage(this.props.feeddata.path) } ><Image source={{uri:this.props.feeddata.path}} borderRadius={5} style={{height:150,width:undefined,resizeMode:'cover',flex:1}} /></TouchableWithoutFeedback> : null }
                          </View>
                       </View>
                       <ScrollView
                          bounces={false}
                          style={{flex:1}}
                        >
                            {
                              this.state.data.map((o,i)=>{
                                let w = 1;
                                if((len-1)==i)
                                {
                                  w = 0;
                                }
                                return (
                                  <TouchableOpacity onPress={()=>this.props.hideCommentPopup(o.user_id)} key={i}>
                                       <View style={[styles.row,{borderBottomWidth:w}]}>
                                        <Image source={{uri:o.image}} style={{width:50,height:50,marginRight:10,resizeMode:'cover'}}/>
                                        <View>
                                            <Text style={styles.title}>{o.name}</Text>
                                            <Text style={styles.desc}>{o.text}</Text>
                                            <Text style={styles.ago}>{o.ago}</Text>
                                        </View>
                                      </View>
                                  </TouchableOpacity>
                                )
                            })
                          }
                      </ScrollView>
                  </View>
                  <View style={{borderColor:'#cfcfcf',borderWidth :0.5}}></View>
                  <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'#FFF',borderBottomLeftRadius:10,borderBottomRightRadius:10,overflow:'hidden'}}>
                    <TextInput
                       style={{height: 50,paddingLeft:10,flex:1,marginRight:10}}
                       placeholder="Write a comment..."
                       onChangeText={(text) => this.setState({text})}
                       underlineColorAndroid="transparent"
                       ref="message"
                     />
                     <TouchableOpacity style={styles.sendbtn} onPress={()=>this.addComment()} >
                        <Text style={{fontFamily:'Roboto-Regular',color:'#FFF'}}>Send</Text>
                     </TouchableOpacity>
                  </View>
              </View>
          </KeyboardAwareScrollView>
    )
  }
}
  const styles = StyleSheet.create({
    container: {
      paddingTop:22,
      borderRadius:10,
      backgroundColor:'#FFF',
      overflow:'hidden',
      flexDirection:'column',
      height:(Platform.OS=='ios') ? height : height-20,
    },
    centering: {
     alignItems: 'center',
     justifyContent: 'center',
     padding: 8,
   },
   row:{
      flexDirection:'row',
      padding:10,
      borderBottomWidth:1,
      borderBottomColor:'#EEE',
   },
   title:{
     fontFamily:'Roboto-Medium',
     fontSize:16,
     color:'#000',
   },
   desc:{
     fontFamily:'Roboto-Regular',
     fontSize:13,
     color:'#444',
   },
   ago:{
     fontFamily:'Roboto-Regular',
     fontSize:11,
     color:'#666',
   },
   sendbtn:{
     width:80,
     height:50,
     borderLeftColor:'#999',
     borderLeftWidth:1,
     paddingHorizontal:10,
     paddingVertical:5,
     backgroundColor:'#6699ff',
     justifyContent:'center',
     alignItems:'center',
     borderBottomRightRadius:10,
     overflow:'hidden'
   },
   profile:{
     width:50,
     height:50,
     borderRadius:25,
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
   },
   top:{
     flexDirection:'row',
   },
   bottom:{
     padding:5,
     paddingBottom:10,
   },
   left: {
      marginRight:10,
    },
  right: {
     flex:1,
  }
});
