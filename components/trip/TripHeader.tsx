import { format } from 'date-fns';
import { Calendar, Edit2, Save, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { motion } from 'framer-motion';
import { TripStatus } from '@prisma/client';

const statusColors = {
  PLANNING: 'bg-yellow-100 text-yellow-800',
  BOOKED: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export function TripHeader({
  trip,
  onEdit,
  isEditing,
}: {
  trip: any;
  onEdit: (val: boolean) => void;
  isEditing: boolean;
}) {
  return (
    <motion.div
      className="flex items-center justify-between p-6 bg-white border-b"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-primary">
            {trip.preferences?.destination}
          </h1>
          <Badge className={statusColors[trip.status as TripStatus]}>
            {trip.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground mt-1">
          {trip.startDate && (
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Calendar className="w-4 h-4" />
              <span>
                {format(new Date(trip.startDate), 'MMM dd')} -
                {format(new Date(trip.endDate), 'MMM dd, yyyy')}
              </span>
            </motion.div>
          )}
        </div>
      </div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={() => onEdit(!isEditing)}
          variant={isEditing ? 'default' : 'outline'}
          className="transition-all duration-200"
        >
          {isEditing ? (
            <>
              <X className="w-4 h-4 mr-2" />
              Cancel Editing
            </>
          ) : (
            <>
              <Edit2 className="w-4 h-4 mr-2" />
              Modify Trip
            </>
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
}
