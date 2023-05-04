import React, { useState, useEffect, useContext } from 'react';
import { Dimensions, FlatList, Image, ImageBackground, Linking, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { ApplicationContext } from '../ApplicationContext';
import { colors } from '../constants/colors';

const NewsScreen = ({navigation}) => {
  const { news, isNewsLoading, loadNews } = useContext(ApplicationContext);

  const [displayedNews, setDisplayedNews] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable onPress={onRefreshButtonPressed}>
          {() => (<Image source={require('../assets/images/refresh.png')} style={styles.headerIcon} />)}
        </Pressable>
      ),
    });

    let displayedNews = news;
    displayedNews.sort((a, b) => (new Date(b.date) - new Date(a.date))); // descending
    setDisplayedNews(displayedNews);
  }, [news]);

  const onRefreshButtonPressed = () => {
    loadNews();
  };

  return (
    <SafeAreaView style={styles.container}>
      { !isNewsLoading &&
        <FlatList
          data={displayedNews}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => 
            <TouchableOpacity style={styles.container} onPress={() => { Linking.openURL(item.link); }}>
              <ImageBackground source={{ uri: item.cover_image_url }} resizeMode="cover" style={styles.backgroundImage}>
                <View style={styles.headerView}>
                  <Image source={{ uri: item.author_image_url }} style={styles.authorImage} />
                </View>
              </ImageBackground>
              <View style={styles.footerView}>
                  <Text style={styles.titleLabel}>{item.title}</Text>
                  <Text style={styles.detailLabel}>{item.author} &middot; {item.timestamp}</Text>
                </View>
            </TouchableOpacity>
          }
        />
      }
      { isNewsLoading &&
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
    tintColor: colors.darkGray
  },
  container: {
    backgroundColor: '#fff'
  },
  backgroundImage: {
    height: Dimensions.get('window').width * 0.50,
  },
  headerView: {
    padding: 10,
  },
  authorImage: {
    height: 20,
    width: 50,
    resizeMode: 'contain',
  },
  footerView: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.50)',
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  titleLabel: {
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

export default NewsScreen;