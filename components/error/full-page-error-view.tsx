import React from 'react';
import { Button } from '@/components/ui/button';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

interface FullPageErrorViewProps {
  title?: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
}

const FullPageErrorView: React.FC<FullPageErrorViewProps> = ({
  title = 'Oops! Something went wrong',
  message = "We're sorry, but there was an error processing your request.",
  actionText = 'Try Again',
  onAction,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center px-4 max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <ExclamationTriangleIcon className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-primary mb-4">{title}</h1>
        <p className="text-lg text-muted-foreground mb-8">{message}</p>
        {onAction && (
          <Button
            onClick={onAction}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg"
          >
            {actionText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default FullPageErrorView;
