import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import PixelButton from './PixelButton';
import PixelInput from './PixelInput';
import PixelPanel from './PixelPanel';
import PixelSprite from './PixelSprite';
import { UnitDisplay } from './UnitDisplay';
import { usePlantsApi } from 'api/usePlantsApi';
import PixelIconButton from './PixelIconButton';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

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

type Props = {
  plant: Plant;
  onDeviceAdded: () => void;
};

export default function PlantCard({ plant, onDeviceAdded }: Props) {
  const [deviceId, setDeviceId] = useState('');
  const { addDeviceToPlant, deletePlant } = usePlantsApi();

  async function handleAddDevice() {
    if (!deviceId.trim()) {
      return;
    }
    try {
      await addDeviceToPlant(plant.id, Number(deviceId));
      await onDeviceAdded();
      console.log('Device added');
    } catch (error) {
      console.error('Failed to add device:', error);
    }
  }

  async function handleDeletePlant() {
    try {
      await deletePlant(plant.id);
      await onDeviceAdded();
    } catch (error) {
      console.error('Failed to delete plant:', error);
    }
  }

  return (
    <PixelPanel source={require('../assets/pixel/panel.png')} scale={4}>
      <Swipeable
        friction={2}
        rightThreshold={40}
        overshootRight={false}
        renderRightActions={() => (
          <Pressable
            onPress={handleDeletePlant}
            className="w-28 items-center justify-center bg-red-500">
            <Text className="font-pixelTitle text-xl text-white">DELETE</Text>
          </Pressable>
        )}>
        <View className="bg-white">
          <View className="flex-row bg-orange-400">
            <View className="flex-[3] items-center justify-between bg-yellow">
              <PixelSprite source={require('../assets/pixel/Flask2.png')} scale={4} />
            </View>

            {plant.device_id !== null ? (
              <View className="flex-[4] gap-2 bg-green">
                <View className="flex-row">
                  <UnitDisplay
                    value={plant.latest_reading?.temperature.toFixed(1) ?? '--'}
                    unit={'°'}
                  />
                  <UnitDisplay value={plant.latest_reading?.humidity.toFixed(0) ?? '--'} unit="%" />
                </View>

                <View className="flex-row">
                  <UnitDisplay
                    value={plant.latest_reading?.light_lux.toFixed(0) ?? '--'}
                    unit="lux"
                  />
                </View>
              </View>
            ) : (
              <View className="flex-[4] gap-2">
                <PixelInput
                  value={deviceId}
                  onChangeText={setDeviceId}
                  placeholder="Enter Device ID"
                  keyboardType="number-pad"
                />

                <PixelButton title="ADD" onPress={handleAddDevice} />
              </View>
            )}
          </View>

          <View className="mt-4 flex-row bg-orange-800">
            <Text className="font-pixelTitle text-4xl">{plant.name}</Text>
          </View>
        </View>
      </Swipeable>
    </PixelPanel>
  );
}
