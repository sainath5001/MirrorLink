import { RPC_URLS } from '@/lib/constants';

export async function checkRPCHealth(chain: 'base' | 'origin'): Promise<boolean> {
  try {
    const rpcUrl = chain === 'base' ? RPC_URLS.BASE : RPC_URLS.ORIGIN;
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1,
      }),
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function getLatestBlock(chain: 'base' | 'origin'): Promise<number | null> {
  try {
    const rpcUrl = chain === 'base' ? RPC_URLS.BASE : RPC_URLS.ORIGIN;
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1,
      }),
      signal: AbortSignal.timeout(5000),
    });
    const data = await response.json();
    return parseInt(data.result, 16);
  } catch {
    return null;
  }
}

