import { usePlantsApi } from 'api/usePlantsApi';
import PixelIconButton from 'components/PixelIconButton';
import PlantCard from 'components/PlantCard';
import { UnitDisplay } from 'components/UnitDisplay';
import { useAuth } from 'context/AuthContext';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

type Plant = {
  id: number;
  name: string;
  device_id: number | null;
  latest_reading: {
    light_lux: number;
    temperature: number;
    humidity: number;
    created_at: string;
  } | null;
};

export default function Home() {
  const { getPlants, createPlant } = usePlantsApi();
  const { setToken } = useAuth();
  const [plants, setPlants] = useState<Plant[]>([]);

  async function loadPlants() {
    try {
      const data = await getPlants();
      setPlants(data);
    } catch (error) {
      console.error('Failed to load plants:', error);
    }
  }

  useEffect(() => {
    loadPlants();
  }, []);

  async function handleAddPlant() {
    try {
      await createPlant('Super Plant');
      await loadPlants();
    } catch (error) {
      console.error('Failed to create plant:', error);
    }
  }

  return (
    <SafeAreaView className="flex-1 flex-col bg-background px-4">
      <View className="mb-4 flex-row items-end justify-between">
        <PixelIconButton
          source={require('../assets/pixel/Settings.png')}
          onPress={() => router.push('/settings')}
        />
        <PixelIconButton source={require('../assets/pixel/Add.png')} onPress={handleAddPlant} />
      </View>

      <View className="flex-1 gap-2 pt-4">
        {plants.map((plant) => (
          <PlantCard key={plant.id} plant={plant} onDeviceAdded={loadPlants} />
        ))}
      </View>
    </SafeAreaView>
  );
}
