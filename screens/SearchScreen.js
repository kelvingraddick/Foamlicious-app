import React, { useState, useEffect, useContext } from 'react';
import { FlatList, Image, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { ApplicationContext } from '../ApplicationContext';
import { appearanceThemes } from '../constants/appearanceThemes';
import { colors } from '../constants/colors';

const SearchScreen = ({navigation}) => {
  const { shoes, isShoesLoading, loadShoes, news, isNewsLoading, loadNews, appearanceTheme } = useContext(ApplicationContext);

  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');
  const [isBarcodeScanningEnabled, setIsBarcodeScanningEnabled] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: (appearanceTheme == appearanceThemes.LIGHT ? colors.white : colors.lightBlack),
      },
      headerRight: () => (
        <Pressable onPress={onScanButtonPressed}>
          {() => isBarcodeScanningEnabled ?
            (<Text style={styles.headerX}>✕</Text>) :
            (<Image source={require('../assets/images/barcode.png')} style={styles.headerIcon} />)
          }
        </Pressable>
      ),
    });
  }, [navigation, isBarcodeScanningEnabled]);

  useEffect(() => {
    let matchingShoes = shoes.filter(shoe => { return shoe.name.toLowerCase().includes(query) || shoe.description.toLowerCase().includes(query) || shoe.color.toLowerCase().includes(query); });
    matchingShoes.sort((a, b) => new Date(b.date) - new Date(a.date)); // descending
    setResults(matchingShoes);
  }, [query]);

  const onScanButtonPressed = () => {
    setIsBarcodeScanningEnabled(!isBarcodeScanningEnabled);
  };

  const renderItem = ({ item }) => {
    return (
      <Pressable
        style={[
          styles.resultView, 
          {
            backgroundColor: (appearanceTheme == appearanceThemes.LIGHT ? 'rgba(255, 255, 255, 0.50)' : colors.lightBlack),
            marginBottom: (appearanceTheme == appearanceThemes.LIGHT ? 0 : 1),
            borderBottomWidth: (appearanceTheme == appearanceThemes.LIGHT ? 1 : 0),
            borderBottomColor: (appearanceTheme == appearanceThemes.LIGHT ? colors.lightGray : 'transparent')
          }
        ]}
        onPress={() => { navigation.push('SHOE', { id: item.id }); }}
      >
        <Image source={{ uri: 'http://www.wavelinkllc.com/foamlife' + item.image_url_1 }} resizeMode="contain" style={styles.image} />
        <View style={styles.textView}>
          <Text style={[styles.nameLabel, { color: (appearanceTheme == appearanceThemes.LIGHT ? colors.darkGray : colors.gray) }]}>{item.name}</Text>
          <Text style={styles.detailLabel}>{item.color}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: (appearanceTheme == appearanceThemes.LIGHT ? colors.white : colors.darkBlack) }]}>
      { isBarcodeScanningEnabled &&
        <View>
          <RNCamera
            style={styles.barcodeCameraView}
            //cameraViewDimensions={{width: 500, height: 250}}
            onBarCodeRead={(event) => {
              setQuery(event.data);
              setIsBarcodeScanningEnabled(false);
            }}
          />
          <View style={styles.barcodeLineView}></View>
        </View>
      }
      <View style={[styles.searchView, { borderBottomWidth: (appearanceTheme == appearanceThemes.LIGHT ? 1 : 0), borderBottomColor: (appearanceTheme == appearanceThemes.LIGHT ? colors.lightGray : 'transparent') }]}>
        <Image source={require('../assets/images/search.png')} style={styles.searchIcon} />
        <TextInput
          style={styles.searchBox}
          onChangeText={setQuery}
          value={query}
          placeholder="Search here for shoes or news.."
          autoCapitalize='none'
          clearButtonMode='unless-editing'
          keyboardType="web-search"
        />
      </View>
      <FlatList
        data={results}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  barcodeCameraView: {
    width: '100%',
    height: Platform.OS === 'ios' ? 250 : 500
  },
  barcodeLineView: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 125 : 250,
    width: '100%',
    height: 3,
    backgroundColor: colors.blue
  },
  headerIcon: {
    resizeMode: 'contain',
    maxHeight: 24,
    tintColor: colors.darkGray
  },
  headerX: {
    paddingRight: 10,
    fontFamily: 'AvenirNext-Regular',
    fontSize: 24,
    color: colors.darkGray,
  },
  searchView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  searchIcon: {
    resizeMode: 'contain',
    maxHeight: 14,
    tintColor: colors.darkGray,
  },
  searchBox: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 14,
    color: colors.darkGray,
  },
  resultView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    height: 40,
    width: 40,
    marginHorizontal: 10,
  },
  textView: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 10,
  },
  nameLabel: {
    fontFamily: 'AvenirNext-Bold',
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailLabel: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 12,
    color: colors.darkGray,
  },
});

export default SearchScreen;