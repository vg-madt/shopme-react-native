import { StatusBar } from 'expo-status-bar';
import React, { useState,useEffect } from 'react';
import { FlatList,Button, StyleSheet, Text, View,SafeAreaView, TouchableOpacity, Image } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import Constants from "expo-constants";

export default function ProductList(props) {
  const prods = props.products;
  function handleAdd(event){
    props.onPress(event);
  }
  
  return (
    <SafeAreaView style={styles.container}>
       <View> 
       <FlatList 
      style={styles.flatlist}
      keyExtractor={(item,index) => item._id}
      data = {prods}
      //extraData={isChanged}
      renderItem = {itemData =>
        <View>
        <TouchableOpacity style={styles.shadow}>
          <Image style={styles.image} source={{uri:Constants.manifest.extra.URL+'/product/image/'+itemData.item.image}}/>          
          </TouchableOpacity>
        
        <View>
        <Text style={styles.text}> {itemData.item.name}</Text>
        </View>
        <View style ={styles.cart}>
          <Text style={styles.price}>CA${itemData.item.price}</Text>
        </View>
        <TouchableOpacity style={styles.icon} onPress={() => handleAdd(itemData.item)}>
        <Icon name="cart-plus" size={40} color="#152026"/>
        <Text>Add to Cart</Text>
        </TouchableOpacity>
        </View>}/>
     </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:'row',
    backgroundColor: '#fff',
    marginTop:30,
    justifyContent:'center',
    width:'100%'
  },
  cart:{
    flexDirection:'row',
    marginLeft:14
  },
  text:{
      paddingTop:18,
      width:300,
      fontSize:16,
      marginBottom:10,
      marginLeft:10
  },
  price:{
    fontSize:16,
    fontWeight:'bold'
  },
  icon:{
    marginTop:-54,
    marginLeft:180,
    alignItems:'center'
  },
  image:{
    height:280,
    width:280,
    borderRadius:30,
    marginLeft:10,
    marginTop:20
  },
  shadow:{

    shadowColor: "#000",
    shadowOffset: {
        width: 2,
        height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 1,
  },
  flatlist:{
      alignContent:'center',
  }
});
