'use strict';
import React, { Component } from 'react';
import { View,  Text,  ScrollView,  ActivityIndicator, AsyncStorage,Dimensions,Image,TouchableOpacity  } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './Style';
import Header from '.././Main/Header';
var {height, width} = Dimensions.get('window');
export default class Index extends Component {
    constructor(props) {
      super(props);
      this.state = {
          user:this.props.user,
          topevent:this.props.topevent,
          data: [],
          loading:true,
          showload:true,
          animating:false,
      }
      this.page = 1;
      this.readmore = [];
      this.readmorebtn = [];
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
    componentDidMount () {
        this.props.googleTracker('FAQ:'+this.state.topevent.title);
        this.props.setCurrentScene('FAQ');
        setTimeout(()=>{ this.getData()},500);
    }
    getData = async () => {
       this.setState({animating:true});
       await fetch('https://api.eventonapp.com/api/faq/'+this.state.topevent.id+'/'+this.page, {
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
       }).catch((error) => {  this.setState({animating:false}) })
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
                  <Header openDrawer={this.props.openDrawer} currentScene={"FAQs"} topevent={this.props.topevent} user={this.props.user} sudonav={this.props.sudonav}/>
                  <View style={[styles.box,{flex:1,justifyContent:'center',alignItems:'center'}]}>
                      <ActivityIndicator
                        style={styles.centering}
                        color="#487597"
                        size="large"
                      />
                </View>
          </LinearGradient>
        )
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
                <Header openDrawer={this.props.openDrawer} currentScene={"FAQs"} topevent={this.props.topevent} user={this.state.user} sudonav={this.props.sudonav}/>
                <View style={{height:250,justifyContent:'center',alignItems:'center',backgroundColor:'#FFF',padding:30,borderRadius:10,marginTop:10}}>
                  <Text style={{fontFamily:'Roboto-Medium',color:'#222',textAlign:'center',fontSize:16}}>Sigh… It's empty!</Text>
                  <Text style={{fontFamily:'Roboto-Thin',color:'#000',textAlign:'center',marginTop:15,fontSize:12}}>The event creator hasn't added any FAQs to this event yet. Please check back the section after sometime.</Text>
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
                <Header openDrawer={this.props.openDrawer} currentScene={"FAQs"} topevent={this.props.topevent} user={this.props.user} sudonav={this.props.sudonav}/>
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
                                <View key={i} style={[styles.row,{borderBottomWidth:l}]}>
                                    <Text style={styles.title}>{o.question}</Text>
                                    <Text style={styles.description}  ref={e => (this.readmore[o.id] = e)}  numberOfLines={2}>{o.answer}</Text>
                                    {
                                       ((o.answer.match(new RegExp("\n", "g")) || []).length > 1 || o.answer.length > 60 )  ?
                                       <View style={{alignItems:'flex-end'}} ref={e => (this.readmorebtn[o.id] = e)}>
                                           <TouchableOpacity onPress={()=>this.expandMore(o.id)} style={{justifyContent:'center',alignItems:'center'}}>
                                               <Text style={{fontSize:11,fontFamily:'Roboto-Medium',color:'#333'}}>Read More</Text>
                                           </TouchableOpacity>
                                       </View>
                                       :
                                       null
                                    }
                                </View>
                              )
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
      )
    }
}
