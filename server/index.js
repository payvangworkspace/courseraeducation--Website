import express from 'express';
import cors from 'cors';
import http from 'http';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- IN-MEMORY MOCK DATASTORES ---

let merchants = [
  { id: 'MCH-1001', name: 'Reliance Retail Ltd', contactNumber: '+91 98200 11223', username: 'reliance_pay', businessName: 'Reliance Retail Digital', registrationDate: '2025-01-15' },
  { id: 'MCH-1002', name: 'Flipkart Logistics', contactNumber: '+91 98450 44556', username: 'flipkart_admin', businessName: 'Flipkart Internet Pvt Ltd', registrationDate: '2025-02-10' },
  { id: 'MCH-1003', name: 'Zomato Media India', contactNumber: '+91 99100 88776', username: 'zomato_pay', businessName: 'Zomato Limited', registrationDate: '2025-03-01' },
  { id: 'MCH-1004', name: 'Tata Neu Digital', contactNumber: '+91 97300 22114', username: 'tata_neu', businessName: 'Tata Digital Private Ltd', registrationDate: '2025-03-20' },
  { id: 'MCH-1005', name: 'Nykaa E-Retail', contactNumber: '+91 98888 33221', username: 'nykaa_pay', businessName: 'FSN E-Commerce Ventures', registrationDate: '2025-04-05' },
  { id: 'MCH-1006', name: 'MakeMyTrip India', contactNumber: '+91 96500 77889', username: 'mmt_gateway', businessName: 'MakeMyTrip (India) Pvt Ltd', registrationDate: '2025-05-12' },
  { id: 'MCH-1007', name: 'Swiggy Bundl Tech', contactNumber: '+91 98111 66554', username: 'swiggy_pay', businessName: 'Bundl Technologies Pvt Ltd', registrationDate: '2025-06-18' }
];

let users = [
  { userId: 'USR-101', userName: 'alex_admin', email: 'admin@payvang.com', role: 'ADMIN', status: true, payinStatus: true, payoutStatus: true, authStatus: false, payoutGstStatus: true, payoutFeeReturnStatus: true, payinGstStatus: true, payoutStatusViaApplication: true, verified: true },
  ...merchants.map((m) => ({
    userId: m.id,
    userName: m.username,
    email: `${m.username}@merchant.com`,
    role: 'MERCHANT',
    fullName: m.name,
    contactNumber: m.contactNumber,
    businessName: m.businessName,
    registrationDate: m.registrationDate,
    activationDate: m.registrationDate,
    verificationDate: m.registrationDate,
    merchantCode: m.id.replace('MCH-', ''),
    appId: `APP${m.id.replace(/\D/g, '')}20260818`,
    appKey: `sec_${m.id.replace(/\D/g, '')}_live_key`,
    status: true,
    payinStatus: true,
    payoutStatus: true,
    authStatus: false,
    payinGstStatus: true,
    payoutGstStatus: true,
    payoutFeeReturnStatus: true,
    payoutStatusViaApplication: true,
    verified: true,
    website: 'https://courseraeducation.com',
    businessType: 'E-Commerce',
    subIndustry: 'Digital Goods',
    country: 'India',
    city: 'Mumbai',
    address: 'Andheri East, Mumbai',
    gender: '—',
    webhookUrl: `https://api.courseraeducation.com/payinwebhook/${m.username}`,
    settlementCycle: 'T+1',
    settlementMode: 'NEFT',
  })),
];

let acquirers = [
  { acquirerId: 'ACQ-01', fullName: 'HDFC SmartHub', acquirerCode: 'HDFC_PG_DIRECT', acquirerPgId: 'HDFC_MCH_88291', acquirerPgKey: 'pg_key_hdfc_991', acquirerPgPassword: 'sec_hdfc_live_9981273', acquirerPayoutPgId: 'HDFC_PO_88291', acquirerPayoutPgKey: 'po_key_hdfc_991', acquirerPayoutPgPassword: 'sec_hdfc_po_112', status: true, payinWebhookUrl: 'https://api.courseraeducation.com/wh/payin/hdfc', payoutWebhookUrl: 'https://api.courseraeducation.com/wh/payout/hdfc', payin: true, payout: true },
  { acquirerId: 'ACQ-02', fullName: 'ICICI UPI Stack', acquirerCode: 'ICICI_UPI_STACK', acquirerPgId: 'ICICI_MCH_44120', acquirerPgKey: 'pg_key_icici_772', acquirerPgPassword: 'sec_icici_live_772183', acquirerPayoutPgId: 'ICICI_PO_44120', acquirerPayoutPgKey: 'po_key_icici_772', acquirerPayoutPgPassword: 'sec_icici_po_889', status: true, payinWebhookUrl: 'https://api.courseraeducation.com/wh/payin/icici', payoutWebhookUrl: 'https://api.courseraeducation.com/wh/payout/icici', payin: true, payout: true },
  { acquirerId: 'ACQ-03', fullName: 'Razorpay Bridge', acquirerCode: 'RAZORPAY_AGG', acquirerPgId: 'rzp_live_918237', acquirerPgKey: 'pg_key_rzp_556', acquirerPgPassword: 'sec_rzp_test_556123', acquirerPayoutPgId: '', acquirerPayoutPgKey: '', acquirerPayoutPgPassword: '', status: true, payinWebhookUrl: 'https://api.courseraeducation.com/wh/payin/rzp', payoutWebhookUrl: '', payin: true, payout: false },
  { acquirerId: 'ACQ-04', fullName: 'Axis Card Hub', acquirerCode: 'AXIS_CARD_ENGINE', acquirerPgId: 'AXIS_MCH_11928', acquirerPgKey: 'pg_key_axis_883', acquirerPgPassword: 'sec_axis_883491', acquirerPayoutPgId: 'AXIS_PO_11928', acquirerPayoutPgKey: 'po_key_axis_883', acquirerPayoutPgPassword: 'sec_axis_po_774', status: false, payinWebhookUrl: 'https://api.courseraeducation.com/wh/payin/axis', payoutWebhookUrl: 'https://api.courseraeducation.com/wh/payout/axis', payin: true, payout: true }
];

let transactions = [
  { id: 'TXN-90124', merchantId: 'MCH-1001', merchantName: 'Reliance Retail Ltd', status: 'Success', customerEmail: 'rahul.sharma@gmail.com', customerName: 'Rahul Sharma', txnAmt: 4999.00, currency: 'INR', transactionType: 'UPI_COLLECT', createdOn: '2026-08-06 11:42:10', detail: 'HDFC UPI App' },
  { id: 'TXN-90125', merchantId: 'MCH-1002', merchantName: 'Flipkart Logistics', status: 'Success', customerEmail: 'priya.verma@yahoo.com', customerName: 'Priya Verma', txnAmt: 12450.50, currency: 'INR', transactionType: 'CREDIT_CARD', createdOn: '2026-08-06 11:15:33', detail: 'Axis Bank Visa Card' },
  { id: 'TXN-90126', merchantId: 'MCH-1003', merchantName: 'Zomato Media India', status: 'Pending', customerEmail: 'amit.patel@hotmail.com', customerName: 'Amit Patel', txnAmt: 680.00, currency: 'INR', transactionType: 'WALLET', createdOn: '2026-08-06 10:50:18', detail: 'Paytm Wallet' },
  { id: 'TXN-90127', merchantId: 'MCH-1004', merchantName: 'Tata Neu Digital', status: 'Failed', customerEmail: 'neha.singh@gmail.com', customerName: 'Neha Singh', txnAmt: 8900.00, currency: 'INR', transactionType: 'NETBANKING', createdOn: '2026-08-06 10:12:05', detail: 'ICICI Bank Gateway Timeout' },
  { id: 'TXN-90128', merchantId: 'MCH-1005', merchantName: 'Nykaa E-Retail', status: 'Success', customerEmail: 'kavita.reddy@outlook.com', customerName: 'Kavita Reddy', txnAmt: 3450.00, currency: 'INR', transactionType: 'DEBIT_CARD', createdOn: '2026-08-06 09:30:44', detail: 'SBI Rupay Card' },
  { id: 'TXN-90129', merchantId: 'MCH-1006', merchantName: 'MakeMyTrip India', status: 'Success', customerEmail: 'vikram.mehta@gmail.com', customerName: 'Vikram Mehta', txnAmt: 28900.00, currency: 'INR', transactionType: 'UPI_QR', createdOn: '2026-08-05 22:10:00', detail: 'PhonePe QR' },
  { id: 'TXN-90130', merchantId: 'MCH-1007', merchantName: 'Swiggy Bundl Tech', status: 'Success', customerEmail: 'ananya.roy@gmail.com', customerName: 'Ananya Roy', txnAmt: 540.00, currency: 'INR', transactionType: 'UPI_COLLECT', createdOn: '2026-08-05 20:45:12', detail: 'Google Pay' }
];

let settlements = [
  { id: 'SET-501', merchantId: 'MCH-1001', amountPayable: 2450000.00, merchantCharge: 49000.00, netSettlement: 2401000.00, createdDate: '2026-08-05', status: 'Settled', utrNumber: 'UTR20260805991201', paymentMode: 'NEFT' },
  { id: 'SET-502', merchantId: 'MCH-1002', amountPayable: 4890000.00, merchantCharge: 97800.00, netSettlement: 4792200.00, createdDate: '2026-08-05', status: 'Settled', utrNumber: 'UTR20260805991202', paymentMode: 'RTGS' },
  { id: 'SET-503', merchantId: 'MCH-1003', amountPayable: 1250000.00, merchantCharge: 25000.00, netSettlement: 1225000.00, createdDate: '2026-08-06', status: 'Processing', utrNumber: 'PENDING_BANK_ACK', paymentMode: 'IMPS' },
  { id: 'SET-504', merchantId: 'MCH-1004', amountPayable: 890000.00, merchantCharge: 17800.00, netSettlement: 872200.00, createdDate: '2026-08-06', status: 'Pending', utrNumber: 'QUEUED', paymentMode: 'NEFT' }
];

let remittances = [
  { id: 'REM-801', utr: 'UTR881920311', payableAmount: 1850000.00, remittanceDate: '2026-08-05', merchant: 'Reliance Retail Ltd', currencyCode: 'INR', acquirerCode: 'HDFC_PG_DIRECT' },
  { id: 'REM-802', utr: 'UTR881920312', payableAmount: 3200000.00, remittanceDate: '2026-08-05', merchant: 'Flipkart Logistics', currencyCode: 'INR', acquirerCode: 'ICICI_UPI_STACK' },
  { id: 'REM-803', utr: 'UTR881920313', payableAmount: 940000.00, remittanceDate: '2026-08-06', merchant: 'Nykaa E-Retail', currencyCode: 'INR', acquirerCode: 'RAZORPAY_AGG' }
];

let chargebacks = [
  { id: 'CBK-301', chargebackId: 'CBK-2026-0912', transactionId: 'TXN-90088', chargebackAmount: 12500.00, chargebackDate: '2026-08-04', merchantName: 'Flipkart Logistics', paymentMethod: 'Credit Card', chargebackStatus: 'Done' },
  { id: 'CBK-302', chargebackId: 'CBK-2026-0913', transactionId: 'TXN-90095', chargebackAmount: 4200.00, chargebackDate: '2026-08-05', merchantName: 'Zomato Media India', paymentMethod: 'UPI', chargebackStatus: 'Pending' },
  { id: 'CBK-303', chargebackId: 'CBK-2026-0914', transactionId: 'TXN-90102', chargebackAmount: 89000.00, chargebackDate: '2026-08-05', merchantName: 'MakeMyTrip India', paymentMethod: 'Netbanking', chargebackStatus: 'Failed' }
];

let paymentLinks = [
  { id: 'PLK-101', title: 'Summer Festival Sale Pass', amount: 2500.00, merchant: 'Zomato Media India', status: 'Active', createdOn: '2026-08-01', url: 'https://payvang.com/pay/plk-101' },
  { id: 'PLK-102', title: 'Bulk Order Advance Payment', amount: 150000.00, merchant: 'Reliance Retail Ltd', status: 'Active', createdOn: '2026-08-03', url: 'https://payvang.com/pay/plk-102' }
];

let payouts = [
  { id: 'POUT-401', beneficiary: 'Supplier Vendor Direct', bankAccount: 'HDFC0000123 - 50100998122', amount: 450000.00, status: 'Success', date: '2026-08-05 14:20' },
  { id: 'POUT-402', beneficiary: 'Logistics Partner Payout', bankAccount: 'ICIC0000441 - 001299812', amount: 890000.00, status: 'Processing', date: '2026-08-06 10:05' }
];

let resellers = [
  { id: 'RSL-01', name: 'FinTech Capital Advisory', contact: '+91 99887 76655', merchantsCount: 18, commissionRate: '0.15%', status: 'Active' },
  { id: 'RSL-02', name: 'Nexus Merchant Solutions', contact: '+91 98765 43210', merchantsCount: 12, commissionRate: '0.20%', status: 'Active' }
];

let teams = [
  { id: 'TM-01', name: 'Alex Morgan', email: 'admin@payvang.com', role: 'Super Administrator', status: 'Active', lastLogin: 'Just now' },
  { id: 'TM-02', name: 'Siddharth Rao', email: 'siddharth@payvang.com', role: 'Risk & Fraud Officer', status: 'Active', lastLogin: '2 hours ago' },
  { id: 'TM-03', name: 'Pooja Iyer', email: 'pooja@payvang.com', role: 'Settlement Ops', status: 'Active', lastLogin: 'Yesterday' }
];

let configurations = [
  { id: 'CFG-01', key: 'GATEWAY_3DS_VERSION', value: '2.2.0', group: 'Security', description: 'Enforce 3D Secure 2.2 protocol for card transactions' },
  { id: 'CFG-02', key: 'INSTANT_PAYOUT_LIMIT', value: '₹5,00,000 / txn', group: 'Payout Engine', description: 'Maximum cap for IMPS/UPI instant batch payouts' },
  { id: 'CFG-03', key: 'AUTO_SETTLEMENT_CRON', value: '0 23 * * *', group: 'Settlements', description: 'Nightly batch settlement triggering schedule' },
  { id: 'CFG-04', key: 'DEFAULT_PG_FEE_PERCENT', value: '1.95%', group: 'Billing', description: 'Standard merchant processing fee structure' }
];

let apiMasters = [
  { id: 'API-01', aggregatorCode: 'HDFC_PG_DIRECT', apiName: 'HDFC SmartHub Charge API', baseUrl: 'https://api.hdfcbank.com/v2', endpoint: '/charge', httpMethod: 'POST', type: 'NETBANKING', merchantId: 'HDFC_MCH_88291', secretKey: 'sec_hdfc_9981', clientId: 'cli_hdfc_881', environment: 'PRODUCTION', active: true, headers: { 'Content-Type': 'application/json' } },
  { id: 'API-02', aggregatorCode: 'ICICI_UPI_STACK', apiName: 'ICICI UPI Collect V2', baseUrl: 'https://upi.icicibank.com/v1', endpoint: '/upi/charge', httpMethod: 'POST', type: 'UPI', merchantId: 'ICICI_MCH_44120', secretKey: 'sec_icici_7721', clientId: 'cli_icici_102', environment: 'PRODUCTION', active: true, headers: { 'Content-Type': 'application/json' } }
];

let merchantAggregatorMappings = [
  { id: 'MAP-01', merchantId: 'MCH-1001', aggregatorCode: 'HDFC_PG_DIRECT', environment: 'PRODUCTION', txnType: 'UPI', priority: 1, active: true },
  { id: 'MAP-02', merchantId: 'MCH-1002', aggregatorCode: 'ICICI_UPI_STACK', environment: 'PRODUCTION', txnType: 'UPI', priority: 2, active: true }
];

let feeRules = [
  { ruleId: 'FEE-01', merchantId: 'MCH-1001', txnType: 'UPI', feeType: 'PERCENTAGE', feeValue: 1.8, capMin: 5, capMax: 100, commissionPercent: 0.2, active: true, effectiveFrom: '2026-01-01T00:00:00Z', effectiveTo: '2027-12-31T23:59:59Z' },
  { ruleId: 'FEE-02', merchantId: 'MCH-1002', txnType: 'CREDIT_CARD', feeType: 'PERCENTAGE', feeValue: 2.1, capMin: 10, capMax: 250, commissionPercent: 0.3, active: true, effectiveFrom: '2026-01-01T00:00:00Z', effectiveTo: '2027-12-31T23:59:59Z' }
];

let limitRules = [
  { id: 'LMT-01', merchantId: 'MCH-1001', txnType: 'UPI', perTxnMin: '10', perTxnMax: '200000', dailyLimit: '10000000', monthlyLimit: '250000000', active: true },
  { id: 'LMT-02', merchantId: 'MCH-1002', txnType: 'NETBANKING', perTxnMin: '100', perTxnMax: '500000', dailyLimit: '25000000', monthlyLimit: '500000000', active: true }
];

let wallets = [
  { merchantId: 'MCH-1001', merchantName: 'Reliance Retail Ltd', balance: 24500000.00, currency: 'INR', reservedBalance: 500000.00, lastUpdated: '2026-08-06 12:30' },
  { merchantId: 'MCH-1002', merchantName: 'Flipkart Logistics', balance: 48900000.00, currency: 'INR', reservedBalance: 1200000.00, lastUpdated: '2026-08-06 12:15' },
  { merchantId: 'MCH-1003', merchantName: 'Zomato Media India', balance: 12500000.00, currency: 'INR', reservedBalance: 300000.00, lastUpdated: '2026-08-06 11:45' }
];

let cryptoWallets = [
  { merchantId: 'MCH-1001', coinType: 'USDT', chainType: 'TRC20', walletAddress: 'TY9aB8xQz2LpNm18cVkZ71pW99201aK', balance: 145000.00, fiatValueUSD: 145000.00 },
  { merchantId: 'MCH-1002', coinType: 'BTC', chainType: 'BITCOIN', walletAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', balance: 4.25, fiatValueUSD: 285000.00 }
];

let cryptoConfigs = [
  { id: 'CCFG-01', merchantId: 'MCH-1001', fiatCurrencyCode: 'USD', cryptoEnabled: true, defaultCoin: 'USDT', defaultNetwork: 'TRC20', walletAddress: 'TY9aB8xQz2LpNm18cVkZ71pW99201aK', status: true, testMode: false },
  { id: 'CCFG-02', merchantId: 'MCH-1002', fiatCurrencyCode: 'INR', cryptoEnabled: true, defaultCoin: 'BTC', defaultNetwork: 'BITCOIN', walletAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', status: true, testMode: false }
];

let ipKeys = [
  { id: 'IPK-01', merchantId: 'MCH-1001', ipAddress: '103.21.244.18', systemName: 'Production Primary Server', ipAddressDesc: 'Core web application API caller' },
  { id: 'IPK-02', merchantId: 'MCH-1002', ipAddress: '52.74.99.120', systemName: 'AWS Gateway Ingress', ipAddressDesc: 'Webhook & API egress IP' }
];

let emailMasters = [
  { id: 'EML-01', emailCode: 'PAYMENT_SUCCESS_NOTIF', fromEmail: 'no-reply@payvang.com', subject: 'Payment Successful - Order #{{orderId}}', bodyTemplate: 'Hello {{customerName}}, your payment of ₹{{amount}} was successful.', smtpHost: 'smtp.sendgrid.net', smtpPort: 587, status: 'ACTIVE' },
  { id: 'EML-02', emailCode: 'SETTLEMENT_DISPATCH', fromEmail: 'settlements@payvang.com', subject: 'Daily Settlement Statement - {{createdDate}}', bodyTemplate: 'Your net settlement of ₹{{netSettlement}} has been credited via UTR {{utr}}.', smtpHost: 'smtp.sendgrid.net', smtpPort: 587, status: 'ACTIVE' }
];

let currencies = [
  { id: 'CUR-01', currencyCode: 'INR', symbol: '₹', name: 'Indian Rupee', status: true },
  { id: 'CUR-02', currencyCode: 'USD', symbol: '$', name: 'US Dollar', status: true },
  { id: 'CUR-03', currencyCode: 'EUR', symbol: '€', name: 'Euro', status: true }
];

let currencyMappings = [
  { userId: 'MCH-1001', currencies: ['INR', 'USD'] },
  { userId: 'MCH-1002', currencies: ['INR', 'EUR', 'USD'] }
];

const countries = [
  { countryId: 'AF', countryCode: 'AF', countryName: 'Afghanistan' },
  { countryId: 'AX', countryCode: 'AX', countryName: 'Aland Islands' },
  { countryId: 'AL', countryCode: 'AL', countryName: 'Albania' },
  { countryId: 'DZ', countryCode: 'DZ', countryName: 'Algeria' },
  { countryId: 'IN', countryCode: 'IN', countryName: 'India' },
  { countryId: 'AE', countryCode: 'AE', countryName: 'United Arab Emirates' },
  { countryId: 'GB', countryCode: 'GB', countryName: 'United Kingdom' },
  { countryId: 'US', countryCode: 'US', countryName: 'United States' }
];

let countryMappings = [];

let payoutsList = [
  { payoutSettingsId: 'PSET-01', merchantId: 'MCH-1001', acquirerProfile: 'HDFC_DIRECT', minimumAmount: 100, maximumAmount: 500000, acquirerPriority: 1, status: true },
  { payoutSettingsId: 'PSET-02', merchantId: 'MCH-1002', acquirerProfile: 'ICICI_UPI', minimumAmount: 50, maximumAmount: 1000000, acquirerPriority: 2, status: true }
];

// --- 1. DASHBOARD ANALYTICS ENDPOINTS ---

app.get('/api/stats/dashboard', (req, res) => {
  res.json({
    todayTxnAmount: 4285920,
    todayTxnAmountSparkline: [250000, 480000, 720000, 610000, 890000, 1050000, 1285920],
    todayTxnCount: 14892,
    todayTxnCountSparkline: [1100, 1400, 1800, 2200, 2600, 2792, 3000],
    txnFees: 85718,
    txnFeesSparkline: [5000, 9600, 14400, 12200, 17800, 21000, 25718],
    subAdmins: 8,
    merchantsCount: merchants.length,
    resellersCount: resellers.length,
    subMerchantsCount: 580,
    weeklyPayoutAnalysis: [
      { date: '30 Jul', success: 38.5, refund: 2.1, total: 40.6 },
      { date: '31 Jul', success: 42.1, refund: 3.4, total: 45.5 },
      { date: '01 Aug', success: 39.8, refund: 1.8, total: 41.6 },
      { date: '02 Aug', success: 47.3, refund: 4.2, total: 51.5 },
      { date: '03 Aug', success: 52.0, refund: 3.1, total: 55.1 },
      { date: '04 Aug', success: 48.9, refund: 2.9, total: 51.8 },
      { date: '05 Aug', success: 56.4, refund: 4.8, total: 61.2 },
      { date: '06 Aug', success: 61.2, refund: 3.5, total: 64.7 }
    ],
    totalTxnsDonut: [
      { name: 'Success', value: 34200000, percentage: '79.7%', color: '#7A1F2B' },
      { name: 'Refunded', value: 3200000, percentage: '7.5%', color: '#C99A3D' },
      { name: 'Pending', value: 5500000, percentage: '12.8%', color: '#D97706' }
    ],
    settlementsMini: {
      amountPayable: 28540000,
      successTxns: 12450,
      pendingTxns: 412
    },
    refundsMini: {
      totalCount: 342,
      totalAmount: 3200000,
      data: [
        { day: 'Mon', amount: 450000 },
        { day: 'Tue', amount: 620000 },
        { day: 'Wed', amount: 380000 },
        { day: 'Thu', amount: 710000 },
        { day: 'Fri', amount: 540000 },
        { day: 'Sat', amount: 500000 }
      ]
    },
    pendingOverview: {
      amount: 342100,
      fee: 6842,
      count: 128
    },
    totalWalletPayout: [
      { date: '30 Jul', amount: 18.2, payoutCount: 140 },
      { date: '31 Jul', amount: 22.5, payoutCount: 180 },
      { date: '01 Aug', amount: 19.8, payoutCount: 165 },
      { date: '02 Aug', amount: 26.4, payoutCount: 210 },
      { date: '03 Aug', amount: 31.0, payoutCount: 260 },
      { date: '04 Aug', amount: 28.7, payoutCount: 235 },
      { date: '05 Aug', amount: 34.2, payoutCount: 290 },
      { date: '06 Aug', amount: 38.9, payoutCount: 320 }
    ]
  });
});

app.get('/api/stats/super-admin', (req, res) => {
  res.json({
    payin: { amount: '₹12,45,00,000', sparkline: [12, 18, 25, 32, 45, 58, 72] },
    payout: { amount: '₹9,82,00,000', sparkline: [8, 14, 20, 27, 36, 44, 52] },
    wallet: { amount: '₹2,63,00,000', sparkline: [4, 6, 8, 11, 14, 17, 20] },
    weeklyAnalysis: [
      { day: 'Mon', payin: 2.4, payout: 1.8 },
      { day: 'Tue', payin: 3.2, payout: 2.5 },
      { day: 'Wed', payin: 2.8, payout: 2.2 },
      { day: 'Thu', payin: 4.5, payout: 3.6 },
      { day: 'Fri', payin: 5.2, payout: 4.0 },
      { day: 'Sat', payin: 3.8, payout: 3.0 }
    ],
    profitsDonut: [
      { name: 'Payin Fees Share', value: 55, color: '#7A1F2B' },
      { name: 'Payout Processing', value: 35, color: '#C99A3D' },
      { name: 'Wallet Reserve Fee', value: 10, color: '#16a34a' }
    ],
    profitCenterTotal: '₹18.4 Lakhs',
    monthlyRevenueTrend: [
      { month: 'Jan', revenue: 1.2, growth: 12 },
      { month: 'Feb', revenue: 1.5, growth: 15 },
      { month: 'Mar', revenue: 1.8, growth: 18 },
      { month: 'Apr', revenue: 2.2, growth: 22 },
      { month: 'May', revenue: 2.7, growth: 25 },
      { month: 'Jun', revenue: 3.1, growth: 30 },
      { month: 'Jul', revenue: 3.8, growth: 35 }
    ]
  });
});

// --- 2. FRONTEND /API REST COMPATIBILITY ENDPOINTS ---

app.get('/api/merchants', (req, res) => {
  const q = req.query.q ? req.query.q.toLowerCase() : '';
  let filtered = merchants.filter(m => 
    m.name.toLowerCase().includes(q) || 
    m.username.toLowerCase().includes(q) || 
    m.businessName.toLowerCase().includes(q)
  );
  res.json(filtered);
});

app.post('/api/merchants', (req, res) => {
  const { name, username, businessName, contactNumber, password } = req.body;
  if (!name || !username || !password) {
    return res.status(400).json({ error: 'Name, Username and Password are required.' });
  }
  if (!/[A-Z]/.test(password)) {
    return res.status(400).json({ error: 'Password must contain at least one uppercase letter.' });
  }
  const newM = {
    id: `MCH-${1000 + merchants.length + 1}`,
    name,
    contactNumber: contactNumber || '+91 99999 00000',
    username,
    businessName: businessName || name,
    registrationDate: new Date().toISOString().split('T')[0]
  };
  merchants.unshift(newM);
  res.status(201).json(newM);
});

app.get('/api/acquirers', (req, res) => res.json(acquirers));
app.post('/api/acquirers', (req, res) => {
  const newA = { ...req.body, acquirerId: req.body.acquirerId || `ACQ-${String(acquirers.length + 1).padStart(2, '0')}` };
  acquirers.unshift(newA);
  res.status(201).json(newA);
});

app.get('/api/transactions', (req, res) => {
  const { merchant, currency, status } = req.query;
  let list = transactions.filter(t => {
    if (merchant && merchant !== 'ALL' && t.merchantId !== merchant && t.merchantName !== merchant) return false;
    if (currency && currency !== 'ALL' && t.currency !== currency) return false;
    if (status && status !== 'ALL' && t.status !== status) return false;
    return true;
  });
  const totalCount = list.length;
  const totalAmount = list.reduce((acc, t) => acc + t.txnAmt, 0);
  const successList = list.filter(t => t.status === 'Success');
  const failedList = list.filter(t => t.status === 'Failed');
  const pendingList = list.filter(t => t.status === 'Pending');

  res.json({
    stats: {
      total: { count: totalCount, amount: totalAmount },
      success: { count: successList.length, amount: successList.reduce((acc, t) => acc + t.txnAmt, 0) },
      failed: { count: failedList.length, amount: failedList.reduce((acc, t) => acc + t.txnAmt, 0) },
      pending: { count: pendingList.length, amount: pendingList.reduce((acc, t) => acc + t.txnAmt, 0) }
    },
    items: list
  });
});

app.get('/api/settlements', (req, res) => {
  const { merchant, status } = req.query;
  let list = settlements.filter(s => {
    if (merchant && merchant !== 'ALL' && s.merchantId !== merchant) return false;
    if (status && status !== 'ALL' && s.status !== status) return false;
    return true;
  });
  res.json({
    summary: { count: list.length, totalAmountPayable: list.reduce((a, s) => a + s.amountPayable, 0), totalNetSettlement: list.reduce((a, s) => a + s.netSettlement, 0) },
    items: list
  });
});

app.get('/api/remittances', (req, res) => res.json(remittances));
app.post('/api/remittances', (req, res) => {
  const newR = { id: `REM-${800 + remittances.length + 1}`, ...req.body, payableAmount: parseFloat(req.body.payableAmount) };
  remittances.unshift(newR);
  res.status(201).json(newR);
});

app.get('/api/chargebacks', (req, res) => {
  const { merchant, status } = req.query;
  let list = chargebacks.filter(c => {
    if (merchant && merchant !== 'ALL' && c.merchantName !== merchant) return false;
    if (status && status !== 'ALL' && c.chargebackStatus !== status) return false;
    return true;
  });
  res.json({
    stats: { totalCount: list.length, totalAmount: list.reduce((a, c) => a + c.chargebackAmount, 0), pendingCount: list.filter(c => c.chargebackStatus === 'Pending').length, failedCount: list.filter(c => c.chargebackStatus === 'Failed').length },
    items: list
  });
});

app.get('/api/payment-links', (req, res) => res.json(paymentLinks));
app.post('/api/payment-links', (req, res) => {
  const link = { id: `PLK-${100 + paymentLinks.length + 1}`, ...req.body, status: 'Active', createdOn: new Date().toISOString().split('T')[0], url: `https://payvang.com/pay/plk-${100 + paymentLinks.length + 1}` };
  paymentLinks.unshift(link);
  res.status(201).json(link);
});

app.get('/api/payouts', (req, res) => res.json(payouts));
app.post('/api/payouts', (req, res) => {
  const po = { id: `POUT-${400 + payouts.length + 1}`, ...req.body, status: 'Processing', date: new Date().toISOString().replace('T', ' ').slice(0, 16) };
  payouts.unshift(po);
  res.status(201).json(po);
});

app.get('/api/resellers', (req, res) => res.json(resellers));
app.get('/api/teams', (req, res) => res.json(teams));
app.get('/api/configurations', (req, res) => res.json(configurations));

// --- 3. ZENITH OPENAPI 114 ROUTES ---

function findUser(userId) {
  return users.find((x) => x.userId === userId || x.email === userId || x.userName === userId);
}

function parseFlag(body, fallback) {
  if (typeof body === 'boolean') return body;
  if (body && typeof body === 'object') {
    if (typeof body.status === 'boolean') return body.status;
    if (typeof body.verified === 'boolean') return body.verified;
    if (typeof body.value === 'boolean') return body.value;
  }
  return fallback;
}

function patchUserFlag(userId, field, body) {
  const user = findUser(userId);
  if (!user) return null;
  user[field] = parseFlag(body, !user[field]);
  return user;
}

app.post('/user/merchant', (req, res) => res.json(users[1]));
app.post('/user/merchant/list', (req, res) => res.json(users.filter(u => u.role === 'MERCHANT')));
app.post('/user/merchant/all', (req, res) => res.json(users.filter(u => u.role === 'MERCHANT')));
app.get('/user/merchant/:userId', (req, res) => res.json(findUser(req.params.userId) || users[1]));
app.post('/user/all', (req, res) => res.json(users));
app.post('/user/admin', (req, res) => res.json(users[0]));
app.post('/user/UserCreationViaAdmin', (req, res) => res.json({ status: true, message: 'User created' }));

app.put('/user/verifyUser/:userId', (req, res) => res.json(patchUserFlag(req.params.userId, 'verified', req.body) || { message: 'Verified' }));
app.put('/user/updateDetails', (req, res) => {
  const { userId, ...fields } = req.body || {};
  const user = findUser(userId);
  if (user) Object.assign(user, fields);
  res.json({ message: 'Updated', userId, ...fields });
});
app.put('/user/status/:userId', (req, res) => res.json(patchUserFlag(req.params.userId, 'status', req.body) || { message: 'Status updated' }));
app.put('/user/payoutstatus/:userId', (req, res) => res.json(patchUserFlag(req.params.userId, 'payoutStatus', req.body) || { message: 'Payout status updated' }));
app.put('/user/payoutStatusViaApplication/:userId', (req, res) => res.json(patchUserFlag(req.params.userId, 'payoutStatusViaApplication', req.body) || { message: 'Payout status updated' }));
app.put('/user/payoutGststatus/:userId', (req, res) => res.json(patchUserFlag(req.params.userId, 'payoutGstStatus', req.body) || { message: 'Payout GST status updated' }));
app.put('/user/payoutFeeReturnStatus/:userId', (req, res) => res.json(patchUserFlag(req.params.userId, 'payoutFeeReturnStatus', req.body) || { message: 'Payout fee return updated' }));
app.put('/user/payinstatus/:userId', (req, res) => res.json(patchUserFlag(req.params.userId, 'payinStatus', req.body) || { message: 'Payin status updated' }));
app.put('/user/payinGststatus/:userId', (req, res) => res.json(patchUserFlag(req.params.userId, 'payinGstStatus', req.body) || { message: 'Payin GST status updated' }));
app.put('/user/document/verify/:documentId', (req, res) => res.json({ message: 'Document verified' }));
app.put('/user/document/reject', (req, res) => res.json({ message: 'Document rejected' }));
app.put('/user/authStatus/:userId', (req, res) => res.json(patchUserFlag(req.params.userId, 'authStatus', req.body) || { message: 'Auth status updated' }));
app.put('/user/UpdateMerchantShortCode/:userId/ShortCode/:shortCode', (req, res) => res.json({ message: 'Shortcode updated' }));

app.get('/user/test', (req, res) => res.json({ status: 'Online' }));
app.get('/user/personalDetails/:userId', (req, res) => {
  const user = findUser(req.params.userId) || users[1];
  res.json({
    userId: user.userId,
    fullName: user.fullName,
    email: user.email,
    emailId: user.emailId || user.email,
    contactNumber: user.contactNumber,
    businessName: user.businessName,
    businessType: user.businessType,
    businessSubType: user.businessSubType || user.subIndustry,
    subIndustry: user.subIndustry,
    website: user.website,
    country: user.country,
    city: user.city,
    address: user.address,
    addressDetails: user.addressDetails || user.address,
    gender: user.gender,
    dateOfBirth: user.dateOfBirth || '',
    registrationNo: user.registrationNo || '',
    panSsn: user.panSsn || '',
    gstVat: user.gstVat || '',
    integrationFee: user.integrationFee || '0',
    webTransferFee: user.webTransferFee || '0',
    settlementFee: user.settlementFee || '0',
    minSettlementFee: user.minSettlementFee || '0',
    countries: user.countries || '',
  });
});
app.get('/user/document/:userId', (req, res) => res.json([{ documentId: 'DOC-901', name: 'PAN Card', status: 'VERIFIED' }]));
app.get('/user/document/file/:documentId', (req, res) => res.send('Mock File Binary'));
app.get('/user/accountDetails/:userId', (req, res) => {
  const user = findUser(req.params.userId) || users[1];
  res.json({
    userId: user.userId,
    bankName: user.bankName || '',
    branchName: user.branchName || '',
    accountNumber: user.accountNumber || '',
    ifscCode: user.ifscCode || user.ifsc || '',
    ifsc: user.ifsc || user.ifscCode || '',
    cardNumber: user.cardNumber || '',
    vpa: user.vpa || '',
  });
});
app.get('/user/GetRandomAESKey', (req, res) => res.json({ aesKey: 'AES-256-KEY-9981' }));
app.post('/userActivity', (req, res) => res.json([{ activity: 'LOGIN', timestamp: '2026-08-06 12:00:00' }]));
app.post('/user/resetPassword', (req, res) => res.json({ message: 'Reset email sent' }));
app.post('/user/document', (req, res) => res.json({ message: 'Uploaded' }));

const findAcquirer = (acquirerId) =>
  acquirers.find((a) => String(a.acquirerId) === String(acquirerId));

const upsertAcquirer = (body) => {
  const existing = findAcquirer(body.acquirerId);
  if (!existing) return null;
  Object.assign(existing, body);
  return existing;
};

app.post('/acquirer', (req, res) => {
  const { acquirerCode, fullName } = req.body || {};
  if (!acquirerCode || !fullName) {
    return res.status(400).json({ status: 'fail', message: 'acquirerCode and fullName are required' });
  }
  const created = { ...req.body, acquirerId: req.body.acquirerId || `ACQ-${String(acquirers.length + 1).padStart(2, '0')}` };
  acquirers.unshift(created);
  res.status(201).json(created);
});

app.post('/acquirer/updatePayout', (req, res) => {
  const updated = upsertAcquirer(req.body || {});
  if (!updated) return res.status(404).json({ status: 'fail', message: 'Acquirer not found' });
  res.json(updated);
});

app.post('/acquirer/updatePayin', (req, res) => {
  const updated = upsertAcquirer(req.body || {});
  if (!updated) return res.status(404).json({ status: 'fail', message: 'Acquirer not found' });
  res.json(updated);
});

app.post('/acquirer/status/:type', (req, res) => {
  const type = String(req.params.type || '').toLowerCase();
  if (type === 'payin') return res.json(acquirers.filter((a) => a.payin));
  if (type === 'payout') return res.json(acquirers.filter((a) => a.payout));
  res.json(acquirers);
});

app.post('/acquirer/all', (req, res) => {
  const { start = 0, size = 25, keyword = '' } = req.body || {};
  const query = String(keyword).trim().toLowerCase();
  const filtered = query
    ? acquirers.filter((a) =>
        [a.acquirerCode, a.fullName, a.acquirerPgId, a.acquirerPayoutPgId]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(query))
      )
    : acquirers;
  res.json(filtered.slice(Number(start), Number(start) + Number(size)));
});

app.get('/acquirer/:acquirerId', (req, res) => {
  const found = findAcquirer(req.params.acquirerId);
  if (!found) return res.status(404).json({ status: 'fail', message: 'Acquirer not found' });
  res.json(found);
});

app.delete('/acquirer/:acquirerId', (req, res) => {
  const before = acquirers.length;
  acquirers = acquirers.filter((a) => String(a.acquirerId) !== String(req.params.acquirerId));
  if (acquirers.length === before) return res.status(404).json({ status: 'fail', message: 'Acquirer not found' });
  res.json({ message: 'Deleted' });
});

app.post('/apimasters/saveapi', (req, res) => {
  const created = {
    ...req.body,
    id: req.body.id || `API-${String(apiMasters.length + 1).padStart(2, '0')}`,
    createdAt: new Date().toISOString(),
  };
  apiMasters.unshift(created);
  res.status(201).json(created);
});

app.post('/apimasters/updateapi', (req, res) => {
  const index = apiMasters.findIndex((item) => String(item.id) === String(req.body.id));
  if (index < 0) return res.status(404).json({ status: 'fail', message: 'API master not found' });
  apiMasters[index] = { ...apiMasters[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json(apiMasters[index]);
});

app.get('/apimasters/GetAllApi', (req, res) => res.json(apiMasters));
app.get('/apimasters/GetApiByid/:id', (req, res) => {
  const found = apiMasters.find((item) => String(item.id) === String(req.params.id));
  if (!found) return res.status(404).json({ status: 'fail', message: 'API master not found' });
  res.json(found);
});
app.get('/apimasters/GetAcquirerCodes', (req, res) => res.json(acquirers.map(a => a.acquirerCode)));

app.post('/apimasters/savemerchantAggregatormapping', (req, res) => res.json(merchantAggregatorMappings[0]));
app.post('/apimasters/updatemerchantAggregatormapping', (req, res) => res.json({ message: 'Updated' }));
app.get('/apimasters/GetMerchantAggregatorMapping/:merchantId', (req, res) => res.json(merchantAggregatorMappings));

app.post('/FeeLimitRule/AddMerchantFeeRule', (req, res) => res.json(feeRules[0]));
app.post('/FeeLimitRule/UpdateMerchantFeeRule', (req, res) => res.json({ message: 'Updated' }));
app.post('/FeeLimitRule/GetAllFeeRules', (req, res) => res.json(feeRules));
app.get('/FeeLimitRule/GetMerchantFeeRule/:merchantId', (req, res) => res.json(feeRules));
app.get('/FeeLimitRule/FeeRuleByMerchantAndTxnType', (req, res) => res.json(feeRules[0]));

app.post('/FeeLimitRule/AddMerchantLimitRule', (req, res) => res.json(limitRules[0]));
app.post('/FeeLimitRule/UpdateMerchantLimitRule', (req, res) => res.json({ message: 'Updated' }));
app.post('/FeeLimitRule/GetLimitRules', (req, res) => res.json(limitRules));
app.get('/FeeLimitRule/GetMerchantlimitRule/:merchantId', (req, res) => res.json(limitRules));
app.get('/FeeLimitRule/LimitRuleByMerchantAndTxnType', (req, res) => res.json(limitRules[0]));
app.post('/FeeLimitRule/checkTxnFee', (req, res) => res.json({ feeAmount: 18.50, netAmount: 981.50 }));

app.post('/transaction', (req, res) => res.json({ content: transactions, totalElements: transactions.length }));
app.post('/transaction/getPayinTxndetails', (req, res) => res.json(transactions));
app.post('/transaction/getPayinCryptoTxndetails', (req, res) => res.json([]));
app.post('/transaction/generateReport', (req, res) => res.json({ reportUrl: 'https://payvang.com/reports/txn_2026.pdf' }));

app.post('/payins/createOrder', (req, res) => res.json({ orderId: `ORD-${Date.now()}`, paymentUrl: `https://payvang.com/checkout/${Date.now()}` }));

app.post('/payins/createCryptoOrder', (req, res) => {
  const { merchantappid, merchanthash, merchantsecretid, mysecretdev } = req.headers;
  const body = req.body || {};
  const orderId = body.orderId || body.externalOrderId || `ORD${Date.now().toString().slice(-10)}`;
  const fiatAmount = body.fiatAmount || "100";
  const coinType = body.coinType || "USDT";
  const emailId = body.emailId || "johndoe@gmail.com";

  console.log('[Kubergates API] Received Headers:', { merchantappid, merchanthash, merchantsecretid, mysecretdev });

  return res.json({
    data: {
      orderId: orderId,
      amount: fiatAmount,
      cryptoOrderId: `cmmn${Math.random().toString(36).substring(2, 12)}`,
      coinType: coinType,
      emailId: emailId,
      paymentlink: `https://betaonramp.kubercrypto.io/pay/${Buffer.from(orderId).toString('base64')}`,
      linkexpirytime: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      statusCode: "201",
      receivedHash: merchanthash || null,
    },
    message: "Order Data",
    status: "success"
  });
});

app.post('/payins/OrderStatus', (req, res) => {
  const { merchantappid, merchanthash } = req.headers;
  const { orderId } = req.body || {};
  
  return res.json({
    data: {
      cryptoOrderId: `cmn3g8s940014hwp90a10hj2n`,
      orderId: orderId || "ORD0717169805",
      cryptoAmount: "20.69",
      merchantCharges: "1.09",
      status: "SUCCESS",
      token: "USDT",
      network: "ethereum",
      verifiedHash: merchanthash || null
    },
    message: "Verify Order",
    status: "success"
  });
});

app.post('/payins/orderStatus', (req, res) => res.json({ status: 'SUCCESS' }));
app.post('/payins/CheckOrderStatus', (req, res) => res.json({ status: 'SUCCESS' }));
app.get('/payins/TestPayin', (req, res) => res.json({ status: 'Online' }));


app.post('/payout/settings', (req, res) => res.json(payoutsList[0]));
app.get('/payout/settings/:userId', (req, res) => {
  res.json(payoutsList.find((p) => p.merchantId === req.params.userId) || payoutsList[0]);
});

app.post('/payout/ipWhiteList', (req, res) => res.json(ipKeys[0]));
app.delete('/payout/ipWhiteList', (req, res) => res.json({ message: 'IP Removed' }));
app.get('/payout/ipWhiteList/:userId', (req, res) => res.json(ipKeys));

app.post('/CryptoConfig/SaveCryptoConfig', (req, res) => res.json(cryptoConfigs[0]));
app.post('/CryptoConfig/updateCryptoConfig', (req, res) => res.json({ message: 'Updated' }));
app.post('/CryptoConfig/SaveCryptoKeys', (req, res) => res.json({ message: 'Saved' }));
app.get('/CryptoConfig/ListCryptoConfig', (req, res) => res.json(cryptoConfigs));
app.get('/CryptoConfig/MerchantCryptoConfig/:merchantId', (req, res) => res.json(cryptoConfigs[0]));
app.get('/CryptoConfig/GetCryptoKeys/:merchantId', (req, res) => res.json({ apiKey: 'CRYPTO-KEY-9981' }));
app.get('/CryptoConfig/ActiveMerchantCryptoConfig/:merchantId', (req, res) => res.json(cryptoConfigs[0]));

app.get('/wallet/walletList', (req, res) => res.json(wallets));
app.get('/wallet/getWalletByMerchantId/:merchantId', (req, res) => {
  res.json(wallets.find((w) => w.merchantId === req.params.merchantId) || wallets[0]);
});
app.get('/wallet/cryptoWalletList', (req, res) => res.json(cryptoWallets));
app.get('/wallet/getCryptoWalletByMerchantId/:merchantId', (req, res) => res.json(cryptoWallets[0]));
app.post('/wallet/savewallet', (req, res) => res.json({ message: 'Saved' }));
app.post('/wallet/creditwallet', (req, res) => res.json({ message: 'Credited' }));

app.post('/currency', (req, res) => res.json(currencies[0]));
app.put('/currency', (req, res) => res.json({ message: 'Updated' }));
app.delete('/currency/:currencyId', (req, res) => res.json({ message: 'Deleted' }));
app.post('/currency/mapping', (req, res) => res.json({ message: 'Mapped' }));
app.get('/currency/mapping/:merchantId', (req, res) => res.json(currencyMappings[0]));
app.delete('/currency/mapping/:merchantId/:currencyId', (req, res) => res.json({ message: 'Removed' }));
app.post('/currency/all', (req, res) => res.json(currencies));

app.post('/country/all', (req, res) => {
  const keyword = String(req.body?.keyword || '').trim().toLowerCase();
  const list = keyword
    ? countries.filter((country) =>
        `${country.countryName} ${country.countryCode}`.toLowerCase().includes(keyword)
      )
    : countries;
  res.json({ data: list, totalElement: list.length });
});
app.post('/country/mapping', (req, res) => {
  const userId = String(req.body?.userId || '');
  const mapped = Array.isArray(req.body?.countries) ? req.body.countries : [];
  const existing = countryMappings.find((item) => item.userId === userId);
  if (existing) existing.countries = mapped;
  else countryMappings.push({ userId, countries: mapped });
  const user = findUser(userId);
  if (user) user.countries = mapped.join(',');
  res.json({ message: 'Mapped' });
});
app.get('/country/mapping/:merchantId', (req, res) => {
  const userId = decodeURIComponent(req.params.merchantId);
  const mapping = countryMappings.find((item) => String(item.userId) === userId);
  res.json(mapping || { userId, countries: [] });
});
app.delete('/country/mapping/:merchantId/:countryId', (req, res) => {
  const userId = decodeURIComponent(req.params.merchantId);
  const countryId = decodeURIComponent(req.params.countryId);
  const mapping = countryMappings.find((item) => String(item.userId) === userId);
  if (mapping) {
    mapping.countries = (mapping.countries || []).filter((item) => {
      const id = typeof item === 'object' ? item.countryId || item.countryCode : item;
      return String(id) !== countryId;
    });
  }
  const user = findUser(userId);
  if (user && mapping) user.countries = (mapping.countries || []).join(',');
  res.json({ message: 'Removed' });
});

app.post('/admin/keys/createIPKey', (req, res) => res.json(ipKeys[0]));
app.post('/admin/keys/ListAllKeys', (req, res) => res.json(ipKeys));
app.get('/admin/keys/GetIpKeyList', (req, res) => res.json(ipKeys));
app.get('/admin/keys/GetIpKeyList/:merchantId', (req, res) => res.json(ipKeys));
app.get('/admin/keys/TestIPKey', (req, res) => res.json({ status: 'Online' }));

app.post('/SaveEmailMaster', (req, res) => res.json(emailMasters[0]));
app.post('/UpdateEmailMaster', (req, res) => res.json({ message: 'Updated' }));
app.post('/GetEmailMasterList', (req, res) => res.json(emailMasters));
app.post('/send-email', (req, res) => res.json({ status: 'SUCCESS' }));

app.get('/api/v1/metrics/hits/total', (req, res) => res.json({ totalHits: 4892010, uptimePercentage: '99.99%' }));
app.get('/api/v1/metrics/hits/url', (req, res) => res.json([
  { url: '/payins/createOrder', hits: 245000 },
  { url: '/transaction', hits: 189000 },
  { url: '/payout/settings', hits: 45000 }
]));
app.get('/api/v1/metrics/hits/status', (req, res) => res.json({ '200': 480000, '400': 8200, '500': 1010 }));

app.post('/GetTestToken', (req, res) => res.json({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', tokenType: 'Bearer' }));
app.post('/generate-token', (req, res) => res.json({ token: 'pvk_live_token_88291029381' }));
app.post('/logoutuser', (req, res) => res.json({ message: 'User logged out' }));
const VALID_RSA_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArWwKya5zEf5FgTPIYzRA\n5GdO0yrTjWDqfP7vlwUcwjMdGSY/8L2NQ35hRvXCji7T0QpANJ6+Tvk8zKPtuUi3\ntzNzIh5zzd/56zd85HL36GVOyB7v9i2xDxbgM7/pJfRepxP99sCG6dDYE/Q5Uk53\ntUOnSh7kb5HglYArqx36JJ4HyqhtKHNXYl6y3tT2Sv8uhOF4Ys3IDa4sD7OhyScw\nchSRThlA2GEoCNS9psLuF9wMdh6tixfcvzKC0jVqRhsHlyn/bcUUEcnvV5u2aKy4\ntPXXifiijPbO9AfKgx4f7hdIlCdMY+i9r+uBk6dTXfzbmOPst9J3w21sLv+HY3ta\naQIDAQAB\n-----END PUBLIC KEY-----`;

app.get('/apiauth/publicKey', (req, res) => res.json({ publicKey: VALID_RSA_PUBLIC_KEY }));

app.get('/TestUrl', (req, res) => res.json({ status: 'Zenith API Gateway Online' }));

// WEBHOOKS
app.post('/payinwebhook/sbiwebhook', (req, res) => res.json({ status: 'OK' }));
app.post('/payinwebhook/juspayinWebhook', (req, res) => res.json({ status: 'OK' }));
app.post('/payinwebhook/hdfcpayinwebhook', (req, res) => res.json({ status: 'OK' }));
app.post('/payinwebhook/geideaWebhook', (req, res) => res.json({ status: 'OK' }));
app.post('/payinwebhook/cryptoWebhook', (req, res) => res.json({ status: 'OK' }));
app.get('/payinwebhook/geideaReturn', (req, res) => res.send('Verified'));
app.get('/payinwebhook/afsReturn', (req, res) => res.send('Verified'));

// CHECKOUT PARAMS — proxy live API (forwards success + expired/fail as-is)
const checkoutParamsHandler = async (req, res) => {
  const { orderId } = req.params;
  const apiKey = process.env.API_KEY || process.env.ZIPAPIKEY || process.env.VITE_API_KEY || '';
  try {
    const remoteRes = await fetch(
      `https://api.courseraeducation.com/checkout/params/${encodeURIComponent(orderId)}`,
      {
        headers: {
          ...(apiKey
            ? {
                ZIPAPIKEY: apiKey,
                'X-API-Key': apiKey,
              }
            : {}),
          // Forward client key if browser already sent one
          ...(req.headers.zipapikey ? { ZIPAPIKEY: req.headers.zipapikey } : {}),
          ...(req.headers['x-api-key'] ? { 'X-API-Key': req.headers['x-api-key'] } : {}),
        },
      }
    );
    const data = await remoteRes.json();
    return res.status(remoteRes.status).json(data);
  } catch (e) {
    console.error('Remote checkout params fetch failed:', e.message);
    return res.status(502).json({
      status: 'fail',
      source: 'Payout-service',
      message: 'Unable to load payment',
    });
  }
};
app.get('/checkout/params/:orderId', checkoutParamsHandler);
app.get('/api/checkout/params/:orderId', checkoutParamsHandler);

app.listen(PORT, () => {
  console.log(`[PayVang API Server] running on http://localhost:${PORT}`);
});

// Optional auto-redirect port 3002 requests to port 3000
try {
  const redirectServer = http.createServer((req, res) => {
    res.writeHead(302, { Location: `http://localhost:3000${req.url}` });
    res.end();
  });
  redirectServer.on('error', (err) => {
    console.log('[Redirect Server] Optional port 3002 listener skipped:', err.message);
  });
  redirectServer.listen(3002, () => {
    console.log('[Redirect Server] Forwarding http://localhost:3002 -> http://localhost:3000');
  });
} catch (e) {}


