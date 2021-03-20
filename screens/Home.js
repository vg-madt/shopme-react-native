import React, {useState,useEffect,useCallback} from 'react';
import { FlatList, StyleSheet, Text, View,SafeAreaView,Image } from 'react-native';
import CategoryList from '../components/CategoryList'
import Search from '../components/SearchBar';
import ProductList from '../components/ProductList';
import SyncStorage from 'sync-storage';
import {SearchBar} from 'react-native-elements';

export default function Home({navigation}) {

    //SyncStorage.set('currentUser', 'Guest');
    const [products,setProducts] = useState([]);
    const [value, setValue] = useState(1);
    const [searchVal, setSearchVal] = useState('');
    const [categories,setCategories] = useState([]);
    var [currentCategory, setCurrentCategory] = useState(1);
    var ID;
    
    function handleChange(newC){
        //console.log('new c ->',newC)
        setCurrentCategory(newC);
        if(value>=10){
        setValue(1);
        }else{
        setValue(value+1);
        }
        //getProductsFromApi(newC);
        //this.forceUpdate();
    }

    const handleSearch = () => {
        //setProducts(p);
        //setSearchVal(searchVal)
        console.log('product searched ',searchVal);
        if(searchVal!= ''){
        getSearchedProducts();
        }else{
            getProductsFromApi();
        }
    
    }
    useEffect(() => {
        getSearchedProducts();
    },[searchVal]);

    const getSearchedProducts = async () => {
        try {
          let response = await fetch(
            'http://localhost:5000/getProduct.action*'+searchVal
          );
          let data = await response.json();
        var obj = Object.values(data);
          console.log("iam called ",value);
          setProducts(obj);
          return obj;
        } catch (error) {
           console.error(error);
        }
      };


    useEffect(() => {
        getProductsFromApi();
    },[value])
    const getProductsFromApi = async () => {
        try {
            if(currentCategory.id==1){
                ID='undefined';
            }else if(currentCategory.id!=1){
                ID = currentCategory.id;
            }
          let response = await fetch(
            'http://localhost:5000/getProduct.action='+ID
          );
          let data = await response.json();
        var obj = Object.values(data);
          console.log("iam called ",value);
          setProducts(obj);
          return obj;
        } catch (error) {
           console.error(error);
        }
      };

      useEffect(() => {
        getArticlesFromApi();
        //console.log("cat ",currentCategory);
    },[])
    const getArticlesFromApi = async () => {
        try {
          let response = await fetch(
            'http://localhost:5000/getCategory.action'
          );
          let data = await response.json();
        var obj = Object.values(data);
          //console.log("json values ",obj);
          setCategories(obj);
          return obj;
        } catch (error) {
           console.error(error);
        }
      };


  return(
    <SafeAreaView style={styles.container}>
        
        <View style={styles.bar}>
        <Image style={styles.image}
      source={require('../assets/icon.png')} />
      <Text style={styles.head}>shopme.ca</Text>
        </View>
        <View style={styles.search}>
        <SearchBar
        placeholder="Search Product"
        darkTheme={true}
        value={searchVal}
        onChangeText={(value) => {setSearchVal(value); handleSearch(value);}}/>
        </View>
        <View style={styles.categoryList}>
        <CategoryList categories={categories}
        currentCategory={currentCategory}
        onPress={handleChange} />
        <View style={styles.productList}>
        <Text style={styles.heading}>{currentCategory.name}</Text>
        <ProductList products={products}/>
        </View>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        marginTop:0,
        padding:90

    },
    search:{
        flex:1,
        backgroundColor:'white'
    },
    categoryList:{
        flex:1,
        marginTop:-550,
        backgroundColor:'white'
    },
    productList:{
        flex:1,
        marginTop:10
    },
    heading:{
        fontSize:30,
        textAlign:'center',
        marginBottom:-20,
        marginTop:10,
    },
    bar:{
        flexDirection:'row',
        height:50,
        width:'100%',
        backgroundColor:'white',
        alignContent:'center',
        alignItems:'center',
        justifyContent:'center'

    },
    image:{
        height:44,
        width:44
    },
    head:{
        fontSize:30,
        padding:5
    }
});


