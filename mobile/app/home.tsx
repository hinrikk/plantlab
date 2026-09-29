import PixelSprite from 'components/PixelSprite';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-background px-4">
      <View className="items-end justify-end bg-red-500">
        <PixelSprite source={require('../assets/pixel/Add.png')} scale={3} />
      </View>
    </SafeAreaView>
  );
}
