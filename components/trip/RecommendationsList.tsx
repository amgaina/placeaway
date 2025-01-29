import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import { TripRecommendation } from '@prisma/client';

const categoryColors = {
  TRANSPORT: 'bg-blue-100 text-blue-800',
  ACCOMMODATION: 'bg-purple-100 text-purple-800',
  FOOD: 'bg-orange-100 text-orange-800',
  ACTIVITIES: 'bg-green-100 text-green-800',
  SAFETY: 'bg-red-100 text-red-800',
  GENERAL: 'bg-gray-100 text-gray-800',
  OTHER: 'bg-gray-100 text-gray-800',
};

const priorityIcons = {
  HIGH: '🔴',
  MEDIUM: '🟡',
  LOW: '🟢',
};

export function RecommendationsList({
  recommendations,
}: {
  recommendations: TripRecommendation[];
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
        <div className="space-y-4">
          {recommendations.map((rec, i) => (
            <div key={i} className="border-b last:border-0 pb-4 last:pb-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium flex items-center gap-2">
                    {priorityIcons[rec.priority]} {rec.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    {rec.description}
                  </p>
                </div>
                <Badge className={categoryColors[rec.category]}>
                  {rec.category}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
