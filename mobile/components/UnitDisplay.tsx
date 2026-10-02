import { Text, View } from 'react-native';

interface UnitDisplayProps {
  value: string;
  unit: string;
}

export const UnitDisplay: React.FC<UnitDisplayProps> = ({ value, unit }) => {
  return (
    <View className="flex-1 flex-row bg-red-600">
      <Text className="font-pixelTitle text-5xl">{value}</Text>
      <Text className="font-pixelTitle text-4xl">{unit}</Text>
    </View>
  );
};
