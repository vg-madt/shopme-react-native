import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import React from 'react';
import Home from '../screens/Home';
import Cart from '../screens/Cart';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Settings from '../screens/Settings';
import Orders from '../screens/Orders';
import Admin from '../screens/Admin'
import Icon from 'react-native-vector-icons/FontAwesome';



const Stack = createStackNavigator();

function StackNav({navigation}) {
  return (
      <Stack.Navigator>
        <Stack.Screen name='Settings' component={Settings} />
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='Register' component={Register} />
        <Stack.Screen name='Cart' component={Cart} />
        <Stack.Screen name='Admin' component={Admin} />
        <Stack.Screen name='Orders' component={Orders} />

      </Stack.Navigator>
  );
}

const Tab = createMaterialBottomTabNavigator();

export default function MyTabs() {
  return (
    <NavigationContainer independent={true}>
    <Tab.Navigator
    activeColor="white"
    inactiveColor="#a0e0e0"
    tabBarOptions={{ showIcon: true, showLabel: false }}
    barStyle={{ backgroundColor: '#152026', height: 80, paddingTop:10 }}>
      <Tab.Screen name="Home" component={Home} options={{
              tabBarIcon: (tabInfo) => (
                <Icon name="home" size={18} color={tabInfo.color} />
              ),
            }}/>
      <Tab.Screen name="Cart" component={Cart} options={{
              tabBarIcon: (tabInfo) => (
                <Icon name="shopping-cart" size={18} color={tabInfo.color} />
              ),
            }} />
      <Tab.Screen name="Settings" children={StackNav} options={{
              tabBarIcon: (tabInfo) => (
                <Icon name="cog" size={18} color={tabInfo.color} />
              ),
            }}/>
    </Tab.Navigator>
    </NavigationContainer>
  );
}
