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
        <Text
          className="font-pixel mb-12 text-center text-4xl text-black"
          style={{ fontWeight: '700' }}>
          {'PLANT LAB'}
        </Text>

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

        <Pressable
          className="bg-rose font-pixel mt-4 items-center border-4 border-black p-4"
          onPress={handleLogin}>
          <Text className="text-xl font-bold text-black">{'LOGIN'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
