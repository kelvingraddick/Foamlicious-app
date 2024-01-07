import React, { createContext, useState, useEffect, useReducer, useContext } from 'react';
import { Button, Image, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { NavigationContainer, DefaultTheme, useNavigation, useRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApplicationContext } from './ApplicationContext';
import SplashScreen from './screens/SplashScreen';
import ReleasesScreen from './screens/ReleasesScreen';
import NewsScreen from './screens/NewsScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import SettingsScreen from './screens/SettingsScreen';
import SearchScreen from './screens/SearchScreen';
import ShoeScreen from './screens/ShoeScreen';
import { appearanceModes } from './constants/appearanceModes';
import { appearanceThemes } from './constants/appearanceThemes';
import { colors } from './constants/colors';

const initialState = {
  shoes: [],
  news: [],
  favorites: [],
  isShoesLoading: true,
  isNewsLoading: true,
  isFavoritesLoading: true,
  appearanceMode: appearanceModes.DARK,
  appearanceTheme: appearanceThemes.DARK,
}

const reducer = (state, action) => {
  switch(action.type) {
    case 'LOADING_SHOES':
      return { ...state, shoes: [], isShoesLoading: true };
    case 'LOADED_SHOES':
      return { ...state, shoes: action.payload, isShoesLoading: false };
    case 'LOADING_NEWS':
       return { ...state, news: [], isNewsLoading: true };
    case 'LOADED_NEWS':
      return { ...state, news: action.payload, isNewsLoading: false };
    case 'LOADING_FAVORITES':
      return { ...state, favorites: [], isFavoritesLoading: true };
    case 'LOADED_FAVORITES':
      return { ...state, favorites: action.payload, isFavoritesLoading: false };
    case 'LOADED_APPEARANCE':
      return { ...state, appearanceMode: action.payload?.appearanceMode, appearanceTheme: action.payload?.appearanceTheme };
    default:
      return state;
  }
};

const TABS = {
  RELEASES: 'RELEASES',
  NEWS: 'NEWS',
  FAVORITES: 'FAVORITES',
  SETTINGS: 'SETTINGS',
}

const Tab = createBottomTabNavigator();

const TabbedScreen = () => {
  const { appearanceTheme } = useContext(ApplicationContext);
  const navigation = useNavigation();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: (appearanceTheme === 'light' ? colors.white : colors.lightBlack),
        },
        headerTitleStyle: [styles.headerTitle, { color: (appearanceTheme === 'light' ? colors.darkGray : colors.gray) }],
        headerRight: () => (
          <Pressable onPress={() => { navigation.navigate('SEARCH'); }}>
            {() => (<Image source={require('./assets/images/search.png')} style={styles.headerIcon} />)}
          </Pressable>
        ),
        tabBarLabelPosition: 'below-icon',
        tabBarStyle: {
          backgroundColor: (appearanceTheme === 'light' ? colors.white : colors.lightBlack),
          borderTopColor: (appearanceTheme === 'light' ? colors.lightGray : colors.lightBlack),
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconSource;
          switch (route.name) {
            case TABS.RELEASES: iconSource = require('./assets/images/calendar.png'); break;
            case TABS.NEWS: iconSource = require('./assets/images/newspaper.png'); break;
            case TABS.FAVORITES: iconSource = require('./assets/images/star.png'); break;
            case TABS.SETTINGS: iconSource = require('./assets/images/cog.png'); break;
          }
          return <Image source={iconSource} style={[styles.tabIcon, { tintColor: focused ? colors.blue : colors.gray }]} />;
        },
        tabBarLabel: ({ focused }) => {
          const label = route.name.toUpperCase();
          return <Text style={[styles.tabLabel, { color: focused ? colors.blue : colors.gray }]}>{label}</Text>;
        },
      })}
    >
      <Tab.Screen name={TABS.RELEASES} component={ReleasesScreen} />
      <Tab.Screen name={TABS.NEWS} component={NewsScreen} />
      <Tab.Screen name={TABS.FAVORITES} component={FavoritesScreen} />
      <Tab.Screen name={TABS.SETTINGS} component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const Stack = createStackNavigator();

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const systemTheme = useColorScheme();

  useEffect(() => {
    loadFavorites();
    loadShoes();
    loadNews();
    loadAppearance();
  }, []);

  const loadShoes = async () => {
    try {
      dispatch({ type: 'LOADING_SHOES' });
      const response = await fetch('http://www.wavelinkllc.com/foamlife/services/shoes.php');
      const data = await response.json();
      dispatch({ type: 'LOADED_SHOES', payload: data });
    } catch (error) {
      console.error('Fetching shoe data failed with error: ' + error.message);
    }
  };
  
  const loadNews = async () => {
    try {
      dispatch({ type: 'LOADING_NEWS' });
      const response = await fetch('http://www.wavelinkllc.com/foamlife/services/news.php');
      const data = await response.json();
      dispatch({ type: 'LOADED_NEWS', payload: data });
    } catch (error) {
      console.error('Fetching news data failed with error: ' + error.message);
    }
  };

  const loadFavorites = async () => {
    try {
      dispatch({ type: 'LOADING_FAVORITES' });
      let favorites = [];
      const storageData = await AsyncStorage.getItem('favorites');
      if (storageData) {
        favorites = JSON.parse(storageData);
      }
      dispatch({ type: 'LOADED_FAVORITES', payload: favorites });
    } catch (error) {
      console.error('Fetching favorites data failed with error: ' + error.message);
    }
  };

  const loadAppearance = async () => {
    try {
      let storageData = await AsyncStorage.getItem('appearanceMode');
      let mode = (storageData && typeof(storageData) == 'string') ? storageData : appearanceModes.DARK;
      let theme = (mode == appearanceModes.SYSTEM) ? (systemTheme || appearanceThemes.DARK) : mode;
      dispatch({
        type: 'LOADED_APPEARANCE', payload: { appearanceMode: mode, appearanceTheme: theme }
      });
    } catch (error) {
      console.error('Fetching appearance data failed with error: ' + error.message);
    }
  };

  const DarkTheme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.darkBlack } };

  return (
    <ApplicationContext.Provider value={{...state, loadShoes, loadNews, loadFavorites, loadAppearance}}>
      <NavigationContainer theme={(state.appearanceTheme === 'light' ? DefaultTheme : DarkTheme)}>
        <Stack.Navigator
          initialRouteName="SplashScreen"
          screenOptions={{
            headerTitleStyle: [styles.headerTitle, { color: (state.appearanceTheme === 'light' ? colors.darkGray : colors.gray) }],
            headerBackTitleVisible: false,
            headerTintColor: colors.darkGray,
          }}
        >
          <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="TabbedScreen" component={TabbedScreen} options={{ headerShown: false, cardStyleInterpolator: ({ current }) => ({ cardStyle: { opacity: current.progress }}) }} />
          <Stack.Screen name="SEARCH" component={SearchScreen} />
          <Stack.Screen name="SHOE" component={ShoeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApplicationContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'AvenirNext-Bold',
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerIcon: {
    resizeMode: 'contain',
    maxHeight: 24,
    tintColor: colors.darkGray
  },
  tabIcon: {
    resizeMode: 'contain',
    maxHeight: 24,
  },
  tabLabel: {
    fontFamily: 'AvenirNext-Bold',
    fontSize: 9,
    fontWeight: 'bold'
  },
});
