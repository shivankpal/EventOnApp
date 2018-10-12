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
    backgroundColor:'#FFF'
 },
 row:{
   marginRight:10,
   marginLeft:10,
   paddingTop:10,
   paddingBottom:10,
   borderBottomWidth:1,
   borderBottomColor:'#EAEAEA'
 },
 title:{
   color: '#222',
   fontSize:16,
   fontFamily:'Roboto-Regular',
 },
 comtext:{
   color: '#666',
   fontSize:12,
   fontFamily:'Roboto-Regular',
   flex:1,
 },
 pollrow:{
   height:30,
   marginBottom:5,
   marginTop:5,
   justifyContent:'center',
   paddingLeft:10,
   alignItems:'flex-start',
},
respondbox:{
  flexDirection:'row',
  flex:1,
  justifyContent:'flex-end',
},
respondbtn:{
  alignItems:'center',
  justifyContent:'center',
  backgroundColor:'#6699ff',
  padding:10,
  borderRadius:5,
},
respondbtntext:{
  color:'#FFF',
  fontFamily:'Roboto-Regular',
},
popup:{
    flex:1,
    backgroundColor:'rgba(0,0,0,0.5)',
    justifyContent:'center',
    alignItems:'center',
},
popupin: {
    margin:20,
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:10,
    paddingRight:10,
    backgroundColor:'#FFF',
    borderRadius:10,
},
textf:{
  fontFamily:'Roboto-Regular',
  fontSize:12,
}
});
