import PixelPanel from 'components/PixelPanel';
import PixelSprite from 'components/PixelSprite';
import { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from 'context/AuthContext';
import { router } from 'expo-router';
import PixelInput from 'components/PixelInput';
import PixelButton from 'components/PixelButton';

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
          <Text className="mt-0 font-pixelTitle text-8xl">{'PLANTLAB'}</Text>
        </View>

        <PixelInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <PixelInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
        />

        <PixelButton title="LOGIN" onPress={handleLogin} />
      </View>
    </SafeAreaView>
  );
}
