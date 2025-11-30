import { format, formatDistanceToNow } from 'date-fns';
import { PRICE_DECIMALS } from './constants';

export function formatPrice(price: bigint | number | string): string {
  const numPrice = typeof price === 'bigint' ? Number(price) : Number(price);
  const divisor = Math.pow(10, PRICE_DECIMALS);
  const usdPrice = numPrice / divisor;
  return usdPrice.toFixed(2);
}

export function formatAddress(address: string, length = 6): string {
  if (!address) return '';
  if (address.length <= length * 2 + 2) return address;
  return `${address.slice(0, length + 2)}...${address.slice(-length)}`;
}

export function formatTimestamp(timestamp: bigint | number | string): string {
  const numTimestamp = typeof timestamp === 'bigint' ? Number(timestamp) : Number(timestamp);
  if (numTimestamp === 0) return 'Never';
  const date = new Date(numTimestamp * 1000);
  return format(date, 'yyyy-MM-dd HH:mm:ss');
}

export function formatRelativeTime(timestamp: bigint | number | string): string {
  const numTimestamp = typeof timestamp === 'bigint' ? Number(timestamp) : Number(timestamp);
  if (numTimestamp === 0) return 'Never';
  const date = new Date(numTimestamp * 1000);
  return formatDistanceToNow(date, { addSuffix: true });
}

export function formatTxHash(txHash: string, length = 8): string {
  if (!txHash) return '';
  if (txHash.length <= length * 2 + 2) return txHash;
  return `${txHash.slice(0, length + 2)}...${txHash.slice(-length)}`;
}

export function calculatePriceDelta(
  originPrice: bigint | number,
  destPrice: bigint | number
): { absolute: number; percentage: number } {
  const origin = typeof originPrice === 'bigint' ? Number(originPrice) : Number(originPrice);
  const dest = typeof destPrice === 'bigint' ? Number(destPrice) : Number(destPrice);
  const divisor = Math.pow(10, PRICE_DECIMALS);
  const originUSD = origin / divisor;
  const destUSD = dest / divisor;
  const absolute = Math.abs(originUSD - destUSD);
  const percentage = originUSD !== 0 ? ((destUSD - originUSD) / originUSD) * 100 : 0;
  return { absolute, percentage };
}

export function calculateLatency(
  originUpdatedAt: bigint | number,
  destUpdatedAt: bigint | number
): number {
  const origin = typeof originUpdatedAt === 'bigint' ? Number(originUpdatedAt) : Number(originUpdatedAt);
  const dest = typeof destUpdatedAt === 'bigint' ? Number(destUpdatedAt) : Number(destUpdatedAt);
  return Math.max(0, dest - origin); // seconds
}

