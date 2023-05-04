import React, { useState, useEffect, useContext } from 'react';
import { Dimensions, FlatList, SafeAreaView, StyleSheet, Text } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { ApplicationContext } from '../ApplicationContext';
import { colors } from '../constants/colors';
import SmallShoeView from '../components/SmallShoeView';

const FavoritesScreen = ({navigation}) => {
  const { favorites, isFavoritesLoading, shoes, isShoesLoading } = useContext(ApplicationContext);

  const [displayedShoes, setDisplayedShoes] = useState([]);

  useEffect(() => {
    let favoriteShoeIds = favorites.map(favorite => favorite.id);
    let displayedShoes = shoes.filter(shoe => favoriteShoeIds.includes(shoe.id));
    displayedShoes.sort((a, b) => (new Date(a.date) - new Date(b.date)));
    setDisplayedShoes(displayedShoes);
  }, [favorites, shoes]);

  return (
    <SafeAreaView style={styles.container}>
      { (!isFavoritesLoading && !isShoesLoading) && favorites.length > 0 &&
        <FlatList
          style={styles.list}
          data={displayedShoes}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => <SmallShoeView shoe={item} />}
        />
      }
      { (!isFavoritesLoading && !isShoesLoading) && favorites.length === 0 &&
        <Text style={styles.noFavoritesLabel}>Add shoes to your favorites by searching or viewing the releases</Text>
      }
      { (isFavoritesLoading || isShoesLoading) &&
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
  headerIcon: {
    resizeMode: 'contain',
    maxHeight: 24,
    tintColor: colors.darkGray,
  },
  container: {

  },
  list: {
    backgroundColor: '#fff',
  },
  noFavoritesLabel: {
    fontFamily: 'AvenirNext-Bold',
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.gray,
    textAlign: 'center',
    paddingVertical: 50,
    paddingHorizontal: 25,
  },
});

export default FavoritesScreen;