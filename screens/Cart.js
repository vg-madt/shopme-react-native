import React, { useState,useEffect } from 'react';
import {Button,FlatList, StyleSheet, Text, View,SafeAreaView,TouchableOpacity,Image, Alert} from 'react-native';
import SyncStorage from 'sync-storage';
import { useIsFocused } from "@react-navigation/native";
import { ScrollView, TextInput } from 'react-native-gesture-handler';
//import Toast from 'react-native-simple-toast';

export default function Cart({navigation}) {
  var currentUser = SyncStorage.get('currentUser');
  var isLoggedIn = SyncStorage.get('isLoggedIn');
  const [user,setUser]=useState('');
  
  var cart = [];
  const[products,setProducts]=useState([]);
  const[productIds,setProductIds]=useState([]);
  const isFocused = useIsFocused();
  var [totalCost,setT] = useState(0);
  var [hst,setH] = useState(0);
  var [subTotal,setS] = useState(0);
  const [change,setChange] = useState(true);
  const [count, setCount] = useState(0);
  
  const[customerName,setCustomerName]=useState('');
  const[customerEmail,setCustomerEmail]=useState('');
  const[phoneNumber,setPhoneNumber]=useState('');
  const[address,setAddress]=useState('');
  const[postalCode,setPostalCode]=useState('');

  

  useEffect(() => {
    console.log("called");
    getCart();
    
    //getProducts();
},[change]);

useEffect(() => {
  console.log("called");
  if(currentUser === '' || currentUser === undefined){
    currentUser = 'Guest';
    setUser('Guest');
    isLoggedIn = false;
    console.log("curent user in cart ",currentUser);
}else{
    currentUser=currentUser;
    setUser(currentUser);
    isLoggedIn=true;
}
  getCart();
  
  //getProducts();
},[isFocused]);



useEffect(() => {
  const interval = setInterval(() => {
    //currentUser = SyncStorage.get('currentUser');
    //console.log('currnt user ',currentUser);
    setCount((count) => count + 1);
  }, 10);

  const unsubscribe = navigation.addListener('focus', () => {
    setCount(0);
  });

  return () => {
    clearTimeout(interval);
    unsubscribe;
  };
}, [clearCart]);

const handleOrder = async () => {
  try{
    var r = await fetch('http://localhost:5000/addOrder.action&' + currentUser, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
                'Accept':'application/json' },
      body: JSON.stringify({
        customerEmail:customerEmail,
        customerName:customerName,
        phoneNumber:phoneNumber,
        address:address,
        postalCode:postalCode,
        details:products,
        hst:hst,
        totalCost:totalCost,
        subTotal:subTotal,
        date: new Date(),
        status:'Ordered'
      })
      
    });
    var c = await fetch('http://localhost:5000/removeCart.action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
                'Accept':'application/json' },
      body: JSON.stringify({
        id:user
      })
      
    });
    navigation.navigate('Home');
  } catch(e){
    console.log('post req error ',e);
    console.log(customerName,customerEmail,address);
  }
}

const clearCart = () => {
  if(currentUser === '' || currentUser === undefined){
    currentUser = 'Guest';
    setUser('Guest');
    isLoggedIn = false;
    console.log("curent user in cart ",currentUser);
}else{
    currentUser=currentUser;
    setUser(currentUser);
    isLoggedIn=true;
}
  try{
    var c = fetch('http://localhost:5000/removeCart.action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
                'Accept':'application/json' },
      body: JSON.stringify({
        id:currentUser
      })
      
    });
    if(change){
      setChange(false);
   }else{
     setChange(true);
   }
    console.log("cart cleared ",currentUser);
  }catch(e){
    console.log('post req error ',e);
    console.log(customerName,customerEmail,address);
  }
}
const getCart = async () => {
  try {
    console.log("getcart is called");
    let response = await fetch(
      'http://localhost:5000/getCart.action&'+currentUser
    );
    let data = await response.json();
  var obj = Object.values(data);
  cart = data;
  setProducts(data.products);
  console.log("products ",products);

  if (cart === undefined) {
    console.log("cart is undefined")
    //cart = {};
    //products = [];
    setProducts([]);
    setT(0);
    setS(0);
    setH(0);
}else if(cart.products.length==0){
  console.log("cart products is empty");
  setProducts([]);
  setT(0);
  setS(0);
  setH(0);

}else if(cart.products.length>0){
  console.log("cart has items ",cart);
  setProducts(cart.products)
    setT(cart.totalCost);
    setS(cart.subTotal);
    setH(cart.hst);
}
    return obj;
  } catch (error) {
     console.error(error);
  }
};

  return (
    <ScrollView style={styles.container}>
    <View style={styles.container}>
        <Text style={styles.heading}>Your Cart</Text>
       
        <View style={styles.line}></View>
        <SafeAreaView style={styles.container}>
       <View> 
       <FlatList 
      style={styles.flatlist}
      keyExtractor={(item,index) => index.toString()}
      data = {products}
      //extraData={isChanged}
      renderItem = {itemData =>
        <View style={styles.cart}>

          <Image style={styles.image} source={{uri:'http://localhost:5000/getImage.action-'+itemData.item.id}}/>          
        
        <Text style={styles.text}> {itemData.item.name}</Text>
          <Text style={styles.price}>CA${itemData.item.price}</Text>
        </View>}/>
     </View>
    
     {subTotal > 0 ? 
     <View>
     <Text style={styles.total}> Sub Total: CA$ {subTotal.toFixed(2)}</Text>
     <Text style={styles.total}> HST 13%: CA$ {hst.toFixed(2)}</Text>
     <Text style={styles.total}> Total: CA$  {totalCost.toFixed(2)}</Text>
     <TouchableOpacity
        onPress={clearCart}>
          <Text style={styles.clr}>Clear Cart</Text>
        </TouchableOpacity>
     
     <View>
     <Text style={styles.heading}>Shipping Details</Text>
     <View style={styles.line}></View>
       <TextInput style={styles.textInput}
       placeholder="Full Name"
       value={customerName}
       onChangeText={(customerName) => setCustomerName(customerName) }
       placeholderTextColor='#505050'/>
       <TextInput style={styles.textInput}
       placeholder="Email"
       autoCapitalize='none'
       value={customerEmail}
       onChangeText={(customerEmail) => setCustomerEmail(customerEmail) }
       placeholderTextColor='#505050'/>
       <TextInput style={styles.textInput}
       placeholder="Phone Number"
       value={phoneNumber}
       onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber) }
       placeholderTextColor='#505050'/>
       <TextInput style={styles.address}
       placeholder="Address"
       value={address}
       onChangeText={(address) => setAddress(address) }
       multiline={true}
       placeholderTextColor='#505050'/>
       <TextInput style={styles.textInput}
       placeholder="Postal Code"
       value={postalCode}
       onChangeText={(postalCode) => setPostalCode(postalCode) }
       placeholderTextColor='#505050'/>
       <TouchableOpacity
        style={styles.button}
        onPress={handleOrder}>
          <Text style={styles.btnText}>Place Order</Text>
        </TouchableOpacity>
     </View>
     </View> : <View><Text style={styles.total}>Your cart is empty!</Text></View> }    
    </SafeAreaView>
    </View>
    </ScrollView>
    
  );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingStart:5,
        paddingTop:10,
        backgroundColor:'white'

    },
    heading:{
        fontSize:30,
        marginTop:30,
        marginBottom:10
        
    },
    line:{
        borderBottomColor:'#a1a1a1',
        borderBottomWidth:1,
        marginBottom:20,
        marginRight:10
    },
    image:{
      height:40,
      width:40
    },
    cart:{
      flex:1,
      flexDirection:'row',
      padding:10,
      justifyContent:'flex-start',
      alignContent:'center',
      alignItems:'center',
      //backgroundColor:'blue'
    },
    text:{
      fontSize:14,
      paddingLeft:30
    },
    price:{
      fontSize:14,
      fontWeight:'bold',
      paddingLeft:30,
      paddingRight:10,
      flex:1,
      textAlign:'right',
      //alignSelf:'stretch'
    },
    total:{
      marginTop:20,
      fontSize:20,
      textAlign:'right',
      paddingEnd:20,
      fontWeight:'500'    
      
    },
    textInput:{
      width:360,
      height:60,
      backgroundColor:'#dBEFF2',
      borderRadius:30,
      marginTop:20,
      marginLeft:-20,
      justifyContent:'center',
      alignSelf:'center',
      padding:16,
      
    },
    address:{
      width:360,
      height:100,
      backgroundColor:'#dBEFF2',
      borderRadius:30,
      marginTop:20,
      marginLeft:-20,
      justifyContent:'center',
      alignSelf:'center',
      paddingLeft:16,
      paddingTop:20
    },
    button:{
      borderColor:'#152026',
        height:60,
        width:360,
        borderRadius:30,
        backgroundColor:'#152026',
        marginVertical:20,
        paddingHorizontal:20,
        alignItems:'center',
        justifyContent:'center',
        marginLeft:10
    },
    btnText:{
      color:'white',
      fontSize:20
    },
    clr:{
      marginTop:20,
      fontSize:20,
      textAlign:'right',
      paddingEnd:20,
      fontWeight:'500',
      color:'blue'
    }
});
