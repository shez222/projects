// SettingsScreen.js

import React, { useContext, useRef } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  SafeAreaView,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemeContext } from '../../ThemeContext';
import { lightTheme, darkTheme } from '../../themes';
import { UserContext } from '../contexts/UserContext';

const SettingsScreen = () => {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = React.useState(true);
  const navigation = useNavigation();

  const { theme, toggleTheme } = useContext(ThemeContext);
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;
  const { logout } = useContext(UserContext);

  const toggleNotifications = () =>
    setIsNotificationsEnabled((previousState) => !previousState);

  const handleToggleTheme = () => {
    toggleTheme();
  };

  const handleNavigate = (screen) => {
    navigation.navigate(screen);
  };

  const handleLogout = async () => {
    // Implement your logout functionality here
    // navigation.navigate('Login'); // Ensure 'Login' is defined in your navigation stack
    const response = await logout();
    // setLoading(false);
    console.log(response);

    if (response) {
      navigation.navigate('Login'); // Adjust as per your navigation structure
    } else {
      // setAlertTitle('Login Failed');
      // setAlertMessage('Invalid email or password.');
      // setAlertVisible(true);
    }
  };

  // Animation references for the back button
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;

  // Interpolate rotation from 0deg to -20deg on press
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-20deg'],
  });

  // Interpolate color from headerTextColor to secondaryColor on press
  const colorInterpolate = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [currentTheme.headerTextColor, currentTheme.secondaryColor],
  });

  // Create Animated Ionicons component
  const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);

  // Animation handlers for the back button
  // const handlePressIn = () => {
  //   // Animate to pressed state
  //   Animated.parallel([
  //     Animated.spring(scaleAnim, {
  //       toValue: 0.9,
  //       friction: 4,
  //       useNativeDriver: true,
  //     }),
  //     Animated.timing(rotateAnim, {
  //       toValue: 1,
  //       duration: 200,
  //       useNativeDriver: true,
  //     }),
  //     Animated.timing(colorAnim, {
  //       toValue: 1,
  //       duration: 200,
  //       useNativeDriver: false, // Color interpolation doesn't support native driver
  //     }),
  //   ]).start();
  // };

  // const handlePressOut = () => {
  //   // Animate back to original state and navigate back
  //   Animated.parallel([
  //     Animated.spring(scaleAnim, {
  //       toValue: 1,
  //       friction: 4,
  //       useNativeDriver: true,
  //     }),
  //     Animated.timing(rotateAnim, {
  //       toValue: 0,
  //       duration: 200,
  //       useNativeDriver: true,
  //     }),
  //     Animated.timing(colorAnim, {
  //       toValue: 0,
  //       duration: 200,
  //       useNativeDriver: false,
  //     }),
  //   ]).start(() => {
  //     navigation.goBack();
  //   });
  // };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentTheme.backgroundColor }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* Header Section with LinearGradient, Animated Back Button, and Title */}
        <LinearGradient
          colors={currentTheme.headerBackground}
          style={styles.header}
          start={[0, 0]}
          end={[0, 1]} // Horizontal gradient; adjust as needed
        >
          {/* Animated Back Button */}
          <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go Back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color={currentTheme.headerTextColor} />
        </TouchableOpacity>
          {/* <TouchableWithoutFeedback
          onPress={handlePressOut}
            // onPressIn={handlePressIn}
            // onPressOut={handlePressOut}
            accessibilityLabel="Go Back"
            accessibilityRole="button"
          >
            <Animated.View
              style={[
                styles.backButton,
                {
                  transform: [{ scale: scaleAnim }, { rotate: rotateInterpolate }],
                },
              ]}
            >
              <AnimatedIonicons name="arrow-back" size={24} color={colorInterpolate} />
            </Animated.View>
          </TouchableWithoutFeedback> */}

          {/* Header Title */}
          <Text style={[styles.headerTitle, { color: currentTheme.headerTextColor }]}>
            Settings
          </Text>
        </LinearGradient>

        {/* Enable Notifications */}
        <TouchableOpacity
          style={[styles.settingItem, { borderBottomColor: currentTheme.borderColor }]}
          activeOpacity={0.7}
          onPress={() => {}}
          accessibilityLabel="Enable Notifications"
          accessibilityRole="button"
        >
          <View style={styles.settingInfo}>
            <Ionicons
              name="notifications"
              size={24}
              color={currentTheme.primaryColor}
              style={styles.icon}
            />
            <Text style={[styles.settingText, { color: currentTheme.textColor }]}>
              Enable Notifications
            </Text>
          </View>
          <Switch
            trackColor={{
              false: currentTheme.switchTrackColorFalse,
              true: currentTheme.switchTrackColorTrue,
            }}
            thumbColor={currentTheme.switchThumbColor}
            ios_backgroundColor={currentTheme.switchIosBackgroundColor}
            onValueChange={toggleNotifications}
            value={isNotificationsEnabled}
          />
        </TouchableOpacity>

        {/* Dark Theme */}
        <TouchableOpacity
          style={[styles.settingItem, { borderBottomColor: currentTheme.borderColor }]}
          activeOpacity={0.7}
          onPress={() => {}}
          accessibilityLabel="Dark Theme"
          accessibilityRole="button"
        >
          <View style={styles.settingInfo}>
            <Ionicons
              name="moon"
              size={24}
              color={currentTheme.primaryColor}
              style={styles.icon}
            />
            <Text style={[styles.settingText, { color: currentTheme.textColor }]}>
              Dark Theme
            </Text>
          </View>
          <Switch
            trackColor={{
              false: currentTheme.switchTrackColorFalse,
              true: currentTheme.switchTrackColorTrue,
            }}
            thumbColor={currentTheme.switchThumbColor}
            ios_backgroundColor={currentTheme.switchIosBackgroundColor}
            onValueChange={handleToggleTheme}
            value={theme === 'dark'}
          />
        </TouchableOpacity>

        {/* Change Password */}
        <TouchableOpacity
          style={[styles.settingItem, { borderBottomColor: currentTheme.borderColor }]}
          onPress={() => handleNavigate('ChangePassword')}
          activeOpacity={0.7}
          accessibilityLabel="Change Password"
          accessibilityRole="button"
        >
          <View style={styles.settingInfo}>
            <Ionicons
              name="lock-closed"
              size={24}
              color={currentTheme.primaryColor}
              style={styles.icon}
            />
            <Text style={[styles.settingText, { color: currentTheme.textColor }]}>
              Change Password
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={currentTheme.placeholderTextColor}
          />
        </TouchableOpacity>

        {/* Language */}
        <TouchableOpacity
          style={[styles.settingItem, { borderBottomColor: currentTheme.borderColor }]}
          onPress={() => handleNavigate('LanguageSettings')}
          activeOpacity={0.7}
          accessibilityLabel="Language"
          accessibilityRole="button"
        >
          <View style={styles.settingInfo}>
            <Ionicons
              name="language"
              size={24}
              color={currentTheme.primaryColor}
              style={styles.icon}
            />
            <Text style={[styles.settingText, { color: currentTheme.textColor }]}>
              Language
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={currentTheme.placeholderTextColor}
          />
        </TouchableOpacity>

        {/* About Us */}
        <TouchableOpacity
          style={[styles.settingItem, { borderBottomColor: currentTheme.borderColor }]}
          onPress={() => handleNavigate('AboutUs')}
          activeOpacity={0.7}
          accessibilityLabel="About Us"
          accessibilityRole="button"
        >
          <View style={styles.settingInfo}>
            <Ionicons
              name="information-circle"
              size={24}
              color={currentTheme.primaryColor}
              style={styles.icon}
            />
            <Text style={[styles.settingText, { color: currentTheme.textColor }]}>
              About Us
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={currentTheme.placeholderTextColor}
          />
        </TouchableOpacity>

        {/* Log Out Button */}
        <TouchableOpacity
          onPress={handleLogout}
          style={[styles.logoutButton, { backgroundColor: currentTheme.primaryColor }]}
          activeOpacity={0.7}
          accessibilityLabel="Log Out"
          accessibilityRole="button"
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles for the components
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 30,
    justifyContent: 'center',
    // borderBottomWidth: 2, // Added for bottom border
    // borderBottomColor: '#CCCCCC', // Default color; will override below
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Elevation for Android
    elevation: 5,
  },
  backButton: {
    position: 'absolute',
    left: 15,
    padding: 8,
    borderRadius: 20, // Make it circular
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 18,
    fontWeight: '500',
  },
  icon: {
    marginRight: 15,
  },
  chevronIcon: {
    marginLeft: 'auto',
  },
  logoutButton: {
    marginTop: 40,
    paddingVertical: 15,
    marginHorizontal: 15,
    borderRadius: 10,
    alignItems: 'center',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Elevation for Android
    elevation: 5,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default SettingsScreen;
