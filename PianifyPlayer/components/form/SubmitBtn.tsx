import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';

import AppButton from '@/components/ui/AppButton';

interface Props {
  title: string;
  customStyle?: object;
}

const SubmitBtn: FC<Props> = (props) => {
  const { handleSubmit } = useFormikContext();

  return (
    <AppButton
      customStyle={ props.customStyle }
      onPress={ handleSubmit }
      title={ props.title }
    />
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default SubmitBtn;
