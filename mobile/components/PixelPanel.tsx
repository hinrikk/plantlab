import { type ReactNode, useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import {
  Canvas,
  ColorMatrix,
  FilterMode,
  Group,
  Image,
  MipmapMode,
  rect,
  useImage,
} from '@shopify/react-native-skia';

type Props = {
  source: number;
  scale?: number;
  padding?: number;
  shadowOffset?: number;
  children?: ReactNode;
};

const CORNER = 4;

export default function PixelPanel({
  source,
  scale = 4,
  padding = 20,
  shadowOffset = 8,
  children,
}: Props) {
  const image = useImage(source);

  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

  function handleLayout(event: LayoutChangeEvent) {
    const { width, height } = event.nativeEvent.layout;

    setSize({
      width,
      height,
    });
  }

  const corner = CORNER * scale;

  if (!image) {
    return (
      <View
        style={{
          paddingRight: shadowOffset,
          paddingBottom: shadowOffset,
        }}>
        <View onLayout={handleLayout}>
          <View style={{ padding }}>{children}</View>
        </View>
      </View>
    );
  }

  const imageWidth = image.width();
  const imageHeight = image.height();

  const sourceX = [0, CORNER, imageWidth - CORNER];
  const sourceY = [0, CORNER, imageHeight - CORNER];

  const sourceWidths = [CORNER, imageWidth - CORNER * 2, CORNER];

  const sourceHeights = [CORNER, imageHeight - CORNER * 2, CORNER];

  const destX = [0, corner, size.width - corner];
  const destY = [0, corner, size.height - corner];

  const destWidths = [corner, size.width - corner * 2, corner];

  const destHeights = [corner, size.height - corner * 2, corner];

  function renderNineSlice(offsetX = 0, offsetY = 0) {
    return [0, 1, 2].flatMap((col) =>
      [0, 1, 2].map((row) => {
        const sx = sourceX[col];
        const sy = sourceY[row];

        const sw = sourceWidths[col];
        const sh = sourceHeights[row];

        const dx = destX[col] + offsetX;
        const dy = destY[row] + offsetY;

        const dw = destWidths[col];
        const dh = destHeights[row];

        const scaleX = dw / sw;
        const scaleY = dh / sh;

        return (
          <Group key={`${offsetX}-${offsetY}-${row}-${col}`} clip={rect(dx, dy, dw, dh)}>
            <Image
              image={image}
              x={dx - sx * scaleX}
              y={dy - sy * scaleY}
              width={imageWidth * scaleX}
              height={imageHeight * scaleY}
              fit="fill"
              sampling={{
                filter: FilterMode.Nearest,
                mipmap: MipmapMode.None,
              }}
            />
          </Group>
        );
      })
    );
  }

  return (
    <View
      style={{
        paddingRight: shadowOffset,
        paddingBottom: shadowOffset,
      }}>
      <View
        onLayout={handleLayout}
        style={{
          position: 'relative',
          alignSelf: 'stretch',
        }}>
        {size.width > 0 && size.height > 0 && (
          <Canvas
            style={{
              position: 'absolute',
              width: size.width + shadowOffset,
              height: size.height + shadowOffset,
            }}>
            {/* Shadow */}
            <Group>
              <ColorMatrix matrix={[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0]} />

              {renderNineSlice(shadowOffset, shadowOffset)}
            </Group>

            {/* Actual panel */}
            {renderNineSlice()}
          </Canvas>
        )}

        <View style={{ padding }}>{children}</View>
      </View>
    </View>
  );
}
