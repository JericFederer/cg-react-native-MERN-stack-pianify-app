import { FC } from 'react';
import { StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';

import AppButton from '../ui/AppButton';

interface Props {
  title: string;
  customStyle?: object;
}

const SubmitBtn: FC<Props> = props => {
  const { handleSubmit, isSubmitting } = useFormikContext();
  return (
    <AppButton
      busy={ isSubmitting }
      onPress={ handleSubmit }
      title={ props.title }
      customStyle={ props.customStyle }
    />
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default SubmitBtn;
