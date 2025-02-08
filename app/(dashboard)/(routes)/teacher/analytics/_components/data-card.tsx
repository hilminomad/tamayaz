import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { formatPrice } from '@/lib/format';

interface DataCardProps {
  value: number;
  label: string;
  shouldFormat?: boolean;
}

export const DataCard = ({ label, value, shouldFormat }: DataCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-sky-700">
          {shouldFormat ? formatPrice(value) : value}
        </div>
      </CardContent>
    </Card>
  );
};
