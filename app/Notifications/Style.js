import { StyleSheet } from "react-native";
export default StyleSheet.create({
  container: {
      flex:1,
      backgroundColor:'#487597'
  },
  centering: {
   alignItems: 'center',
   justifyContent: 'center',
   padding: 8,
 },
 box: {
    margin:10,
    borderRadius:10,
    backgroundColor:'#FFF'
 },
 row:{
   marginHorizontal:10,
   paddingVertical:15,
   borderBottomWidth:1,
   borderBottomColor:'#EAEAEA',
   flexDirection:'row',
   justifyContent:'center',
 },
 ago:{
   color: '#666',
   fontSize:10,
   fontFamily:'Roboto-Regular',
 },
 title:{
   color: '#333',
   fontSize:14,
   fontFamily:'Roboto-Bold',
 },
 description:{
   color: '#666',
   fontSize:12,
   fontFamily:'Roboto-Regular',
 },
});
