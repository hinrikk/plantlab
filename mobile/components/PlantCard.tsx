import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
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
  onDelete: () => void;
  onEdit: () => void;
};

export default function PlantCard({ plant, onDeviceAdded, onDelete, onEdit }: Props) {
  const [deviceId, setDeviceId] = useState('');
  const { addDeviceToPlant } = usePlantsApi();

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

  return (
    <PixelPanel source={require('../assets/pixel/panel.png')} scale={4}>
      <Swipeable
        friction={2}
        rightThreshold={40}
        overshootRight={false}
        renderRightActions={() => (
          <View className="ml-4 flex-row">
            <Pressable onPress={onEdit} className="w-28 items-center justify-center bg-yellow">
              <Text className="font-pixelTitle text-xl text-black">EDIT</Text>
            </Pressable>

            <Pressable onPress={onDelete} className="w-28 items-center justify-center bg-red-500">
              <Text className="font-pixelTitle text-xl text-white">DELETE</Text>
            </Pressable>
          </View>
        )}>
        <View className="bg-white">
          <View className="gap flex-row">
            <View className="flex-[3] items-center justify-end pr-4">
              <PixelSprite source={require('../assets/pixel/Flask2.png')} scale={4} idle />
            </View>

            {plant.device_id !== null ? (
              <View className="flex-[4] gap-2">
                <View className="flex-row">
                  <UnitDisplay
                    value={plant.latest_reading?.temperature.toFixed(1) ?? '--'}
                    unit={'°'}
                    title={'Temp.'}
                  />
                  <UnitDisplay
                    value={plant.latest_reading?.humidity.toFixed(0) ?? '--'}
                    unit="%"
                    title={'Air Humid.'}
                  />
                </View>

                <View className="flex-row">
                  <UnitDisplay
                    value={plant.latest_reading?.light_lux.toFixed(1) ?? '--'}
                    unit="lux"
                    title={'Illuminance'}
                  />
                </View>

                <View className="relative flex-col gap-2 self-start">
                  <PixelSprite source={require('../assets/pixel/Colorbar.png')} scale={5} />
                  <Text className="font-pixelTitle text-lg">{'Soil Humidity'}</Text>
                  <View
                    className="absolute top-0"
                    style={{
                      left: '50%',
                      transform: [{ translateX: -8 }],
                    }}>
                    <PixelSprite source={require('../assets/pixel/Marker.png')} scale={2} />
                  </View>
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

          <View className="mt-4 flex-row items-center justify-between">
            <Text className="font-pixelTitle text-5xl">{plant.name}</Text>
            {/* <PixelIconButton
              source={require('../assets/pixel/Arrow-Right.png')}
              onPress={() => console.log('details')}
              scale={2}
            /> */}
          </View>
        </View>
      </Swipeable>
    </PixelPanel>
  );
}
