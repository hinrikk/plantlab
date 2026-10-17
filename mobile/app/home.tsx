import { usePlantsApi } from 'api/usePlantsApi';
import PixelIconButton from 'components/PixelIconButton';
import PlantCard from 'components/PlantCard';
import { useAuth } from 'context/AuthContext';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import PixelButton from 'components/PixelButton';
import PixelModal from 'components/PixelModal';
import EditPlantModal from 'components/EditPlantModal';

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
  const { getPlants, createPlant, deletePlant, updatePlant } = usePlantsApi();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [plantToDelete, setPlantToDelete] = useState<Plant | null>(null);
  const [plantToEdit, setPlantToEdit] = useState<Plant | null>(null);

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

  async function handleConfirmDelete() {
    if (!plantToDelete) return;

    try {
      await deletePlant(plantToDelete.id);
      setPlantToDelete(null);
      await loadPlants();
    } catch (error) {
      console.error('Failed to delete plant:', error);
    }
  }

  async function handleSavePlant(id: number, name: string) {
    try {
      await updatePlant(id, name);
      await loadPlants();
      setPlantToEdit(null);
    } catch (error) {
      console.error('Failed to update plant:', error);
      throw error;
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
          <PlantCard
            key={plant.id}
            plant={plant}
            onDeviceAdded={loadPlants}
            onDelete={() => setPlantToDelete(plant)}
            onEdit={() => setPlantToEdit(plant)}
          />
        ))}
      </View>

      <PixelModal visible={plantToDelete !== null} onClose={() => setPlantToDelete(null)}>
        <Text className="font-pixelTitle text-2xl">Bist du sicher, dass du</Text>
        <Text className="font-pixelTitle text-5xl">{plantToDelete?.name}</Text>
        <Text className="font-pixelTitle text-2xl">löschen möchtest?</Text>
        <PixelButton title="CANCEL" onPress={() => setPlantToDelete(null)} />
        <PixelButton title="DELETE" className="bg-rose" onPress={handleConfirmDelete} />
      </PixelModal>

      <PixelModal visible={plantToDelete !== null} onClose={() => setPlantToDelete(null)}>
        <Text className="font-pixelTitle text-2xl">Bist du sicher, dass du</Text>
        <Text className="font-pixelTitle text-5xl">{plantToDelete?.name}</Text>
        <Text className="font-pixelTitle text-2xl">löschen möchtest?</Text>
        <PixelButton title="CANCEL" onPress={() => setPlantToDelete(null)} />
        <PixelButton title="DELETE" className="bg-rose" onPress={handleConfirmDelete} />
      </PixelModal>

      <EditPlantModal
        plant={plantToEdit}
        onClose={() => setPlantToEdit(null)}
        onSave={handleSavePlant}
      />
    </SafeAreaView>
  );
}
