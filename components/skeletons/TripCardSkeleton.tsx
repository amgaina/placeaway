export const TripCardSkeleton = () => {
  return (
    <div className="rounded-lg border p-4 space-y-4 animate-pulse">
      <div className="h-32 bg-gray-200 rounded-lg" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
      <div className="flex gap-2">
        <div className="h-8 bg-gray-200 rounded w-24" />
        <div className="h-8 bg-gray-200 rounded w-24" />
      </div>
    </div>
  );
};
