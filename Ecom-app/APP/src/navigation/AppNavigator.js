// src/navigation/AppNavigator.js

import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native'; // Import necessary components
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import OtpScreen from '../screens/OtpScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import MarketPage from '../screens/MarketPage';
import PurchaseHistoryScreen from '../screens/PurchaseHistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HelpScreen from '../screens/HelpScreen';
import ProductPage from '../screens/ProductPage';
import CartPage from '../screens/CartPage';
import NewPasswordScreen from '../screens/NewPasswordScreen';
import FavouritesPage from '../screens/FavouritesPage';

import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import { ThemeProvider, ThemeContext } from '../../ThemeContext';
import { lightTheme, darkTheme } from '../../themes';
import { FavouritesContext, FavouritesProvider } from '../contexts/FavouritesContext'; // Import FavouritesContext and Provider

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MarketStack = createStackNavigator();
const FavouritesStack = createStackNavigator();

const MarketStackScreen = () => (
  <MarketStack.Navigator screenOptions={{ headerShown: false }}>
    <MarketStack.Screen name="MarketHome" component={MarketPage} />
    <MarketStack.Screen name="ProductPage" component={ProductPage} />
    <MarketStack.Screen name="CartPage" component={CartPage} />
    <MarketStack.Screen name="Settings" component={SettingsScreen} />
  </MarketStack.Navigator>
);

const FavouritesStackScreen = () => (
  <FavouritesStack.Navigator screenOptions={{ headerShown: false }}>
    <FavouritesStack.Screen name="Favourites2" component={FavouritesPage} />
    <FavouritesStack.Screen name="ProductPage" component={ProductPage} />
    <FavouritesStack.Screen name="CartPage" component={CartPage} />
    <FavouritesStack.Screen name="Settings" component={SettingsScreen} />
  </FavouritesStack.Navigator>
);

const MainTabNavigator = () => {
  const { theme } = useContext(ThemeContext);
  const { favouriteItems } = useContext(FavouritesContext);

  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  const styles = StyleSheet.create({
    badge: {
      position: 'absolute',
      right: -6,
      top: -3,
      backgroundColor: currentTheme.priceColor,
      borderRadius: 8,
      width: 16,
      height: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    badgeText: {
      color: '#FFFFFF',
      fontSize: 10,
      fontWeight: 'bold',
    },
  });

  return (
    <Tab.Navigator
      initialRouteName="Market"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Favourites') {
            iconName = focused ? 'heart' : 'heart-outline';

            return (
              <View style={{ width: 24, height: 24, margin: 5 }}>
                <Ionicons name={iconName} size={size} color={color} />
                {favouriteItems.length > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {favouriteItems.length}
                    </Text>
                  </View>
                )}
              </View>
            );
          } else if (route.name === 'PurchaseHistory') {
            iconName = focused ? 'history' : 'history';
            return <MaterialIcons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Market') {
            iconName = focused ? 'storefront' : 'storefront-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'UserProfile') {
            iconName = focused ? 'person' : 'person-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Help') {
            iconName = focused ? 'help-circle' : 'help-circle-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: currentTheme.tabBarActiveTintColor,
        tabBarInactiveTintColor: currentTheme.tabBarInactiveTintColor,
        tabBarStyle: {
          backgroundColor: currentTheme.cardBackground,
        },
      })}
    >
      <Tab.Screen name="Favourites" component={FavouritesStackScreen} />
      <Tab.Screen name="PurchaseHistory" component={PurchaseHistoryScreen} />
      <Tab.Screen name="Market" component={MarketStackScreen} />
      <Tab.Screen name="UserProfile" component={UserProfileScreen} />
      <Tab.Screen name="Help" component={HelpScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <ThemeProvider>
      <FavouritesProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="Otp" component={OtpScreen} />
            <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
            <Stack.Screen name="Main" component={MainTabNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </FavouritesProvider>
    </ThemeProvider>
  );
};

export default AppNavigator;















// // src/navigation/AppNavigator.js

// import React, { useContext } from 'react';
// import { View, Text, StyleSheet } from 'react-native'; // Import necessary components
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';

// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// import LoginScreen from '../screens/LoginScreen';
// import RegisterScreen from '../screens/RegisterScreen';
// import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
// import OtpScreen from '../screens/OtpScreen';
// import UserProfileScreen from '../screens/UserProfileScreen';
// import MarketPage from '../screens/MarketPage';
// import PurchaseHistoryScreen from '../screens/PurchaseHistoryScreen';
// import SettingsScreen from '../screens/SettingsScreen';
// import HelpScreen from '../screens/HelpScreen';
// import ProductPage from '../screens/ProductPage';
// import CartPage from '../screens/CartPage';
// import NewPasswordScreen from '../screens/NewPasswordScreen';
// import FavouritesPage from '../screens/FavouritesPage';

// import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// import { ThemeProvider, ThemeContext } from '../../ThemeContext';
// import { lightTheme, darkTheme } from '../../themes';

// import { FavouritesContext, FavouritesProvider } from '../contexts/FavouritesContext'; // Import FavouritesContext and Provider

// const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();

// // Create Stack Navigators for tabs
// const MarketStack = createStackNavigator();
// const FavouritesStack = createStackNavigator();
// // Create other stack navigators as needed

// const MarketStackScreen = () => (
//   <MarketStack.Navigator screenOptions={{ headerShown: false }}>
//     <MarketStack.Screen name="Market" component={MarketPage} />
//     <MarketStack.Screen name="ProductPage" component={ProductPage} />
//     <MarketStack.Screen name="CartPage" component={CartPage} />
//     <MarketStack.Screen name="Settings" component={SettingsScreen} />
//     {/* Add other screens as needed */}
//   </MarketStack.Navigator>
// );

// const FavouritesStackScreen = () => (
//   <FavouritesStack.Navigator screenOptions={{ headerShown: false }}>
//     <FavouritesStack.Screen name="Favourites" component={FavouritesPage} />
//     <FavouritesStack.Screen name="ProductPage" component={ProductPage} />
//     <FavouritesStack.Screen name="CartPage" component={CartPage} />
//     <FavouritesStack.Screen name="Settings" component={SettingsScreen} />
//     {/* Add other screens as needed */}
//   </FavouritesStack.Navigator>
// );

// // Define the Tab Navigator
// const MainTabNavigator = () => {
//   const { theme } = useContext(ThemeContext);
//   const { favouriteItems } = useContext(FavouritesContext); // Access favouriteItems

//   const currentTheme = theme === 'light' ? lightTheme : darkTheme;

//   const styles = StyleSheet.create({
//     badge: {
//       position: 'absolute',
//       right: -6,
//       top: -3,
//       backgroundColor: currentTheme.priceColor, // Use theme color
//       borderRadius: 8,
//       width: 16,
//       height: 16,
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     badgeText: {
//       color: '#FFFFFF',
//       fontSize: 10,
//       fontWeight: 'bold',
//     },
//   });

//   return (
//     <Tab.Navigator
//       initialRouteName="Market"
//       screenOptions={({ route }) => ({
//         headerShown: false,
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName;

//           if (route.name === 'Favourites') {
//             iconName = focused ? 'heart' : 'heart-outline';

//             return (
//               <View style={{ width: 24, height: 24, margin: 5 }}>
//                 <Ionicons name={iconName} size={size} color={color} />
//                 {favouriteItems.length > 0 && (
//                   <View style={styles.badge}>
//                     <Text style={styles.badgeText}>{favouriteItems.length}</Text>
//                   </View>
//                 )}
//               </View>
//             );
//           } else if (route.name === 'PurchaseHistory') {
//             iconName = focused ? 'history' : 'history';
//             return <MaterialIcons name={iconName} size={size} color={color} />;
//           } else if (route.name === 'Market') {
//             iconName = focused ? 'storefront' : 'storefront-outline';
//             return <Ionicons name={iconName} size={size} color={color} />;
//           } else if (route.name === 'UserProfile') {
//             iconName = focused ? 'person' : 'person-outline';
//             return <Ionicons name={iconName} size={size} color={color} />;
//           } else if (route.name === 'Help') {
//             iconName = focused ? 'help-circle' : 'help-circle-outline';
//             return <Ionicons name={iconName} size={size} color={color} />;
//           }
//         },
//         tabBarActiveTintColor: currentTheme.tabBarActiveTintColor,
//         tabBarInactiveTintColor: currentTheme.tabBarInactiveTintColor,
//         tabBarStyle: {
//           backgroundColor: currentTheme.cardBackground,
//         },
//       })}
//     >
//       <Tab.Screen name="Favourites" component={FavouritesStackScreen} />
//       <Tab.Screen name="PurchaseHistory" component={PurchaseHistoryScreen} />
//       <Tab.Screen name="Market" component={MarketStackScreen} />
//       <Tab.Screen name="UserProfile" component={UserProfileScreen} />
//       <Tab.Screen name="Help" component={HelpScreen} />
//     </Tab.Navigator>
//   );
// };

// const AppNavigator = () => {
//   return (
//     <ThemeProvider>
//       <FavouritesProvider> {/* Wrap with FavouritesProvider */}
//         <NavigationContainer>
//           <Stack.Navigator
//             initialRouteName="Login"
//             screenOptions={{ headerShown: false }}
//           >
//             {/* Authentication Screens */}
//             <Stack.Screen name="Login" component={LoginScreen} />
//             <Stack.Screen name="Register" component={RegisterScreen} />
//             <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
//             <Stack.Screen name="Otp" component={OtpScreen} />
//             <Stack.Screen name="NewPassword" component={NewPasswordScreen} />

//             {/* Main App Screens with Bottom Tab Navigator */}
//             <Stack.Screen name="Main" component={MainTabNavigator} />

//             {/* Other Screens that should not show the bottom tab bar */}
//             {/* Remove SettingsScreen from here */}
//           </Stack.Navigator>
//         </NavigationContainer>
//       </FavouritesProvider>
//     </ThemeProvider>
//   );
// };

// export default AppNavigator;




// // AppNavigator.js

// import React, { useContext } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';

// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// import LoginScreen from '../screens/LoginScreen';
// import RegisterScreen from '../screens/RegisterScreen';
// import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
// import OtpScreen from '../screens/OtpScreen';
// import UserProfileScreen from '../screens/UserProfileScreen';
// import MarketPage from '../screens/MarketPage';
// import PurchaseHistoryScreen from '../screens/PurchaseHistoryScreen';
// import SettingsScreen from '../screens/SettingsScreen';
// import HelpScreen from '../screens/HelpScreen';
// import ProductPage from '../screens/ProductPage';
// import CustomHeader from '../components/CustomHeader';

// import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// import { ThemeProvider, ThemeContext } from '../../ThemeContext';
// import { lightTheme, darkTheme } from '../../themes';
// import CartPage from '../screens/CartPage';
// import NewPasswordScreen from '../screens/NewPasswordScreen';

// const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();

// const MainTabNavigator = ({ userProfileImage, username }) => {
//   const { theme } = useContext(ThemeContext);
//   const currentTheme = theme === 'light' ? lightTheme : darkTheme;

//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         header: () => (
//           <CustomHeader
//             userProfileImage={userProfileImage}
//             username={username}
//           />
//         ),
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName;

//           if (route.name === 'Market') {
//             iconName = focused ? 'storefront' : 'storefront-outline';
//             return <Ionicons name={iconName} size={size} color={color} />;
//           } else if (route.name === 'PurchaseHistory') {
//             iconName = 'history';
//             return <MaterialIcons name={iconName} size={size} color={color} />;
//           } else if (route.name === 'UserProfile') {
//             iconName = focused ? 'person' : 'person-outline';
//             return <Ionicons name={iconName} size={size} color={color} />;
//           } else if (route.name === 'Settings') {
//             iconName = focused ? 'settings' : 'settings-outline';
//             return <Ionicons name={iconName} size={size} color={color} />;
//           } else if (route.name === 'Help') {
//             iconName = focused ? 'help-circle' : 'help-circle-outline';
//             return <Ionicons name={iconName} size={size} color={color} />;
//           }
//         },
//         tabBarActiveTintColor: currentTheme.tabBarActiveTintColor,
//         tabBarInactiveTintColor: currentTheme.tabBarInactiveTintColor,
//         tabBarStyle: {
//           backgroundColor: currentTheme.cardBackground,
//         },
//       })}
//     >
//       <Tab.Screen name="Market" component={MarketPage} />
//       <Tab.Screen name="PurchaseHistory" component={PurchaseHistoryScreen} />
//       <Tab.Screen name="UserProfile" component={UserProfileScreen} />
//       <Tab.Screen name="Settings" component={SettingsScreen} />
//       <Tab.Screen name="Help" component={HelpScreen} />
//     </Tab.Navigator>
//   );
// };

// const AppNavigator = () => {
//   const userProfileImage =
//     'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg';
//   const username = 'John Doe'; // Replace with actual username from your user data

//   return (
//     <ThemeProvider>
//       <NavigationContainer>
//         <Stack.Navigator
//           initialRouteName="Login"
//           screenOptions={{ headerShown: true }}
//         >
//           {/* Authentication Screens */}
//           <Stack.Screen
//             name="Login"
//             component={LoginScreen}
//             options={{ headerShown: false }}
//           />
//           <Stack.Screen
//             name="Register"
//             component={RegisterScreen}
//             options={{ headerShown: false }}
//           />
//           <Stack.Screen
//             name="ForgotPassword"
//             component={ForgotPasswordScreen}
//             options={{ headerShown: false }}
//           />
//           <Stack.Screen
//             name="Otp"
//             component={OtpScreen}
//             options={{ headerShown: false }}
//           />
//           <Stack.Screen
//             name="NewPassword"
//             component={NewPasswordScreen}
//             options={{ headerShown: false }}
//           />

//           {/* Main App Screens with Bottom Tab Navigator */}
//           <Stack.Screen name="Main" options={{ headerShown: false }}>
//             {() => (
//               <MainTabNavigator
//                 userProfileImage={userProfileImage}
//                 username={username}
//               />
//             )}
//           </Stack.Screen>

//           {/* Product Page */}
//           <Stack.Screen
//             name="ProductPage"
//             component={ProductPage}
//             options={{
//               headerShown: true,
//               header: () => (
//                 <CustomHeader
//                   userProfileImage={userProfileImage}
//                   username={username}
//                 />
//               ),
//             }}
//           />
//           <Stack.Screen
//             name="CartPage"
//             component={CartPage}
//             options={{
//               headerShown: true,
//               header: () => (
//                 <CustomHeader
//                   userProfileImage={userProfileImage}
//                   username={username}
//                 />
//               ),
//             }}
//           />
//         </Stack.Navigator>
//       </NavigationContainer>
//     </ThemeProvider>
//   );
// };

// export default AppNavigator;
