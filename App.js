import React, { createContext, useState, useEffect, useReducer } from 'react';
import { Button, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ApplicationContext } from './ApplicationContext';
import ReleasesScreen from './screens/ReleasesScreen';
import SearchScreen from './screens/SearchScreen';
import ShoeScreen from './screens/ShoeScreen';
import { colors } from './constants/colors';

const initalState = {
  shoes: [],
  news: [],
  isShoesLoading: true,
  isNewsLoading: true,
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

function NewsScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text>News Screen</Text>
      <Button
        title="Go to SHOE Screen"
        onPress={() => { navigation.navigate('SHOE'); }}
      />
    </View>
  );
}

function FavoritesScreen() {
  return (
    <View style={styles.container}>
      <Text>Favorites Screen</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text>Settings Screen</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

const TabbedScreen = () => {
  const navigation = useNavigation();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitleStyle: styles.headerTitle,
        headerRight: () => (
          <Pressable onPress={() => { navigation.navigate('SEARCH'); }}>
            {() => (<Image source={require('./assets/images/search.png')} style={styles.headerIcon} />)}
          </Pressable>
        ),
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

  useEffect(() => {
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

  return (
    <ApplicationContext.Provider value={{...state, loadShoes, loadNews}}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="TabbedScreen"
          screenOptions={{
            headerTitleStyle: styles.headerTitle,
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
    color: colors.darkGray,
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
