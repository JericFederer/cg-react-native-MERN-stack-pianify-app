import { FC } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import AntDesing from 'react-native-vector-icons/AntDesign';
import { ScrollView } from 'react-native-gesture-handler';

import { useFetchHistories} from '@/hooks/query';
import EmptyRecords from '../ui/EmptyRecords';
import AudioListLoadingUI from '../ui/AudioListLoadingUI';
import colors from '@/constants/colors';

interface Props {}

const HistoryTab: FC<Props> = props => {
  const { data, isLoading } = useFetchHistories();

  if (isLoading) return <AudioListLoadingUI />;

  if (!data || !data[0]?.audios.length)
    return <EmptyRecords title="There is no history!" />;

  return (
    <ScrollView style={ styles.container }>
      {
        data.map((item, mainIndex) => {
          return (
            <View key={ item.date + mainIndex }>
              <Text style={ styles.date }>{ item.date }</Text>
              <View style={ styles.listContainer }>
                {
                  item.audios.map((audio, index) => {
                    return (
                      <View key={ audio.id + index } style={ styles.history }>
                        <Text style={ styles.historyTitle }>{ audio.title }</Text>
                        <Pressable>
                          <AntDesing name="close" color={ colors.CONTRAST } />
                        </Pressable>
                      </View>
                    );
                  })
                }
              </View>
            </View>
          );
        })
      }
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {},
  listContainer: {
    marginTop: 10,
    paddingLeft: 10,
  },
  date: {
    color: colors.SECONDARY,
  },
  historyTitle: {
    color: colors.CONTRAST,
    paddingHorizontal: 5,
    fontWeight: '700',
    flex: 1,
  },
  history: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.OVERLAY,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default HistoryTab;
