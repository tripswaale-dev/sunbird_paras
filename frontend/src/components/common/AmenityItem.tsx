import { Bed, Utensils, Camera, Car, Coffee, Check } from 'lucide-react';

interface AmenityItemProps {
  amenity: string;
}

export function AmenityItem({ amenity }: AmenityItemProps) {
  // Determine which icon to use based on the amenity name
  let Icon = Check;
  const name = amenity.toLowerCase();
  
  if (name.includes('hotel') || name.includes('accommodation')) Icon = Bed;
  else if (name.includes('meal') || name.includes('food')) Icon = Utensils;
  else if (name.includes('sightseeing') || name.includes('tour')) Icon = Camera;
  else if (name.includes('transfer') || name.includes('transport')) Icon = Car;
  else if (name.includes('breakfast')) Icon = Coffee;

  return (
    <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
      <Icon className="h-4 w-4 text-primary" />
      <span>{amenity}</span>
    </div>
  );
}
