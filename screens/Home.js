import React, {useState,useEffect} from 'react';
import { FlatList, StyleSheet, Text, View,SafeAreaView,Image,Modal } from 'react-native';
import CategoryList from '../components/CategoryList'
import {useIsFocused} from '@react-navigation/native'
import ProductList from '../components/ProductList';
import SyncStorage from 'sync-storage';
import {SearchBar} from 'react-native-elements';
import Constants from "expo-constants";
import Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Home({navigation}) {

    //SyncStorage.set('currentUser', 'Guest');
    const [products,setProducts] = useState([]);
    const [value, setValue] = useState(1);
    const [productAdded,setProductAdded] = useState(false)
    const [searchVal, setSearchVal] = useState('');
    const [categories,setCategories] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    var [currentCategory, setCurrentCategory] = useState({_id:'6065fc8349c6a9c057a2aef8', name: 'All Products'});
    var CID;
    const [sortVal,setSortVal] = useState("NA")
    var [isSort,setIsSort] = useState(false)
    var sortBy = ["Price - High to Low","Price - Low to High","Newest Arrivals"]
    const isFocused = useIsFocused()
    
    function handleAdd(p){
      console.log("prodyct add ",p)
      addToCart(p)
    }

    function handleChange(newC){
        console.log('new c ->',newC._id)
        setCurrentCategory(newC);
        setSearchVal('')
        if(value>=2){
        setValue(1);
        }else{
        setValue(value+1);
        }
    }

    const handleSearch = () => {
        console.log('product searched ',searchVal);

        if(searchVal!= ''){
          
        getSearchedProducts();
        }else{
          getProductsFromApi()
        }
    }
    useEffect(() => {
        getSearchedProducts();
    },[searchVal]);

    useEffect(() => {
      getProductsFromApi()
      getCategoriesFromApi();
  },[isFocused]);

    const getSearchedProducts = async () => {
        try {
          if(searchVal!==''){
          let response = await fetch(
            Constants.manifest.extra.URL+'/product/search/'+searchVal
          );
          let data = await response.json();
          console.log("searched products",data);
          setProducts(data);
          }
        } catch (error) {
           console.error(error);
        }
      };


    useEffect(() => {
        getProductsFromApi();
        
    },[value])

    const getProductsFromApi = async () => {
      let url;
        try {
            if(currentCategory._id==='1' || currentCategory.name === 'All Products'){
                url = Constants.manifest.extra.URL+'/product/'
            }else{
                CID = currentCategory._id;
                //console.log('products of category ',currentCategory._id)
                url = Constants.manifest.extra.URL+'/product/category/'+CID
            }
          let response = await fetch(
            url
          );
          let data = await response.json();
          setProducts(data);
        } catch (error) {
           console.error(error);
        }
      };



    
    const getCategoriesFromApi = async () => {
        try {
          let response = await fetch(
            Constants.manifest.extra.URL+'/category'
          );
          let data = await response.json();
          
          data.push({name:'All Products',_id:'1'})
          let result = data.sort((a,b) => {
            return a.name.localeCompare(b.name);;
          })
          //console.log("result ",result)
          setCategories(data);
         // console.log("Home categories ",categories)
        } catch (error) {
           console.error(error);
        }
      };

      var currentUser = SyncStorage.get('currentUser');
  var isLoggedIn = SyncStorage.get('isLoggedIn');
  const [cart,setCart] = useState({})
  const [saveC,setSaveCart] = useState(false)
  //const isFocused = useIsFocused();
 
  useEffect(() => {
    getCart();
},[isFocused]);

useEffect(() => {
  saveCart();
},[productAdded]);



  if(currentUser === '' || currentUser === undefined){
    currentUser = 'Guest';
    isLoggedIn = false;
    //console.log("curent user in home ",currentUser);
}else{
    currentUser=currentUser;
    isLoggedIn=true;
}


  const getCart = async () => {
    try {
      console.log("getcart is called");
      let response = await fetch(
        Constants.manifest.extra.URL+'/cart/'+currentUser
      );
      let data = await response.json();
      setCart(data);
      console.log("cart value",cart.products)
    } catch (error) {
       console.error(error);
    }
  };
  const saveCart = async ()=>{
    try{
      console.log("save to cart is called ",cart);
      var r = await fetch(Constants.manifest.extra.URL+'/cart/'+currentUser, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
                  'Accept':'application/json' },
        body: JSON.stringify({
          products:cart.products,
          totalcost:cart.totalcost,
          hst:cart.hst,
          subtotal:cart.subtotal
        })
        
      });
      let data = await r.json();
    } catch(e){
      console.log('post req error ',e);
      //console.log('invalid user');
    }
  }
  const addToCart = async (product) => {
    //getCart();
  
    console.log("product to add ",product)
    currentUser = SyncStorage.get('currentUser');
    const found = cart.products.some(el => el._id === product._id)
    var data = JSON.parse(JSON.stringify(cart))
    if(!found){
      product.count = 1
      console.log("old cart ",cart)
      //setCartProducts(products => [...products,product])
      
      data.products.push(product)
      data.subtotal = data.subtotal + product.price
      data.hst = data.subtotal * 0.13
      data.totalcost = data.subtotal+data.hst
      console.log("new cart ",data)
      
    }else{
      var pr = data.products.findIndex(p => p._id === product._id)
      console.log("found ",pr)
      //pr.count = pr.count+1
      //data.products.push(pr)
      data.products[pr].count = data.products[pr].count+1
      data.subtotal = data.subtotal + (data.products[pr].price * (data.products[pr].count-1))
      data.hst = data.subtotal * 0.13
      data.totalcost = data.subtotal + data.hst
  
    }
    setCart(data)
    setSaveCart(!saveC)
    setProductAdded(!productAdded)
  }

  const sortProducts = (sort) => {
    setModalVisible(!modalVisible)
    console.log("sort req ",sort)
    if(sort === "Price - Low to High"){
      setSortVal("LH")
    }else if(sort==="Price - High to Low"){
      setSortVal("HL")
    }else if(sort === "Newest Arrivals"){
      setSortVal("NA")
    }
      setIsSort(!isSort)
      console.log("sortval in case ",sortVal,isSort)
  }

  useEffect(() => {
    getSortedProducts()  
  },[isSort]);

  const getSortedProducts = async () => {
    console.log("sortval in get",sortVal)
    try{
      let response = await fetch(
        Constants.manifest.extra.URL+'/product/sort/'+sortVal
      );
      let data = await response.json();
      console.log("sorted products array ",data)
      setProducts(data);
    }catch(e){
      console.log(error)
    }
  }


  return(
    <View style={styles.container}>
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
          <View style={styles.container,{marginTop:40}}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Sort By</Text>
            <FlatList 
            style={styles.flatlist}
            keyExtractor={(item,index) => index.toString()}
            data = {sortBy}
            renderItem = {itemData =>   
                <View>
                <TouchableOpacity
                onPress={() => sortProducts(itemData.item)}>
        <Text style={styles.text}> {itemData.item}</Text>
        </TouchableOpacity>
        <View style={styles.line}></View>
        </View>
        }/>          
        </View>
        </View>
</Modal>

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
          <View style={styles.sort}>
            <TouchableOpacity onPress={() => setModalVisible(true)}><Text style={{fontSize:16,marginTop:40}}>Sort By  <Icon name="sort-down" size={20}/></Text></TouchableOpacity></View>
        <Text style={styles.heading}>{currentCategory.name}</Text>
        <ProductList products={products}
        onPress={handleAdd}/>
        </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container:{
        flex:1,

    },
    search:{
        flex:1,
        backgroundColor:'white'
    },
    categoryList:{
        flex:1,
        marginTop:-620,
        backgroundColor:'white'
    },
    productList:{
        flex:1,
        marginTop:-30
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
    },
    sort:{
      marginLeft:300,
      marginTop:0
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    },
    line:{
      borderBottomColor:'#a1a1a1',
      borderBottomWidth:1,
      marginHorizontal:10
  },
  text:{
    fontSize:20,
    padding:10
  }
});


