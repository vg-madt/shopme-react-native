import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { FlatList, StyleSheet, Text, View,SafeAreaView, TouchableOpacity } from 'react-native';

export default function CategoryList(props) {
    const categories = props.categories;
    var v;
    function handleChange(event) {
      props.onPress(event);
  }
  return (
    <SafeAreaView styles={styles.container}>
        <View style={styles.shadow}>
      <FlatList 
      style={styles.flatlist}
      horizontal
      keyExtractor={(item,index) => item._id}
      data = {categories}
      renderItem = {itemData =>
        
        <TouchableOpacity onPress={() => handleChange(itemData.item)}>   
        <Text style={styles.text}> {itemData.item.name}</Text>
     </TouchableOpacity>
        }
      />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text:{
      borderRadius:40,
      paddingVertical:32,
      paddingHorizontal:2,
      height:80,
      width:80,
      marginLeft:10,
      textAlign:'center',
      backgroundColor: '#a0e0e0',
      overflow: 'hidden',
      fontSize:12,
      justifyContent:'center',
      alignItems:'center',
      alignContent:'center',
      alignSelf:'center'
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
    //backgroundColor:'#000'
  },
  flatlist:{
      alignContent:'center',
  }
});
