import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

interface BudgetTrackerProps {
  budget: number;
  setBudget: (budget: number) => void;
  totalPrice: number;
}

export function BudgetTracker({
  budget,
  setBudget,
  totalPrice,
}: BudgetTrackerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Budget: ${budget}</span>
            <span>Remaining: ${budget - totalPrice}</span>
          </div>
          <Slider
            value={[budget]}
            onValueChange={(value) => setBudget(value[0])}
            max={10000}
            step={100}
          />
        </div>
      </CardContent>
    </Card>
  );
}
