import React, { useState, useEffect, useContext } from 'react';
import { Image, Linking, Platform, SafeAreaView, SectionList, Share, StyleSheet, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActionSheet from 'react-native-actionsheet';
import { ApplicationContext } from '../ApplicationContext';
import { settings } from '../constants/settings';
import { colors } from '../constants/colors';
import { appearanceThemes } from '../constants/appearanceThemes';
import { appearanceModes } from '../constants/appearanceModes';
import { getCapitalizedWord } from '../helpers/formatter';
import { Link } from '@react-navigation/native';

const SettingsScreen = ({navigation}) => {
  const { appearanceMode, appearanceTheme, loadAppearance } = useContext(ApplicationContext);

  let DATA = [
    {
      title: 'GENERAL',
      data: [
        { text: settings.APP_NAME + ' Website', onPress: () => { openUrl(settings.WEBSITE_URL); } },
        { text: 'Change appearance: ' + getCapitalizedWord(appearanceMode), onPress: () => { actionSheet && actionSheet.show(); } }
      ],
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

  const saveAppearanceMode = async (newAppearanceMode) => {
    try {
      await AsyncStorage.setItem('appearanceMode', newAppearanceMode);
      await loadAppearance();
    } catch (error) {
      console.error('Saving appearance mode data failed with error: ' + error.message);
    }
  } 

  let actionSheet = null;
  const actionOptions = {
    LIGHT: getCapitalizedWord(appearanceModes.LIGHT),
    DARK: getCapitalizedWord(appearanceModes.DARK),
    SYSTEM: getCapitalizedWord(appearanceModes.SYSTEM),
    CANCEL: 'Cancel',
  };

  const onActionOptionPress = async (index) => {
    const actionOption = Object.values(actionOptions)[index];
    switch (actionOption) {
      case actionOptions.LIGHT:
        await saveAppearanceMode(appearanceModes.LIGHT);
        break;
      case actionOptions.DARK:
        await saveAppearanceMode(appearanceModes.DARK);
        break;
      case actionOptions.SYSTEM:
        await saveAppearanceMode(appearanceModes.SYSTEM);
        break;
    };
  };

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
          <TouchableOpacity
            style={[
              styles.itemContainer,
              {
                borderTopWidth: index === 0 ? 1 : 0,
                backgroundColor: (appearanceTheme == appearanceThemes.LIGHT ? colors.white : colors.lightBlack),
                borderColor: (appearanceTheme == appearanceThemes.LIGHT ? colors.lightGray : colors.darkBlack)
              }
            ]}
            onPress={item.onPress}
          >
            <Text style={[styles.itemLabel, { color: (appearanceTheme == appearanceThemes.LIGHT ? colors.darkGray : colors.gray) }]}>{item.text}</Text>
            { item.imageSource && <Image source={item.imageSource} style={styles.itemImage} />}
          </TouchableOpacity>
        )}
        renderSectionHeader={({section: {title}}) => 
          <Text style={styles.sectionHeaderLabel}>{title}</Text>
        }
        stickySectionHeadersEnabled={false}
        ListFooterComponent={<Text style={styles.footerLabel}>{'Version ' + settings.APP_VERSION + ' · ' + settings.DISCLAIMER_MESSAGE}</Text>}
      />
      <ActionSheet
        ref={x => actionSheet = x}
        title={'Choose option:'}
        tintColor={colors.darkGray}
        options={[actionOptions.LIGHT, actionOptions.DARK, actionOptions.SYSTEM, actionOptions.CANCEL]}
        cancelButtonIndex={Object.values(actionOptions).indexOf(actionOptions.CANCEL)}
        onPress={onActionOptionPress}
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
    borderBottomWidth: 1,
  },
  itemLabel: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 14,
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