import { Text, View } from 'react-native';

interface UnitDisplayProps {
  value: string;
  unit: string;
  title: string;
}

export const UnitDisplay: React.FC<UnitDisplayProps> = ({ value, unit, title }) => {
  return (
    <View className="flex-1 flex-col">
      <View className="flex-row">
        <Text className="font-pixelTitle text-4xl">{value}</Text>
        <Text className="font-pixelTitle text-2xl">{unit}</Text>
      </View>
      <Text className="font-pixelTitle">{title}</Text>
    </View>
  );
};
