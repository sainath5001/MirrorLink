import { describe, it, expect } from 'vitest';
import {
  formatPrice,
  formatAddress,
  formatTimestamp,
  calculatePriceDelta,
  calculateLatency,
} from '@/lib/format';

describe('format utilities', () => {
  describe('formatPrice', () => {
    it('formats bigint price correctly', () => {
      expect(formatPrice(BigInt('200000000000'))).toBe('2000.00');
      expect(formatPrice(BigInt('123456789000'))).toBe('1234.57');
    });

    it('formats number price correctly', () => {
      expect(formatPrice(200000000000)).toBe('2000.00');
    });

    it('formats string price correctly', () => {
      expect(formatPrice('200000000000')).toBe('2000.00');
    });
  });

  describe('formatAddress', () => {
    it('formats address with default length', () => {
      const addr = '0x1234567890123456789012345678901234567890';
      expect(formatAddress(addr)).toBe('0x123456...7890');
    });

    it('formats address with custom length', () => {
      const addr = '0x1234567890123456789012345678901234567890';
      expect(formatAddress(addr, 4)).toBe('0x1234...7890');
    });
  });

  describe('formatTimestamp', () => {
    it('formats timestamp correctly', () => {
      const timestamp = 1701234567; // 2023-11-29
      const formatted = formatTimestamp(timestamp);
      expect(formatted).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
    });

    it('handles zero timestamp', () => {
      expect(formatTimestamp(0)).toBe('Never');
    });
  });

  describe('calculatePriceDelta', () => {
    it('calculates delta correctly', () => {
      const origin = BigInt('200000000000'); // $2000
      const dest = BigInt('201000000000'); // $2010
      const delta = calculatePriceDelta(origin, dest);
      expect(delta.absolute).toBeCloseTo(10, 2);
      expect(delta.percentage).toBeCloseTo(0.5, 2);
    });

    it('handles negative delta', () => {
      const origin = BigInt('200000000000');
      const dest = BigInt('199000000000');
      const delta = calculatePriceDelta(origin, dest);
      expect(delta.absolute).toBeCloseTo(10, 2);
      expect(delta.percentage).toBeCloseTo(-0.5, 2);
    });
  });

  describe('calculateLatency', () => {
    it('calculates latency in seconds', () => {
      const origin = 1701234567;
      const dest = 1701234587; // 20 seconds later
      expect(calculateLatency(origin, dest)).toBe(20);
    });

    it('returns 0 for negative latency', () => {
      const origin = 1701234587;
      const dest = 1701234567; // 20 seconds earlier
      expect(calculateLatency(origin, dest)).toBe(0);
    });
  });
});

