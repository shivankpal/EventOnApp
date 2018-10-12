'use strict';
import React, { Component } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator,Linking,TouchableOpacity,Dimensions,AsyncStorage  } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './Style';
import Header from '.././Main/Header';
const imageSource = {
        XLS : require(".././Assets/Img/excel-xls-icon.png"),
        DOC: require(".././Assets/Img/word-doc-icon.png"),
        PPT: require(".././Assets/Img/ppt-icon.png"),
        PDF: require(".././Assets/Img/pdf-icon.png"),
        MP3: require(".././Assets/Img/mp3-icon.png"),
        RAR: require(".././Assets/Img/rar-icon.png"),
};
const {height, width} = Dimensions.get('window');
export default class Index extends Component {
    constructor(props) {
      super(props);
      this.state = {
          user:this.props.user,
          topevent:this.props.topevent,
          data: [],
          loading:true,
      }
      this.openUrl = this.openUrl.bind(this);
      this.page = 1;
    }
    componentWillMount () {
      this.props.googleTracker('DOWNLOADS:'+this.state.topevent.title);
      this.props.setCurrentScene('Downloads');
      setTimeout(()=>{ this.getData() },500)
    }
    getData = async (id) => {
        this.setState({animating:true})
         await fetch('https://api.eventonapp.com/api/downloads/'+this.state.topevent.id+'/'+this.page, {
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
         })
         .catch((error) => {
                this.setState({animating:false})
         })
    }
    openUrl = (url) => {
      Linking.canOpenURL(url).then(supported => {
          if (!supported) {

          } else {
            return Linking.openURL(url);
          }
          }).catch(err => console.error('An error occurred', err));
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
                <Header openDrawer={this.props.openDrawer} currentScene={"Downloads"} topevent={this.props.topevent} user={this.props.user} sudonav={this.props.sudonav}/>
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
      if(this.state.loading==false && this.state.data.length==0)
      {
          return (
            <LinearGradient
                start={this.state.topevent.theme.bg_gradient.start}
                end={this.state.topevent.theme.bg_gradient.end}
                locations={this.state.topevent.theme.bg_gradient.locations}
                colors={this.state.topevent.theme.bg_gradient.colors}
                style={{ flex: 1 }}
            >
                <Header openDrawer={this.props.openDrawer} currentScene={"Downloads"} topevent={this.props.topevent} user={this.state.user} sudonav={this.props.sudonav}/>
                <View style={{height:250,justifyContent:'center',alignItems:'center',backgroundColor:'#FFF',padding:30,borderRadius:10,margin:20}}>
                  <Text style={{fontFamily:'Roboto-Medium',color:'#222',textAlign:'center',fontSize:16}}>Sigh… It's empty!</Text>
                  <Text style={{fontFamily:'Roboto-Thin',color:'#000',textAlign:'center',marginTop:15,fontSize:12}}>The event creator hasn't uploaded any document to this event yet. Please check back the section after sometime.</Text>
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
                <Header openDrawer={this.props.openDrawer} currentScene={"Downloads"} topevent={this.props.topevent} user={this.props.user} sudonav={this.props.sudonav}/>
                <ScrollView
                    removeClippedSubviews={true}
                    contentContainerStyle={{paddingHorizontal:20,paddingBottom:40,paddingTop:20}}
                  >
                    <View>
                        <View style={{backgroundColor:'#FFF',padding:5,borderTopLeftRadius:10,borderTopRightRadius:10}}></View>
                        <View style={{backgroundColor:'#FFF'}}>
                        {  this.state.data.map((o,i) => {
                            l = (i==ld) ? 0 : 1;
                            if(o.link!=''){
                              return (
                                <TouchableOpacity onPress={()=>this.openUrl(o.link)} key={i} style={[styles.row,{flexDirection:'row',borderBottomWidth:l}]}>
                                    <View style={{marginRight:10}}>
                                      <Image source={imageSource[o.type]} style={{width:60,height:60}} />
                                    </View>
                                    <View style={{flex:1}}>
                                      <Text style={styles.title}>{o.title}</Text>
                                      <Text style={styles.description}>{o.description}</Text>
                                    </View>
                                </TouchableOpacity>
                              )
                            }
                          })
                        }
                      </View>
                      <View style={{backgroundColor:'#FFF',padding:5,borderBottomLeftRadius:10,borderBottomRightRadius:10,marginBottom:40}}></View>
                      </View>
                      {
                          (this.state.showload  && (this.state.loading==false)) ?
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
        </LinearGradient>
      );
    }
}
