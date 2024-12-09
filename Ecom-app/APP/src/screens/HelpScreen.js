// HelpScreen.js

import React, { useContext, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ScrollView,
  SafeAreaView,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemeContext } from '../../ThemeContext';
import { lightTheme, darkTheme } from '../../themes';

const HelpScreen = () => {
  const navigation = useNavigation();

  const { theme } = useContext(ThemeContext);
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

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
  const handlePressIn = () => {
    // Animate to pressed state
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.9,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(colorAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false, // Color interpolation doesn't support native driver
      }),
    ]).start();
  };

  const handlePressOut = () => {
    // Animate back to original state and navigate back
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(colorAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start(() => {
      navigation.goBack();
    });
  };

  // Handlers for help items
  const handleFAQPress = () => {
    navigation.navigate('FAQ'); // Ensure 'FAQ' screen is defined in your navigation stack
  };

  const handleContactUsPress = () => {
    // Open email client
    Linking.openURL('mailto:support@example.com');
  };

  const handleTermsPress = () => {
    navigation.navigate('Terms'); // Ensure 'Terms' screen is defined in your navigation stack
  };

  const handlePrivacyPress = () => {
    navigation.navigate('Privacy'); // Ensure 'Privacy' screen is defined in your navigation stack
  };

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
          {/* <TouchableWithoutFeedback
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
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
            Help & Support
          </Text>
        </LinearGradient>

        {/* Help Options */}
        <View style={styles.helpContainer}>
          {/* Frequently Asked Questions */}
          <TouchableOpacity
            style={[styles.helpItem, { borderBottomColor: currentTheme.borderColor }]}
            onPress={handleFAQPress}
            activeOpacity={0.7}
            accessibilityLabel="Frequently Asked Questions"
            accessibilityRole="button"
          >
            <View style={styles.helpInfo}>
              <Ionicons
                name="help-circle"
                size={24}
                color={currentTheme.primaryColor}
                style={styles.icon}
              />
              <Text style={[styles.helpText, { color: currentTheme.textColor }]}>
                Frequently Asked Questions
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={currentTheme.placeholderTextColor}
            />
          </TouchableOpacity>

          {/* Contact Us */}
          <TouchableOpacity
            style={[styles.helpItem, { borderBottomColor: currentTheme.borderColor }]}
            onPress={handleContactUsPress}
            activeOpacity={0.7}
            accessibilityLabel="Contact Us"
            accessibilityRole="button"
          >
            <View style={styles.helpInfo}>
              <Ionicons
                name="mail"
                size={24}
                color={currentTheme.primaryColor}
                style={styles.icon}
              />
              <Text style={[styles.helpText, { color: currentTheme.textColor }]}>
                Contact Us
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={currentTheme.placeholderTextColor}
            />
          </TouchableOpacity>

          {/* Terms and Conditions */}
          <TouchableOpacity
            style={[styles.helpItem, { borderBottomColor: currentTheme.borderColor }]}
            onPress={handleTermsPress}
            activeOpacity={0.7}
            accessibilityLabel="Terms and Conditions"
            accessibilityRole="button"
          >
            <View style={styles.helpInfo}>
              <Ionicons
                name="document-text"
                size={24}
                color={currentTheme.primaryColor}
                style={styles.icon}
              />
              <Text style={[styles.helpText, { color: currentTheme.textColor }]}>
                Terms and Conditions
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={currentTheme.placeholderTextColor}
            />
          </TouchableOpacity>

          {/* Privacy Policy */}
          <TouchableOpacity
            style={[styles.helpItem, { borderBottomColor: currentTheme.borderColor }]}
            onPress={handlePrivacyPress}
            activeOpacity={0.7}
            accessibilityLabel="Privacy Policy"
            accessibilityRole="button"
          >
            <View style={styles.helpInfo}>
              <Ionicons
                name="lock-closed"
                size={24}
                color={currentTheme.primaryColor}
                style={styles.icon}
              />
              <Text style={[styles.helpText, { color: currentTheme.textColor }]}>
                Privacy Policy
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={currentTheme.placeholderTextColor}
            />
          </TouchableOpacity>
        </View>
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
    // borderBottomWidth: 2, // Thickness of the bottom border
    // Dynamic borderBottomColor is set inline
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
  helpContainer: {
    marginTop: 10,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginLeft: 15
  },
  helpInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpText: {
    fontSize: 18,
    flexShrink: 1, // Ensure text wraps if too long
  },
  icon: {
    marginRight: 15,
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

export default HelpScreen;
