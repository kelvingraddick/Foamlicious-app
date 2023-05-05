import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../constants/colors';
import { months } from '../constants/months';

const SmallShoeView = (props) => {
  const { shoe, actionIconImageSource, onPress } = props;

  const dayOfMonthOrdinalSuffix = (dayOfMonth) => {
    if (dayOfMonth > 3 && dayOfMonth < 21) return dayOfMonth + "th";
    switch (dayOfMonth % 10) {
      case 1:
        return dayOfMonth + "st";
      case 2:
        return dayOfMonth + "nd";
      case 3:
        return dayOfMonth + "rd";
      default:
        return dayOfMonth + "th";
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: 'http://www.wavelinkllc.com/foamlife' + shoe.image_url_1 }} resizeMode="contain" style={styles.shoeImage} />
      <View style={styles.textView}>
        <Text style={styles.nameLabel}>{shoe.name}</Text>
        <Text style={styles.detailLabel}>{shoe.color}</Text>
        <Text style={styles.dateLabel}>
          {
            (shoe.hide_month === '0' ? months.long[new Date(shoe.date).getMonth()] + ' ' : '') +
            (shoe.hide_day === '0' ? dayOfMonthOrdinalSuffix(new Date(shoe.date + 'T00:00:00.000-05:00').getDate()) + ', ' : '') + 
            new Date(shoe.date).getFullYear()
          }
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
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
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
    color: colors.darkGray,
  },
  detailLabel: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 13,
    color: colors.darkGray,
  },
  dateLabel: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 12,
    color: colors.gray,
  },
  moreImage: {
    height: 15,
    width: 15,
    tintColor: colors.darkGray
  },
});

export default SmallShoeView;