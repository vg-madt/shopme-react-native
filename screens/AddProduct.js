import React,{useState,useEffect} from 'react';
import { FlatList, StyleSheet, Text,View,Modal,Alert,Image} from 'react-native';
import { TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import Constants from "expo-constants";
import {useIsFocused} from '@react-navigation/native'




export default function AddProduct({ navigation }) {
    const [products,setProducts]=useState([]);
    const [categories,setCategories] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [categoryModal, setCategoryModal] = useState(false);
    const [chosenCat,setChosenCat] = useState({name:"All Products",_id:"6065fc8349c6a9c057a2aef8"})
    const [productChosenCat,setpcc] = useState({name:'',_id:'',price:0,cid:''})
    const [cCat,setCCat] = useState([])
    const [name,setName] = useState('');
    const [price,setPrice] = useState(0);
    const [productAdd, setProductAdd] = useState(false)
    const [pid,setpid] = useState('')
    const [cid,setcid] = useState('')
    const [isEdit,setIsEdit] = useState(false)    
    const [imageData, setImageData] = useState(null)
    const [selectedProduct,setSelectedProduct] = useState({})
    const isFocused = useIsFocused();
    const [URI,setURI] = useState('')

    const getCategory = async (cid) => {
        try{
            let response = await fetch(
                Constants.manifest.extra.URL+'/category/'+cid
              );
              setChosenCat(await response.json())
        }catch(e){
            console.error(e);
        }
    }
    const getCategories = async () => {
        try {
          let response = await fetch(
            Constants.manifest.extra.URL+'/category'
          );
          let data = await response.json();
         // console.log("response ",data)
         data.push({name:'All Products',_id:'1'})
          let result = data.sort((a,b) => {
            return a.name.localeCompare(b.name);;
          })
          setCategories(result)
          //console.log("categories in set ",categories)
          setCCat(categories.filter((element) => {
            return element.name !=="All Products"
        }))
        setpcc(categories[0])
          //console.log('category ',Object.values(productChosenCat)[1])
        } catch (error) {
           console.error(error);
        }
    };

      useEffect(() => {
        console.log("useeffect called")
        getCategories();
        
    },[modalVisible,isFocused,categoryModal])

   

    const getProducts = async () => {
        let url;
        try {
            if(chosenCat._id==='6065fc8349c6a9c057a2aef8' || chosenCat.name === 'All Products'){
                url = Constants.manifest.extra.URL+'/product/'
            }else{
                url = Constants.manifest.extra.URL+'/product/category/'+chosenCat._id
            }
          let response = await fetch(
            url
          );
          let data = await response.json();
          setProducts(data)
        } catch (error) {
           console.error(error);
        }
      };

      useEffect(() => {
        getProducts();
    },[chosenCat,isFocused,productAdd,isEdit])

    const cancelAdd = async() => {
        setModalVisible(!modalVisible)
        setName('')
            setPrice('')
            setImageData(null)
            setIsEdit(false)
            setURI("")
    }

    const addProduct = async() => {
        setModalVisible(!modalVisible)
        setProductAdd(!productAdd)
        try{
            if(isEdit==false){
            var r = await fetch( Constants.manifest.extra.URL+'/product', {
              method: 'POST',
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              body: addImageData(imageData, {
                name:name,
                price:price,
                cid:cid
            })
              
            });
            let data = await r.json();
            setProducts(data);
            console.log('add')
        }else{
            var r = await fetch( Constants.manifest.extra.URL+'/product/update/'+pid, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                  body: addImageData(imageData, {
                    name:name,
                    price:price,
                    cid:cid
                })
                
              });
              console.log('edit');
              let data = await r.json();
              setProducts(data);
              
        }
            setName('')
            setPrice('')
            setImageData(null)
            setIsEdit(false)
            setURI("")
      
          } catch(e){
            console.log('post req error ',e);
          }
        
    }

    const deleteProduct = async(event) => {
        setProductAdd(!productAdd)

        try{
            var r = await fetch( Constants.manifest.extra.URL+'/product/delete/'+event._id);
            let data = await r.json();
            setProducts(data);
            console.log("values after del ",data);
          } catch(e){
            console.log('post req error ',e);
          }
    }

    const editProduct = (event) => {
        console.log("event click -> ",event.price)
        getCategory(event.cid)
        setModalVisible(!modalVisible);
        setName(event.name)
        setPrice(event.price.toString())
        setcid(event.cid)
        setpid(event._id)
        setSelectedProduct(event)
        setIsEdit(true)
    }

    const getChosenCategory = (event) => {
        setCategoryModal(!categoryModal)
        setcid(event._id)
        setChosenCat(event)
        setpcc(event)
        console.log("chosen id and name ",event._id,event.name)
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        console.log(result);
    
        if (!result.cancelled) {
          setImageData(result);
          setURI(result.uri)
          //console.log("result ",result)
        }
      };

    const addImageData = (imageData,body) => {
        const data = new FormData();
    
        if(imageData){
        data.append("fileData",{
            name:name+(new Date())+'.jpg',
            type: 'image/jpeg',
            uri: 
            Platform.OS === "iOS" ? imageData.uri : imageData.uri.replace("file://", "")
        });
    }
        data.append('name',name)
        data.append('price',parseFloat(price))
        data.append('cid',chosenCat._id)
        //console.log("data ",data)
        
          return data;
    }



    return (
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
          <View style={styles.container}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Add Product</Text>
            <TextInput style={styles.textInput}
        placeholder='Product Name' 
        value={name}
        onChangeText={(name) => setName(name)}/>
        <TextInput style={styles.textInput}
        placeholder='Product Price' 
        value={price.toString()}
        onChangeText={(price) => setPrice(price)}/>

        <TouchableOpacity style={styles.category} onPress={() => setCategoryModal(!categoryModal)}>
            <Text style={{fontSize:15}}>{chosenCat.name}  <Icon style ={styles.icon} size={25} name="sort-down"/></Text></TouchableOpacity>
            <Image style={styles.modalImage} source={URI!=""  ? {uri:URI}: {uri:Constants.manifest.extra.URL+'/product/image/'+selectedProduct.image}}/>
            <TouchableOpacity style={styles.category} onPress={pickImage}>
            <Text style={{fontSize:15}}>Upload Image</Text></TouchableOpacity>
        <View style={styles.product}>
        <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={cancelAdd}>
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={addProduct}>
              <Text style={styles.textStyle}>Add</Text>
            </TouchableOpacity>
            
            </View>
          </View>
        </View>


        <Modal
        //modal for choosing category
        animationType="slide"
        transparent={true}
        visible={categoryModal}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setCategoryModal(!categoryModal);
        }}
      >
          <View style={styles.container}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Choose Category</Text>
            <FlatList 
            style={styles.flatlist}
            keyExtractor={(item,index) => item._id}
            data = {cCat}
            renderItem = {itemData =>   
                <View>
                <TouchableOpacity style={styles.product}
                onPress={() => getChosenCategory(itemData.item)}>
        <Text style={styles.text}> {itemData.item.name}</Text>
        </TouchableOpacity>
        <View style={styles.line}></View>
        </View>
        }/>          
        </View>
        </View>
      </Modal>
      
      </Modal>


      <Modal
        animationType="slide"
        transparent={true}
        visible={categoryModal}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setCategoryModal(!categoryModal);
        }}
      >
          <View style={styles.container}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Choose Category</Text>
            <FlatList 
            style={styles.flatlist}
            keyExtractor={(item,index) => item._id}
            data = {categories}
            renderItem = {itemData =>   
                <View>
                <TouchableOpacity style={styles.product}
                onPress={() => getChosenCategory(itemData.item)}>
        <Text style={styles.text}> {itemData.item.name}</Text>
        </TouchableOpacity>
        <View style={styles.line}></View>
        </View>
        }/>          
        </View>
        </View>
      </Modal>
      <View style={{flexDirection:'row'}}>
        <Text style={styles.heading}>Products</Text>
        <TouchableOpacity style={styles.cat} onPress={() => setCategoryModal(true)}>
            <Text style={{fontSize:14,textAlign:'center'}}>{chosenCat.name}  <Icon style ={styles.icon} size={20} name="sort-down"/></Text></TouchableOpacity>
            </View>
        <FlatList 
            style={styles.flatlist}
            keyExtractor={(item,index) => item._id}
            data = {products}
            renderItem = {itemData =>   
                <View>
                <View style={styles.product}>
                <Image style={styles.image} source={{uri:Constants.manifest.extra.URL+'/product/image/'+itemData.item.image}}/>
        <Text style={styles.text}> {itemData.item.name}</Text>
        <TouchableOpacity onPress={() => editProduct(itemData.item)}>
        <Icon style ={styles.icon} size={25} name="edit"/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteProduct(itemData.item)}>
        <Icon style ={styles.icon} size={25} name="trash"/>
        </TouchableOpacity>
        </View>
        <View style={styles.line}></View>
        </View>
        }
      />
      <TouchableOpacity style ={styles.add}
      onPress={()=>setModalVisible(true)}>
        <Icon size={30} color='white' name="plus"/>
        </TouchableOpacity>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingTop:50
    },
    product:{
        flexDirection:'row'
    },
    heading:{
        fontSize:26,
        fontWeight:'400',
        marginLeft:20,
        marginTop:-20,
        marginBottom:10
    },
    text:{
        paddingVertical:18,
        paddingHorizontal:10,
        height:50,
        marginVertical:5,
        width:'60%',
        backgroundColor: 'white',
        overflow: 'hidden',
        fontSize:16
    },
    icon:{
        color:'#1874CD',
        paddingVertical:18,
        paddingHorizontal:12

    },
    add:{
        backgroundColor:'#152026',
        height:60,
        width:60,
        justifyContent:'center',
        padding:18,
        marginLeft:330,
        borderRadius:35,
        marginBottom:20,
        color:'white',
    },
    flatlist:{
        alignContent:'center',
        marginLeft:20
    },
    line:{
        borderBottomColor:'#a1a1a1',
        borderBottomWidth:1,
        marginHorizontal:0
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 15,
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
      button: {
        borderRadius: 35,
        padding: 16,
        elevation: 2,
        width:100,
        alignItems:'center',
        margin:10,
        marginTop:20
      },
      buttonClose: {
        backgroundColor: "#152026"
      },
      textInput:{
        borderColor:'#152026',
        height:60,
        width:340,
        borderRadius:30,
        backgroundColor:'#EBEFF2',
        marginVertical:10,
        paddingHorizontal:30,
        alignSelf:'center'
    },
    image:{
        height:40,
        width:40,
        marginTop:10,
        marginBottom:10
      },
      modalImage:{
        height:60,
        width:60,
        marginTop:10,
        marginBottom:10
      },
    textStyle:{
        color:'white'
    },
    category:{
      paddingHorizontal:20,
      paddingVertical:10,
      borderRadius:35,
      backgroundColor:'#b0e0e0'
    },
    cat:{
      padding:10,
      borderRadius:35,
      backgroundColor:'#b0e0e0',
      marginLeft:160,
      marginTop:0,
      justifyContent:'center',
      alignSelf:'center',
      marginTop:-24,
      height:40,
      width:120
    }
  });