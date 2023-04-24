import React, { useState, useEffect, useContext } from 'react';
import { Dimensions, FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ApplicationContext } from '../ApplicationContext';
import { colors } from '../constants/colors';

const SearchScreen = ({navigation}) => {
  const { shoes, isShoesLoading, loadShoes, news, isNewsLoading, loadNews } = useContext(ApplicationContext);

  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTintColor: colors.darkGray,
      headerRight: () => (
        <Pressable onPress={onScanButtonPressed}>
          {() => (<Image source={require('../assets/images/barcode.png')} style={styles.headerIcon} />)}
        </Pressable>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    console.log("query: " + query);
    let matchingShoes = shoes.filter(shoe => { return shoe.name.toLowerCase().includes(query) || shoe.description.toLowerCase().includes(query) || shoe.color.toLowerCase().includes(query); });
    matchingShoes.sort((a, b) => new Date(b.date) - new Date(a.date)); // descending
    setResults(matchingShoes);
  }, [query]);

  const onScanButtonPressed = () => {
    
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.resultView}>
        <Image source={{ uri: 'http://www.wavelinkllc.com/foamlife' + item.image_url_1 }} resizeMode="contain" style={styles.image} />
        <View style={styles.textView}>
          <Text style={styles.nameLabel}>{item.name}</Text>
          <Text style={styles.detailLabel}>{item.color}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchView}>
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
    backgroundColor: '#fff'
  },
  headerIcon: {
    resizeMode: 'contain',
    maxHeight: 24,
    tintColor: colors.darkGray
  },
  searchView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray
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
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray
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
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
  },
  nameLabel: {
    fontFamily: 'AvenirNext-Bold',
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.darkGray,
  },
  detailLabel: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 12,
    color: colors.darkGray,
  },
});

export default SearchScreen;