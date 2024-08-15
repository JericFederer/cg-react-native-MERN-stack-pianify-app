import { FC } from 'react';
import { StyleSheet, ScrollView } from 'react-native';

import AudioListItem from '../ui/AudioListItem';
import AudioListLoadingUI from '../ui/AudioListLoadingUI';
// TODO import EmptyRecords from '@/ui/EmptyRecords';
import { useFetchUploadsByProfile } from '@/hooks/query';

interface Props {}

const UploadsTab: FC<Props> = props => {
  const { data, isLoading } = useFetchUploadsByProfile();

  if (isLoading) return <AudioListLoadingUI />;

  // TODO if (!data?.length) return <EmptyRecords title="There is no audio!" />;

  return (
    <ScrollView style={ styles.container }>
      {
        data?.map(item => {
          return <AudioListItem key={ item.id } audio={ item } />;
        })
      }
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default UploadsTab;
