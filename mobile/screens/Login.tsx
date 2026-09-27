import PixelPanel from 'components/PixelPanel';
import PixelSprite from 'components/PixelSprite';
import { useState } from 'react';
import { View, Text, TextInput, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin() {
    console.log('Login:', email, password);
  }

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-background px-4">
      <View className="flex-1 justify-center gap-y-8">
        <View className="mb-8 items-center">
          <PixelSprite source={require('../assets/pixel/Flask.png')} scale={4} />
        </View>

        <PixelPanel source={require('../assets/pixel/panel.png')} scale={4}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="your@mail.com"
            className="font-pixel text-lg text-black"
          />
        </PixelPanel>

        <PixelPanel source={require('../assets/pixel/panel.png')} scale={4}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            className="font-pixel text-lg text-black"
          />
        </PixelPanel>

        <View className="relative mt-4 pb-2 pr-2">
          {/* Shadow */}
          <View className="absolute bottom-0 left-2 right-0 top-2 bg-black" />

          <Pressable
            className="items-center border-4 border-black bg-[#ff7c5c] p-4"
            onPress={handleLogin}>
            <Text className="font-pixel text-xl text-black">LOGIN</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
