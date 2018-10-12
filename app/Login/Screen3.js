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
  Dimensions
} from 'react-native';
import CustomStatusBar from '.././Common/CustomStatusBar';
import ToastAndroid from '@remobile/react-native-toast';
const imageSource = {
    plus_icon : require(".././Assets/Img/pfile_plus.png"),
    tick_icon : require(".././Assets/Img/pfile_tick.png"),
    back_icon : require(".././Assets/Img/arrow_left.png"),
    forward_icon : require(".././Assets/Img/arrow_right.png"),
};
const {height, width} = Dimensions.get('window');
export default class Screen3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
        buttons:[],
        screen_title:'',
        data:'',
        prevData:this.props.data,
        user:false,
        topevent:false,
        loading:true,
    }
    this.getData = this.getData.bind(this);
    this.inputData= new Array();
  }

  componentWillMount(){
    setTimeout(()=>{ this.getData(3) },400)
  }
  getData = async (id) => {
    await fetch('https://api.eventonapp.com/api/profiling/'+id, {
       method: 'GET',
    }).then((response) => response.json())
    .then((responseJson) => {
          this.setState({buttons: responseJson.data.buttons,screen_title: responseJson.data.screen_title},()=>{
                this.setState({loading:false})
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
          width: 15,
          height: 15
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
          width: 15,
          height: 15
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
  pushToScreen4 = () => {
    if(this.inputData.length)
    {
        var prevData = this.state.prevData;
        prevData = prevData.concat(this.inputData);
        this.props.navigator.push({ id: 'Screen4', data:prevData  })
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
                  <TouchableOpacity onPress={()=>{this.props.navigator.pop()}} style={{position:'absolute',top:0,left:0,padding:15}}>
                        <Image source={imageSource.back_icon} style={{width:25,height:25}}/>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>this.pushToScreen4()} style={{position:'absolute',top:0,right:0,padding:15}}>
                        <Image source={imageSource.forward_icon} style={{width:25,height:25}}/>
                  </TouchableOpacity>
                  <Text style={{fontFamily:'Roboto-Regular',color:'#9c9fa6',fontSize:18,marginTop:20}}>{this.state.screen_title.toUpperCase()}</Text>
              </View>
                <ScrollView style={{flex:1}}>
                    <View style={styles.contain}>
                    {
                        this.state.buttons.map((o,i) => {
                            return (
                              <TouchableOpacity key={i} ref={'TOUCH'+o.id} onPress={()=>{this.toggleTick(o.id)}} style={styles.item}>
                                  <Text ref={'TEXT'+o.id} style={styles.title}>{o.parameter}</Text>
                                  <Image ref={'PLUS'+o.id} source={imageSource.plus_icon} style={{width:15,height:15}} />
                                  <Image ref={'TICK'+o.id} source={imageSource.tick_icon} style={{width:0,height:0}} />
                              </TouchableOpacity>
                            )
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
    backgroundColor:'#FFF',
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
    flexDirection:'row'
  },
  title:{
    color:'#9c9fa6',
    fontFamily:'Roboto-Regular',
    fontSize:12,
    marginRight:5
  },
  header:{
    height:60,
    backgroundColor:'blue'
  },
  footer:{
    height:60,
    backgroundColor:'blue'
  }

});
