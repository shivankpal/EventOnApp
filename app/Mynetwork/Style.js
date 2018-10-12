import { StyleSheet,Dimensions } from "react-native";
export default StyleSheet.create({
  container: {
      flex:1,
      backgroundColor:'#292E39'
  },
  centering: {
   alignItems: 'center',
   justifyContent: 'center',
   padding: 8,
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
 box: {
    marginHorizontal:10,
    marginVertical:20,
    borderRadius:10,
    backgroundColor:'#FFF',
    padding:5,
 },
 row:{
   marginRight:10,
   marginLeft:10,
   paddingTop:10,
   paddingBottom:10,
   borderBottomWidth:1,
   borderBottomColor:'#EAEAEA',
   flexDirection:'row'
 },
 left:{
   marginRight:10
 },
 right:{
    flex:1
 },
 name:{
   color: '#000',
   fontSize: 16,
   fontFamily:'Roboto-Regular',
 },
 location:{
   color: '#666',
   fontSize:12,
   fontFamily:'Roboto-Regular',
 },
 role:{
   color: '#666',
   fontSize:12,
   fontFamily:'Roboto-Regular',
   backgroundColor:'#eaeaea',
   alignSelf:'flex-start',
   paddingVertical:3,
   paddingHorizontal:5,
 },
 profession:{
   color: '#666',
   fontSize:12,
   fontFamily:'Roboto-Medium',
 },
 btn_box:{
    flex:1,
    paddingTop:5,
    paddingBottom:5,
 },
 btn:{
   backgroundColor:'#6699ff',
   padding:10,
   alignSelf:'flex-end',
 },
 btnText:{
   backgroundColor:'#6699ff',
   color:'#FFF',
   fontFamily:'Roboto-Regular'
 }
});
