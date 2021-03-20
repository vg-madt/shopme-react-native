import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, TextInput, SafeAreaView} from 'react-native';
import {SearchBar} from 'react-native-elements';
export default function Search(props) {
    const searchVal = props.searchVal;

    function handleSearch(event) {
      props.onChangeText(event);
      //console.log('target ',event);
  }

  return (
    <SafeAreaView style={styles.container}>
        <SearchBar
        placeholder="Search Product"
        darkTheme={true}
        value={searchVal}
        onChangeText={() => handleSearch(searchVal)}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:90

    },
    searchBar:{
      borderRadius:30,
      width:400,
      padding:20,
      textAlign:'left',
      backgroundColor: '#EBEFF2',
      marginHorizontal:20,
      marginTop:10,
      fontSize:16
  }
});
