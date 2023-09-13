import React, { useState, useEffect, useContext } from 'react';
import { Dimensions, FlatList, SafeAreaView, StyleSheet, Text } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApplicationContext } from '../ApplicationContext';
import { appearanceThemes } from '../constants/appearanceThemes';
import { colors } from '../constants/colors';
import SmallShoeView from '../components/SmallShoeView';

const FavoritesScreen = ({navigation}) => {
  const { favorites, isFavoritesLoading, loadFavorites, shoes, isShoesLoading, appearanceTheme } = useContext(ApplicationContext);

  const [displayedShoes, setDisplayedShoes] = useState([]);
  const [selectedShoe, setSelectedShoe] = useState(null);

  let actionSheet = null;
  const actionOptions = {
    VIEW_SHOE: 'View shoe',
    MOVE_UP: 'Move up',
    MOVE_DOWN: 'Move down',
    REMOVE_AS_FAVORITE: 'Remove as favorite',
    CANCEL: 'Cancel',
  };

  useEffect(() => {
    let displayedShoes = favorites.map(favorite => shoes.find(shoe => favorite.id === shoe.id));
    setDisplayedShoes(displayedShoes);
  }, [favorites, shoes]);

  // when a shoe is selected (and state updated), open action menu
  useEffect(() => {
    if (selectedShoe) {
      actionSheet && actionSheet.show();
    }
  }, [selectedShoe]);

  const onActionOptionPress = async (index) => {
    if (selectedShoe) {
      let newFavorites = favorites;
      let position;

      const actionOption = Object.values(actionOptions)[index];
      switch (actionOption) {
        case actionOptions.VIEW_SHOE:
          navigation.push('SHOE', { id: selectedShoe.id });
          break;
        case actionOptions.MOVE_UP:
          position = newFavorites.findIndex(favorites => favorites.id == selectedShoe.id);
          if (position > 0) {
            let favorite = newFavorites[position];
            newFavorites[position] = newFavorites[position - 1];
            newFavorites[position - 1] = favorite;
            await saveFavorites(newFavorites);
          }
          break;
        case actionOptions.MOVE_DOWN:
          position = newFavorites.findIndex(favorites => favorites.id == selectedShoe.id);
          if (position < newFavorites.length - 1) {
            let favorite = newFavorites[position];
            newFavorites[position] = newFavorites[position + 1];
            newFavorites[position + 1] = favorite;
            await saveFavorites(newFavorites);
          }
          break;
        case actionOptions.REMOVE_AS_FAVORITE:
          newFavorites = newFavorites.filter(favorite => favorite.id !== selectedShoe.id);
          await saveFavorites(newFavorites);
          break;
      };
      
      setSelectedShoe(null);
    }
  };

  const saveFavorites = async (newFavorites) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
      loadFavorites();
    } catch (error) {
      console.error('Saving favorites data failed with error: ' + error.message);
    }
  } 

  return (
    <SafeAreaView style={styles.container}>
      { (!isFavoritesLoading && !isShoesLoading) && favorites.length > 0 &&
        <>
          <FlatList
            style={[styles.list, { backgroundColor: (appearanceTheme == appearanceThemes.LIGHT ? colors.white : colors.darkBlack) }]}
            data={displayedShoes}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => <SmallShoeView shoe={item} actionIconImageSource={require('../assets/images/options.png')} onPress={() => setSelectedShoe(item)} />}
          />
          <ActionSheet
            ref={x => actionSheet = x}
            title={'Choose option:'}
            tintColor={colors.darkGray}
            options={[actionOptions.VIEW_SHOE, actionOptions.MOVE_UP, actionOptions.MOVE_DOWN, actionOptions.REMOVE_AS_FAVORITE, actionOptions.CANCEL]}
            cancelButtonIndex={Object.values(actionOptions).indexOf(actionOptions.CANCEL)}
            destructiveButtonIndex={Object.values(actionOptions).indexOf(actionOptions.REMOVE_AS_FAVORITE)}
            onPress={onActionOptionPress}
          />
        </>
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