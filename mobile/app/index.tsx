import PixelPanel from 'components/PixelPanel';
import PixelSprite from 'components/PixelSprite';
import { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from 'context/AuthContext';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('test@mail.com');
  const [password, setPassword] = useState('password123');
  const { setToken } = useAuth();

  async function handleLogin() {
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log('Login failed:', data);
        return;
      }

      await setToken(data.token);
      console.log('Login successful:', data);
      router.replace('/home');
    } catch (error) {
      console.error('Login error:', error);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-background px-4">
      <View className="flex-1 justify-center gap-y-8">
        <View className="items-center">
          <PixelSprite source={require('../assets/pixel/Flask2.png')} scale={4} />
          <Text className="font-pixelTitle mt-0 text-8xl">{'PLANTLAB'}</Text>
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
            <Text className="font-pixelTitle text-3xl text-black">LOGIN</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
