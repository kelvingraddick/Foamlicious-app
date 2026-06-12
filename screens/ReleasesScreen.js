import React, {useState, useEffect, useContext, useCallback} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {ApplicationContext} from '../ApplicationContext';
import {appearanceThemes} from '../constants/appearanceThemes';
import {filters} from '../constants/filters';
import {colors} from '../constants/colors';
import {sorts} from '../constants/sorts';
import SmallShoeView from '../components/SmallShoeView';

const ReleasesScreen = ({navigation}) => {
  const {shoes, isShoesLoading, appearanceTheme} =
    useContext(ApplicationContext);
  const tabBarHeight = useBottomTabBarHeight();
  const isLightTheme = appearanceTheme === appearanceThemes.LIGHT;
  const screenBackgroundColor = isLightTheme ? colors.white : 'transparent';
  const listBackgroundColor = isLightTheme
    ? colors.whiteGray
    : colors.darkBlack;
  const rowBackgroundColor = isLightTheme ? colors.white : 'transparent';
  const filterBorderBottomColor = isLightTheme
    ? colors.lightGray
    : 'transparent';

  const [displayedShoes, setDisplayedShoes] = useState([]);
  const [filter, setFilter] = useState(filters.UPCOMING);
  const [upcomingShoesSort, setUpcomingShoesSort] = useState(sorts.ASCENDING);
  const [pastShoesSort, setPastShoesSort] = useState(sorts.DESCENDING);

  const onSortButtonPressed = useCallback(() => {
    if (filter === filters.UPCOMING) {
      setUpcomingShoesSort(
        upcomingShoesSort === sorts.ASCENDING
          ? sorts.DESCENDING
          : sorts.ASCENDING,
      );
    } else {
      setPastShoesSort(
        pastShoesSort === sorts.ASCENDING ? sorts.DESCENDING : sorts.ASCENDING,
      );
    }
  }, [filter, upcomingShoesSort, pastShoesSort]);

  useEffect(() => {
    let imageSource =
      (filter === filters.UPCOMING ? upcomingShoesSort : pastShoesSort) ===
      sorts.ASCENDING
        ? require('../assets/images/ascending.png')
        : require('../assets/images/descending.png');
    navigation.setOptions({
      headerLeft: () => (
        <Pressable onPress={onSortButtonPressed}>
          {() => <Image source={imageSource} style={styles.headerIcon} />}
        </Pressable>
      ),
    });
  }, [
    navigation,
    filter,
    upcomingShoesSort,
    pastShoesSort,
    onSortButtonPressed,
  ]);

  useEffect(() => {
    let filteredShoes =
      filter === filters.UPCOMING
        ? shoes.filter(shoe => new Date(shoe.date) > new Date())
        : shoes.filter(shoe => new Date(shoe.date) <= new Date());
    filteredShoes.sort((a, b) =>
      (filter === filters.UPCOMING ? upcomingShoesSort : pastShoesSort) ===
      sorts.ASCENDING
        ? new Date(a.date) - new Date(b.date) // ascending
        : new Date(b.date) - new Date(a.date),
    ); // descending
    setDisplayedShoes(filteredShoes);
  }, [shoes, filter, upcomingShoesSort, pastShoesSort]);

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: screenBackgroundColor,
        },
      ]}>
      <View
        style={[
          styles.filterView,
          {
            borderBottomColor: filterBorderBottomColor,
          },
        ]}>
        <Pressable
          onPress={() => {
            setFilter(filters.UPCOMING);
          }}
          style={({pressed}) => [
            styles.filterButton,
            {
              backgroundColor: pressed
                ? colors.whiteGray
                : appearanceTheme === appearanceThemes.LIGHT
                ? colors.white
                : colors.darkBlack,
            },
          ]}>
          {({pressed}) => (
            <Text
              style={
                filter === filters.UPCOMING
                  ? styles.selectedFilterLabel
                  : styles.unselectedFilterLabel
              }>
              UPCOMING
            </Text>
          )}
        </Pressable>
        <Pressable
          onPress={() => {
            setFilter(filters.PAST);
          }}
          style={({pressed}) => [
            styles.filterButton,
            {
              backgroundColor: pressed
                ? colors.whiteGray
                : appearanceTheme === appearanceThemes.LIGHT
                ? colors.white
                : colors.darkBlack,
            },
          ]}>
          {({pressed}) => (
            <Text
              style={
                filter === filters.PAST
                  ? styles.selectedFilterLabel
                  : styles.unselectedFilterLabel
              }>
              PAST
            </Text>
          )}
        </Pressable>
      </View>
      {!isShoesLoading && (
        <FlatList
          style={[styles.list, {backgroundColor: listBackgroundColor}]}
          contentContainerStyle={[
            styles.listContent,
            {paddingBottom: tabBarHeight},
          ]}
          data={displayedShoes}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <View style={{backgroundColor: rowBackgroundColor}}>
              <SmallShoeView
                shoe={item}
                onPress={() => {
                  navigation.push('SHOE', {id: item.id});
                }}
              />
            </View>
          )}
        />
      )}
      {isShoesLoading && (
        <FlatList
          style={[styles.list, {backgroundColor: listBackgroundColor}]}
          contentContainerStyle={[
            styles.listContent,
            {paddingBottom: tabBarHeight},
          ]}
          data={[0, 1, 2, 3, 4, 5]}
          keyExtractor={item => item.toString()}
          renderItem={({item}) => {
            return (
              <SkeletonPlaceholder
                backgroundColor={
                  appearanceTheme === appearanceThemes.LIGHT
                    ? colors.whiteGray
                    : colors.lightBlack
                }
                highlightColor={
                  appearanceTheme === appearanceThemes.LIGHT
                    ? colors.white
                    : colors.darkGray
                }
                borderRadius={0}>
                <SkeletonPlaceholder.Item flexDirection="column">
                  <SkeletonPlaceholder.Item flexDirection="row">
                    <SkeletonPlaceholder.Item
                      flex={1}
                      marginLeft={20}
                      marginVertical={20}>
                      <SkeletonPlaceholder.Item height={14} />
                      <SkeletonPlaceholder.Item
                        marginTop={6}
                        height={12}
                        width={Dimensions.get('window').width * 0.3}
                      />
                    </SkeletonPlaceholder.Item>
                    <SkeletonPlaceholder.Item
                      height={32}
                      width={32}
                      marginHorizontal={20}
                      marginVertical={20}
                    />
                  </SkeletonPlaceholder.Item>
                  <SkeletonPlaceholder.Item
                    height={Dimensions.get('window').width * 0.3}
                    width={Dimensions.get('window').width}
                  />
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
  },
  headerIcon: {
    resizeMode: 'contain',
    maxHeight: 24,
    tintColor: colors.darkGray,
  },
  filterView: {
    flexDirection: 'row',
    borderBottomWidth: 0.2,
  },
  filterButton: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
  },
  selectedFilterLabel: {
    fontFamily: 'AvenirNext-Bold',
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.darkGray,
  },
  unselectedFilterLabel: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 14,
    color: colors.darkGray,
  },
});

export default ReleasesScreen;
