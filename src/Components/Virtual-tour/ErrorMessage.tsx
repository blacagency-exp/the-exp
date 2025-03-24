

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4">
        <h3 className="text-xl font-bold text-red-600 mb-2">Error</h3>
        <p className="text-gray-700 mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-[#5A8E00] text-white rounded-md hover:bg-[#4A7500] transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}