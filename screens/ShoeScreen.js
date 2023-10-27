import React, { useState, useEffect, useContext } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, Linking, Platform, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import ShareActionSheet from 'react-native-actionsheet';
import BuyNowActionSheet from 'react-native-actionsheet';
import ApparelActionSheet from 'react-native-actionsheet';
import CalendarActionSheet from 'react-native-actionsheet';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNCalendarEvents from "react-native-calendar-events";
import { ApplicationContext } from '../ApplicationContext';
import { appearanceThemes } from '../constants/appearanceThemes';
import SmallShoeView from '../components/SmallShoeView';
import { getPrettyDate } from '../helpers/formatter';
import { colors } from '../constants/colors';
import { months } from '../constants/months';

const ShoeScreen = ({route, navigation}) => {
  const id = route.params.id;

  const { shoes, isShoesLoading, favorites, isFavoritesLoading, loadFavorites, appearanceTheme } = useContext(ApplicationContext);

  const [shoe, setShoe] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [suggestedShoes, setSuggestedShoes] = useState([]);

  const sellerActionOptions = {
    STOCKX: 'StockX.com',
    GOAT: 'Goat.com',
    CANCEL: 'Cancel',
  };

  const apparelActionOptions = {
    //DOPESNEAKERTEES: 'DopeSneakerTees.com', // site is down
    EBAY: 'Ebay.com',
    ETSY: 'Etsy.com',
    MYFITTEDS: 'MyFitteds.com',
    CANCEL: 'Cancel',
  };

  const [calendars, setCalendars] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: (appearanceTheme == appearanceThemes.LIGHT ? colors.white : colors.lightBlack),
      },
      headerRight: () => (
        <Pressable onPress={() => { this.ShareActionSheet && this.ShareActionSheet.show(); }}>
          {() => (<Image source={require('../assets/images/share.png')} style={styles.headerIcon} />)}
        </Pressable>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    let currentShoe = shoes.find(shoe => shoe.id === id) || {};
    currentShoe.isFavorited = favorites.find(favorite => favorite.id === currentShoe.id) !== undefined;
    let shoeDate = new Date(currentShoe.date + 'T00:00:00.000-05:00');
    currentShoe.formattedDate = 
      (currentShoe.hide_month === '0' ? (months.long[shoeDate.getMonth()] + ' ') : '') +
      (currentShoe.hide_day === '0' ? (shoeDate.getDate() + ', ') : '') +
      shoeDate.getFullYear();
    setShoe(currentShoe);
    navigation.setOptions({ headerTitle: currentShoe.name });

    let currentSuggestedShoes = shoes.filter(shoe => shoe.category_1 == currentShoe.category_1);
    currentSuggestedShoes = currentSuggestedShoes.sort(() => 0.5 - Math.random()).slice(0, 3); // random top 3
    setSuggestedShoes(currentSuggestedShoes);
  }, [shoes, favorites]);

  // when calendars are found (and state updated), open calendar select menu
  useEffect(() => {
    if (calendars && calendars.length > 0) {
      this.CalendarActionSheet && this.CalendarActionSheet.show();
    }
  }, [calendars]);

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

  const onAddToCalendarButtonPressed = async () => {
    RNCalendarEvents.requestPermissions().then((response) => {
      if (response === 'authorized') {
        RNCalendarEvents.findCalendars().then((response) => {
          const editableCalendars = response.filter(x => x.allowsModifications);
          setCalendars(editableCalendars);
        })
        .catch((error) => {
          console.error('Finding calendars failed with error: ' + error.message);
        });
      } else {
        console.log('Requesting calendar permissions failed with response: ' + response);
      }
    })
    .catch((error) => {
      console.error('Requesting calendar permissions failed with error: ' + error.message);
    });
  };

  const onShareActionOptionPress = async (index) => {
    const url = getSellerUrl(Object.values(sellerActionOptions)[index]);
    if (!url) return;
    try {
      const message = 'Check out ' + shoe.name + ' ' + shoe.color + ' at: ' + url;
      await Share.share(
        { message: message, url: url, title: message },
        { dialogTitle: message, subject: message, tintColor: colors.darkGray }
      );
    } catch (error) {
      console.error('Sharing shoe failed with error: ' + error.message);
    }
  };

  const onBuyNowActionOptionPress = async (index) => {
    const url = getSellerUrl(Object.values(sellerActionOptions)[index]);
    if (url) Linking.openURL(url);
  };

  const getSellerUrl = (sellerActionOption) => {
    let url = null;
    const searchQueryString = getSearchQueryString(shoe.name + '+' + shoe.color);
    switch (sellerActionOption) {
      case sellerActionOptions.STOCKX:
        url = (shoe.stock_x_url && shoe.stock_x_url !== '') ? shoe.stock_x_url : 'https://stockx.com/search?s=' + searchQueryString;
        break;
      case sellerActionOptions.GOAT:
        url = (shoe.goat_url && shoe.goat_url !== '') ? shoe.goat_url : 'https://www.goat.com/search?query=' + searchQueryString;
        break;
    };
    return url;
  };

  const getSearchQueryString = (rawString) => {
    return rawString && rawString
      .replace("'", "")
      .replace("“", "")
      .replace("”", "")
      .replace(" ", "+")
      .replace("/", "+")
      .replace("-", "+");
  };

  const onApparelActionOptionPress = async (index) => {
    const keyword = shoe.category_2 && shoe.category_2.toLowerCase();
    const actionOption = Object.values(apparelActionOptions)[index];
    switch (actionOption) {
      case apparelActionOptions.DOPESNEAKERTEES:
        Linking.openURL((shoe.dope_sneaker_tees_url && shoe.dope_sneaker_tees_url !== '') ? shoe.dope_sneaker_tees_url : 'https://www.dopesneakertees.com/search?type=product&q=foamposite ' + keyword + ' shirt');
        break;
      case apparelActionOptions.EBAY:
        Linking.openURL((shoe.ebay_apparel_url && shoe.ebay_apparel_url !== '') ? shoe.ebay_apparel_url : 'http://www.ebay.com/sch/foamposite ' + keyword + ' shirt');
        break;
      case apparelActionOptions.ETSY:
        Linking.openURL((shoe.etsy_url && shoe.etsy_url !== '') ? shoe.etsy_url : 'https://www.etsy.com/search?q=foamposite ' + keyword);
        break;
      case apparelActionOptions.MYFITTEDS:
        Linking.openURL((shoe.my_fitteds_url && shoe.my_fitteds_url !== '') ? shoe.my_fitteds_url : 'https://www.myfitteds.com/search?q=foamposite ' + keyword);
        break;
    };
  };

  const onCalendarActionOptionPress = async (index) => {
    const calendar = calendars[index];
    if (calendar) {
      const title = shoe.name + ' release day';
      const date = new Date(shoe.date + 'T00:00:00.000-05:00');

      RNCalendarEvents.saveEvent(title, {
        calendarId: calendar.id,
        title: title,
        startDate: date.toISOString(),
        endDate: date.toISOString(),
        allDay: true,
        description: title,
        notes: title
      })
      .then((response) => {
        const message = getPrettyDate(shoe.date, shoe.hide_month === '0', shoe.hide_day === '0') + ': \'' + title + '\'';
        Alert.alert('An event was added to your calendar!', message, [{text: 'OK' }]);
      })
      .catch((error) => {
        console.error('Saving calendar event failed with error: ' + error.message);
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: (appearanceTheme == appearanceThemes.LIGHT ? colors.white : colors.darkBlack) }]}>
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
          <View style={[styles.infoView, { backgroundColor: (appearanceTheme == appearanceThemes.LIGHT ? colors.whiteGray : colors.black) }]}>
            <Text style={[styles.nameLabel, { color: (appearanceTheme == appearanceThemes.LIGHT ? colors.darkGray : colors.gray) }]}>{shoe.name}</Text>
            <Text style={[styles.infoLabel, { color: (appearanceTheme == appearanceThemes.LIGHT ? colors.darkGray : colors.gray) }]}>
              {shoe.color}
              {shoe.style_code && <Text>{'\n' + shoe.style_code}</Text>}
              {'\n' + shoe.formattedDate}
              {shoe.price && <Text>{'\n' + shoe.price}</Text>}
            </Text>
          </View>
          <Text style={[styles.descriptionLabel, { color: (appearanceTheme == appearanceThemes.LIGHT ? colors.darkGray : colors.gray) }]}>{shoe.description}</Text>
          <Pressable style={[styles.buttonView, { backgroundColor: colors.blue }]} onPress={() => { this.BuyNowActionSheet && this.BuyNowActionSheet.show(); }}>
            <Text style={styles.buttonViewLabel}>BUY NOW</Text>
          </Pressable>
          <Pressable style={[styles.buttonView, { backgroundColor: colors.darkGray }]} onPress={onFavoriteButtonPressed}>
            { !isFavoritesLoading && <Text style={styles.buttonViewLabel}>{isFavoritesLoading ? 'LOADING..' : (shoe.isFavorited ? 'UN-FAVORITE' : 'FAVORITE')}</Text> }
            { isFavoritesLoading && <ActivityIndicator /> }
          </Pressable>
          { new Date(shoe.date) > new Date() &&
            <Pressable style={[styles.buttonView, { backgroundColor: '#5E5E5E' }]} onPress={onAddToCalendarButtonPressed}>
              <Text style={styles.buttonViewLabel}>ADD TO CALENDAR</Text>
            </Pressable>
          }
          <Text style={styles.suggestedLabel}>Suggested</Text>
          {suggestedShoes.map((suggestedShoe, index) => {
            return (<SmallShoeView shoe={suggestedShoe} onPress={() => { navigation.push('SHOE', { id: suggestedShoe.id }); }} />)
          })}
          <Pressable style={[styles.buttonView, { backgroundColor: '#5E5E5E', marginBottom: 50 }]} onPress={() => { this.ApparelActionSheet && this.ApparelActionSheet.show(); }}>
            <Text style={styles.buttonViewLabel}>FIND MATCHING APPAREL</Text>
          </Pressable>
          <ShareActionSheet
            ref={x => this.ShareActionSheet = x}
            title={'Choose seller to share:'}
            tintColor={colors.darkGray}
            options={Object.values(sellerActionOptions)}
            cancelButtonIndex={Object.values(sellerActionOptions).indexOf(sellerActionOptions.CANCEL)}
            onPress={onShareActionOptionPress}
          />
          <BuyNowActionSheet
            ref={x => this.BuyNowActionSheet = x}
            title={'Choose seller'}
            tintColor={colors.darkGray}
            options={Object.values(sellerActionOptions)}
            cancelButtonIndex={Object.values(sellerActionOptions).indexOf(sellerActionOptions.CANCEL)}
            onPress={onBuyNowActionOptionPress}
          />
          <ApparelActionSheet
            ref={x => this.ApparelActionSheet = x}
            title={'Choose seller'}
            tintColor={colors.darkGray}
            options={Object.values(apparelActionOptions)}
            cancelButtonIndex={Object.values(apparelActionOptions).indexOf(apparelActionOptions.CANCEL)}
            onPress={onApparelActionOptionPress}
          />
          <CalendarActionSheet
            ref={x => this.CalendarActionSheet = x}
            title={'Choose calendar to add event to:'}
            tintColor={colors.darkGray}
            options={calendars.map(calendar => calendar.title).concat('Cancel')}
            cancelButtonIndex={calendars.length}
            onPress={onCalendarActionOptionPress}
          />
        </>
      }
      { isShoesLoading &&
        <SkeletonPlaceholder
          backgroundColor={(appearanceTheme == appearanceThemes.LIGHT ? colors.whiteGray : colors.lightBlack)}
          highlightColor={(appearanceTheme == appearanceThemes.LIGHT ? colors.white : colors.darkGray)}
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
    
  },
  headerIcon: {
    resizeMode: 'contain',
    maxHeight: 24,
    tintColor: colors.darkGray
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
    paddingHorizontal: 20,
    paddingBottom: 5,
    fontFamily: 'AvenirNext-Bold',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dividerView: {
    height: 1,
    width: 200,
    alignSelf: 'center',
    backgroundColor: colors.lightGray
  },
  infoView: {
    paddingVertical: 20,
  },
  infoLabel: {
    paddingHorizontal: 20,
    fontFamily: 'AvenirNext-Regular',
    fontSize: 12,
  },
  descriptionLabel: {
    padding: 20,
    fontFamily: 'AvenirNext-Regular',
    fontSize: 12,
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