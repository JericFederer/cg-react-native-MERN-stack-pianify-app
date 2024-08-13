import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';

interface Props<T> {
  data: T[];
  renderItem(item: T): JSX.Element;
  col?: number;
}

const GridView = <T extends any>(props: Props<T>) => {
  const { data, col = 2, renderItem } = props;
  const halfWidth: number = parseInt(`${100 / col}%`);

  return (
    <View style={styles.container}>
      {
        data.map((item, index) => {
          return (
            <View key={ index } style={{ width: halfWidth }}>
              <View style={{ padding: 5 }}>{ renderItem(item) }</View>
            </View>
          );
        })
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
});

export default GridView;
