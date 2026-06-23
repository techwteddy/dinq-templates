import { z } from 'zod';

export const StellarKeypairSchema = z.object({
  publicKey: z.string().min(56).max(56),
  secretKey: z.string().min(56).max(56),
});

export type StellarKeypair = z.infer<typeof StellarKeypairSchema>;

export const BalanceSchema = z.object({
  xlm: z.string(),
  usdc: z.string(),
});

export type Balance = z.infer<typeof BalanceSchema>;

export const TransactionRecordSchema = z.object({
  id: z.string(),
  hash: z.string(),
  type: z.enum(['payment', 'create_account', 'other']),
  amount: z.string(),
  asset: z.string(),
  from: z.string(),
  to: z.string(),
  memo: z.string().optional(),
  createdAt: z.string(),
  successful: z.boolean(),
});

export type TransactionRecord = z.infer<typeof TransactionRecordSchema>;

export const SendPaymentParamsSchema = z.object({
  senderSecret: z.string().min(56).max(56),
  recipientPublicKey: z.string().min(56).max(56),
  amount: z.string().regex(/^\d+(\.\d{1,7})?$/, 'Invalid amount format'),
  memo: z.string().max(28).optional(),
});

export type SendPaymentParams = z.infer<typeof SendPaymentParamsSchema>;

export interface PaymentResult {
  hash: string;
  ledger: number;
  successful: boolean;
}

export const HORIZON_TESTNET_URL = 'https://horizon-testnet.stellar.org';
export const FRIENDBOT_URL = 'https://friendbot.stellar.org';

// USDC on Stellar testnet (Circle's testnet issuer)
export const USDC_ASSET_CODE = 'USDC';
export const USDC_ISSUER_TESTNET = 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5';
