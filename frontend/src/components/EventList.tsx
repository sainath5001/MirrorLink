import React from 'react';
import { formatPrice, formatRelativeTime } from '@/lib/format';
import { EXPLORER_URLS } from '@/lib/constants';
import { FiExternalLink } from 'react-icons/fi';

interface Event {
  type: 'origin' | 'destination';
  price: bigint | number;
  roundId: bigint | number;
  updatedAt: bigint | number;
  transactionHash?: string;
  blockNumber?: number;
}

interface EventListProps {
  events: Event[];
  maxItems?: number;
  className?: string;
}

export default function EventList({
  events,
  maxItems = 20,
  className = '',
}: EventListProps) {
  const displayEvents = events.slice(0, maxItems);

  if (displayEvents.length === 0) {
    return (
      <div
        className={`bg-gray-900 rounded-lg shadow-md p-4 border border-gray-800 ${className}`}
      >
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Recent Events
        </h3>
        <p className="text-sm text-gray-500">No events yet</p>
      </div>
    );
  }

  return (
    <div
      className={`bg-gray-900 rounded-lg shadow-md p-4 border border-gray-800 ${className}`}
    >
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Recent Events
      </h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {displayEvents.map((event, index) => {
          const explorerUrl =
            event.type === 'origin'
              ? EXPLORER_URLS.ORIGIN
              : EXPLORER_URLS.BASE;
          const txUrl = event.transactionHash
            ? `${explorerUrl}/tx/${event.transactionHash}`
            : null;

          return (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded ${
                      event.type === 'origin'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}
                  >
                    {event.type === 'origin' ? 'Origin' : 'Destination'}
                  </span>
                  <span className="text-sm font-semibold text-white">
                    ${formatPrice(event.price)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>Round: {event.roundId.toString()}</span>
                  <span>{formatRelativeTime(event.updatedAt)}</span>
                </div>
              </div>
              {txUrl && (
                <a
                  href={txUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  aria-label="View transaction on explorer"
                >
                  <FiExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

