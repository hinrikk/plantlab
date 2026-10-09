import PixelPanel from './PixelPanel';
import { TextInput, TextInputProps } from 'react-native';

type PixelInputProps = TextInputProps & {
  value: string;
  onChangeText: (text: string) => void;
};

export default function PixelInput({ value, onChangeText, ...props }: PixelInputProps) {
  return (
    <PixelPanel source={require('../assets/pixel/panel.png')} scale={4}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        className="font-pixelTitle text-lg text-black"
        {...props}
      />
    </PixelPanel>
  );
}
