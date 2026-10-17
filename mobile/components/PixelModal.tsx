import { ReactNode } from 'react';
import { Modal, View } from 'react-native';
import PixelPanel from './PixelPanel';

type Props = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function PixelModal({ visible, onClose, children }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/60">
        <View className="w-full p-2">
          <PixelPanel source={require('../assets/pixel/panel.png')} scale={4}>
            <View className="gap-4 p-4">{children}</View>
          </PixelPanel>
        </View>
      </View>
    </Modal>
  );
}
