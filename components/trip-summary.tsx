import { Calendar, Users, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function TripSummary({ duration, travelers, totalPrice }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trip Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span>{duration} days</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span>{travelers} travelers</span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <span>${totalPrice}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

