import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

export function RecommendationsList({
  recommendations,
}: {
  recommendations: string[];
}) {
  return (
    <Card className="bg-white shadow-md">
      <CardHeader className="p-4 bg-sky-100">
        <CardTitle className="text-2xl flex items-center gap-2 text-sky-700">
          <Info className="h-6 w-6" />
          Travel Tips & Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ul className="space-y-2 list-disc list-inside">
          {recommendations.map((rec, i) => (
            <li key={i}>{rec}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
