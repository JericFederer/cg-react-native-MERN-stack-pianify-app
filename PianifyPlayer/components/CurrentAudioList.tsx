import { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

import AudioListModal from './ui/AudioListModal';
import useAudioController from '@/hooks/useAudioController';
import { getPlayerState } from '@/store/player';

interface Props {
  visible: boolean;
  onRequestClose(): void;
}

const CurrentAudioList: FC<Props> = ({ visible, onRequestClose }) => {
  const { onGoingList } = useSelector(getPlayerState);
  const { onAudioPress } = useAudioController();
  return (
    <AudioListModal
      visible={ visible }
      onRequestClose={ onRequestClose }
      header="Audios on the way"
      data={ onGoingList }
      onItemPress={ onAudioPress }
    />
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default CurrentAudioList;
