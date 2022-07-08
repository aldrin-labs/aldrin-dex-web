import {
  SolletWalletAdapter,
  SolletExtensionWalletAdapter,
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  MathWalletAdapter,
  SolongWalletAdapter,
  Coin98WalletAdapter,
  SolflareWalletAdapter,
  SlopeWalletAdapter,
  PhantomWalletName,
  SolletWalletName,
  SolletExtensionWalletName,
  LedgerWalletName,
  MathWalletName,
  SolongWalletName,
  Coin98WalletName,
  SolflareWalletName,
  SlopeWalletName,
} from '@solana/wallet-adapter-wallets'

export const getWalletAdapters = () => {
  return {
    [SolletWalletName]: new SolletWalletAdapter(),
    [SolletExtensionWalletName]: new SolletExtensionWalletAdapter(),
    [LedgerWalletName]: new LedgerWalletAdapter(),
    [PhantomWalletName]: new PhantomWalletAdapter(),
    [MathWalletName]: new MathWalletAdapter(),
    [SolongWalletName]: new SolongWalletAdapter(),
    [Coin98WalletName]: new Coin98WalletAdapter(),
    [SolflareWalletName]: new SolflareWalletAdapter(),
    [SlopeWalletName]: new SlopeWalletAdapter(),
  }
}
