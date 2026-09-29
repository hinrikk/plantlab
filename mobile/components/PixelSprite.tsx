import { Canvas, Image, useImage, FilterMode, MipmapMode } from '@shopify/react-native-skia';

type Props = {
  source: number;
  scale?: number;
};

export default function PixelSprite({ source, scale = 4 }: Props) {
  const image = useImage(source);

  if (!image) return null;

  const width = image.width() * scale;
  const height = image.height() * scale;

  return (
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
  );
}
