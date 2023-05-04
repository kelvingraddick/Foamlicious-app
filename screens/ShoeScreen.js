import React, { useState, useEffect, useContext } from 'react';
import { Dimensions, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApplicationContext } from '../ApplicationContext';
import SmallShoeView from '../components/SmallShoeView';
import { colors } from '../constants/colors';
import { months } from '../constants/months';

const ShoeScreen = ({route, navigation}) => {
  const id = route.params.id;

  const { shoes, isShoesLoading, favorites, isFavoritesLoading, loadFavorites } = useContext(ApplicationContext);

  const [shoe, setShoe] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [suggestedShoes, setSuggestedShoes] = useState([]);

  useEffect(() => {
    let currentShoe = shoes.find(shoe => shoe.id === id) || {};
    currentShoe.isFavorited = favorites.find(favorite => favorite.id === currentShoe.id) !== undefined;
    setShoe(currentShoe);
    navigation.setOptions({ headerTitle: currentShoe.name });

    let currentSuggestedShoes = shoes.filter(shoe => shoe.category_1 == currentShoe.category_1);
    currentSuggestedShoes = currentSuggestedShoes.sort(() => 0.5 - Math.random()).slice(0, 3); // random top 3
    setSuggestedShoes(currentSuggestedShoes);
  }, [shoes, favorites]);

  const getImageUrls = () => {
    return shoe ? [shoe.image_url_1, shoe.image_url_2, shoe.image_url_3] : [];
  };

  const getNumberOfImages = () => {
    return getImageUrls().filter(imageUrl => imageUrl).length;
  };

  const onImageScroll = (scrollOffset) => {
    let numberOfImagesScrolled = Math.round(scrollOffset / Dimensions.get('window').width);
    setCurrentImageIndex(numberOfImagesScrolled);
  };

  const onFavoriteButtonPressed = async () => {
    try {
      let newFavorites = favorites;
      const existingFavorite = newFavorites.find(favorite => favorite.id === shoe.id);
      if (existingFavorite) {
        newFavorites = newFavorites.filter(favorite => favorite.id !== shoe.id);
      } else {
        newFavorites.push({ id: shoe.id });
      }
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
      loadFavorites();
    } catch (error) {
      console.error('Saving favorites data failed with error: ' + error.message);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      { !isShoesLoading && shoe &&
        <>
          <View style={styles.dateView}>
            { shoe.hide_day === '0' &&
              <View style={styles.dayView}>
                <Text style={styles.dayLabel}>{new Date(shoe.date + 'T00:00:00.000-05:00').getDate()}</Text>
              </View>
            }
            <View style={styles.monthYearView}>
              <Text style={styles.monthYearLabel}>
                { shoe.hide_month === '0' ? months.short[new Date(shoe.date).getMonth()] + '\n' : ''}
                {new Date(shoe.date).getFullYear()}
              </Text>
            </View>
          </View>
          <ScrollView
            style={styles.imageScrollView}
            horizontal={true}
            contentContainerStyle={{ width: `${100 * getNumberOfImages()}%` }}
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            pagingEnabled
            onScroll={(data) => onImageScroll(data.nativeEvent.contentOffset.x)}
            scrollEventThrottle={200}
          >
            {getImageUrls().map((imageUrl, index) => {
              return (<Image source={{ uri: 'http://www.wavelinkllc.com/foamlife' + imageUrl }} resizeMode="contain" style={styles.image} />);
            })}
          </ScrollView>
          <View style={styles.bulletsView}>
            {[...Array(getNumberOfImages())].map((item, index) => {
              return (<Text style={[styles.bulletText, { color: index === currentImageIndex ? colors.darkGray : colors.lightGray }]}>&middot;</Text>);
            })}
          </View>
          <View style={styles.nameView}>
            <Text style={styles.nameLabel}>{shoe.name}</Text>
          </View>
          <View style={styles.dividerView}></View>
          <Text style={styles.descriptionLabel}>{shoe.color}</Text>
          <Pressable style={[styles.buttonView, { backgroundColor: colors.blue }]}>
            <Text style={styles.buttonViewLabel}>BUY NOW</Text>
          </Pressable>
          <Pressable style={[styles.buttonView, { backgroundColor: colors.darkGray }]} onPress={onFavoriteButtonPressed}>
            <Text style={styles.buttonViewLabel}>{shoe.isFavorited ? 'UN-FAVORITE' : 'FAVORITE'}</Text>
          </Pressable>
          <Pressable style={[styles.buttonView, { backgroundColor: '#5E5E5E' }]}>
            <Text style={styles.buttonViewLabel}>ADD TO CALENDAR</Text>
          </Pressable>
          <Text style={styles.suggestedLabel}>Suggested</Text>
          {suggestedShoes.map((suggestedShoe, index) => {
            return (<SmallShoeView shoe={suggestedShoe} />)
          })}
        </>
      }
      { isShoesLoading &&
        <SkeletonPlaceholder
          backgroundColor={colors.whiteGray}
          highlightColor={'#fff'}
          borderRadius={0}
        >
          <SkeletonPlaceholder.Item flexDirection="column">
            <SkeletonPlaceholder.Item flexDirection="row">
              <SkeletonPlaceholder.Item flex={1} marginLeft={20} marginVertical={20}>
                <SkeletonPlaceholder.Item height={14} />
                <SkeletonPlaceholder.Item marginTop={6} height={12} width={Dimensions.get('window').width * 0.3} />
              </SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item height={32} width={32} marginHorizontal={20} marginVertical={20} />
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item height={Dimensions.get('window').width * 0.3} width={Dimensions.get('window').width} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      } 
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
  },
  imageScrollView: {
    height: 250
  },
  image: {
    width: Dimensions.get('window').width
  },
  dateView: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1
  },
  dayView: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    backgroundColor: colors.blue
  },
  dayLabel: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 20,
    textAlign: 'center',
    color: '#fff',
  },
  monthYearView: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  monthYearLabel: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 11,
    textAlign: 'center',
    color: colors.darkGray,
  },
  bulletsView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5
  },
  bulletText: {
    marginHorizontal: 1,
    fontFamily: 'AvenirNext-Bold',
    fontSize: 30,
    lineHeight: 30,
    fontWeight: 'bold',
    color: colors.lightGray,
  },
  nameLabel: {
    marginBottom: 15,
    alignSelf: 'center',
    fontFamily: 'AvenirNext-Bold',
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.darkGray,
  },
  dividerView: {
    height: 1,
    width: 200,
    alignSelf: 'center',
    backgroundColor: colors.lightGray
  },
  descriptionLabel: {
    paddingTop: 15,
    paddingHorizontal: 20,
    paddingBottom: 20,
    fontFamily: 'AvenirNext-Regular',
    fontSize: 12,
    color: colors.darkGray,
  },
  buttonView: {
    padding: 15,
    alignItems: 'center'
  },
  buttonViewLabel: {
    color: '#fff',
    fontFamily: 'AvenirNext-Bold',
    fontSize: 14,
    fontWeight: 'bold',
  },
  suggestedLabel: {
    marginTop: 20,
    marginHorizontal: 15,
    fontFamily: 'AvenirNext-Bold',
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.darkGray,
  },
});

export default ShoeScreen;