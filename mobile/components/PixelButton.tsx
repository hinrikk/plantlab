import { Pressable, Text, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

type PixelButtonProps = {
  title: string;
  onPress: () => void;
  className?: string;
};

export default function PixelButton({ title, onPress, className = '' }: PixelButtonProps) {
  return (
    <View className="relative pb-2 pr-2">
      {/* Shadow */}
      <View className="absolute bottom-0 left-2 right-0 top-2 bg-black" />

      <Pressable
        onPress={onPress}
        className={twMerge('items-center border-4 border-black bg-yellow p-4', className)}>
        <Text className="font-pixelTitle text-3xl text-black">{title}</Text>
      </Pressable>
    </View>
  );
}
