import { FC, useState } from 'react';
import { View, StyleSheet, Image, Text, Pressable } from 'react-native';
import { useProgress } from 'react-native-track-player';
import { useDispatch, useSelector } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import formatDuration from 'format-duration';
import Slider from '@react-native-community/slider';

import { getPlayerState, updatePlaybackRate } from '@/store/player';
import AppLink from './ui/AppLink';
import AppModal from './ui/AppModal';
import colors from '@/constants/colors';
import useAudioController from '@/hooks/useAudioController';
import Loader from './ui/Loader';
import PlayPauseBtn from './ui/PlayPauseBtn';
import PlayerController from './ui/PlayerController';
import PlaybackRateSelector from './ui/PlaybackRateSelector';
import AudioInfoContainer from './AudioInfoContainer';

interface Props {
  visible: boolean;
  onRequestClose(): void;
  onListOptionPress?(): void;
}

const fromattedDuration = (duration = 0) => {
  return formatDuration(duration, {
    leading: true,
  });
};

const AudioPlayer: FC<Props> = ({
  visible,
  onListOptionPress,
  onRequestClose,
}) => {
  const [showAudioInfo, setShowAudioInfo] = useState(false);
  const { onGoingAudio, playbackRate } = useSelector(getPlayerState);
  const {
    isPlaying,
    isBusy,
    onNextPress,
    onPreviousPress,
    seekTo,
    skipTo,
    togglePlayPause,
    setPlaybackRate,
  } = useAudioController();
  const poster = onGoingAudio?.poster;
  const source = poster ? { uri: poster } : require('../assets/music.png');

  const { duration, position } = useProgress();
  const dispatch = useDispatch();

  const handleOnNextPress = async () => {
    await onNextPress();
  };

  const handleOnPreviousPress = async () => {
    await onPreviousPress();
  };

  const updateSeek = async (value: number) => {
    await seekTo(value);
  };

  const handleSkipTo = async (skipType: 'forward' | 'reverse') => {
    if (skipType === 'forward') await skipTo(10);
    if (skipType === 'reverse') await skipTo(-10);
  };

  const onPlaybacRatekPress = async (rate: number) => {
    await setPlaybackRate(rate);
    dispatch(updatePlaybackRate(rate));
  };

  return (
    <AppModal animation visible={ visible } onRequestClose={ onRequestClose }>
      <View style={ styles.container }>
        <Pressable
          onPress={
            () => setShowAudioInfo(true)
          }
          style={ styles.infoBtn }>
          <AntDesign name="infocirlceo" color={ colors.CONTRAST } size={ 24 } />
        </Pressable>
        <AudioInfoContainer
          visible={ showAudioInfo }
          closeHandler={ setShowAudioInfo }
        />
        <Image source={ source } style={ styles.poster } />
        <View style={ styles.contentContainer }>
          <Text style={ styles.title }>{ onGoingAudio?.title }</Text>

          <AppLink title={ onGoingAudio?.owner.name || '' } />

          <View style={ styles.durationContainer }>
            <Text style={ styles.duration }>
              { fromattedDuration(position * 1000) }
            </Text>
            <Text style={ styles.duration }>
              { fromattedDuration(duration * 1000) }
            </Text>
          </View>

          <Slider
            minimumValue={ 0 }
            maximumValue={ duration }
            minimumTrackTintColor={ colors.CONTRAST }
            maximumTrackTintColor={ colors.INACTIVE_CONTRAST }
            value={ position }
            onSlidingComplete={ updateSeek }
          />

          <View style={ styles.controles }>
            {/* Previous */}
            <PlayerController onPress={ handleOnPreviousPress } ignoreContainer>
              <AntDesign
                name="stepbackward"
                size={ 24 }
                color={ colors.CONTRAST }
              />
            </PlayerController>

            {/* Skip Time Left */}
            <PlayerController
              onPress={
                () => handleSkipTo('reverse')
              }
              ignoreContainer>
              <FontAwesome
                name="rotate-left"
                size={ 18 }
                color={ colors.CONTRAST }
              />
              <Text style={ styles.skipText }>-10s</Text>
            </PlayerController>

            {/* Play Pause */}
            <PlayerController>
              {
                isBusy ? (
                  <Loader color={ colors.PRIMARY } />
                ) : (
                  <PlayPauseBtn
                    playing={ isPlaying }
                    onPress={ togglePlayPause }
                    color={ colors.PRIMARY }
                  />
                )
              }
            </PlayerController>

            {/* Skip Time Right */}
            <PlayerController
              onPress={
                () => handleSkipTo('forward')
              }
              ignoreContainer>
              <FontAwesome
                name="rotate-right"
                size={ 18 }
                color={ colors.CONTRAST }
              />
              <Text style={ styles.skipText }>+10s</Text>
            </PlayerController>

            {/* Next */}
            <PlayerController onPress={ handleOnNextPress } ignoreContainer>
              <AntDesign name="stepforward" size={ 24 } color={ colors.CONTRAST } />
            </PlayerController>
          </View>

          <PlaybackRateSelector
            onPress={ onPlaybacRatekPress }
            activeRate={ playbackRate.toString() }
            containerStyle={{ marginTop: 20 }}
          />

          <View style={ styles.listOptionBtnContainer }>
            <PlayerController onPress={ onListOptionPress } ignoreContainer>
              <MaterialComIcon
                name="playlist-music"
                size={ 24 }
                color={ colors.CONTRAST }
              />
            </PlayerController>
          </View>
        </View>
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  poster: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  contentContainer: {
    width: '100%',
    flex: 1,
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.CONTRAST,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  duration: {
    color: colors.CONTRAST,
  },
  controles: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  skipText: {
    fontSize: 12,
    marginTop: 2,
    color: colors.CONTRAST,
  },
  infoBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  listOptionBtnContainer: {
    alignItems: 'flex-end',
  },
});

export default AudioPlayer;
