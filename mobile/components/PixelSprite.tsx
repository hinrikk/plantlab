import { useEffect } from 'react';
import { Canvas, Image, useImage, FilterMode, MipmapMode } from '@shopify/react-native-skia';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

type Props = {
  source: number;
  scale?: number;
  idle?: boolean;
};

const DURATION_MS = 1600;

export default function PixelSprite({ source, scale = 4, idle = false }: Props) {
  const image = useImage(source);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!idle) return;

    progress.value = withRepeat(
      withTiming(2 * Math.PI, {
        duration: DURATION_MS,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [idle, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const stretch = Math.sin(progress.value) * 0.08;

    return {
      transform: [{ scaleX: 1 - stretch }, { scaleY: 1 + stretch }],
      transformOrigin: 'center bottom',
    };
  });

  if (!image) return null;

  const width = image.width() * scale;
  const height = image.height() * scale;

  return (
    <Animated.View style={idle ? animatedStyle : undefined}>
      <Canvas style={{ width, height }}>
        <Image
          image={image}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="fill"
          sampling={{
            filter: FilterMode.Nearest,
            mipmap: MipmapMode.None,
          }}
        />
      </Canvas>
    </Animated.View>
  );
}
