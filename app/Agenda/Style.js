import { StyleSheet } from "react-native";
export default StyleSheet.create({
  container: {
      flex:1,
  },
  centering: {
   alignItems: 'center',
   justifyContent: 'center',
   padding: 8,
 },
 box: {
    margin:20,
    borderRadius:10,
 },
 row: {
   marginTop: 10,
   marginBottom: 10,
   backgroundColor:'#FFF',
   borderRadius:10,
   flexDirection:'column',
 },
 left: {
    backgroundColor:'#E5E5E5',
    flex:1,
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    alignItems:'center',
 },
right: {
   flex:1,
   padding:10,
},
title:{
  color: '#444',
  fontSize: 16,
  fontFamily:'Roboto-Medium',
  flex:1,
},
location:{
  color: '#666',
  fontSize:12,
  fontFamily:'Roboto-Regular',
},
description:{
  color: '#666',
  fontSize:12,
  fontFamily:'Roboto-Regular',
},
date:{
  alignSelf:'flex-start',
  fontFamily:'Roboto-Medium',
  fontSize:16,
  padding:10,
  color:'#999',
}
});
