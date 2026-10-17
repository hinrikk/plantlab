import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text } from 'react-native';
import { z } from 'zod';

import PixelModal from './PixelModal';
import PixelButton from './PixelButton';
import PixelInput from './PixelInput';
import { zodResolver } from '@hookform/resolvers/zod';

type Plant = {
  id: number;
  name: string;
};

type Props = {
  plant: Plant | null;
  onClose: () => void;
  onSave: (id: number, name: string) => Promise<void>;
};

const editPlantSchema = z.object({
  name: z.string().trim().min(1, 'Bitte einen Namen eingeben').max(50, 'Name ist zu lang'),
});

type EditPlantForm = z.infer<typeof editPlantSchema>;

export default function EditPlantModal({ plant, onClose, onSave }: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<EditPlantForm>({
    resolver: zodResolver(editPlantSchema),
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    reset({ name: plant?.name ?? '' });
  }, [plant?.id, plant?.name, reset]);

  async function onSubmit(values: EditPlantForm) {
    if (!plant) return;
    await onSave(plant.id, values.name.trim());
  }

  return (
    <PixelModal visible={plant !== null} onClose={onClose}>
      <Text className="font-pixelTitle text-3xl">Pflanze bearbeiten</Text>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <>
            <PixelInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Pflanzenname"
            />

            {error && <Text className="font-pixel text-red-500">{error.message}</Text>}
          </>
        )}
      />

      <PixelButton title="SAVE" onPress={handleSubmit(onSubmit)} />
      <PixelButton title="CANCEL" className="bg-rose" onPress={onClose} />
    </PixelModal>
  );
}
