import { StyleSheet,Dimensions } from "react-native";
export default StyleSheet.create({
     container: {
        flex:1,
        opacity:1,
        backgroundColor:'transparent',
     },
     header:{
        height:50,
        flexDirection:'row',
        backgroundColor:'transparent',
        paddingLeft:10,
        paddingRight:10,
        alignItems:'center',
     },
     header_left:{
       justifyContent: 'center',
       position:'absolute',
       top:0,
       left:0,
       height:50,
       padding:10,
     },
     header_center:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal:10,
     },
     header_right:{
       justifyContent: 'center',
       alignItems: 'center',
       position:'absolute',
       top:0,
       right:0,
       height:60,
       padding:10,
       flexDirection:'row',
     },
     header_center_title:{
       color: 'white',
       margin: 10,
       fontSize: 16,
       fontFamily:'Roboto-Medium',
     },
     main:{
       flex:1,
       backgroundColor:'transparent'
     },
     row:{
       width: window.width,
       flexDirection:'row',
       padding:5,
       justifyContent:'center',
       alignItems:'center',
       borderTopWidth:1,
       borderColor:'#EAEAEA',
     },
     listicon:{
       justifyContent:'flex-start',
       padding:10,
     },
     listbox:{
       flex:3
     },
     icons:{
       width:50,
       height:50,
       borderRadius:25,
       alignSelf:'center'
     },
     title:{
       fontSize:15,
       fontWeight:'600',
       color:'#777'
     },
     footer:{
        width:window.width+3,
        height:50,
        backgroundColor:'#444',
        flexDirection:'row',
        alignItems:'center',
        padding:10
     },
     footer_center:{
        flex:2.5,
        justifyContent: 'flex-start',
     },
     footer_right:{
        flex:1,
        justifyContent: 'flex-end',
        padding:5,
        backgroundColor:'#F79633',
        alignItems:'center'
     },
     footer_center_title:{
       color: 'white',
       fontSize: 14,
       fontWeight:'200',
     },
     button:{
       color:'#FFF',
       fontSize: 14,
       fontWeight:'400',
     }
});
