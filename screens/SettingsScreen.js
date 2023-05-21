import React, { useState, useEffect } from 'react';
import { Image, Linking, Platform, SafeAreaView, SectionList, Share, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { settings } from '../constants/settings';
import { colors } from '../constants/colors';
import { Link } from '@react-navigation/native';

const SettingsScreen = ({navigation}) => {
  const [displayedShoes, setDisplayedShoes] = useState([]);

  const DATA = [
    {
      title: 'GENERAL',
      data: [{ text: settings.APP_NAME + ' Website', onPress: () => { openUrl(settings.WEBSITE_URL); } }],
    },
    {
      title: 'SOCIAL',
      data: [
        {
          text: 'Follow @' + settings.TWITTER_HANDLE + ' On Twitter',
          imageSource: require('../assets/images/twitter.png'),
          onPress: () => { openUrl('twitter://user?screen_name=' + settings.TWITTER_HANDLE, 'http://www.twitter.com/' + settings.TWITTER_HANDLE); }
        },
        {
          text: 'Follow @' + settings.INSTAGRAM_HANDLE + ' On Instagram',
          imageSource: require('../assets/images/instagram.png'),
          onPress: () => { openUrl('instagram://user?username=' + settings.INSTAGRAM_HANDLE, 'http://www.instagram.com/' + settings.INSTAGRAM_HANDLE); }
        },
        {
          text: 'Like ' + settings.FACEBOOK_NAME + ' On Facebook',
          imageSource: require('../assets/images/facebook.png'),
          onPress: () => { openUrl('fb://profile/' + settings.FACEBOOK_ID, 'https://www.facebook.com/' + settings.FACEBOOK_NAME); }
        },
        {
          text: 'Add ' + settings.SNAPCHAT_NAME + ' On Snapchat',
          imageSource: require('../assets/images/snapchat.png'),
          onPress: () => { openUrl('snapchat://add/' + settings.SNAPCHAT_NAME, 'http://www.snapchat.com/add/' + settings.SNAPCHAT_NAME); }
        },
      ],
    },
    {
      title: 'FEEDBACK',
      data: [
        {
          text: 'Tell A Friend',
          onPress: async () => {
            try {
              const message = 'Check out Foams App in the App Store for the latest Nike Foamposite news!';
              await Share.share(
                {
                  message: message,
                  url: Platform.OS === 'ios' ? settings.APPLE_APP_URL : settings.ANDROID_APP_URL,
                  title: message,
                },
                {
                  dialogTitle: message,
                  subject: message,
                  tintColor: colors.darkGray 
                }
              );
            } catch (error) {
              console.error('Sharing app failed with error: ' + error.message);
            }
          }
        },
        { text: 'Send Feedback', onPress: () => { openUrl('mailto:' + settings.EMAIL_ADDRESS); } },
        {
          text: 'Rate This App',
          onPress: () => { openUrl(Platform.OS === 'ios' ? 'itms-apps://itunes.apple.com/us/app/apple-store/id' + settings.APPLE_APP_ID + '?mt=8' : settings.ANDROID_APP_URL); }
        },
      ],
    },
    {
      title: 'INFO',
      data: [
        { text: 'Privacy Policy', onPress: () => { openUrl(settings.PRIVACY_POLICY_URL); } },
        { text: 'Developer', onPress: () => { openUrl('http://www.wavelinkllc.com'); } },
      ],
    },
  ];

  useEffect(() => {
    
  }, []);

  const openUrl = async function(url, fallbackUrl) {
    if (await Linking.canOpenURL(url)) {
      await Linking.openURL(url);
    } else if (await Linking.canOpenURL(fallbackUrl)) {
      await Linking.openURL(fallbackUrl);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={DATA}
        keyExtractor={(item, index) => item + index}
        renderItem={({item, index}) => (
          <TouchableOpacity style={[styles.itemContainer, { borderTopWidth: index === 0 ? 1 : 0 }]} onPress={item.onPress}>
            <Text style={styles.itemLabel}>{item.text}</Text>
            { item.imageSource && <Image source={item.imageSource} style={styles.itemImage} />}
          </TouchableOpacity>
        )}
        renderSectionHeader={({section: {title}}) => 
          <Text style={styles.sectionHeaderLabel}>{title}</Text>
        }
        stickySectionHeadersEnabled={false}
        ListFooterComponent={<Text style={styles.footerLabel}>{'Version ' + settings.APP_VERSION + ' · ' + settings.DISCLAIMER_MESSAGE}</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {

  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: colors.lightGray,
  },
  itemLabel: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 14,
    color: colors.darkGray,
  },
  itemImage: {
    height: 20,
    width: 20,
    resizeMode: 'contain'
  },
  sectionHeaderLabel: {
    fontFamily: 'AvenirNext-Bold',
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.darkGray,
    textTransform: 'uppercase',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  footerLabel: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 14,
    color: colors.darkGray,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});

export default SettingsScreen;