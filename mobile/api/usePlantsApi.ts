import { useAuth } from '../context/AuthContext';

export function usePlantsApi() {
  const { token } = useAuth();

  async function getPlants() {
    const response = await fetch('http://192.168.178.32:3000/plants', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(`Failed to fetch plants: ${response.status} ${message}`);
    }

    return response.json();
  }

  async function addDeviceToPlant(plantId: number, deviceId: number) {
    const response = await fetch(`http://192.168.178.32:3000/plants/${plantId}/device`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        device_id: deviceId,
      }),
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(`Failed to add device: ${response.status} ${message}`);
    }

    return response.json();
  }

  async function createPlant(name: string) {
    const response = await fetch('http://192.168.178.32:3000/plants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
      }),
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(`Failed to create plant: ${response.status} ${message}`);
    }

    return response.json();
  }

  return {
    getPlants,
    addDeviceToPlant,
    createPlant,
  };
}
