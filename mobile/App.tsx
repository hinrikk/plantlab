import LoginScreen from 'screens/Login';
import './global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';

export default function App() {
  const [fontsLoaded] = useFonts({
    GeistPixel: require('assets/fonts/GeistPixel-Regular-VariableFont_ELSH.ttf'),
    VT: require('assets/fonts/VT323-Regular.ttf'),
  });

  if (!fontsLoaded) return null;
  return (
    <SafeAreaProvider>
      <LoginScreen />;
    </SafeAreaProvider>
  );
}
