import { Pressable } from 'react-native';

import PixelSprite from './PixelSprite';

type Props = {
  source: number;
  onPress: () => void;
  scale?: number;
};

export default function PixelIconButton({ source, onPress, scale = 2 }: Props) {
  return (
    <Pressable onPress={onPress}>
      <PixelSprite source={source} scale={scale} />
    </Pressable>
  );
}
