import React, { createContext, useState, useEffect, useReducer } from 'react';
import { Button, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, DefaultTheme, useNavigation, useRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApplicationContext } from './ApplicationContext';
import ReleasesScreen from './screens/ReleasesScreen';
import NewsScreen from './screens/NewsScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import SettingsScreen from './screens/SettingsScreen';
import SearchScreen from './screens/SearchScreen';
import ShoeScreen from './screens/ShoeScreen';
import useTheme from './hooks/useTheme';
import { colors } from './constants/colors';

const initalState = {
  shoes: [],
  news: [],
  favorites: [],
  isShoesLoading: true,
  isNewsLoading: true,
  isFavoritesLoading: true,
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
  const navigation = useNavigation();
  const colorScheme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: (colorScheme === 'light' ? colors.white : colors.lightBlack),
        },
        headerTitleStyle: [styles.headerTitle, { color: (colorScheme === 'light' ? colors.darkGray : colors.gray) }],
        headerRight: () => (
          <Pressable onPress={() => { navigation.navigate('SEARCH'); }}>
            {() => (<Image source={require('./assets/images/search.png')} style={styles.headerIcon} />)}
          </Pressable>
        ),
        tabBarStyle: {
          backgroundColor: (colorScheme === 'light' ? colors.white : colors.lightBlack),
          borderTopColor: (colorScheme === 'light' ? colors.lightGray : colors.lightBlack),
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
  const [state, dispatch] = useReducer(reducer, initalState);
  const colorScheme = useTheme();

  useEffect(() => {
    loadFavorites();
    loadShoes();
    loadNews();
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

  const DarkTheme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.darkBlack } };

  return (
    <ApplicationContext.Provider value={{...state, loadShoes, loadNews, loadFavorites}}>
      <NavigationContainer theme={(colorScheme === 'light' ? DefaultTheme : DarkTheme)}>
        <Stack.Navigator
          initialRouteName="TabbedScreen"
          screenOptions={{
            headerTitleStyle: [styles.headerTitle, { color: (colorScheme === 'light' ? colors.darkGray : colors.gray) }],
            headerBackTitleVisible: false,
            headerTintColor: colors.darkGray,
          }}
        >
          <Stack.Screen name="TabbedScreen" component={TabbedScreen} options={{ headerShown: false }} />
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
