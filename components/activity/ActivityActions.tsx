import { ActivityStatus } from '@prisma/client';
import { Check, X, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { useState } from 'react';
import { toast } from 'sonner';

interface ActivityActionsProps {
  status: ActivityStatus;
  onStatusChange: (status: ActivityStatus) => Promise<void>;
  onAttachment: (file: File) => Promise<void>;
}

export function ActivityActions({
  status,
  onStatusChange,
  onAttachment,
}: ActivityActionsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (newStatus: ActivityStatus) => {
    setIsLoading(true);
    try {
      await onStatusChange(newStatus);
    } finally {
      toast.success('Activity updated successfully');
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        await onAttachment(file);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant={status === 'APPROVED' ? 'default' : 'outline'}
              onClick={() => handleStatusChange('APPROVED')}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : status === 'APPROVED' ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <Check className="w-4 h-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Approve Activity</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant={status === 'REJECTED' ? 'destructive' : 'outline'}
              onClick={() => handleStatusChange('REJECTED')}
              disabled={isLoading}
            >
              <X className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reject Activity</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="image/*,.pdf"
                  disabled={isLoading}
                />
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isLoading}
                  asChild
                >
                  {/* <span>
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                  </span> */}
                </Button>
              </label>
            </div>
          </TooltipTrigger>
          <TooltipContent>Upload Attachment</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
