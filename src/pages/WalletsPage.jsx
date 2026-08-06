import React, { useEffect, useState } from 'react';
import PayVangLayout from '../components/layout/PayVangLayout';
import GradientButton from '../components/common/GradientButton';
import { Wallet, Plus, RefreshCw, DollarSign } from 'lucide-react';

export default function WalletsPage() {
  const [wallets, setWallets] = useState([]);
  const [cryptoWallets, setCryptoWallets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/wallet/walletList').then((r) => r.json()),
      fetch('/wallet/cryptoWalletList').then((r) => r.json())
    ])
      .then(([wData, cData]) => {
        setWallets(wData);
        setCryptoWallets(cData);
        setLoading(false);
      });
  }, []);

  return (
    <PayVangLayout title="Wallets & Escrow" subtitle="Central merchant escrow balances, reserve holds & crypto wallets.">
      <div className="space-y-6">
        {/* FIAT WALLETS */}
        <div className="coursera-card p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-[#7A1F2B]" />
              <h3 className="text-xl font-bold text-[#7A1F2B] font-heading">Merchant Fiat Escrow Balances</h3>
            </div>
            <GradientButton onClick={() => alert('Manually crediting wallet balance...')}>
              Credit Merchant Wallet
            </GradientButton>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="w-6 h-6 text-[#7A1F2B] animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[#7A1F2B]/15 text-xs font-bold text-[#7A1F2B] uppercase bg-[#FBF3E7]/50">
                    <th className="py-3 px-4 rounded-l-xl">Merchant Name</th>
                    <th className="py-3 px-4">Merchant ID</th>
                    <th className="py-3 px-4">Net Balance</th>
                    <th className="py-3 px-4">Reserved Escrow</th>
                    <th className="py-3 px-4 rounded-r-xl">Last Sync</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#7A1F2B]/10">
                  {wallets.map((w) => (
                    <tr key={w.merchantId} className="hover:bg-[#FBF3E7]/60">
                      <td className="py-3.5 px-4 font-bold text-[#241417]">{w.merchantName}</td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-[#7A1F2B]">{w.merchantId}</td>
                      <td className="py-3.5 px-4 font-extrabold text-[#16a34a] text-base">₹{w.balance.toLocaleString('en-IN')}</td>
                      <td className="py-3.5 px-4 font-bold text-[#C99A3D]">₹{w.reservedBalance.toLocaleString('en-IN')}</td>
                      <td className="py-3.5 px-4 text-xs text-[#6b5a56]">{w.lastUpdated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* CRYPTO WALLETS */}
        <div className="coursera-card p-6 md:p-8 space-y-4">
          <h3 className="text-xl font-bold text-[#7A1F2B] font-heading">Merchant Crypto Hot Wallets</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#7A1F2B]/15 text-xs font-bold text-[#7A1F2B] uppercase bg-[#FBF3E7]/50">
                  <th className="py-3 px-4 rounded-l-xl">Merchant ID</th>
                  <th className="py-3 px-4">Coin & Chain</th>
                  <th className="py-3 px-4">Wallet Address</th>
                  <th className="py-3 px-4">Crypto Balance</th>
                  <th className="py-3 px-4 rounded-r-xl">Fiat Equivalent (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#7A1F2B]/10">
                {cryptoWallets.map((cw) => (
                  <tr key={cw.merchantId} className="hover:bg-[#FBF3E7]/60">
                    <td className="py-3.5 px-4 font-bold text-[#7A1F2B]">{cw.merchantId}</td>
                    <td className="py-3.5 px-4 font-bold text-[#C99A3D]">{cw.coinType} ({cw.chainType})</td>
                    <td className="py-3.5 px-4 font-mono text-xs text-[#6b5a56]">{cw.walletAddress}</td>
                    <td className="py-3.5 px-4 font-extrabold text-[#241417]">{cw.balance} {cw.coinType}</td>
                    <td className="py-3.5 px-4 font-extrabold text-[#16a34a]">${cw.fiatValueUSD.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PayVangLayout>
  );
}
