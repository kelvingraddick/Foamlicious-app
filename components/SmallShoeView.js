import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import useTheme from '../hooks/useTheme';
import { getPrettyDate } from '../helpers/formatter';
import { colors } from '../constants/colors';

const SmallShoeView = (props) => {
  const { shoe, actionIconImageSource, onPress } = props;

  const colorScheme = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { 
          backgroundColor: (colorScheme === 'light' ? 'transparent' : colors.lightBlack),
          marginBottom: (colorScheme === 'light' ? 0 : 1),
          borderBottomWidth: (colorScheme === 'light' ? 1 : 0),
          borderBottomColor: (colorScheme === 'light' ? colors.lightGray : 'transparent'),
        }
      ]}
      onPress={onPress}
    >
      <Image source={{ uri: 'http://www.wavelinkllc.com/foamlife' + shoe.image_url_1 }} resizeMode="contain" style={styles.shoeImage} />
      <View style={styles.textView}>
        <Text style={[styles.nameLabel, { color: (colorScheme === 'light' ? colors.darkGray : colors.gray) }]}>{shoe.name}</Text>
        <Text style={styles.detailLabel}>{shoe.color}</Text>
        <Text style={[styles.dateLabel, { color: (colorScheme === 'light' ? colors.gray : colors.darkGray) }]}>{getPrettyDate(shoe.date, shoe.hide_month === '0', shoe.hide_day === '0')}
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