import React from 'react';
import { Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../constants/colors';
import { months } from '../constants/months';

const LargeShoeView = (props) => {
  const { shoe } = props;

  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.container} onPress={() => { navigation.push('SHOE', { id: shoe.id }); }}>
      <ImageBackground source={{ uri: 'http://www.wavelinkllc.com/foamlife' + shoe.image_url_1 }} resizeMode="contain" style={styles.backgroundImage}>
        <View style={styles.headerView}>
          <View style={styles.nameView}>
            <Text style={styles.nameLabel}>{shoe.name}</Text>
            <Text style={styles.colorLabel}>{shoe.color}</Text>
          </View>
          <View style={styles.dateView}>
            { shoe.hide_day === '0' &&
              <View style={styles.dayView}>
                <Text style={styles.dayLabel}>{new Date(shoe.date + 'T00:00:00.000-05:00').getDate()}</Text>
              </View>
            }
            <View style={styles.monthYearView}>
              <Text style={styles.monthYearLabel}>
                { shoe.hide_month === '0' ? months.short[new Date(shoe.date).getMonth()] + '\n' : ''}
                {new Date(shoe.date).getFullYear()}
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

const styles = StyleSheet.create({
  container: {
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
  },
});

export default LargeShoeView;