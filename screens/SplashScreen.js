import React, { useEffect } from 'react';
import { Image, SafeAreaView, StyleSheet, View } from 'react-native';
import BootSplash from "react-native-bootsplash";
import { colors } from '../constants/colors';

const SplashScreen = ({navigation}) => {
  
  useEffect(() => {
    BootSplash.hide({ fade: true });
    setTimeout(() => {
      navigation.navigate('TabbedScreen');
    }, 3000);
  }, []);

  const onSomething = async (index) => {
    
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Image source={require('../assets/images/splash.gif')} style ={styles.image} /> 
      </View> 
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.black,
  },
  image: {
    width: '100%',
    resizeMode: 'contain',
}
});

export default SplashScreen;