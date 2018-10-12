'use strict';
import React, { Component } from 'react';
import { View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  AsyncStorage,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Animated,
  Dimensions,
  ToastAndroid
} from 'react-native';
import Header from '.././Main/Header';
import {Actions} from 'react-native-router-flux';
import CustomStatusBar from '.././Common/CustomStatusBar';
const imageSource = {
    plus_icon : require(".././Assets/Img/pfile_plus.png"),
    tick_icon : require(".././Assets/Img/pfile_tick.png"),
    arrow_left: require(".././Assets/Img/arrow_left.png"),
};
const {height, width} = Dimensions.get('window');
export default class Prefer extends Component {
  constructor(props) {
    super(props);
    this.state = {
        user:this.props.user,
        optionid:this.props.optionid,
        buttons:[],
        loading:true,
    }
    this.getData = this.getData.bind(this);
    this.inputData= new Array();
    this.savePrefer = this.savePrefer.bind();
  }

  componentDidMount(){
      setTimeout(()=>{
          this.getData(this.state.optionid);
      },5000)
  }

  getData = async (id) => {
    await fetch('https://api.eventonapp.com/api/profilingUser/'+this.state.user.id+'/'+id, {
       method: 'GET',
    }).then((response) => response.json())
    .then((responseJson) => {
          this.setState({buttons: responseJson.data.buttons,screen_title: responseJson.data.screen_title},()=>{
              this.setState({loading:false});
          });
     });
  }
  toggleTick = (tag) => {
    if(this.inputData.indexOf(tag) < 0)
    {
      this.refs['TOUCH'+tag].setNativeProps({
        style: {
          backgroundColor: "#27ccc0"
        }
      })
      this.refs['TEXT'+tag].setNativeProps({
        style: {
          color: "#FFF"
        }
      })
      this.refs['PLUS'+tag].setNativeProps({
        style: {
          width: 0,
          height: 0
        }
      })
      this.refs['TICK'+tag].setNativeProps({
        style: {
          width: 12,
          height: 12
        }
      })
      this.inputData.push(tag);
    }
    else
    {
      this.refs['TOUCH'+tag].setNativeProps({
        style: {
          backgroundColor: "transparent"
        }
      })
      this.refs['TEXT'+tag].setNativeProps({
        style: {
          color: "#9c9fa6"
        }
      })
      this.refs['PLUS'+tag].setNativeProps({
        style: {
          width: 12,
          height: 12
        }
      })
      this.refs['TICK'+tag].setNativeProps({
        style: {
          width: 0,
          height: 0
        }
      })
      this.inputData.splice(this.inputData.indexOf(tag),1)
    }
  }
  savePrefer = async () => {
    if(this.inputData.length)
    {
        await fetch('https://api.eventonapp.com/api/saveMorePrefer/'+this.state.user.id+'/'+this.state.optionid, {
           method: 'POST',
           body: JSON.stringify({
             attribute: this.inputData,
           }),
        }).then((response) => {
            setTimeout(() => { this.props.navigator.pop()  },300);
         })
    }
    else
    {
        ToastAndroid.show('Please atleast Select One', ToastAndroid.LONG);
    }
  }
  pushBack = () => {
    this.props.navigator.pop();
  }
  render() {
    if(this.state.loading)
    {
        return (
            <View style={styles.container}>
              <CustomStatusBar backgroundColor="#292E39" barStyle="light-content"/>
              <View style={styles.header}>
                  <View style={styles.header_left}>
                    <TouchableOpacity onPress={()=>this.pushBack()}>
                        <Image source={imageSource.arrow_left} style={{width:30,height:30}}></Image>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.header_center}>
                      <Text style={[styles.header_center_title,{color:'#9c9fa6'}]} ellipsizeMode={'tail'}  numberOfLines={1}>{(this.props.optionid==3) ? 'Edit Industries' : 'Edit Events'}</Text>
                  </View>
                  <View style={styles.header_right}>
                    <TouchableOpacity style={{backgroundColor:'#FFF',borderRadius:5,justifyContent:'center',alignItems:'center',paddingVertical:4,paddingHorizontal:7}} onPress={()=>this.savePrefer()}>
                        <Text style={{color:'#333',fontFamily:'Roboto-Regular',textAlign:'center'}}>Done</Text>
                    </TouchableOpacity>
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
            <View style={styles.container}>
                <CustomStatusBar backgroundColor="#292E39" barStyle="light-content"/>
                <View style={styles.header}>
                    <View style={styles.header_left}>
                      <TouchableOpacity onPress={()=>this.pushBack()}>
                          <Image source={imageSource.arrow_left} style={{width:30,height:30}}></Image>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.header_center}>
                        <Text style={[styles.header_center_title,{color:'#9c9fa6'}]} ellipsizeMode={'tail'}  numberOfLines={1}>{(this.props.optionid==3) ? 'Edit Industries' : 'Edit Events'}</Text>
                    </View>
                    <View style={styles.header_right}>
                      <TouchableOpacity style={{backgroundColor:'#FFF',borderRadius:5,justifyContent:'center',alignItems:'center',paddingVertical:4,paddingHorizontal:7}} onPress={()=>this.savePrefer()}>
                          <Text style={{color:'#333',fontFamily:'Roboto-Regular',textAlign:'center'}}>Done</Text>
                      </TouchableOpacity>
                    </View>
                </View>
                <ScrollView style={{flex:1}}>
                    <View style={styles.contain}>
                    {
                        this.state.buttons.map((o,i) => {
                            if(o.upid){
                              this.inputData.push(o.id);
                              return (
                                <TouchableOpacity key={i} ref={'TOUCH'+o.id} onPress={()=>{this.toggleTick(o.id)}} style={[styles.item,{backgroundColor:'#27ccc0'}]}>
                                    <Text ref={'TEXT'+o.id} style={[styles.title,{color:'#FFF'}]}>{o.parameter}</Text>
                                    <Image ref={'PLUS'+o.id} source={imageSource.plus_icon} style={{width:0,height:0}} />
                                    <Image ref={'TICK'+o.id} source={imageSource.tick_icon} style={{width:12,height:12}} />
                                </TouchableOpacity>
                              )
                            }
                            else
                            {
                              return (
                                <TouchableOpacity key={i} ref={'TOUCH'+o.id} onPress={()=>{this.toggleTick(o.id)}} style={styles.item}>
                                    <Text ref={'TEXT'+o.id} style={styles.title}>{o.parameter}</Text>
                                    <Image ref={'PLUS'+o.id} source={imageSource.plus_icon} style={{width:12,height:12}} />
                                    <Image ref={'TICK'+o.id} source={imageSource.tick_icon} style={{width:0,height:0}} />
                                </TouchableOpacity>
                              )
                           }
                        }
                      )
                    }
                    </View>
               </ScrollView>
            </View>
      )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#292E39',
  },
  contain:{
    flex:1,
    alignItems: 'center',
    flexDirection:'row',
    justifyContent:'center',
    flexWrap:'wrap',
    margin:10,
  },
  item:{
    justifyContent:'center',
    alignItems:'center',
    padding:7,
    borderWidth:1,
    borderColor:'#353a4c',
    margin:5,
    borderRadius:5,
    flexDirection:'row',
    backgroundColor:'transparent'
  },
  title:{
    color:'#9c9fa6',
    fontFamily:'Roboto-Regular',
    fontSize:12,
    marginRight:5
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

});
