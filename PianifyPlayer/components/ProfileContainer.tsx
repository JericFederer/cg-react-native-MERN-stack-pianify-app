import { FC } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { UserProfile } from '@/store/auth';
import AvatarField from './ui/AvatarField';
import colors from '@/constants/colors';

interface Props {
  profile?: UserProfile | null;
}

const ProfileContainer: FC<Props> = ({ profile }) => {
  if (!profile) return null;

  return (
    <View style={ styles.container }>
      <AvatarField source={ profile.avatar } />

      <View style={ styles.profileInfoConatiner }>
        <Text style={ styles.profileName }>{ profile.name }</Text>
        <View style={ styles.flexRow }>
          <Text style={ styles.email }>{ profile.email }</Text>
          <MaterialIcon name="verified" size={ 15 } color={ colors.SECONDARY } />
        </View>

        <View style={ styles.flexRow }>
          <Text style={ styles.profileActionLink }>
            { profile.followers } Followers
          </Text>
          <Text style={ styles.profileActionLink }>
            { profile.followings } Followings
          </Text>
        </View>
      </View>

      <Pressable style={ styles.settingsBtn }>
        <AntDesign name="setting" size={ 22 } color={ colors.CONTRAST } />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfoConatiner: {
    paddingLeft: 10,
  },
  profileName: {
    color: colors.CONTRAST,
    fontSize: 18,
    fontWeight: '700',
  },
  email: {
    color: colors.CONTRAST,
    marginRight: 5,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileActionLink: {
    backgroundColor: colors.SECONDARY,
    color: colors.PRIMARY,
    paddingHorizontal: 4,
    paddingVertical: 2,
    margin: 5,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileContainer;
