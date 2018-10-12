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
  } from 'react-native';
  import CustomStatusBar from '.././Common/CustomStatusBar';
  import ToastAndroid from '@remobile/react-native-toast';
  const imageSource = {
      back_icon : require(".././Assets/Img/arrow_left.png"),
      forward_icon : require(".././Assets/Img/arrow_right.png"),
  };
var {height, width} = Dimensions.get('window');
export default class Screen1 extends Component {
  constructor() {
    super();
    this.state = {
        buttons:[],
        screen_title:'',
        data:'',
        skip:0,
        loading:true
    }
    this.getData = this.getData.bind(this);
  }
  componentWillMount(){
      setTimeout(()=>{ this.getData(1) },400)
  }

  getData = async (id) => {
    await fetch('https://api.eventonapp.com/api/profiling/'+id, {
       method: 'GET',
    }).then((response) => response.json())
    .then((responseJson) => {
          this.setState({ buttons: responseJson.data.buttons, screen_title: responseJson.data.screen_title },()=>{
                this.setState({loading:false})
          });
     });
  }
  toggleTick = (tag, skip) => {
    if(this.state.data.length)
    {
        this.refs[this.state.data].setNativeProps({
          style: {
            color: "#9c9fa6",
            fontSize:13,
          }
        })
        this.refs['TOUCH_'+this.state.data].setNativeProps({
          style: {
            borderColor:'#353a4c'
          }
        })
    }
    this.setState({data:tag, skip:skip});
    this.refs[tag].setNativeProps({
			style: {
				color: "#EAEAEA",
        fontSize:15,
			}
		})
    this.refs['TOUCH_'+tag].setNativeProps({
      style: {
        borderColor:'#EAEAEA'
      }
    })
    setTimeout(()=>{
      this.pushToScreen2()
    },500)
  }
  pushToScreen2 = () => {
    if(this.state.data.length)
    {
        if(parseInt(this.state.skip)>0)
        {
            this.props.navigator.push({ id: 'Screen3', data: [this.state.data]  })
        }
        else
        {
            this.props.navigator.push({ id: 'Screen2', data: this.state.data  })
        }
    }
    else
    {
       ToastAndroid.show('Please select one' , ToastAndroid.LONG);
    }
  }
  render() {
      if(this.state.loading)
      {
        return (
            <View style={{flex:1,backgroundColor:'#292E39',justifyContent:'center'}}>
                <CustomStatusBar backgroundColor="#292E39" barStyle="light-content"/>
                <View style={{flex:0.2,justifyContent:'center',alignItems:'center',borderBottomWidth:1,borderColor:'#353a4c'}}>
                    <TouchableOpacity style={{position:'absolute',top:0,right:0,padding:15}} onPress={()=>this.pushToScreen2()}>
                          <Image source={imageSource.forward_icon} style={{width:25,height:20}}/>
                    </TouchableOpacity>
                    <Text style={{fontFamily:'Roboto-Regular',color:'#9c9fa6',fontSize:18,marginTop:20}}>{this.state.screen_title.toUpperCase()}</Text>
                </View>
                <View style={{flex:1,justifyContent:'center'}}>
                    <ActivityIndicator
                      style={{alignItems: 'center',justifyContent: 'center',padding: 8}}
                      color="#6699ff"
                      size="large"
                    />
                </View>
            </View>
        )
      }
      return (
        <View style={{flex:1,backgroundColor:'#292E39',justifyContent:'center'}}>
            <CustomStatusBar backgroundColor="#292E39" barStyle="light-content"/>
              <View style={{flex:0.2,justifyContent:'center',alignItems:'center',borderBottomWidth:1,borderColor:'#353a4c'}}>
                  <TouchableOpacity style={{position:'absolute',top:0,right:0,padding:15}} onPress={()=>this.pushToScreen2()}>
                        <Image source={imageSource.forward_icon} style={{width:25,height:20}}/>
                  </TouchableOpacity>
                  <Text style={{fontFamily:'Roboto-Regular',color:'#9c9fa6',fontSize:18,marginTop:20}}>{this.state.screen_title.toUpperCase()}</Text>
              </View>
              <ScrollView style={{marginTop:10}} contentContainerStyle={{flexDirection:'row',flexWrap:'wrap'}}>
                {
                    this.state.buttons.map((o,i) => {
                      var nwidth = (width-40)/2;
                      return (
                        <TouchableOpacity key={i} ref={'TOUCH_'+o.id} onPress={()=>{this.toggleTick(o.id,o.skip_next_screen)}}  style={{borderWidth:1,borderColor:'#353a4c',width:nwidth,height:nwidth/2,justifyContent:'center',alignItems:'center',margin:10,padding:10}}>
                            <Text ref={o.id} style={{fontFamily:'Roboto-Medium',color:'#9c9fa6',fontSize:13,textAlign:'center'}}>{o.parameter}</Text>
                        </TouchableOpacity>
                      )
                  })
                }
              </ScrollView>
        </View>
      )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#FFF',
  },
  contain:{
    flex:1,
    alignItems: 'center',
    flexDirection:'row',
    justifyContent:'space-around',
    flexWrap:'wrap',
    marginTop:100,
  },
  item:{
    justifyContent:'center',
    alignItems:'center',
    padding:10,
    paddingLeft:15,
    paddingRight:15,
    margin:5,
    borderWidth:0.5,
    borderColor:'#36505B',
  },
  title:{
    color:'#888',
    fontFamily:'Roboto-Regular'
  },
  header:{
    height:60,
    backgroundColor:'blue'
  },
  footer:{
    height:60,
    backgroundColor:'#487597'
  }

});
