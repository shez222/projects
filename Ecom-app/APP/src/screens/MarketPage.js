// src/screens/MarketPage.js

import React, { useState, useContext, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
  useWindowDimensions,
  RefreshControl, // Ensure RefreshControl is imported
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { debounce } from 'lodash'; // Ensure lodash is installed
import { LinearGradient } from 'expo-linear-gradient';

import { ThemeContext } from '../../ThemeContext';
import { lightTheme, darkTheme } from '../../themes';
import { CartContext } from '../contexts/CartContext';
import { FavouritesContext } from '../contexts/FavouritesContext'; // Import FavouritesContext
import CustomHeader from '../components/CustomHeader';
import CustomAlert from '../components/CustomAlert'; // Import CustomAlert

import { fetchProducts } from '../services/api';

const MarketPage = () => {
  const navigation = useNavigation();

  // Get theme from context
  const { theme } = useContext(ThemeContext);
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  // Access cart context
  const { cartItems, addToCart } = useContext(CartContext);

  // Access favourites context
  const { favouriteItems, addToFavourites, removeFromFavourites } = useContext(FavouritesContext);

  // State to hold fetched products
  const [products, setProducts] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Refreshing state for pull-to-refresh
  const [refreshing, setRefreshing] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortOption, setSortOption] = useState('Default');

  const { width } = useWindowDimensions();

  // Determine number of columns based on screen width
  const getNumberOfColumns = () => {
    if (width <= 375) return 1; // Single column for small screens
    if (width <= 800) return 2; // Two columns for medium screens
    if (width <= 1200) return 3; // Three columns for large screens
    return 4; // Four columns for extra large screens
  };

  const numColumns = getNumberOfColumns();

  // State for controlling the CustomAlert
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertIcon, setAlertIcon] = useState('');
  const [alertButtons, setAlertButtons] = useState([]);

  // Fetch products from API
  const fetchAllProducts = async (isRefreshing = false) => {
    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    const response = await fetchProducts();

    if (isRefreshing) {
      setRefreshing(false);
    } else {
      setLoading(false);
    }

    if (response.success) {
      setProducts(response.data.data); // Adjust according to your API response
      setFilteredData(sortData(response.data.data, sortOption));
    } else {
      setError(response.message);
      // Display error using CustomAlert
      setAlertTitle('Error');
      setAlertMessage(response.message);
      setAlertIcon('alert-circle');
      setAlertButtons([
        {
          text: 'Retry',
          onPress: () => {
            setAlertVisible(false);
            fetchAllProducts(isRefreshing);
          },
        },
      ]);
      setAlertVisible(true);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  // Debounced search handler
  const handleSearch = (text) => {
    setSearchQuery(text);
    debouncedFilter(text);
  };

  const filterData = (text) => {
    const newData = products.filter((item) => {
      const itemData = `
        ${item.subjectName.toUpperCase()}
        ${item.subjectCode.toUpperCase()}
        ${item.name.toUpperCase()}
      `;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });

    setFilteredData(sortData(newData, sortOption));
  };

  const debouncedFilter = useCallback(debounce(filterData, 300), [products, sortOption]);

  const sortData = (dataToSort, option) => {
    let sortedData = [...dataToSort];
    if (option === 'Name (A-Z)') {
      sortedData.sort((a, b) => a.name.localeCompare(b.name));
    } else if (option === 'Name (Z-A)') {
      sortedData.sort((a, b) => b.name.localeCompare(a.name));
    } else if (option === 'Price (Low to High)') {
      sortedData.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (option === 'Price (High to Low)') {
      sortedData.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }
    return sortedData;
  };

  const handleSortOption = (option) => {
    setSortOption(option);
    setFilteredData(sortData(filteredData, option));
    setSortModalVisible(false);
  };

  const handleAddToCart = (item) => {
    const added = addToCart(item);
    if (added) {
      setAlertTitle('Success');
      setAlertMessage(`${item.name} has been added to your cart.`);
      setAlertIcon('cart');
    } else {
      setAlertTitle('Info');
      setAlertMessage(`${item.name} is already in your cart.`);
      setAlertIcon('information-circle');
    }
    setAlertButtons([
      {
        text: 'OK',
        onPress: () => setAlertVisible(false),
      },
    ]);
    setAlertVisible(true);
  };

  const handleToggleFavorite = (item) => {
    const isFavourite = favouriteItems.some((favItem) => favItem._id === item._id);
    if (isFavourite) {
      removeFromFavourites(item._id);
      setAlertTitle('Removed from Favourites');
      setAlertMessage(`${item.name} has been removed from your favourites.`);
      setAlertIcon('heart-dislike-outline');
    } else {
      addToFavourites(item);
      setAlertTitle('Added to Favourites');
      setAlertMessage(`${item.name} has been added to your favourites.`);
      setAlertIcon('heart');
    }
    setAlertButtons([
      {
        text: 'OK',
        onPress: () => setAlertVisible(false),
      },
    ]);
    setAlertVisible(true);
  };

  const renderItem = ({ item }) => {
    const isFavorite = favouriteItems.some((favItem) => favItem._id === item._id);
    return (
      <View
        style={[
          styles.card,
          { backgroundColor: currentTheme.cardBackground, width: getCardWidth() },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate('ProductPage', { item })}
          accessibilityLabel={`View details for ${item.name}`}
          activeOpacity={0.8}
          style={styles.cardTouchable}
        >
          <Image
            source={{ uri: item.image }}
            style={styles.cardImage}
            resizeMode="cover"
          />
          {/* Favorite Icon */}
          <TouchableOpacity
            style={styles.favoriteIcon}
            onPress={() => handleToggleFavorite(item)}
            accessibilityLabel={
              isFavorite
                ? `Remove ${item.name} from favourites`
                : `Add ${item.name} to favourites`
            }
            accessibilityRole="button"
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? '#E91E63' : currentTheme.placeholderTextColor}
            />
          </TouchableOpacity>
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: currentTheme.cardTextColor }]}>
              {item.name}
            </Text>
            <Text style={[styles.cardSubtitle, { color: currentTheme.textColor }]}>
              {item.subjectName} ({item.subjectCode})
            </Text>
            <View style={styles.ratingContainer}>
              {Array.from({ length: 5 }, (_, index) => (
                <Ionicons
                  key={index}
                  name={index < Math.floor(item.ratings) ? 'star' : 'star-outline'}
                  size={16}
                  color="#FFD700"
                />
              ))}
              <Text style={[styles.reviewCount, { color: currentTheme.textColor }]}>
                {' '}
                ({item.numberOfReviews})
              </Text>
            </View>
            <Text style={[styles.cardPrice, { color: currentTheme.cardTextColor }]}>
              ${item.price}
            </Text>
          </View>
        </TouchableOpacity>
        {/* Cart Icon */}
        <TouchableOpacity
          style={[styles.cartIcon, { backgroundColor: currentTheme.primaryColor }]}
          onPress={() => handleAddToCart(item)}
          accessibilityLabel={`Add ${item.name} to Cart`}
          accessibilityRole="button"
        >
          <Ionicons name="cart-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    );
  };

  const getCardWidth = () => {
    // Calculate card width based on number of columns and screen width
    const totalMargin = 20 * (numColumns + 1); // 20 is the horizontal margin between cards
    const availableWidth = width - totalMargin;
    return availableWidth / numColumns;
  };

  useEffect(() => {
    // Initial sort based on default option
    setFilteredData(sortData(products, sortOption));
    return () => {
      debouncedFilter.cancel();
    };
  }, [products]);

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
      <StatusBar
        backgroundColor={currentTheme.headerBackground[1]}
        barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
      />
      <CustomHeader />

      <View style={styles.header}>
        {/* Gradient Overlay */}
        <LinearGradient
          colors={currentTheme.headerBackground}
          style={styles.headerGradient}
          start={[0, 0]}
          end={[0, 1]}
        />
        <Text style={[styles.title, { color: currentTheme.headerTextColor }]}>
          Marketplace
        </Text>
      </View>
      <View style={styles.searchSortContainer}>
        <View
          style={[
            styles.searchContainer,
            { backgroundColor: currentTheme.cardBackground },
          ]}
        >
          <Ionicons
            name="search"
            size={24}
            color={currentTheme.placeholderTextColor}
            style={styles.searchIcon}
            accessibilityLabel="Search Icon"
          />
          <TextInput
            style={[styles.searchInput, { color: currentTheme.textColor }]}
            placeholder="Search by subject, code, or exam name"
            placeholderTextColor={currentTheme.placeholderTextColor}
            value={searchQuery}
            onChangeText={handleSearch}
            accessibilityLabel="Search Input"
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity
          style={[
            styles.sortButton,
            { backgroundColor: currentTheme.primaryColor },
          ]}
          onPress={() => setSortModalVisible(true)}
          accessibilityLabel="Sort Button"
          accessibilityRole="button"
        >
          <MaterialIcons name="sort" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Sort Modal */}
      {sortModalVisible && (
        <Modal
          visible={sortModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setSortModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback onPress={() => setSortModalVisible(false)}>
              <View style={styles.modalOverlay} />
            </TouchableWithoutFeedback>
            <View
              style={[
                styles.modalContent,
                { backgroundColor: currentTheme.cardBackground },
              ]}
            >
              <Text style={[styles.modalTitle, { color: currentTheme.cardTextColor }]}>
                Sort By
              </Text>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleSortOption('Name (A-Z)')}
                accessibilityLabel="Sort by Name A-Z"
                accessibilityRole="button"
              >
                <Text style={[styles.modalOptionText, { color: currentTheme.textColor }]}>
                  Name (A-Z)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleSortOption('Name (Z-A)')}
                accessibilityLabel="Sort by Name Z-A"
                accessibilityRole="button"
              >
                <Text style={[styles.modalOptionText, { color: currentTheme.textColor }]}>
                  Name (Z-A)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleSortOption('Price (Low to High)')}
                accessibilityLabel="Sort by Price Low to High"
                accessibilityRole="button"
              >
                <Text style={[styles.modalOptionText, { color: currentTheme.textColor }]}>
                  Price (Low to High)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleSortOption('Price (High to Low)')}
                accessibilityLabel="Sort by Price High to Low"
                accessibilityRole="button"
              >
                <Text style={[styles.modalOptionText, { color: currentTheme.textColor }]}>
                  Price (High to Low)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleSortOption('Default')}
                accessibilityLabel="Sort by Default"
                accessibilityRole="button"
              >
                <Text style={[styles.modalOptionText, { color: currentTheme.textColor }]}>
                  Default
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={currentTheme.primaryColor} />
        </View>
      )}

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: currentTheme.errorTextColor }]}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={() => fetchAllProducts()}
            style={[styles.retryButton, { backgroundColor: currentTheme.primaryColor }]}
            accessibilityLabel="Retry Fetching Products"
            accessibilityRole="button"
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Product List */}
      {!loading && !error && (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item._id} // Ensure each id is unique
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContent,
            numColumns === 1 && styles.singleColumnContent, // Center items for single column
          ]}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="search"
                size={80}
                color={currentTheme.placeholderTextColor}
              />
              <Text style={[styles.emptyText, { color: currentTheme.textColor }]}>
                No results found.
              </Text>
            </View>
          }
          numColumns={numColumns}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          key={numColumns} // Re-render FlatList when numColumns changes
          refreshing={refreshing} // Add this line
          onRefresh={() => fetchAllProducts(true)} // Add this line
        />
      )}

      {/* CustomAlert Component */}
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        icon={alertIcon}
        onClose={() => setAlertVisible(false)}
        buttons={alertButtons}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'relative',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    zIndex: 1,
  },
  headerCartButton: {
    position: 'absolute',
    right: 15,
    top: 40,
    padding: 5,
  },
  headerCartBadge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#E53935', // Red color for badge
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCartBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchSortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -30,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    borderRadius: 30,
    paddingHorizontal: 15,
    alignItems: 'center',
    flex: 1,
    height: 60,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
  },
  sortButton: {
    marginLeft: 10,
    padding: 16,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  listContent: {
    paddingBottom: 20,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  singleColumnContent: {
    alignItems: 'center',
  },
  card: {
    borderRadius: 10,
    marginBottom: 15,
    marginHorizontal: 10,
    // width is set dynamically
    elevation: 3,
    overflow: 'hidden',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Shadow for Android
    backgroundColor: '#fff',
    // Responsive adjustments
    minHeight: 300,
  },
  cardTouchable: {
    flex: 1,
  },
  cardImage: {
    width: '100%',
    height: 140,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    padding: 5,
  },
  cartIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#009688', // Can use currentTheme.primaryColor
    borderRadius: 20,
    padding: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 14,
    marginVertical: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewCount: {
    fontSize: 12,
    marginLeft: 5,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    marginTop: 15,
  },
  // Modal styles
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    borderRadius: 20,
    padding: 20,
    elevation: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalOption: {
    paddingVertical: 10,
    width: '100%',
  },
  modalOptionText: {
    fontSize: 18,
    textAlign: 'center',
  },
  // Loading and Error styles
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    zIndex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MarketPage;
















// // src/screens/MarketPage.js

// import React, { useState, useContext, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   StatusBar,
//   Modal,
//   TouchableWithoutFeedback,
//   ActivityIndicator,
//   useWindowDimensions,
// } from 'react-native';
// import { Ionicons, MaterialIcons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import { debounce } from 'lodash'; // Ensure lodash is installed
// import { LinearGradient } from 'expo-linear-gradient';

// import { ThemeContext } from '../../ThemeContext';
// import { lightTheme, darkTheme } from '../../themes';
// import { CartContext } from '../contexts/CartContext';
// import { FavouritesContext } from '../contexts/FavouritesContext'; // Import FavouritesContext
// import CustomHeader from '../components/CustomHeader';
// import CustomAlert from '../components/CustomAlert'; // Import CustomAlert

// import { fetchProducts } from '../services/api';

// const MarketPage = () => {
//   const navigation = useNavigation();

//   // Get theme from context
//   const { theme } = useContext(ThemeContext);
//   const currentTheme = theme === 'light' ? lightTheme : darkTheme;

//   // Access cart context
//   const { cartItems, addToCart } = useContext(CartContext);

//   // Access favourites context
//   const { favouriteItems, addToFavourites, removeFromFavourites } = useContext(FavouritesContext);

//   // State to hold fetched products
//   const [products, setProducts] = useState([]);

//   // Loading and error states
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const [searchQuery, setSearchQuery] = useState('');
//   const [filteredData, setFilteredData] = useState([]);
//   const [sortModalVisible, setSortModalVisible] = useState(false);
//   const [sortOption, setSortOption] = useState('Default');

//   const { width } = useWindowDimensions();

//   // Determine number of columns based on screen width
//   const getNumberOfColumns = () => {
//     if (width <= 375) return 1; // Single column for small screens
//     if (width <= 800) return 2; // Two columns for medium screens
//     if (width <= 1200) return 3; // Three columns for large screens
//     return 4; // Four columns for extra large screens
//   };

//   const numColumns = getNumberOfColumns();

//   // State for controlling the CustomAlert
//   const [alertVisible, setAlertVisible] = useState(false);
//   const [alertTitle, setAlertTitle] = useState('');
//   const [alertMessage, setAlertMessage] = useState('');
//   const [alertIcon, setAlertIcon] = useState('');
//   const [alertButtons, setAlertButtons] = useState([]);

//   // Fetch products from API
//   const fetchAllProducts = async () => {
//     setLoading(true);
//     const response = await fetchProducts();
//     setLoading(false);

//     if (response.success) {
//       setProducts(response.data.data); // Adjust according to your API response
//       setFilteredData(sortData(response.data.data, sortOption));
//     } else {
//       setError(response.message);
//       // Display error using CustomAlert
//       setAlertTitle('Error');
//       setAlertMessage(response.message);
//       setAlertIcon('alert-circle');
//       setAlertButtons([
//         {
//           text: 'Retry',
//           onPress: () => {
//             setAlertVisible(false);
//             fetchAllProducts();
//           },
//         },
//       ]);
//       setAlertVisible(true);
//     }
//   };

//   useEffect(() => {
//     fetchAllProducts();
//   }, []);

//   // Debounced search handler
//   const handleSearch = (text) => {
//     setSearchQuery(text);
//     debouncedFilter(text);
//   };

//   const filterData = (text) => {
//     const newData = products.filter((item) => {
//       const itemData = `
//         ${item.subjectName.toUpperCase()}
//         ${item.subjectCode.toUpperCase()}
//         ${item.name.toUpperCase()}
//       `;
//       const textData = text.toUpperCase();

//       return itemData.indexOf(textData) > -1;
//     });

//     setFilteredData(sortData(newData, sortOption));
//   };

//   const debouncedFilter = useCallback(debounce(filterData, 300), [products, sortOption]);

//   const sortData = (dataToSort, option) => {
//     let sortedData = [...dataToSort];
//     if (option === 'Name (A-Z)') {
//       sortedData.sort((a, b) => a.name.localeCompare(b.name));
//     } else if (option === 'Name (Z-A)') {
//       sortedData.sort((a, b) => b.name.localeCompare(a.name));
//     } else if (option === 'Price (Low to High)') {
//       sortedData.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
//     } else if (option === 'Price (High to Low)') {
//       sortedData.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
//     }
//     return sortedData;
//   };

//   const handleSortOption = (option) => {
//     setSortOption(option);
//     setFilteredData(sortData(filteredData, option));
//     setSortModalVisible(false);
//   };

//   const handleAddToCart = (item) => {
//     const added = addToCart(item);
//     if (added) {
//       setAlertTitle('Success');
//       setAlertMessage(`${item.name} has been added to your cart.`);
//       setAlertIcon('cart');
//     } else {
//       setAlertTitle('Info');
//       setAlertMessage(`${item.name} is already in your cart.`);
//       setAlertIcon('information-circle');
//     }
//     setAlertButtons([
//       {
//         text: 'OK',
//         onPress: () => setAlertVisible(false),
//       },
//     ]);
//     setAlertVisible(true);
//   };

//   const handleToggleFavorite = (item) => {
//     const isFavourite = favouriteItems.some((favItem) => favItem._id === item._id);
//     if (isFavourite) {
//       removeFromFavourites(item._id);
//       setAlertTitle('Removed from Favourites');
//       setAlertMessage(`${item.name} has been removed from your favourites.`);
//       setAlertIcon('heart-dislike-outline');
//     } else {
//       addToFavourites(item);
//       setAlertTitle('Added to Favourites');
//       setAlertMessage(`${item.name} has been added to your favourites.`);
//       setAlertIcon('heart');
//     }
//     setAlertButtons([
//       {
//         text: 'OK',
//         onPress: () => setAlertVisible(false),
//       },
//     ]);
//     setAlertVisible(true);
//   };

//   const renderItem = ({ item }) => {
//     const isFavorite = favouriteItems.some((favItem) => favItem._id === item._id);
//     return (
//       <View
//         style={[
//           styles.card,
//           { backgroundColor: currentTheme.cardBackground, width: getCardWidth() },
//         ]}
//       >
//         <TouchableOpacity
//           onPress={() => navigation.navigate('ProductPage', { item })}
//           accessibilityLabel={`View details for ${item.name}`}
//           activeOpacity={0.8}
//           style={styles.cardTouchable}
//         >
//           <Image
//             source={{ uri: item.image }}
//             style={styles.cardImage}
//             resizeMode="cover"
//           />
//           {/* Favorite Icon */}
//           <TouchableOpacity
//             style={styles.favoriteIcon}
//             onPress={() => handleToggleFavorite(item)}
//             accessibilityLabel={
//               isFavorite
//                 ? `Remove ${item.name} from favourites`
//                 : `Add ${item.name} to favourites`
//             }
//             accessibilityRole="button"
//           >
//             <Ionicons
//               name={isFavorite ? 'heart' : 'heart-outline'}
//               size={24}
//               color={isFavorite ? '#E91E63' : currentTheme.placeholderTextColor}
//             />
//           </TouchableOpacity>
//           <View style={styles.cardContent}>
//             <Text style={[styles.cardTitle, { color: currentTheme.cardTextColor }]}>
//               {item.name}
//             </Text>
//             <Text style={[styles.cardSubtitle, { color: currentTheme.textColor }]}>
//               {item.subjectName} ({item.subjectCode})
//             </Text>
//             <View style={styles.ratingContainer}>
//               {Array.from({ length: 5 }, (_, index) => (
//                 <Ionicons
//                   key={index}
//                   name={index < Math.floor(item.ratings) ? 'star' : 'star-outline'}
//                   size={16}
//                   color="#FFD700"
//                 />
//               ))}
//               <Text style={[styles.reviewCount, { color: currentTheme.textColor }]}>
//                 {' '}
//                 ({item.numberOfReviews})
//               </Text>
//             </View>
//             <Text style={[styles.cardPrice, { color: currentTheme.cardTextColor }]}>
//               ${item.price}
//             </Text>
//           </View>
//         </TouchableOpacity>
//         {/* Cart Icon */}
//         <TouchableOpacity
//           style={[styles.cartIcon, { backgroundColor: currentTheme.primaryColor }]}
//           onPress={() => handleAddToCart(item)}
//           accessibilityLabel={`Add ${item.name} to Cart`}
//           accessibilityRole="button"
//         >
//           <Ionicons name="cart-outline" size={24} color="#FFFFFF" />
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   const getCardWidth = () => {
//     // Calculate card width based on number of columns and screen width
//     const totalMargin = 20 * (numColumns + 1); // 20 is the horizontal margin between cards
//     const availableWidth = width - totalMargin;
//     return availableWidth / numColumns;
//   };

//   useEffect(() => {
//     // Initial sort based on default option
//     setFilteredData(sortData(products, sortOption));
//     return () => {
//       debouncedFilter.cancel();
//     };
//   }, [products]);

//   return (
//     <View style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
//       <StatusBar
//         backgroundColor={currentTheme.headerBackground[1]}
//         barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
//       />
//       <CustomHeader />

//       <View style={styles.header}>
//         {/* Gradient Overlay */}
//         <LinearGradient
//           colors={currentTheme.headerBackground}
//           style={styles.headerGradient}
//           start={[0, 0]}
//           end={[0, 1]}
//         />
//         <Text style={[styles.title, { color: currentTheme.headerTextColor }]}>
//           Marketplace
//         </Text>
//       </View>
//       <View style={styles.searchSortContainer}>
//         <View
//           style={[
//             styles.searchContainer,
//             { backgroundColor: currentTheme.cardBackground },
//           ]}
//         >
//           <Ionicons
//             name="search"
//             size={24}
//             color={currentTheme.placeholderTextColor}
//             style={styles.searchIcon}
//             accessibilityLabel="Search Icon"
//           />
//           <TextInput
//             style={[styles.searchInput, { color: currentTheme.textColor }]}
//             placeholder="Search by subject, code, or exam name"
//             placeholderTextColor={currentTheme.placeholderTextColor}
//             value={searchQuery}
//             onChangeText={handleSearch}
//             accessibilityLabel="Search Input"
//             returnKeyType="search"
//           />
//         </View>
//         <TouchableOpacity
//           style={[
//             styles.sortButton,
//             { backgroundColor: currentTheme.primaryColor },
//           ]}
//           onPress={() => setSortModalVisible(true)}
//           accessibilityLabel="Sort Button"
//           accessibilityRole="button"
//         >
//           <MaterialIcons name="sort" size={24} color="#FFFFFF" />
//         </TouchableOpacity>
//       </View>

//       {/* Sort Modal */}
//       {sortModalVisible && (
//         <Modal
//           visible={sortModalVisible}
//           animationType="fade"
//           transparent={true}
//           onRequestClose={() => setSortModalVisible(false)}
//         >
//           <View style={styles.modalBackground}>
//             <TouchableWithoutFeedback onPress={() => setSortModalVisible(false)}>
//               <View style={styles.modalOverlay} />
//             </TouchableWithoutFeedback>
//             <View
//               style={[
//                 styles.modalContent,
//                 { backgroundColor: currentTheme.cardBackground },
//               ]}
//             >
//               <Text style={[styles.modalTitle, { color: currentTheme.cardTextColor }]}>
//                 Sort By
//               </Text>
//               <TouchableOpacity
//                 style={styles.modalOption}
//                 onPress={() => handleSortOption('Name (A-Z)')}
//                 accessibilityLabel="Sort by Name A-Z"
//                 accessibilityRole="button"
//               >
//                 <Text style={[styles.modalOptionText, { color: currentTheme.textColor }]}>
//                   Name (A-Z)
//                 </Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.modalOption}
//                 onPress={() => handleSortOption('Name (Z-A)')}
//                 accessibilityLabel="Sort by Name Z-A"
//                 accessibilityRole="button"
//               >
//                 <Text style={[styles.modalOptionText, { color: currentTheme.textColor }]}>
//                   Name (Z-A)
//                 </Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.modalOption}
//                 onPress={() => handleSortOption('Price (Low to High)')}
//                 accessibilityLabel="Sort by Price Low to High"
//                 accessibilityRole="button"
//               >
//                 <Text style={[styles.modalOptionText, { color: currentTheme.textColor }]}>
//                   Price (Low to High)
//                 </Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.modalOption}
//                 onPress={() => handleSortOption('Price (High to Low)')}
//                 accessibilityLabel="Sort by Price High to Low"
//                 accessibilityRole="button"
//               >
//                 <Text style={[styles.modalOptionText, { color: currentTheme.textColor }]}>
//                   Price (High to Low)
//                 </Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.modalOption}
//                 onPress={() => handleSortOption('Default')}
//                 accessibilityLabel="Sort by Default"
//                 accessibilityRole="button"
//               >
//                 <Text style={[styles.modalOptionText, { color: currentTheme.textColor }]}>
//                   Default
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>
//       )}

//       {/* Loading Indicator */}
//       {loading && (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color={currentTheme.primaryColor} />
//         </View>
//       )}

//       {/* Error Message */}
//       {error && (
//         <View style={styles.errorContainer}>
//           <Text style={[styles.errorText, { color: currentTheme.errorTextColor }]}>
//             {error}
//           </Text>
//           <TouchableOpacity
//             onPress={fetchAllProducts}
//             style={[styles.retryButton, { backgroundColor: currentTheme.primaryColor }]}
//             accessibilityLabel="Retry Fetching Products"
//             accessibilityRole="button"
//           >
//             <Text style={styles.retryButtonText}>Retry</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* Product List */}
//       {!loading && !error && (
//         <FlatList
//           data={filteredData}
//           keyExtractor={(item) => item._id} // Ensure each id is unique
//           renderItem={renderItem}
//           contentContainerStyle={[
//             styles.listContent,
//             numColumns === 1 && styles.singleColumnContent, // Center items for single column
//           ]}
//           ListEmptyComponent={
//             <View style={styles.emptyContainer}>
//               <Ionicons
//                 name="search"
//                 size={80}
//                 color={currentTheme.placeholderTextColor}
//               />
//               <Text style={[styles.emptyText, { color: currentTheme.textColor }]}>
//                 No results found.
//               </Text>
//             </View>
//           }
//           numColumns={numColumns}
//           showsVerticalScrollIndicator={false}
//           keyboardShouldPersistTaps="handled"
//           key={numColumns} // Re-render FlatList when numColumns changes
//         />
//       )}

//       {/* CustomAlert Component */}
//       <CustomAlert
//         visible={alertVisible}
//         title={alertTitle}
//         message={alertMessage}
//         icon={alertIcon}
//         onClose={() => setAlertVisible(false)}
//         buttons={alertButtons}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     position: 'relative',
//     height: 150,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headerGradient: {
//     position: 'absolute',
//     width: '100%',
//     height: '100%',
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     zIndex: 1,
//   },
//   headerCartButton: {
//     position: 'absolute',
//     right: 15,
//     top: 40,
//     padding: 5,
//   },
//   headerCartBadge: {
//     position: 'absolute',
//     right: 0,
//     top: 0,
//     backgroundColor: '#E53935', // Red color for badge
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headerCartBadgeText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   searchSortContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: -30,
//     marginHorizontal: 20,
//     marginBottom: 10,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     borderRadius: 30,
//     paddingHorizontal: 15,
//     alignItems: 'center',
//     flex: 1,
//     height: 60,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   searchIcon: {
//     marginRight: 10,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 18,
//   },
//   sortButton: {
//     marginLeft: 10,
//     padding: 16,
//     borderRadius: 30,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   listContent: {
//     paddingBottom: 20,
//     paddingHorizontal: 10,
//     paddingTop: 10,
//   },
//   singleColumnContent: {
//     alignItems: 'center',
//   },
//   card: {
//     borderRadius: 10,
//     marginBottom: 15,
//     marginHorizontal: 10,
//     // width is set dynamically
//     elevation: 3,
//     overflow: 'hidden',
//     // Shadow for iOS
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     // Shadow for Android
//     backgroundColor: '#fff',
//     // Responsive adjustments
//     minHeight: 300,
//   },
//   cardTouchable: {
//     flex: 1,
//   },
//   cardImage: {
//     width: '100%',
//     height: 140,
//   },
//   favoriteIcon: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     backgroundColor: 'rgba(255,255,255,0.7)',
//     borderRadius: 20,
//     padding: 5,
//   },
//   cartIcon: {
//     position: 'absolute',
//     bottom: 10,
//     right: 10,
//     backgroundColor: '#009688', // Can use currentTheme.primaryColor
//     borderRadius: 20,
//     padding: 8,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   cardContent: {
//     padding: 10,
//   },
//   cardTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   cardSubtitle: {
//     fontSize: 14,
//     marginVertical: 5,
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   reviewCount: {
//     fontSize: 12,
//     marginLeft: 5,
//   },
//   cardPrice: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginTop: 5,
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     marginTop: 50,
//   },
//   emptyText: {
//     fontSize: 18,
//     marginTop: 15,
//   },
//   // Modal styles
//   modalBackground: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalOverlay: {
//     position: 'absolute',
//     width: '100%',
//     height: '100%',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     width: '80%',
//     borderRadius: 20,
//     padding: 20,
//     elevation: 10,
//     alignItems: 'center',
//   },
//   modalTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   modalOption: {
//     paddingVertical: 10,
//     width: '100%',
//   },
//   modalOptionText: {
//     fontSize: 18,
//     textAlign: 'center',
//   },
//   // Loading and Error styles
//   loadingContainer: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: [{ translateX: -25 }, { translateY: -25 }],
//     zIndex: 1,
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   errorText: {
//     fontSize: 18,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   retryButton: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 20,
//   },
// });

// export default MarketPage;







