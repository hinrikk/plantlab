import { Text, Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from 'context/AuthContext';
import PixelButton from 'components/PixelButton';
import PixelIconButton from 'components/PixelIconButton';

export default function SettingsScreen() {
  const { setToken } = useAuth();
  return (
    <SafeAreaView className="flex-1 bg-background p-4 ">
      <View className="mb-8 flex-row items-center justify-end">
        <PixelIconButton
          source={require('../assets/pixel/Arrow-Right.png')}
          onPress={() => router.back()}
          scale={2}
        />
      </View>

      <PixelButton className={'bg-rose'} title="LOGOUT" onPress={() => setToken(null)} />
    </SafeAreaView>
  );
}
