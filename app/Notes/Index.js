'use strict';
import React, { Component } from 'react';
import { View,Alert,Modal,  Text, TextInput,  ScrollView,  ActivityIndicator, AsyncStorage,Image,Dimensions,TouchableWithoutFeedback,TouchableOpacity,Clipboard  } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ToastAndroid from '@remobile/react-native-toast';
import LinearGradient from 'react-native-linear-gradient';
import Header from '.././Main/Header';
import styles from './Style';
const {height, width} = Dimensions.get('window');
const imageSource = {
        close_icon: require(".././Assets/Img/postback_close.png"),
};
export default class Index extends Component {
    constructor(props) {
      super(props);
      this.state = {
          user:this.props.user,
          topevent:this.props.topevent,
          data: [],
          loading:true,
          note:[],
          modalVisible:false,
          showForm:false,
          title:'',
          description:'',
          showload:true,
          animating:false,
      }
      this.page = 1;
    }
    componentWillMount() {
        this.props.googleTracker('EVENT NOTES');
        this.props.setCurrentScene('Event Notes');
        setTimeout(()=>{
          this.getData()
        },300)
    }
    getData = async () => {
       this.setState({animating:true});
       await fetch('https://api.eventonapp.com/api/notes/'+this.state.user.id+'/'+this.state.topevent.id+"/"+this.page, {
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
       }).catch((error) => { this.setState({animating:false})  })
    }
    noteAction = (o,i) => {
      this.setState({note:o})
      Alert.alert('',
        o.title,
        [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'Edit', onPress: () => this.showForm() },
          {text: 'Delete', onPress: () => this.deleteMyNote(o.id,i) },
        ],
        { cancelable: false }
      )
    }
    pushToLogin = () => {
        if(typeof this.props.sudonav != 'undefined')
        {
            this.props.sudonav.resetTo({ id: 'SudoLogin'});
        }
    }
    deleteMyNote = async (id,i) => {
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
          let data = this.state.data;
          data.splice(i,1);
          this.setState({data:data});
          await fetch('https://api.eventonapp.com/api/deletemynotes/'+id, {
             method: 'GET'
          }).then((response) => response.json())
          .then((responseJson) => {      }).catch((error) => {  });
      }
    }
    showDetail = (o) => {
        this.setState({note:o},() => {
            this.setState({modalVisible:true},() => {

            })
        })
    }
    taptocopy = async () => {
      await Clipboard.setString(this.state.note.title+'\n'+this.state.note.note);
      ToastAndroid.show('Copied',ToastAndroid.SHORT);
    }
    showForm = () => {
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
          this.setState({modalVisible:false,title:this.state.note.title,description:this.state.note.note},()=>{
              this.setState({showForm:true},()=>{ })
          })
      }
    }
    updateNote = () => {
        let note = this.state.data;
        var index = note.map(function (o) { return o.id; }).indexOf(this.state.note.id);
        if(index>=0)
        {
            note[index]['title'] = this.state.title;
            note[index]['note'] = this.state.description;
            this.setState({data:note},()=>{
                this.setState({showForm:false,modalVisible:false},()=>{
                      var body = new FormData();
                      body.append('note_id', this.state.note.id);
                      body.append('title', this.state.title);
                      body.append('note', this.state.description);
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
                      xhttp.open("POST", "https://api.eventonapp.com/api/updateNote", true);
                      xhttp.setRequestHeader("Content-type", "multipart/form-data");
                      xhttp.send(body);

                })
            });
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

      if(this.state.loading){
        return (
            <LinearGradient
                start={this.state.topevent.theme.bg_gradient.start}
                end={this.state.topevent.theme.bg_gradient.end}
                locations={this.state.topevent.theme.bg_gradient.locations}
                colors={this.state.topevent.theme.bg_gradient.colors}
                style={{ flex: 1 }}
            >
                  <Header openDrawer={this.props.openDrawer} currentScene={'Event Notes'} topevent={this.props.topevent} user={this.state.user} sudonav={this.props.sudonav}/>
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
      if(this.state.data.length==0 && this.state.loading==false)
      {
          return (
            <LinearGradient
                start={this.state.topevent.theme.bg_gradient.start}
                end={this.state.topevent.theme.bg_gradient.end}
                locations={this.state.topevent.theme.bg_gradient.locations}
                colors={this.state.topevent.theme.bg_gradient.colors}
                style={{ flex: 1 }}
            >
              <Header openDrawer={this.props.openDrawer} currentScene={'Event Notes'} topevent={this.props.topevent} user={this.state.user} sudonav={this.props.sudonav}/>
              <View style={styles.box}>
                  <View style={{height:250,justifyContent:'center',alignItems:'center',backgroundColor:'#FFF',padding:30,borderRadius:10}}>
                    <Text style={{fontFamily:'Roboto-Medium',color:'#222',textAlign:'center',fontSize:16}}>{"Sigh… It's empty"}</Text>
                    <Text style={{fontFamily:'Roboto-Thin',color:'#000',textAlign:'center',marginTop:15,fontSize:12}}>You have not added notes to this event yet.</Text>
                  </View>
              </View>
            </LinearGradient>
          )
      }
      let ld = this.state.data.length-1;
      let l = 1;
      return (
          <LinearGradient
              start={this.state.topevent.theme.bg_gradient.start}
              end={this.state.topevent.theme.bg_gradient.end}
              locations={this.state.topevent.theme.bg_gradient.locations}
              colors={this.state.topevent.theme.bg_gradient.colors}
              style={{ flex: 1 }}
          >
                <Header openDrawer={this.props.openDrawer} currentScene={'Event Notes'} topevent={this.props.topevent} user={this.state.user} sudonav={this.props.sudonav}/>
                <ScrollView
                  removeClippedSubviews={true}
                  contentContainerStyle={{paddingHorizontal:20,paddingBottom:40,paddingTop:20}}
                  >
                      <View>
                          <View style={{backgroundColor:'#FFF',padding:5,borderTopLeftRadius:10,borderTopRightRadius:10}}></View>
                          <View style={{backgroundColor:'#FFF'}}>
                              {
                                this.state.data.map((o,i) => {
                                  l = (i==ld) ? 0 : 1;
                                  return (
                                    <TouchableWithoutFeedback  key={i} onPress={()=>this.showDetail(o)} onLongPress={()=>this.noteAction(o,i)}>
                                        <View style={[styles.row,{flexDirection:'row',borderBottomWidth:l}]}>
                                            <View style={{flex:1,marginRight:5}}>
                                                <Text style={styles.title}>{o.title}</Text>
                                                <Text style={styles.description} numberOfLines = {2}>{o.note}</Text>
                                                <Text style={styles.date}>{o.created_on}</Text>
                                                { (o.reference!='') ? <Text style={{fontFamily:'Roboto-Regular',fontSize:11,color:'#888'}}>Ref.: {o.reference}</Text> : null }
                                            </View>
                                            {(o.image!='') ? <Image borderRadius={5} source={{uri:o.image}} style={{width:60,height:60,borderRadius:5}}/>: null }
                                        </View>
                                    </TouchableWithoutFeedback>
                                  )
                                })
                              }
                          </View>
                          <View style={{backgroundColor:'#FFF',padding:5,borderBottomLeftRadius:10,borderBottomRightRadius:10,marginBottom:40}}></View>
                      </View>
                      {
                          (this.state.showload && (this.state.loading==false)) ?
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
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => { this.setState({ modalVisible: !this.state.modalVisible} ) }}
                    >
                   <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)'}}>
                         <TouchableOpacity style={{position:'absolute',top:20,right:20,zIndex:20,padding:5}} onPress={()=>this.setState({ modalVisible: false })}>
                             <Image source={imageSource.close_icon} style={{width:20,height:20,alignSelf:'flex-end'}}  />
                         </TouchableOpacity>
                          <ScrollView contentContainerStyle={{flex:1,justifyContent:'center',alignItems:'center'}}>
                              <View style={{backgroundColor:'#FFF',padding:20,margin:30,borderRadius:10,elevation:3,justifyContent:'center',alignItems:'flex-start'}}>
                                  <View style={{flexDirection:'row'}}>
                                      {(this.state.note.image!='') ? <Image borderRadius={5} source={{uri:this.state.note.image}} style={{width:100,height:100,borderRadius:5,marginRight:10}} /> : null }
                                      <View style={{flex:1}}>
                                        <Text style={styles.title}>{this.state.note.title}</Text>
                                        <Text style={styles.date}>{this.state.note.created_on}</Text>
                                        { (this.state.note.reference!='') ? <Text style={{fontFamily:'Roboto-Regular',fontSize:11,color:'#888'}}>Ref.: {this.state.note.reference}</Text> : null }
                                      </View>
                                  </View>
                                  <Text style={[styles.description,{margin:10,textAlign:'left'}]}>{this.state.note.note}</Text>
                                  <View style={{justifyContent:'center',alignItems:'center',flexDirection:'row',width:'100%'}}>
                                        <TouchableOpacity onPress={()=>this.taptocopy()} style={{backgroundColor:'#6699FF',padding:5,borderRadius:5}}><Text style={{color:'#FFF',fontFamily:'Roboto-Medium'}}>Tap To Copy</Text></TouchableOpacity>
                                  </View>
                              </View>
                          </ScrollView>
                   </View>
              </Modal>
              <Modal
                  animationType={"fade"}
                  transparent={true}
                  visible={this.state.showForm}
                  onRequestClose={() => { this.setState({ showForm: !this.state.showForm } ) }}
                  >
                      <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)'}}>
                            <KeyboardAwareScrollView keyboardShouldPersistTaps={"always"}>
                                    <View style={{backgroundColor:'#FFF',margin:30,borderRadius:10,elevation:3,width:(width-60)}}>
                                          <View style={{overflow:'hidden', flexDirection:'row',backgroundColor:'#6699ff',justifyContent:'center',borderTopLeftRadius:10,borderTopRightRadius:10,alignItems:'center'}}>
                                              <Text style={{flex:1,color:'#FFF',padding:10,fontFamily:'Roboto-Bold'}} >Edit Note</Text>
                                              <TouchableOpacity style={{padding:10}} onPress={()=>{ this.setState({showForm: false}) }} >
                                                  <Text style={{color:'#FFF',fontFamily:'Roboto-Bold'}}>X</Text>
                                              </TouchableOpacity>
                                          </View>
                                          <View style={{padding:20}}>
                                              <Text style={{fontFamily:'Roboto-Regular',fontSize:12,color:'#666'}}>Title</Text>
                                              <TextInput
                                                    style={{ backgroundColor: '#f7f7f7', fontFamily: 'Roboto-Regular', color: '#333', width: '100%', height: 40, borderRadius: 5, borderWidth: 1, borderColor: 'lightgray', padding: 5, marginBottom: 15 }}
                                                    multiline = {false}
                                                    underlineColorAndroid = {'transparent'}
                                                    placeholder = {"Title"}
                                                    placeholderTextColor={'#9F9F9F'}
                                                    value={this.state.title}
                                                    onChangeText = {(title) => this.setState({title})}
                                              />
                                              <Text style={{fontFamily:'Roboto-Regular',fontSize:12,color:'#666'}}>Note</Text>
                                              <TextInput
                                                    style={{ backgroundColor: '#f7f7f7', fontFamily: 'Roboto-Regular', color: '#333',width:'100%',height:200, borderRadius: 5, borderWidth: 1, borderColor: 'lightgray', padding: 5, marginBottom: 15 }}
                                                    multiline = {true}
                                                    underlineColorAndroid = {'transparent'}
                                                    placeholder = {"Note"}
                                                    placeholderTextColor={'#9F9F9F'}
                                                    textAlignVertical = {'top'}
                                                    value={this.state.description}
                                                    onChangeText = {(description) => this.setState({description})}
                                              />
                                              <View style={{justifyContent:'flex-end',alignItems:'flex-end',flexDirection:'row',width:'100%',paddingVertical:10}}>
                                                    <TouchableOpacity onPress={()=>this.updateNote()} style={{backgroundColor:'#6699FF',paddingHorizontal:10,paddingVertical:5,borderRadius:5}}><Text style={{color:'#FFF',fontFamily:'Roboto-Medium'}}>Update</Text></TouchableOpacity>
                                              </View>
                                          </View>
                                    </View>
                              </KeyboardAwareScrollView>
                          </View>
                </Modal>
        </LinearGradient>
      );
    }
}
