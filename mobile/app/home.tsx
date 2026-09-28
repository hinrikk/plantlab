import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-background px-4">
      <Text>Logged in</Text>
    </SafeAreaView>
  );
}
