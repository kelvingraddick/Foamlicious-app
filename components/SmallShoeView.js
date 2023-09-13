import React, { useContext } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ApplicationContext } from '../ApplicationContext';
import { appearanceThemes } from '../constants/appearanceThemes';
import { getPrettyDate } from '../helpers/formatter';
import { colors } from '../constants/colors';

const SmallShoeView = (props) => {
  const { shoe, actionIconImageSource, onPress } = props;

  const { appearanceTheme } = useContext(ApplicationContext);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { 
          backgroundColor: (appearanceTheme == appearanceThemes.LIGHT ? 'transparent' : colors.lightBlack),
          marginBottom: (appearanceTheme == appearanceThemes.LIGHT ? 0 : 1),
          borderBottomWidth: (appearanceTheme == appearanceThemes.LIGHT ? 1 : 0),
          borderBottomColor: (appearanceTheme == appearanceThemes.LIGHT ? colors.lightGray : 'transparent'),
        }
      ]}
      onPress={onPress}
    >
      <Image source={{ uri: 'http://www.wavelinkllc.com/foamlife' + shoe.image_url_1 }} resizeMode="contain" style={styles.shoeImage} />
      <View style={styles.textView}>
        <Text style={[styles.nameLabel, { color: (appearanceTheme == appearanceThemes.LIGHT ? colors.darkGray : colors.gray) }]}>{shoe.name}</Text>
        <Text style={styles.detailLabel}>{shoe.color}</Text>
        <Text style={[styles.dateLabel, { color: (appearanceTheme == appearanceThemes.LIGHT ? colors.gray : colors.darkGray) }]}>{getPrettyDate(shoe.date, shoe.hide_month === '0', shoe.hide_day === '0')}
        </Text>
      </View>
      <Image source={actionIconImageSource || require('../assets/images/arrow_right.png')} style={styles.moreImage} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 15,
    paddingRight: 10,
  },
  shoeImage: {
    height: 80,
    width: 80,
    marginRight: 15,
  },
  textView: {
    flex: 1,
    justifyContent: 'center',
  },
  nameLabel: {
    fontFamily: 'AvenirNext-Bold',
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailLabel: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 13,
    color: colors.darkGray,
  },
  dateLabel: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 12,
  },
  moreImage: {
    height: 15,
    width: 15,
    tintColor: colors.darkGray
  },
});

export default SmallShoeView;