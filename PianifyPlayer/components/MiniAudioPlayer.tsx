import { FC, useState } from 'react';
import { useProgress } from 'react-native-track-player';
import { View, StyleSheet, Image, Text, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { mapRange } from '@/utils/math';
import { getPlayerState } from '@/store/player';
import colors from '@/constants/colors';
import useAudioController from '@/hooks/useAudioController';
import Loader from '@/components/ui/Loader';
import PlayPauseBtn from '@/components/ui/PlayPauseBtn';
import AudioPlayer from './AudioPlayer';
import CurrentAudioList from './CurrentAudioList';

interface Props {}

export const MiniPlayerHeight = 60;

const MiniAudioPlayer: FC<Props> = props => {
  const { onGoingAudio } = useSelector( getPlayerState );
  const { isPlaying, isBusy, togglePlayPause } = useAudioController();
  const progress = useProgress();
  const [playerVisibility, setPlayerVisibility] = useState(false);
  const [showCurrentList, setShowCurrentList] = useState(false);

  const poster = onGoingAudio?.poster;
  const source = poster ? { uri: poster } : require('../assets/music.png');

  const showPlayerModal = () => {
    setPlayerVisibility(true);
  };

  const closePlayerModal = () => {
    setPlayerVisibility(false);
  };

  const handleOnCurrentListClose = () => {
    setShowCurrentList(false);
  };

  const handleOnListOptionPress = () => {
    closePlayerModal();
    setShowCurrentList(true);
  };

  return (
    <>
      <View
        style={{
          height: 2,
          backgroundColor: colors.SECONDARY,
          width: `${
            mapRange({
              outputMin: 0,
              outputMax: 100,
              inputMin: 0,
              inputMax: progress.duration,
              inputValue: progress.position,
            })
          }%`,
        }}
      />
      <View style={ styles.container }>
        <Image source={ source } style={ styles.poster } />

        <Pressable onPress={ showPlayerModal } style={ styles.contentContainer }>
          <Text style={ styles.title }>{ onGoingAudio?.title }</Text>
          <Text style={ styles.name }>{ onGoingAudio?.owner.name }</Text>
        </Pressable>

        <Pressable style={{ paddingHorizontal: 10 }}>
          <AntDesign name="hearto" size={ 24 } color={ colors.CONTRAST } />
        </Pressable>

        {
          isBusy ? (
            <Loader />
          ) : (
            <PlayPauseBtn playing={ isPlaying } onPress={ togglePlayPause } />
          )
        }
      </View>

      <AudioPlayer
        visible={ playerVisibility }
        onRequestClose={ closePlayerModal }
        onListOptionPress={ handleOnListOptionPress }
      />
      <CurrentAudioList
        visible={ showCurrentList }
        onRequestClose={ handleOnCurrentListClose }
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: MiniPlayerHeight,
    backgroundColor: colors.PRIMARY,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    height: '100%',
    padding: 5,
  },
  poster: {
    height: MiniPlayerHeight - 10,
    width: MiniPlayerHeight - 10,
    borderRadius: 5,
  },
  title: {
    color: colors.CONTRAST,
    fontWeight: '700',
    paddingHorizontal: 5,
  },
  name: {
    color: colors.SECONDARY,
    fontWeight: '700',
    paddingHorizontal: 5,
  },
});

export default MiniAudioPlayer;
