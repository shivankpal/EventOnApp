'use strict';
import React, { Component } from 'react';
import { View,  Text,  Image,  ScrollView,  ActivityIndicator, AsyncStorage, Dimensions, TouchableOpacity,TouchableWithoutFeedback,Alert,Modal,TextInput, ToastAndroid  } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './Style';
import CustomStatusBar from '.././Common/CustomStatusBar';
const imageSource = {
        arrow_left: require(".././Assets/Img/arrow_left.png"),
        edit_icon: require(".././Assets/Img/pencil_white.png"),
};
const {height, width} = Dimensions.get('window');
export default class MyBusinesscards extends Component {
    constructor(props) {
      super(props);
      this.state = {
          user:this.props.user,
          data: [],
          loading:true,
          showForm:false,
          card_id:0,
          card:'',
          showload:true,
          animating:false,
      }
      this.page = 1;
    }
    componentWillMount () {
      setTimeout(()=>{
        this.getData();
      },1000)
    }
    getData = async () => {
      this.setState({animating:true});
       await fetch('https://api.eventonapp.com/api/mybusinessCards/'+this.state.user.id+'/'+this.page, {
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
       }).catch((error) => {   });
    }
    pushBack = () => {
      this.props.navigator.pop();
    }
    noteAction = (o,i) => {
      this.setState({card:o})
      Alert.alert('',
        o.title,
        [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'Edit', onPress: () => this.showForm(o) },
          {text: 'Delete', onPress: () => this.deleteMyNote(o.id,i) },
        ],
        { cancelable: false }
      )
    }
    deleteMyNote = async (id,i) => {
      let data = this.state.data;
      data.splice(i,1);
      this.setState({data:data});
      await fetch('https://api.eventonapp.com/api/deleteCards/'+id, {
         method: 'GET'
      }).then((response) => response.json())
      .then((responseJson) => {
          this.getData();
      }).catch((error) => {  });
    }
    showForm = (data) => {
      this.setState({modalVisible:false,card:data,title:data.title},()=>{
          this.setState({showForm:true},()=>{

          })
      })
    }
    updateCard = () => {
        let card = this.state.data;
        var index = card.map(function (o) { return o.id; }).indexOf(this.state.card.id);
        if(index>=0)
        {
            card[index]['title'] = this.state.title;
            this.setState({data:card},()=>{
                this.setState({showForm:false,modalVisible:false},()=>{

                      var body = new FormData();
                      body.append('card_id', this.state.card.id);
                      body.append('title', this.state.title);

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
                      xhttp.open("POST", "https://api.eventonapp.com/api/updateMyCard", true);
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
          <View style={{flex:1,backgroundColor:'#292E39'}}>
            <CustomStatusBar backgroundColor="#292E39" barStyle="light-content"/>
              <View style={styles.header}>
                  <View style={styles.header_left}>
                    <TouchableOpacity onPress={()=>this.pushBack()}>
                        <Image source={imageSource.arrow_left} style={{width:30,height:30}}></Image>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.header_center}>
                      <Text style={[styles.header_center_title,{color:'#9c9fa6'}]} ellipsizeMode={'tail'}  numberOfLines={1}>Business Cards</Text>
                  </View>
                  <View style={styles.header_right}>
                    <View style={{width:30,height:30}}>
                    </View>
                  </View>
              </View>
              <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                  <ActivityIndicator
                    style={styles.centering}
                    color="#487597"
                    size="large"
                  />
              </View>
          </View>
        )
      }
      if(this.state.data.length==0)
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
                      <Text style={[styles.header_center_title,{color:'#9c9fa6'}]} ellipsizeMode={'tail'}  numberOfLines={1}>Business Cards</Text>
                  </View>
                  <View style={styles.header_right}>
                    <View style={{width:30,height:30}}>
                    </View>
                  </View>
              </View>
              <View style={styles.box}>
                  <View style={{height:250,justifyContent:'center',alignItems:'center',backgroundColor:'#FFF',padding:30,borderRadius:10}}>
                    <Text style={{fontFamily:'Roboto-Medium',color:'#222',textAlign:'center',fontSize:16}}>{"Sigh… It's empty"}</Text>
                    <Text style={{fontFamily:'Roboto-Thin',color:'#000',textAlign:'center',marginTop:15,fontSize:12}}>You have not added any Business card yet.</Text>
                  </View>
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
                        <Text style={[styles.header_center_title,{color:'#9c9fa6'}]} ellipsizeMode={'tail'}  numberOfLines={1}>Business Cards</Text>
                    </View>
                    <View style={styles.header_right}>
                      <View style={{width:30,height:30}}>
                      </View>
                    </View>
                </View>
                <ScrollView removeClippedSubviews={true}>
                    <View style={{marginTop:10}}>
                        {
                            this.state.data.map((o,i) => {
                              return (
                                <TouchableWithoutFeedback  key={i} onLongPress={()=>this.noteAction(o,i)}>
                                  <View style={{backgroundColor:'#FFF',marginHorizontal:10,marginVertical:5,padding:10,borderRadius:5}}>
                                    <Image source={{uri:o.image}} resizeMode={'cover'} style={{position:'relative',flex:1,width:null,height:200,justifyContent:'flex-end'}}>
                                        <View style={styles.right}>
                                            <Text style={styles.title} numberOfLines={2}>{o.title}</Text>
                                            <Text style={styles.date}>{o.created_on} @ {o.location}</Text>
                                            {(o.reference!='') ? <Text style={styles.date}>Ref.: {o.reference}</Text> : null}
                                        </View>
                                    </Image>
                                  </View>
                              </TouchableWithoutFeedback>
                              )
                          })
                        }
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
                    </View>
                </ScrollView>
                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.showForm}
                    onRequestClose={() => { this.setState({ showForm: !this.state.showForm } ) }}
                    >
                   <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)'}}>
                          <KeyboardAwareScrollView keyboardShouldPersistTaps={"always"} >
                          <View style={{ overflow: 'hidden',backgroundColor:'#FFF',margin:30,borderRadius:10,elevation:3,width:(width-60)}}>
                              <View style={{ overflow: 'hidden',flexDirection:'row',backgroundColor:'#6699ff',justifyContent:'center',borderTopLeftRadius:10,borderTopRightRadius:10,alignItems:'center'}}>
                                        <Text style={{flex:1,color:'#FFF',padding:10,fontFamily:'Roboto-Bold'}} >Edit Card</Text>
                                        <TouchableOpacity style={{padding:10}} onPress={()=>{ this.setState({showForm:false,title:''}) }} >
                                            <Text style={{color:'#FFF',fontFamily:'Roboto-Bold'}}>X</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{padding:20}}>
                                        <Text style={{fontFamily:'Roboto-Regular',fontSize:12,color:'#666'}}>Title</Text>
                                        <TextInput
                                              style = {{color:'#333',backgroundColor:'#f7f7f7',fontFamily:'Roboto-Regular',width:'100%',height:200, borderRadius:5,borderWidth:1,borderColor:'#EAEAEA',padding:5,marginBottom:5}}
                                              multiline = {true}
                                              textAlignVertical = {'top'}
                                              underlineColorAndroid = {'transparent'}
                                              placeholder = {"Title"}
                                              placeholderTextColor={'#9F9F9F'}
                                              value={this.state.title}
                                              onChangeText = {(title) => this.setState({title})}
                                        />
                                        <View style={{justifyContent:'flex-end',alignItems:'flex-end',flexDirection:'row',width:'100%',paddingVertical:10}}>
                                              <TouchableOpacity onPress={()=>this.updateCard()} style={{backgroundColor:'#6699FF',paddingHorizontal:10,paddingVertical:5,borderRadius:5}}><Text style={{color:'#FFF',fontFamily:'Roboto-Medium'}}>Update</Text></TouchableOpacity>
                                        </View>
                                    </View>
                              </View>
                          </KeyboardAwareScrollView>
                   </View>
              </Modal>
            </View>
      );
    }
}
