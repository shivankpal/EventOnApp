'use strict';
import React, { Component } from 'react';
import { Image,Text  } from 'react-native';
export default class Images extends Component {
  componentWillMount(){
    if(this.props.source.uri)
    {

        Image.prefetch(this.props.source.uri);
        Image.getSize(this.props.source.uri, (width, height) => {this.setState({width, height}) });
    }
  }
    render () {
      return (
          <Image  {...this.props}>

          </Image>
      );
    }

}
