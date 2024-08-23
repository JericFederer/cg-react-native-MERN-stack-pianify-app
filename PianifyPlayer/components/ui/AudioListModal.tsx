import { FC } from 'react';
import { useSelector } from 'react-redux';
import { View, StyleSheet, Text, FlatList } from 'react-native';

import { AudioData } from '@/@types/audio';
import { getPlayerState } from '@/store/player';
import AppModal from './AppModal';
import colors from '@/constants/colors';
import AudioListItem from './AudioListItem';
import AudioListLoadingUI from './AudioListLoadingUI';

interface Props {
  data: AudioData[];
  header?: string;
  visible: boolean;
  onRequestClose(): void;
  onItemPress(item: AudioData, data: AudioData[]): void;
  loading?: boolean;
}

const AudioListModal: FC<Props> = ({
  header,
  loading,
  data,
  visible,
  onItemPress,
  onRequestClose,
}) => {
  const { onGoingAudio } = useSelector(getPlayerState);
  return (
    <AppModal visible={ visible } onRequestClose={ onRequestClose }>
      <View style={styles.container}>
        {
          loading ? (
            <AudioListLoadingUI />
          ) : (
            <>
              <Text style={ styles.header }>{ header }</Text>
              <FlatList
                data={ data }
                keyExtractor={ item => item.id }
                renderItem={
                  ({ item }) => {
                    return (
                      <AudioListItem
                        onPress={ () => onItemPress(item, data) }
                        audio={ item }
                        isPlaying={ onGoingAudio?.id === item.id }
                      />
                    );
                  }
                }
              />
            </>
          )
        }
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.CONTRAST,
    paddingVertical: 10,
  },
});

export default AudioListModal;
