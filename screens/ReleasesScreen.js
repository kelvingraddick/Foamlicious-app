import React, { useState, useEffect, useContext } from 'react';
import { Dimensions, FlatList, Image, ImageBackground, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { ApplicationContext } from '../ApplicationContext';
import { filters } from '../constants/filters';
import { colors } from '../constants/colors';
import { sorts } from '../constants/sorts';
import { months } from '../constants/months';

const ReleasesScreen = ({navigation}) => {
  const { shoes, isShoesLoading, loadShoes } = useContext(ApplicationContext);

  const [displayedShoes, setDisplayedShoes] = useState([]);
  const [filter, setFilter] = useState(filters.UPCOMING);
  const [upcomingShoesSort, setUpcomingShoesSort] = useState(sorts.ASCENDING);
  const [pastShoesSort, setPastShoesSort] = useState(sorts.DESCENDING);

  useEffect(() => {
    let imageSource = (filter === filters.UPCOMING ? upcomingShoesSort : pastShoesSort) === sorts.ASCENDING ?
      require('../assets/images/ascending.png') :
      require('../assets/images/descending.png');
    navigation.setOptions({
      headerLeft: () => (
        <Pressable onPress={onSortButtonPressed}>
          {() => (<Image source={imageSource} style={styles.headerIcon} />)}
        </Pressable>
      ),
    });
  }, [navigation, filter, upcomingShoesSort, pastShoesSort]);

  useEffect(() => {
    let displayedShoes = filter === filters.UPCOMING ?
      shoes.filter(shoe => new Date(shoe.date) > new Date()) :
      shoes.filter(shoe => new Date(shoe.date) <= new Date());
    displayedShoes.sort((a, b) => 
      (filter === filters.UPCOMING ? upcomingShoesSort : pastShoesSort) === sorts.ASCENDING ?
        (new Date(a.date) - new Date(b.date)) : // ascending
        (new Date(b.date) - new Date(a.date)));  // descending
    setDisplayedShoes(displayedShoes);
  }, [shoes, filter, upcomingShoesSort, pastShoesSort]);

  const onSortButtonPressed = () => {
    if (filter === filters.UPCOMING) {
      setUpcomingShoesSort(upcomingShoesSort === sorts.ASCENDING ? sorts.DESCENDING : sorts.ASCENDING);
    } else {
      setPastShoesSort(pastShoesSort === sorts.ASCENDING ? sorts.DESCENDING : sorts.ASCENDING);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.shoeView} onPress={() => { navigation.navigate('SHOE', { id: item.id }); }}>
        <ImageBackground source={{ uri: 'http://www.wavelinkllc.com/foamlife' + item.image_url_1 }} resizeMode="contain" style={styles.backgroundImage}>
          <View style={styles.headerView}>
            <View style={styles.nameView}>
              <Text style={styles.nameLabel}>{item.name}</Text>
              <Text style={styles.colorLabel}>{item.color}</Text>
            </View>
            <View style={styles.dateView}>
              { item.hide_day === '0' &&
                <View style={styles.dayView}>
                  <Text style={styles.dayLabel}>{new Date(item.date + 'T00:00:00.000-05:00').getDate()}</Text>
                </View>
              }
              <View style={styles.monthYearView}>
                <Text style={styles.monthYearLabel}>
                  { item.hide_month === '0' ? months[new Date(item.date).getMonth()] + '\n' : ''}
                  {new Date(item.date).getFullYear()}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.moreButtonView}>
            <Image source={require('../assets/images/arrow_right.png')} style={styles.moreButtonImage} />
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.filterView}>
        <Pressable
          onPress={() => { setFilter(filters.UPCOMING); }}
          style={({pressed}) => [styles.filterButton, { backgroundColor: pressed ? colors.whiteGray : '#fff' }]}
        >
          {({pressed}) => (<Text style={filter === filters.UPCOMING ? styles.selectedFilterLabel : styles.unselectedFilterLabel}>UPCOMING</Text>)}
        </Pressable>
        <Pressable
          onPress={() => { setFilter(filters.PAST); }}
          style={({pressed}) => [styles.filterButton, { backgroundColor: pressed ? colors.whiteGray : '#fff' }]}
        >
          {({pressed}) => (<Text style={filter === filters.PAST ? styles.selectedFilterLabel : styles.unselectedFilterLabel}>PAST</Text>)}
        </Pressable>
      </View>
      { !isShoesLoading &&
        <FlatList
          data={displayedShoes}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
        />
      }
      { isShoesLoading &&
        <FlatList
          data={[0, 1, 2, 3, 4, 5]}
          keyExtractor={item => item.toString()}
          renderItem={({item}) => {
            return (
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
            );
          }}
        />
      } 
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  headerIcon: {
    resizeMode: 'contain',
    maxHeight: 24,
    tintColor: colors.darkGray
  },
  filterView: {
    flexDirection: 'row',
    borderBottomWidth: 0.2,
    borderBottomColor: colors.lightGray
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
  shoeView: {
    flex: 1,
    justifyContent: 'space-between',
    height: Dimensions.get('window').width * 0.85,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray
  },
  backgroundImage: {
    flex: 1,
  },
  headerView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
  },
  nameView: {
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
  colorLabel: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 12,
    color: colors.darkGray,
  },
  dateView: {

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
  footerView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    padding: 10,
  },
  moreButtonView: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    margin: 10,
    padding: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.42)',
  },
  moreButtonImage: {
    height: 20,
    width: 20,
  }
});

export default ReleasesScreen;