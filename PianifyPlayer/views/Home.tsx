import React, { FC, useState } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { getFromAsyncStorage, Keys } from '@/utils/asyncStorage';
import { AudioData, Playlist } from '@/@types/audio';
import { getClient } from '@/api/client';
import { useFetchPlaylist } from '@/hooks/query';
import { updateNotification} from '@/store/notification';
import OptionsModal from '@/components/OptionsModal';
import PlaylistForm, { PlaylistInfo } from '@/components/PlaylistForm';
import PlayListModal from '@/components/PlaylistModal';
import RecommendedAudios from '@/components/RecommendedAudios';
import colors from '@/constants/colors';
import catchAsyncError from '@/api/catchError';
import LatestUploads from '@/components/LatestUploads';


interface Props {}

const Home: FC<Props> = props => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<AudioData>();
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [showPlaylistForm, setShowPlaylistForm] = useState(false);

  const { data } = useFetchPlaylist();

  const dispatch = useDispatch();

  const handleOnFavPress = async () => {
    if (!selectedAudio) return;
    // send request with the audio id that we want to add to fav

    try {
      const client = await getClient();
      const { data } = await client.post('/favorite?audioId=' + selectedAudio.id);
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(updateNotification({ message: errorMessage, type: 'error' }));
    }

    setSelectedAudio(undefined);
    setShowOptions(false);
  };

  const handleOnLongPress = (audio: AudioData) => {
    setSelectedAudio(audio);
    setShowOptions(true);
  };

  const handleOnAddToPlaylist = () => {
    setShowOptions(false);
    setShowPlaylistModal(true);
  };

  const handlePlaylistSubmit = async (value: PlaylistInfo) => {
    if (!value.title.trim()) {
      return;
    }

    try {
      const client = await getClient();
      const { data } = await client.post('/playlist/create', {
        resId: selectedAudio?.id,
        title: value.title,
        visibility: value.private ? 'private' : 'public',
      });
      console.log(data);
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      console.log(errorMessage);
    }
  };

  const updatePlaylist = async (item: Playlist) => {
    try {
      const client = await getClient();
      const { data } = await client.patch('/playlist', {
        id: item.id,
        item: selectedAudio?.id,
        title: item.title,
        visibility: item.visibility,
      });

      setSelectedAudio(undefined);
      setShowPlaylistModal(false);
      dispatch(
        updateNotification({ message: 'New audio added.', type: 'success' }),
      );
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      console.log(errorMessage);
    }
  };

  return (
    <View style={ styles.container }>
      <LatestUploads
        onAudioPress={
          item => {
            console.log(item);
          }
        }
        onAudioLongPress={ handleOnLongPress }
      />
      <RecommendedAudios
        onAudioPress={
          item => {
            console.log(item);
          }
        }
        onAudioLongPress={ handleOnLongPress }
      />
      <OptionsModal
        visible={ showOptions }
        onRequestClose={
          () => {
            setShowOptions(false);
          }
        }
        options={[
          {
            title: 'Add to playlist',
            icon: 'playlist-music',
            onPress: handleOnAddToPlaylist,
          },
          {
            title: 'Add to favorite',
            icon: 'cards-heart',
            onPress: handleOnFavPress,
          },
        ]}
        renderItem={
          item => {
            return (
              <Pressable onPress={ item.onPress } style={ styles.optionContainer }>
                <MaterialComIcon
                  size={ 24 }
                  color={ colors.PRIMARY }
                  name={ item.icon }
                />
                <Text style={ styles.optionLabel }>{ item.title }</Text>
              </Pressable>
            );
          }
        }
      />
      <PlayListModal
        visible={ showPlaylistModal }
        onRequestClose={
          () => {
            setShowPlaylistModal(false);
          }
        }
        list={ data || [] }
        onCreateNewPress={
          () => {
            setShowPlaylistModal(false);
            setShowPlaylistForm(true);
          }
        }
        onPlaylistPress={ updatePlaylist }
      />

      <PlaylistForm
        visible={ showPlaylistForm }
        onRequestClose={
          () => {
            setShowPlaylistForm(false);
          }
        }
        onSubmit={ handlePlaylistSubmit }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  optionLabel: {
    color: colors.PRIMARY,
    fontSize: 16,
    marginLeft: 5
  },
});

export default Home;
