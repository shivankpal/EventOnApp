'use strict';
import React, { Component } from 'react';
import { View, Text,  ScrollView,  ActivityIndicator,AsyncStorage,Image,Dimensions,TouchableOpacity  } from 'react-native';
import ToastAndroid from '@remobile/react-native-toast';
const {height, width} = Dimensions.get('window');
export default class Pin extends Component {
    constructor(props) {
      super(props);
      this.state = {
          row: this.props.row,
          width:200,
          height:200,
          owidth: ((width-40)/2),
          loading:false,
      }
      Image.getSize(this.props.row.path, (width, height) => {this.setState({width, height},()=>{
          this.setState({loading:false});
      }) });

    }
    render () {
      if(this.state.width && this.state.height)
      {
        var nheight = this.state.height/(this.state.width/this.state.owidth);

        var xheight = (this.state.width > this.state.owidth) ? nheight : this.state.height;

        return (
          <View style={{marginVertical:10}}>
              <TouchableOpacity onPress={()=>{ this.props.showPop(this.props.row.path,this.state.height) }} style={{height: xheight, width: '100%',borderRadius:10}}>
                  <Image borderRadius={10} source={{uri:this.props.row.path}} style={{height: xheight, width: '100%',resizeMode:'contain'}}/>
              </TouchableOpacity>
              <View style={{justifyContent:'flex-end',flexDirection:'column',width:'100%'}}>
                  <View style={{flexDirection:'row'}} >
                    <Text style={{fontFamily:'Roboto-Regular',color:'#EEE',fontSize:12}}>Posted By - </Text><Text style={{fontFamily:'Roboto-Medium',color:'#FFF',fontSize:13}}>{this.props.row.posted_by}</Text></View>
                  <Text style={{paddingHorizontal:3,fontFamily:'Roboto-Regular',fontSize:11,color:'#EEE'}}>{this.props.row.format_date}</Text>
              </View>
          </View>
        )
      }
      else{
        return null;
      }
    }
}
