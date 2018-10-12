import React, { Component } from "react";
import {
	View,
	Text,
	Image,
	TouchableOpacity,
	ScrollView,
	ActivityIndicator,
	TextInput,
	Modal,
	TouchableWithoutFeedback
} from "react-native";
import styles from "./Style";
import Accordion from "react-native-collapsible/Accordion";
import ToastAndroid from '@remobile/react-native-toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
export default class Popup extends Component {
	constructor(props) {
		super(props);
		this.state = {
      defaultParameter: [],
      param: [],
      search:this.props.search,
      loading:true,
    };
		this.toggleTick = this.toggleTick.bind(this);
		this.inputRefs = [];
	}
	componentDidMount(){
		setTimeout(()=>{ this.defaultParameter() },300)
	}
	defaultParameter = async () => {
		await fetch("https://api.eventonapp.com/api/defaultParameter", {
			method: "GET"
		}).then(response => response.json()).then(responseJson => {
				this.setState({	defaultParameter: responseJson.data},() => {
						this.setState({loading:false},() => {
								if(this.props.filters)
								{
									this.props.filters.map((o,i)	=>	{
											this.toggleTick(o);
									})
								}
						})
				})
		}).catch(error => {	})
	}
	toggleTick = (pvid) => {
		var tf = this.state.param;
		var index = tf.indexOf(pvid);
		if (index > -1) {
			this.inputRefs[pvid].setNativeProps({
				style: {
					color: "#CCC"
				}
			});
			if (index > -1) {
				tf.splice(index, 1);
			}
			this.setState({ param: tf });
		} else {
			this.inputRefs[pvid].setNativeProps({
				style: {
					color: "green"
				}
			});
			tf.push(pvid);
			this.setState({ param: tf });
		}
	}
	renderContent = (section) => {
			return (
						<ScrollView scrollEventThrottle={30} style={styles.fil_content} removeClippedSubviews={true}>
							{
								section.values.map((f, j) => {
									return (
										<TouchableWithoutFeedback	key={j}	onPress={() => {	this.toggleTick(f.value)	}}>
											<View style={styles.fil_row}>
												<Text style={styles.fil_row_text}>{f.value}</Text>
												<Text
													ref={e => (this.inputRefs[f.value] = e)}
													style={styles.fil_row_tick}
												>
													✔
												</Text>
											</View>
										</TouchableWithoutFeedback>
									)
							})
						}
						</ScrollView>
			)
	}
	renderHeader(section,index,isActive) {
			return (
				<View style={styles.fil_header}>
					<Text style={styles.fil_headerText}>{section.title}</Text>
					{ (isActive) ?	<Text style={{color:'#444',fontSize:20,fontFamily:'Roboto-Bold'}}>&minus;</Text> : <Text style={{color:'#444',fontSize:20,fontFamily:'Roboto-Bold'}}>&#43;</Text> }
				</View>
			);
	}
  showloading = () => {
    if(this.state.loading)
    {
      return (
        <ActivityIndicator
          style={styles.centering}
          color="#487597"
          size="large"
        />
      )
    }
    else {
      return (
        <Accordion
          initiallyActiveSection={0}
          sections={this.state.defaultParameter}
          renderHeader={this.renderHeader}
          renderContent={this.renderContent}
        />
      )
    }
  }
	resetFilter = () => {
			this.setState({search:'',param:[]},()=>{
						this.props.generateQuery(this.state.param, this.state.search)
			})
	}
	render() {
		return (
      <View style={styles.popup}>
				<KeyboardAwareScrollView bounces={false} contentContainerStyle={{justifyContent:'center'}}  keyboardShouldPersistTaps={"always"}>
          <View style={styles.popupin}>
							<View style={[styles.fil_title,{flexDirection:'row'}]}>
									<Text style={[styles.fil_title_text,{flex:1}]}>Filters</Text>
									<TouchableWithoutFeedback onPress={()=>this.resetFilter()}><Text style={[styles.fil_title_text,{alignItems:'flex-end',justifyContent:'flex-end'}]}>Clear</Text></TouchableWithoutFeedback>
							</View>
              <View style={styles.textbox}>
                  <TextInput placeholder={"Search"} underlineColorAndroid="transparent" onChangeText={(text) => { this.setState({ search: text }) }} style={styles.textinput} value={this.state.search} />
                  <TouchableOpacity style={{alignItems:'center',backgroundColor:'#CCC',padding:10,width:60,borderRadius:5}} onPress={()=>this.props.generateQuery(this.state.param, this.state.search)}>
                    <Text style={{fontFamily:'Roboto-Regular',fontSize:12}}>DONE</Text>
                  </TouchableOpacity>
              </View>
              <View style={styles.popbox}>
                  {this.showloading()}
              </View>
          </View>
				</KeyboardAwareScrollView>
      </View>
		);
	}
}
