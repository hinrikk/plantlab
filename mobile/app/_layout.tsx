import '../global.css';

import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';

import { AuthProvider, useAuth } from '../context/AuthContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function RootNavigator() {
  const { token } = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!token}>
        <Stack.Screen name="index" />
      </Stack.Protected>

      <Stack.Protected guard={!!token}>
        <Stack.Screen name="home" />
        <Stack.Screen
          name="settings"
          options={{
            animation: 'slide_from_left',
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    GeistPixel: require('../assets/fonts/GeistPixel-Regular-VariableFont_ELSH.ttf'),
    VT: require('../assets/fonts/VT323-Regular.ttf'),
    Pixelify: require('../assets/fonts/PixelifySans-VariableFont_wght.ttf'),
    Tiny5: require('../assets/fonts/Tiny5-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
