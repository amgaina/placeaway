import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AITripSuggestion } from '@/schemas/trip';
import { Budget } from '@prisma/client';
import { Euro, Plane, Calendar } from 'lucide-react';

export function BudgetTracker({ budget }: { budget: Budget }) {
  const total = budget.total;
  const spent =
    budget.accommodation +
    budget.transport +
    budget.activities +
    budget.food +
    budget.other;

  return (
    <Card className="bg-white shadow-md">
      <CardHeader className="p-4 bg-sky-100">
        <CardTitle className="text-2xl flex items-center gap-2 text-sky-700">
          <Euro className="h-6 w-6" />
          Budget Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between text-lg">
          <span>Total: ${total}</span>
          <span>Spent: ${spent}</span>
        </div>
        <Progress value={66} className="h-3 bg-sky-100" />
        <div className="grid grid-cols-2 gap-3 text-sm">
          {Object.entries(budget).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between bg-sky-50 p-2 rounded"
            >
              <div className="flex items-center gap-2">
                <Euro className="h-4 w-4 text-sky-600" />
                <span>{key}</span>
              </div>
              <span>${value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
