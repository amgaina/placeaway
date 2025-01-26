import React from 'react';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-lg text-gray-600 mb-8">{message}</p>
        {onAction && (
          <button
            onClick={onAction}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
};

export default FullPageErrorView;
