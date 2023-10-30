import {PixelRatio, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CustomHeader from '../../component/CustomHeader';
import MainView from '../../component/MainView';
import ActionBox from '../../component/ActionBox';
import playSound from '../../Hooks/playSound';
import UserDetails from '../Settings/UserDetails';
import icons from '../../Resources/Icons/icons';

const ReportsScreenFixed = ({navigation}) => {
  return (
    <MainView>
      {/* header */}
      <CustomHeader title={'Reports'} />
      {/* scroll view */}

      <ScrollView>
        <View style={styles.report_container}>
          <View style={styles.ActionBox_style}>
            <ActionBox
              title={'Vehicle Wise Fixed Reports'}
              onAction={() => navigation.navigate('CarReportsFixed')}
            />
          </View>
          <View style={styles.ActionBox_style}>
            <ActionBox
              title={'Operator Wise Fixed Reports'}
              onAction={() => navigation.navigate('OperatorReportFixed')}
              icon={icons.users}
            />
          </View>
        </View>
      </ScrollView>
    </MainView>
  );
};

export default ReportsScreenFixed;

const styles = StyleSheet.create({
  report_container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    padding: PixelRatio.roundToNearestPixel(10),
  },
  ActionBox_style: {
    maxWidth: '48%',
    maxHeight: '45%',
    width: '48%',

    paddingVertical: PixelRatio.roundToNearestPixel(10),
  },
});
