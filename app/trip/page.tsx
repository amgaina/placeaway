'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserTrips } from '@/actions/trip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaPlane, FaSpinner } from 'react-icons/fa';
import {
  Plus,
  GridIcon,
  ListIcon,
  Search,
  Calendar,
  GroupIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Trip } from '@prisma/client';
import { TripWithPreferencesAndBudget } from '@/schemas/trip';
import FullPageErrorView from '@/components/error/full-page-error-view';

type ViewMode = 'grid' | 'list';
type FilterStatus = 'all' | 'planning' | 'completed';

/**
 * TripsPage Component
 *
 * A comprehensive page component for displaying and managing user trips.
 *
 * Features:
 * - Displays trips in both grid and list view modes
 * - Provides trip filtering by status (all/planning/completed)
 * - Implements search functionality for trips by destination
 * - Shows trip statistics (total, planning, completed)
 * - Handles loading and error states
 *
 * State Management:
 * - trips: Array of user trips with preferences and budget information
 * - loading: Boolean indicating data fetch status
 * - error: String containing error message if any
 * - searchQuery: String for filtering trips by destination
 * - filterStatus: Current filter status ('all' | 'planning' | 'completed')
 * - viewMode: Current view mode ('grid' | 'list')
 *
 * Data Flow:
 * 1. Loads trips data on component mount
 * 2. Transforms raw trip data to include preferences
 * 3. Filters trips based on search query and status
 * 4. Sorts trips by start date (descending)
 *
 * @returns {JSX.Element} Rendered trips page with filtering, searching, and view options
 * @throws {Error} When trip data fetching fails
 */
export default function TripsPage() {
  const [trips, setTrips] = useState<TripWithPreferencesAndBudget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const router = useRouter();

  useEffect(() => {
    async function loadTrips() {
      try {
        const result = await getUserTrips();
        if (result.error) {
          setError(result.error);
        } else {
          setTrips(
            result.data?.map((trip) => ({
              ...trip,
              preferences: {
                destination: trip.preferences?.destination ?? null,
                visitorCount: trip.preferences?.visitorCount ?? 1,
                interests: trip.preferences?.interests ?? [],
                hasChildren: trip.preferences?.hasChildren ?? false,
                hasPets: trip.preferences?.hasPets ?? false,
                origin: trip.preferences?.origin ?? null,
                id: trip.preferences?.id ?? trip.id,
                tripId: trip.preferences?.tripId ?? trip.id,
              },
              status: trip.status ?? 'PLANNING',
              startDate: trip.startDate ? new Date(trip.startDate) : null,
              endDate: trip.endDate ? new Date(trip.endDate) : null,
            })) ?? [],
          );
        }
      } catch (err) {
        setError('Failed to load trips');
        console.error('Trip loading error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadTrips();
  }, []);

  const filteredTrips = trips
    .filter((trip) => {
      // Status filter
      if (
        filterStatus !== 'all' &&
        (trip?.status?.toLowerCase() ?? 'planning') !== filterStatus
      ) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const destination = trip?.preferences?.destination ?? '';
        return destination.toLowerCase().includes(searchQuery.toLowerCase());
      }

      return true;
    })
    .sort((a, b) => {
      const dateA = a?.startDate ? new Date(a.startDate).getTime() : 0;
      const dateB = b?.startDate ? new Date(b.startDate).getTime() : 0;
      return dateB - dateA || 0;
    });

  if (loading) {
    return <LoadingView />;
  }

  if (error) {
    return (
      <FullPageErrorView
        message={error}
        title="Error"
        onAction={() => window.location.reload()}
        actionText="Try Again"
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-primary/5 border-b">
        <div className="max-w-7xl mx-auto py-12 px-6">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">
              Your Travel Journey
            </h1>
            <p className="text-muted-foreground">
              Discover and manage your adventures
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="bg-white/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">
                    {trips.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Trips</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">
                    {trips.filter((t) => t.status === 'PLANNING').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Planning</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">
                    {trips.filter((t) => t.status === 'COMPLETED').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search trips..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={filterStatus}
              onValueChange={(value) => setFilterStatus(value as FilterStatus)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Trips</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <ListIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <GridIcon className="h-4 w-4" />
            </Button>
            <Button
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/plan">
                <Plus className="w-4 h-4 mr-2" />
                New Trip
              </Link>
            </Button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {filteredTrips.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyState query={searchQuery} />
            </motion.div>
          ) : (
            <motion.div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredTrips.map((trip) => (
                <Card
                  key={trip.id}
                  className="group cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]"
                  onClick={() => router.push(`/trip/${trip.id}`)}
                >
                  <CardHeader className="border-b bg-primary/5">
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-primary">
                        {trip.preferences?.destination ?? 'Unknown Destination'}
                      </span>
                      <Badge
                        variant={
                          trip.status === 'PLANNING' ? 'default' : 'secondary'
                        }
                      >
                        {trip.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <GroupIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {trip.preferences?.visitorCount ?? 0} Visitors
                        </span>
                      </div>
                      {trip.startDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(trip.startDate), 'MMM dd')} -
                            {format(new Date(trip.endDate!), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      )}
                      <div className="border-t pt-4">
                        <div className="flex flex-col gap-2">
                          <p className="text-sm font-medium">Trip Details:</p>
                          <ul className="text-sm text-muted-foreground">
                            <li>ID: {trip.id}</li>
                            <li>Title: {trip.title}</li>
                            <li>Status: {trip.status}</li>
                            <li>
                              Destination:{' '}
                              {trip.preferences?.destination ??
                                'No destination set'}
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="pt-4 flex items-center justify-between">
                        <Badge variant="outline" className="bg-primary/5">
                          {trip.hasAISuggestions
                            ? 'AI Enhanced'
                            : 'AI Planning in Progress'}
                        </Badge>
                        <Button variant="ghost" className="text-primary">
                          View Details →
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function LoadingView() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <FaSpinner className="w-8 h-8 text-primary animate-spin" />
        <p className="text-primary font-medium">Loading your trips...</p>
      </div>
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="text-center py-12 border-2 border-dashed rounded-lg">
      <div className="max-w-md mx-auto">
        <FaPlane className="w-12 h-12 text-primary/20 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No trips planned yet
        </h3>
        <p className="text-muted-foreground mb-4">
          {query
            ? `No trips found for "${query}"`
            : 'Start planning your next adventure!'}
        </p>
        <Link href="/plan" className="bg-primary">
          Plan Your First Trip
        </Link>
      </div>
    </div>
  );
}
