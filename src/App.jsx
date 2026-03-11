// COMPLETE WHEELTRACKER DESKTOP - ALL ACTIONS + STOCK MANAGEMENT
// Replace your entire src/App.jsx with this file

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Home, List, Plus, Briefcase, BarChart3, LogOut, RefreshCw, Edit2, X, Shield, DollarSign, Repeat, AlertCircle, Settings } from 'lucide-react';
import { BarChart, Bar, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const FINNHUB_API_KEY = 'd6mn0b1r01qir35hndo0d6mn0b1r01qir35hndog';
const COLORS = ['#00d4aa', '#3b82f6', '#f59e0b', '#ef4444'];

const supabaseUrl = 'https://zrstqrerxpythrzsoqbb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpyc3RxcmVyeHB5dGhyenNvcWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNzMzNjcsImV4cCI6MjA4NTg0OTM2N30.AglivjSMAd9ropC0V_3BzxxnrwaiARP7jxcxbDLRE1A';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function WheelTrackerDesktop() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0e14' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <AuthPage />;
  return <DesktopApp user={user} />;
}

function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setMessage('Password reset email sent! Check your inbox.');
        setEmail('');
      } else if (isSignUp) {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          }
        });
        if (error) throw error;
        setMessage('✅ Check your email to verify your account!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0e14' }}>
      <div className="data-card p-8 w-full max-w-md rounded-lg">
        <h1 className="text-white text-2xl font-semibold mb-2">
          {isForgotPassword ? 'Reset Password' : 'WheelTracker Desktop'}
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          {isForgotPassword ? 'Enter your email to reset password' : 'Professional Trading Platform'}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded text-sm">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="info-label block mb-2">EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/20 border border-gray-700 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-gray-600"
              required
            />
          </div>

          {!isForgotPassword && (
            <div>
              <label className="info-label block mb-2">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/20 border border-gray-700 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-gray-600"
                required
                minLength={6}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 rounded transition disabled:opacity-50"
          >
            {loading ? 'Please wait...' : (
              isForgotPassword ? 'Send Reset Link' :
              isSignUp ? 'Sign Up' : 'Sign In'
            )}
          </button>
        </form>

        {!isForgotPassword && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setIsForgotPassword(true)}
              className="text-gray-400 hover:text-gray-300 text-sm"
            >
              Forgot Password?
            </button>
          </div>
        )}

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              if (isForgotPassword) {
                setIsForgotPassword(false);
                setError(null);
                setMessage(null);
              } else {
                setIsSignUp(!isSignUp);
                setError(null);
                setMessage(null);
              }
            }}
            className="text-gray-400 hover:text-gray-300 text-sm"
          >
            {isForgotPassword ? '← Back to Sign In' :
             isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}

// HELPER FUNCTIONS FOR LIVE PRICE DATA
async function fetchStockPrice(ticker) {
  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${FINNHUB_API_KEY}`
    );
    const data = await response.json();
    return data.c && data.c > 0 ? data.c : null;
  } catch (error) {
    console.error(`Error fetching ${ticker}:`, error);
    return null;
  }
}

async function fetchOptionData(ticker, strike, expiry, type) {
  try {
    const expiryDate = new Date(expiry);
    const expiryTimestamp = Math.floor(expiryDate.getTime() / 1000);
    
    const response = await fetch(
      `https://query2.finance.yahoo.com/v7/finance/options/${ticker}?date=${expiryTimestamp}`
    );
    const data = await response.json();
    
    if (!data.optionChain?.result?.[0]) return null;
    
    const chain = data.optionChain.result[0];
    const options = type === 'Call' ? chain.options[0]?.calls : chain.options[0]?.puts;
    
    if (!options) return null;
    
    const option = options.find(opt => 
      Math.abs(opt.strike - parseFloat(strike)) < 0.01
    );
    
    if (!option) return null;
    
    return {
      lastPrice: option.lastPrice || 0,
      bid: option.bid || 0,
      ask: option.ask || 0,
      volume: option.volume || 0,
      openInterest: option.openInterest || 0,
      impliedVolatility: option.impliedVolatility || 0,
      delta: option.delta || null,
      gamma: option.gamma || null,
      theta: option.theta || null,
      vega: option.vega || null,
      inTheMoney: option.inTheMoney || false
    };
  } catch (error) {
    console.error(`Error fetching option data for ${ticker}:`, error);
    return null;
  }
}

async function updateStockPrices(stocks, userId) {
  const updates = [];
  
  for (const stock of stocks) {
    const price = await fetchStockPrice(stock.ticker);
    
    if (price) {
      updates.push({
        id: stock.id,
        current_price: price,
        last_updated: new Date().toISOString()
      });
    }
    
    await new Promise(resolve => setTimeout(resolve, 1100));
  }
  
  for (const update of updates) {
    try {
      await supabase
        .from('stocks')
        .update({ 
          current_price: update.current_price,
          last_updated: update.last_updated
        })
        .eq('id', update.id)
        .eq('user_id', userId);
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  }
  
  return updates.length;
}

async function updateOptionPrices(contracts, userId) {
  const updates = [];
  
  for (const contract of contracts.filter(c => c.status === 'Open')) {
    const optionData = await fetchOptionData(
      contract.symbol,
      contract.strike,
      contract.expiry,
      contract.type
    );
    
    if (optionData) {
      const currentPrice = optionData.lastPrice || ((optionData.bid + optionData.ask) / 2);
      const originalPremium = parseFloat(contract.premium) || 0;
      const numContracts = parseFloat(contract.num_contracts) || 1;
      
      const soldFor = originalPremium * 100 * numContracts;
      const currentValue = currentPrice * 100 * numContracts;
      const unrealizedPL = soldFor - currentValue;
      
      updates.push({
        id: contract.id,
        current_price: currentPrice,
        unrealized_pl: unrealizedPL,
        implied_volatility: optionData.impliedVolatility,
        delta: optionData.delta,
        gamma: optionData.gamma,
        theta: optionData.theta,
        vega: optionData.vega,
        last_updated: new Date().toISOString()
      });
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  for (const update of updates) {
    try {
      await supabase
        .from('contracts')
        .update(update)
        .eq('id', update.id)
        .eq('user_id', userId);
    } catch (error) {
      console.error('Error updating contract:', error);
    }
  }
  
  return updates.length;
}

function DesktopApp({ user }) {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [contracts, setContracts] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchContracts();
    fetchStocks();
  }, []);

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setContracts(data || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStocks = async () => {
    try {
      const { data, error } = await supabase
        .from('stocks')
        .select('*')
        .eq('user_id', user.id)
        .order('ticker', { ascending: true });
      if (error) throw error;
      setStocks(data || []);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex h-screen">
      <div className="sidebar w-64 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-white text-xl font-semibold">WheelTracker</h1>
          <p className="text-gray-500 text-xs mt-1">Desktop Platform</p>
        </div>

        <nav className="flex-1 py-4">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className={`nav-item w-full flex items-center gap-3 px-6 py-3 ${currentPage === 'dashboard' ? 'active' : ''}`}
          >
            <Home size={20} />
            <span className="text-sm font-medium">Dashboard</span>
          </button>
          <button
            onClick={() => setCurrentPage('options')}
            className={`nav-item w-full flex items-center gap-3 px-6 py-3 ${currentPage === 'options' ? 'active' : ''}`}
          >
            <List size={20} />
            <span className="text-sm font-medium">Options</span>
          </button>
          <button
            onClick={() => setCurrentPage('holdings')}
            className={`nav-item w-full flex items-center gap-3 px-6 py-3 ${currentPage === 'holdings' ? 'active' : ''}`}
          >
            <Briefcase size={20} />
            <span className="text-sm font-medium">Holdings</span>
          </button>
          <button
            onClick={() => setCurrentPage('analytics')}
            className={`nav-item w-full flex items-center gap-3 px-6 py-3 ${currentPage === 'analytics' ? 'active' : ''}`}
          >
            <BarChart3 size={20} />
            <span className="text-sm font-medium">Analytics</span>
          </button>
          <button
            onClick={() => setCurrentPage('add')}
            className={`nav-item w-full flex items-center gap-3 px-6 py-3 ${currentPage === 'add' ? 'active' : ''}`}
          >
            <Plus size={20} />
            <span className="text-sm font-medium">Add Trade</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800 flex items-center justify-between">
          <div className="text-white text-sm font-medium truncate">{user.email}</div>
          <button onClick={handleSignOut} className="text-gray-400 hover:text-gray-300">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="top-nav px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-white text-lg font-semibold">
              {currentPage === 'dashboard' && 'Portfolio Overview'}
              {currentPage === 'options' && 'Options Contracts'}
              {currentPage === 'holdings' && 'Stock Holdings'}
              {currentPage === 'analytics' && 'Performance Analytics'}
              {currentPage === 'add' && 'Add New Trade'}
            </h2>
          </div>
          <button
            onClick={() => { fetchContracts(); fetchStocks(); }}
            className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition"
          >
            <RefreshCw size={16} className={`inline mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {currentPage === 'dashboard' && <DashboardPage contracts={contracts} stocks={stocks} />}
          {currentPage === 'options' && <OptionsPage contracts={contracts} onRefresh={fetchContracts} userId={user.id} />}
          {currentPage === 'holdings' && <HoldingsPage stocks={stocks} onRefresh={fetchStocks} onContractsRefresh={fetchContracts} userId={user.id} />}
          {currentPage === 'analytics' && <AnalyticsPage contracts={contracts} stocks={stocks} />}
          {currentPage === 'add' && <AddTradePage onSuccess={() => { fetchContracts(); fetchStocks(); }} userId={user.id} />}
        </div>
      </div>
    </div>
  );
}

function DashboardPage({ contracts, stocks }) {
  const totalPremiums = contracts.reduce((sum, c) => {
    if (c.is_hedge) return sum;
    const premiumToUse = c.net_premium !== null && c.net_premium !== undefined ? c.net_premium : parseFloat(c.premium) || 0;
    const numContracts = parseFloat(c.num_contracts) || 1;
    const totalPremium = premiumToUse * 100 * numContracts;
    const openFee = parseFloat(c.open_fee) || 0;
    return sum + (totalPremium - openFee);
  }, 0);

  const closedContracts = contracts.filter(c => c.status === 'Closed' && !c.is_hedge);
  const openContracts = contracts.filter(c => c.status === 'Open' && !c.is_hedge);
  const realizedProfit = closedContracts.reduce((sum, c) => sum + (parseFloat(c.profit) || 0), 0);
  const stockValue = stocks.reduce((sum, s) => sum + (s.shares * (s.current_price || s.avg_buy_price)), 0);
  const stockCostBasis = stocks.reduce((sum, s) => sum + (s.shares * s.avg_buy_price), 0);
  const stockUnrealizedPL = stockValue - stockCostBasis;
  const totalGain = realizedProfit + stockUnrealizedPL;
  const totalROI = stockCostBasis > 0 ? ((totalGain / stockCostBasis) * 100).toFixed(2) : 0;
  const winRate = closedContracts.length > 0 ? ((closedContracts.filter(c => parseFloat(c.profit) > 0).length / closedContracts.length) * 100).toFixed(1) : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="data-card rounded-lg p-5">
          <div className="info-label mb-2">TOTAL PORTFOLIO VALUE</div>
          <div className="text-white text-3xl font-semibold data-value mb-1">${(stockValue + totalPremiums).toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
          <div className="flex items-center gap-2 text-sm">
            <span className="gain">+${totalGain.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            <span className="neutral">•</span>
            <span className="gain">+{totalROI}%</span>
          </div>
        </div>

        <div className="data-card rounded-lg p-5">
          <div className="info-label mb-2">NET PREMIUM INCOME</div>
          <div className="text-white text-3xl font-semibold data-value mb-1">${totalPremiums.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
          <div className="text-sm neutral">{contracts.filter(c => !c.is_hedge).length} total contracts</div>
        </div>

        <div className="data-card rounded-lg p-5">
          <div className="info-label mb-2">WIN RATE</div>
          <div className="text-white text-3xl font-semibold data-value mb-1">{winRate}%</div>
          <div className="text-sm neutral">{closedContracts.filter(c => parseFloat(c.profit) > 0).length} / {closedContracts.length} trades</div>
        </div>

        <div className="data-card rounded-lg p-5">
          <div className="info-label mb-2">OPEN POSITIONS</div>
          <div className="text-white text-3xl font-semibold data-value mb-1">{openContracts.length}</div>
          <div className="text-sm neutral">{openContracts.filter(c => c.type === 'Put').length} Puts • {openContracts.filter(c => c.type === 'Call').length} Calls</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="data-card rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
              <div className="info-label">OPEN POSITIONS</div>
              <div className="text-gray-500 text-xs">{openContracts.length} positions</div>
            </div>

            {openContracts.length === 0 ? (
              <div className="px-5 py-12 text-center text-gray-500 text-sm">No open positions</div>
            ) : (
              <>
                <div className="grid grid-cols-12 gap-4 px-5 py-3 text-xs neutral border-b border-gray-800" style={{ background: 'rgba(0,0,0,0.2)' }}>
                  <div className="col-span-2">SYMBOL</div>
                  <div className="col-span-1">TYPE</div>
                  <div className="col-span-2">STRIKE</div>
                  <div className="col-span-2">EXPIRY</div>
                  <div className="col-span-1 text-center">QTY</div>
                  <div className="col-span-2 text-right">PREMIUM</div>
                  <div className="col-span-2 text-right">NET P&L</div>
                </div>

                {openContracts.slice(0, 5).map((contract) => {
                  const premiumPerShare = contract.net_premium !== null && contract.net_premium !== undefined 
                    ? contract.net_premium 
                    : parseFloat(contract.premium) || 0;
                  const numContracts = parseFloat(contract.num_contracts) || 1;
                  const totalPremium = premiumPerShare * 100 * numContracts;
                  const netPL = totalPremium - (parseFloat(contract.open_fee) || 0);
                  const isHedged = contract.hedge_strike !== null && contract.hedge_strike !== undefined;

                  return (
                    <div key={contract.id} className="data-row grid grid-cols-12 gap-4 px-5 py-4 items-center">
                      <div className="col-span-2">
                        <div className="text-white font-medium">{contract.symbol}</div>
                        {isHedged && (
                          <div className="flex items-center gap-1 text-xs text-blue-400 mt-1">
                            <Shield size={10} />
                            <span>{contract.strike}/{contract.hedge_strike} Spread</span>
                          </div>
                        )}
                      </div>
                      <div className="col-span-1">
                        <span className={`text-xs px-2 py-1 rounded ${contract.type === 'Put' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                          {contract.type.toUpperCase()}
                        </span>
                      </div>
                      <div className="col-span-2 neutral">${contract.strike}</div>
                      <div className="col-span-2 neutral text-sm">{new Date(contract.expiry).toLocaleDateString()}</div>
                      <div className="col-span-1 text-center neutral">{contract.num_contracts}</div>
                      <div className="col-span-2 text-right neutral">${totalPremium.toFixed(2)}</div>
                      <div className="col-span-2 text-right gain font-medium">+${netPL.toFixed(2)}</div>
                    </div>
                  );
                })}

                {openContracts.length > 5 && (
                  <div className="px-5 py-3 border-t border-gray-800" style={{ background: 'rgba(0,0,0,0.2)' }}>
                    <button className="text-xs text-gray-500 hover:text-gray-400 w-full text-center">
                      View All {openContracts.length} Positions →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="data-card rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800">
              <div className="info-label">STOCK HOLDINGS</div>
            </div>

            {stocks.length === 0 ? (
              <div className="px-5 py-8 text-center text-gray-500 text-sm">No holdings</div>
            ) : (
              <>
                <div className="divide-y divide-gray-800">
                  {stocks.map((stock) => {
                    const currentValue = stock.shares * (stock.current_price || stock.avg_buy_price);
                    const costBasis = stock.shares * stock.avg_buy_price;
                    const unrealizedPL = currentValue - costBasis;
                    const plPercent = ((unrealizedPL / costBasis) * 100).toFixed(1);

                    return (
                      <div key={stock.id} className="px-5 py-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-white font-medium">{stock.ticker}</div>
                          <div className="text-white font-medium data-value">${currentValue.toFixed(0)}</div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="neutral">{stock.shares} shares @ ${stock.avg_buy_price}</span>
                          <span className={unrealizedPL >= 0 ? 'gain' : 'loss'}>
                            {unrealizedPL >= 0 ? '+' : ''}${unrealizedPL.toFixed(0)} ({plPercent}%)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="px-5 py-3 border-t border-gray-800" style={{ background: 'rgba(0,0,0,0.2)' }}>
                  <div className="flex justify-between items-center text-sm">
                    <span className="neutral">Total Value</span>
                    <span className="text-white font-medium data-value">${stockValue.toFixed(0)}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="data-card rounded-lg p-5">
            <div className="info-label mb-4">PERFORMANCE BREAKDOWN</div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="neutral">Premium Income</span>
                <span className="text-white font-medium data-value">${totalPremiums.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="neutral">Options Realized</span>
                <span className="gain font-medium data-value">+${realizedProfit.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="neutral">Stock Unrealized</span>
                <span className={`font-medium data-value ${stockUnrealizedPL >= 0 ? 'gain' : 'loss'}`}>
                  {stockUnrealizedPL >= 0 ? '+' : ''}${stockUnrealizedPL.toFixed(0)}
                </span>
              </div>
              <div className="separator my-2"></div>
              <div className="flex justify-between items-center">
                <span className="text-white font-medium">Total P/L</span>
                <span className="gain font-semibold text-base data-value">+${totalGain.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// STOCK MANAGEMENT MODALS

// Main Stock Management Modal - Choose Action
function StockManageModal({ stock, onClose, onSuccess, onContractsSuccess, userId }) {
  const [action, setAction] = useState(null);

  if (action === 'close') {
    return <CloseStockModal stock={stock} onClose={onClose} onSuccess={onSuccess} />;
  }

  if (action === 'options') {
    return <StockOptionsModal stock={stock} onClose={onClose} onSuccess={onContractsSuccess} userId={userId} />;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="data-card rounded-lg p-6 w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white text-lg font-semibold">Manage Stock</h3>
            <p className="text-gray-500 text-sm mt-1">{stock.ticker} - {stock.shares} shares</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setAction('close')}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg p-4 text-left transition"
          >
            <div className="font-semibold">Close Position</div>
            <div className="text-sm text-gray-400 mt-1">Sell shares and calculate profit</div>
          </button>

          <button
            onClick={() => setAction('options')}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg p-4 text-left transition"
          >
            <div className="font-semibold">Options Strategy</div>
            <div className="text-sm text-gray-400 mt-1">Sell calls or buy protective puts</div>
          </button>
        </div>
      </div>
    </div>
  );
}

// Close Stock Position Modal
function CloseStockModal({ stock, onClose, onSuccess }) {
  const [sellDate, setSellDate] = useState(new Date().toISOString().split('T')[0]);
  const [sellPrice, setSellPrice] = useState('');
  const [sellFee, setSellFee] = useState('0');
  const [submitting, setSubmitting] = useState(false);

  const costBasis = stock.shares * stock.avg_buy_price;
  const buyFee = parseFloat(stock.buy_fee) || 0;
  const sellPriceNum = parseFloat(sellPrice) || 0;
  const sellFeeNum = parseFloat(sellFee) || 0;
  const totalProceeds = stock.shares * sellPriceNum;
  const profit = totalProceeds - costBasis - buyFee - sellFeeNum;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Delete the stock (close position)
      const { error } = await supabase
        .from('stocks')
        .delete()
        .eq('id', stock.id);

      if (error) throw error;
      
      alert(`✅ Position closed! Profit: ${profit >= 0 ? '+' : ''}$${profit.toFixed(2)}`);
      onSuccess();
      onClose();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="data-card rounded-lg p-6 w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white text-lg font-semibold">Close Stock Position</h3>
            <p className="text-gray-500 text-sm mt-1">{stock.ticker} - {stock.shares} shares</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="info-label block mb-2">SELL DATE *</label>
            <input
              type="date"
              value={sellDate}
              onChange={(e) => setSellDate(e.target.value)}
              className="w-full bg-black/20 border border-gray-700 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-gray-600"
              required
            />
          </div>

          <div>
            <label className="info-label block mb-2">SELL PRICE (per share) *</label>
            <input
              type="number"
              step="0.01"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
              className="w-full bg-black/20 border border-gray-700 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-gray-600"
              placeholder={stock.current_price || stock.avg_buy_price}
              required
            />
          </div>

          <div>
            <label className="info-label block mb-2">SELL FEE</label>
            <input
              type="number"
              step="0.01"
              value={sellFee}
              onChange={(e) => setSellFee(e.target.value)}
              className="w-full bg-black/20 border border-gray-700 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-gray-600"
              placeholder="0.00"
            />
          </div>

          {sellPrice && (
            <div className="p-4 bg-gray-800/50 rounded text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Cost Basis:</span>
                <span className="text-white font-medium">${costBasis.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Sell Proceeds:</span>
                <span className="text-white font-medium">${totalProceeds.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Fees:</span>
                <span className="text-white font-medium">-${(buyFee + sellFeeNum).toFixed(2)}</span>
              </div>
              <div className="separator my-2"></div>
              <div className="flex justify-between">
                <span className="text-white font-semibold">Net Profit:</span>
                <span className={`font-bold ${profit >= 0 ? 'gain' : 'loss'}`}>
                  {profit >= 0 ? '+' : ''}${profit.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded font-medium transition disabled:opacity-50"
            >
              {submitting ? 'Closing...' : 'Close Position'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Stock Options Strategy Modal
function StockOptionsModal({ stock, onClose, onSuccess, userId }) {
  const [strategyType, setStrategyType] = useState(null);

  if (strategyType === 'sell-call') {
    return <SellCallModal stock={stock} onClose={onClose} onSuccess={onSuccess} userId={userId} />;
  }

  if (strategyType === 'buy-put') {
    return <BuyPutModal stock={stock} onClose={onClose} onSuccess={onSuccess} userId={userId} />;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="data-card rounded-lg p-6 w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white text-lg font-semibold">Options Strategy</h3>
            <p className="text-gray-500 text-sm mt-1">{stock.ticker} - {stock.shares} shares</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setStrategyType('sell-call')}
            className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-lg p-4 text-left transition"
          >
            <div className="font-semibold">Sell Covered Calls</div>
            <div className="text-sm text-blue-300 mt-1">Generate income from your shares</div>
          </button>

          <button
            onClick={() => setStrategyType('buy-put')}
            className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-lg p-4 text-left transition"
          >
            <div className="font-semibold">Buy Protective Puts</div>
            <div className="text-sm text-red-300 mt-1">Hedge downside risk (with optional spread)</div>
          </button>
        </div>
      </div>
    </div>
  );
}

// Sell Covered Call Modal
function SellCallModal({ stock, onClose, onSuccess, userId }) {
  const [strike, setStrike] = useState('');
  const [expiry, setExpiry] = useState('');
  const [premium, setPremium] = useState('');
  const [numContracts, setNumContracts] = useState('1');
  const [sellFee, setSellFee] = useState('0');
  const [sellDate, setSellDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);

  const maxContracts = Math.floor(stock.shares / 100);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const contractData = {
      symbol: stock.ticker,
      type: 'Call',
      strike: parseFloat(strike),
      expiry,
      premium: parseFloat(premium),
      num_contracts: parseInt(numContracts),
      status: 'Open',
      current_price: parseFloat(strike),
      rolled: false,
      date: sellDate,
      open_fee: parseFloat(sellFee),
      is_hedge: false,
      user_id: userId
    };

    try {
      const { error } = await supabase.from('contracts').insert([contractData]);
      if (error) throw error;
      
      alert('✅ Covered call added successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="data-card rounded-lg p-6 w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white text-lg font-semibold">Sell Covered Call</h3>
            <p className="text-gray-500 text-sm mt-1">{stock.ticker} - Max {maxContracts} contracts</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="info-label block mb-2">STRIKE PRICE *</label>
            <input
              type="number"
              step="0.01"
              value={strike}
              onChange={(e) => setStrike(e.target.value)}
              className="w-full bg-black/20 border border-gray-700 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-gray-600"
              placeholder={stock.current_price || stock.avg_buy_price}
              required
            />
          </div>

          <div>
            <label className="info-label block mb-2">EXPIRATION DATE *</label>
            <input
              type="date"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="w-full bg-black/20 border border-gray-700 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-gray-600"
              required
            />
          </div>

          <div>
            <label className="info-label block mb-2">SELL DATE *</label>
            <input
              type="date"
              value={sellDate}
              onChange={(e) => setSellDate(e.target.value)}
              className="w-full bg-black/20 border border-gray-700 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-gray-600"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="info-label block mb-2">PREMIUM (per share) *</label>
              <input
                type="number"
                step="0.01"
                value={premium}
                onChange={(e) => setPremium(e.target.value)}
                className="w-full bg-black/20 border border-gray-700 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-gray-600"
                placeholder="2.50"
                required
              />
            </div>

            <div>
              <label className="info-label block mb-2">SELL FEE</label>
              <input
                type="number"
                step="0.01"
                value={sellFee}
                onChange={(e) => setSellFee(e.target.value)}
                className="w-full bg-black/20 border border-gray-700 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-gray-600"
                placeholder="0.65"
              />
            </div>
          </div>

          <div>
            <label className="info-label block mb-2">NUMBER OF CONTRACTS *</label>
            <input
              type="number"
              min="1"
              max={maxContracts}
              value={numContracts}
              onChange={(e) => setNumContracts(e.target.value)}
              className="w-full bg-black/20 border border-gray-700 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-gray-600"
              required
            />
            <div className="text-xs text-gray-400 mt-1">You have {stock.shares} shares (max {maxContracts} contracts)</div>
          </div>

          {premium && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded">
              <div className="text-xs text-gray-400 mb-1">Total Premium Income:</div>
              <div className="text-white font-medium">
                ${((parseFloat(premium) * 100 * parseInt(numContracts || 1)) - parseFloat(sellFee || 0)).toFixed(2)}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition disabled:opacity-50"
            >
              {submitting ? 'Adding...' : 'Sell Call'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Buy Protective Put Modal (with optional spread)
function BuyPutModal({ stock, onClose, onSuccess, userId }) {
  const [buyStrike, setBuyStrike] = useState('');
  const [expiry, setExpiry] = useState('');
  const [buyPremium, setBuyPremium] = useState('');
  const [buyFee, setBuyFee] = useState('0');
  const [buyDate, setBuyDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Spread options
  const [isSpread, setIsSpread] = useState(false);
  const [sellStrike, setSellStrike] = useState('');
  const [sellPremium, setSellPremium] = useState('');
  const [sellFee, setSellFee] = useState('0');

  const [submitting, setSubmitting] = useState(false);

  const numContracts = Math.floor(stock.shares / 100);
  const buyPremiumNum = parseFloat(buyPremium) || 0;
  const buyFeeNum = parseFloat(buyFee) || 0;
  const sellPremiumNum = parseFloat(sellPremium) || 0;
  const sellFeeNum = parseFloat(sellFee) || 0;
  
  const grossCost = buyPremiumNum * 100 * numContracts;
  const totalCost = grossCost + buyFeeNum + sellFeeNum;
  const spreadIncome = sellPremiumNum * 100 * numContracts;
  const netCost = isSpread ? totalCost - spreadIncome : totalCost;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // For bought puts, we track them as contracts with negative premium
    const contractData = {
      symbol: stock.ticker,
      type: 'Put',
      strike: parseFloat(buyStrike),
      expiry,
      premium: -buyPremiumNum, // Negative because we're BUYING
      num_contracts: numContracts,
      status: 'Open',
      current_price: parseFloat(buyStrike),
      rolled: false,
      date: buyDate,
      open_fee: buyFeeNum,
      is_hedge: false,
      user_id: userId
    };

    // If it's a spread, add the hedge info
    if (isSpread) {
      contractData.hedge_strike = parseFloat(sellStrike);
      contractData.hedge_premium = sellPremiumNum;
      contractData.hedge_fee = sellFeeNum;
      contractData.hedge_date = buyDate;
      contractData.net_premium = -buyPremiumNum + sellPremiumNum - ((buyFeeNum + sellFeeNum) / 100);
    }

    try {
      const { error } = await supabase.from('contracts').insert([contractData]);
      if (error) throw error;
      
      alert(`✅ Protective put ${isSpread ? 'spread ' : ''}added successfully!`);
      onSuccess();
      onClose();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto" onClick={onClose}>
      <div className="data-card rounded-lg p-6 w-full max-w-md m-4 my-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white text-lg font-semibold">Buy Protective Put</h3>
            <p className="text-gray-500 text-sm mt-1">{stock.ticker} - {numContracts} contracts</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="info-label block mb-2">BUY STRIKE PRICE *</label>
            <input
              type="number"
              step="0.01"
              value={buyStrike}
              onChange={(e) => setBuyStrike(e.target.value)}
              className="w-full bg-black/20 border border-gray-700 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-gray-600"
              placeholder={stock.current_price || stock.avg_buy_price}
              required
            />
          </div>

          <div>
            <label className="info-label block mb-2">EXPIRATION DATE *</label>
            <input
              type="date"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="w-full bg-black/20 border border-gray-700 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-gray-600"
              required
            />
          </div>

          <div>
            <label className="info-label block mb-2">PURCHASE DATE *</label>
            <input
              type="date"
              value={buyDate}
              onChange={(e) => setBuyDate(e.target.value)}
              className="w-full bg-black/20 border border-gray-700 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-gray-600"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="info-label block mb-2">PREMIUM PAID *</label>
              <input
                type="number"
                step="0.01"
                value={buyPremium}
                onChange={(e) => setBuyPremium(e.target.value)}
                className="w-full bg-black/20 border border-gray-700 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-gray-600"
                placeholder="1.50"
                required
              />
            </div>

            <div>
              <label className="info-label block mb-2">PURCHASE FEE</label>
              <input
                type="number"
                step="0.01"
                value={buyFee}
                onChange={(e) => setBuyFee(e.target.value)}
                className="w-full bg-black/20 border border-gray-700 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-gray-600"
                placeholder="0.65"
              />
            </div>
          </div>

          {/* SPREAD OPTION */}
          <div className="pt-4 border-t border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <label className="info-label">USE SPREAD? (Sell lower put to offset cost)</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsSpread(false)}
                  className={`px-4 py-2 rounded text-sm font-medium transition ${!isSpread ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400'}`}
                >
                  No
                </button>
                <button
                  type="button"
                  onClick={() => setIsSpread(true)}
                  className={`px-4 py-2 rounded text-sm font-medium transition ${isSpread ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400'}`}
                >
                  Yes
                </button>
              </div>
            </div>

            {isSpread && (
              <div className="space-y-4 p-4 bg-red-500/5 border border-red-500/20 rounded">
                <div className="text-sm text-red-400 mb-3">Sell Lower Strike Put (Spread Leg)</div>
                
                <div>
                  <label className="info-label block mb-2">SELL STRIKE PRICE *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={sellStrike}
                    onChange={(e) => setSellStrike(e.target.value)}
                    className="w-full bg-black/20 border border-gray-700 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-gray-600"
                    placeholder="Lower than buy strike"
                    required={isSpread}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="info-label block mb-2">PREMIUM RECEIVED *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={sellPremium}
                      onChange={(e) => setSellPremium(e.target.value)}
                      className="w-full bg-black/20 border border-gray-700 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-gray-600"
                      placeholder="0.75"
                      required={isSpread}
                    />
                  </div>

                  <div>
                    <label className="info-label block mb-2">SELL FEE</label>
                    <input
                      type="number"
                      step="0.01"
                      value={sellFee}
                      onChange={(e) => setSellFee(e.target.value)}
                      className="w-full bg-black/20 border border-gray-700 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-gray-600"
                      placeholder="0.65"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {buyPremium && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded">
              <div className="text-xs text-gray-400 mb-1">
                {isSpread ? 'Net Cost (Buy - Sell):' : 'Total Cost:'}
              </div>
              <div className="text-white font-medium">
                {isSpread ? (
                  <div>
                    ${grossCost.toFixed(2)} - ${spreadIncome.toFixed(2)} + ${(buyFeeNum + sellFeeNum).toFixed(2)} fees = 
                    <span className="text-red-400"> ${netCost.toFixed(2)}</span>
                  </div>
                ) : (
                  <div>
                    ${grossCost.toFixed(2)} + ${buyFeeNum.toFixed(2)} fees = 
                    <span className="text-red-400"> ${totalCost.toFixed(2)}</span>
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Protecting {stock.shares} shares ({numContracts} contracts)
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded font-medium transition disabled:opacity-50"
            >
              {submitting ? 'Adding...' : 'Buy Put'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Continue with remaining modals and pages...
// (Due to length, I'll provide the rest in the next message - the code structure remains the same as before)
// HEDGE MODAL (for options contracts)
function HedgeModal({ contract, onClose, onSuccess }) {
  const [hedgeStrike, setHedgeStrike] = useState('');
  const [hedgePremium, setHedgePremium] = useState('');
  const [hedgeFee, setHedgeFee] = useState('0');
  const [hedgeDate, setHedgeDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);

  const originalPremium = parseFloat(contract.premium) || 0;
  const hedgePremiumNum = parseFloat(hedgePremium) || 0;
  const hedgeFeeNum = parseFloat(hedgeFee) || 0;
  const netPremium = originalPremium - hedgePremiumNum - (hedgeFeeNum / 100);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('contracts')
        .update({
          hedge_strike: parseFloat(hedgeStrike),
          hedge_premium: parseFloat(hedgePremium),
          hedge_fee: parseFloat(hedgeFee),
          hedge_date: hedgeDate,
          net_premium: netPremium
        })
        .eq('id', contract.id);

      if (error) throw error;
      
      alert('✅ Hedge added successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="data-card rounded-lg p-6 w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white text-lg font-semibold">Add Hedge</h3>
            <p className="text-gray-500 text-sm mt-1">{contract.symbol} ${contract.strike} {contract.type}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="info-label block mb-2">HEDGE STRIKE PRICE *</label>
            <input
              type="number"
              step="0.01"
              value={hedgeStrike}
              onChange={(e) => setHedgeStrike(e.target.value)}
              className="w-full bg-black/20 border border-gray-700 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-gray-600"
              placeholder="e.g., 200"
              required
            />
          </div>

          <div>
            <label className="info-label block mb-2">PURCHASE DATE *</label>
            <input
              type="date"
              value={hedgeDate}
              onChange={(e) => setHedgeDate(e.target.value)}
              className="w-full bg-black/20 border border-gray-700 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-gray-600"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="info-label block mb-2">PREMIUM PAID *</label>
              <input
                type="number"
                step="0.01"
                value={hedgePremium}
                onChange={(e) => setHedgePremium(e.target.value)}
                className="w-full bg-black/20 border border-gray-700 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-gray-600"
                placeholder="e.g., 1.50"
                required
              />
            </div>

            <div>
              <label className="info-label block mb-2">PURCHASE FEE</label>
              <input
                type="number"
                step="0.01"
                value={hedgeFee}
                onChange={(e) => setHedgeFee(e.target.value)}
                className="w-full bg-black/20 border border-gray-700 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-gray-600"
                placeholder="0.65"
              />
            </div>
          </div>

          {hedgePremium && (
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded">
              <div className="text-sm text-blue-400 mb-1">Net Premium Calculation:</div>
              <div className="text-white font-medium">
                ${originalPremium.toFixed(2)} - ${hedgePremiumNum.toFixed(2)} - ${(hedgeFeeNum / 100).toFixed(2)} = 
                <span className="text-green-400"> ${netPremium.toFixed(2)}</span> per share
              </div>
              <div className="text-xs text-gray-400 mt-2">
                Per contract: ${(netPremium * 100).toFixed(2)}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition disabled:opacity-50"
            >
              {submitting ? 'Adding...' : 'Add Hedge'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// CLOSE CONTRACT MODAL
function CloseModal({ contract, onClose, onSuccess }) {
  const [closePrice, setClosePrice] = useState('');
  const [closeFee, setCloseFee] = useState('0');
  const [closeDate, setCloseDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const premiumPerShare = parseFloat(contract.premium) || 0;
    const numContracts = parseFloat(contract.num_contracts) || 1;
    const totalPremium = premiumPerShare * 100 * numContracts;
    const openFee = parseFloat(contract.open_fee) || 0;
    const closePriceNum = parseFloat(closePrice) || 0;
    const closeFeeNum = parseFloat(closeFee) || 0;

    const profit = totalPremium - openFee - (closePriceNum * 100 * numContracts) - closeFeeNum;

    try {
      const { error } = await supabase
        .from('contracts')
        .update({
          status: 'Closed',
          close_date: closeDate,
          close_price: closePriceNum,
          close_fee: closeFeeNum,
          profit: profit.toFixed(2)
        })
        .eq('id', contract.id);

      if (error) throw error;
      
      alert('✅ Contract closed successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="data-card rounded-lg p-6 w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white text-lg font-semibold">Close Contract</h3>
            <p className="text-gray-500 text-sm mt-1">{contract.symbol} ${contract.strike} {contract.type}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="info-label block mb-2">BUYBACK DATE *</label>
            <input
              type="date"
              value={closeDate}
              onChange={(e) => setCloseDate(e.target.value)}
              className="w-full bg-black/20 border border-gray-700 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-gray-600"
              required
            />
          </div>

          <div>
            <label className="info-label block mb-2">BUYBACK PRICE (per share) *</label>
            <input
              type="number"
              step="0.01"
              value={closePrice}
              onChange={(e) => setClosePrice(e.target.value)}
              className="w-full bg-black/20 border border-gray-700 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-gray-600"
              placeholder="0.50"
              required
            />
          </div>

          <div>
            <label className="info-label block mb-2">BUYBACK FEE</label>
            <input
              type="number"
              step="0.01"
              value={closeFee}
              onChange={(e) => setCloseFee(e.target.value)}
              className="w-full bg-black/20 border border-gray-700 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-gray-600"
              placeholder="0.65"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-500 text-white rounded font-medium transition disabled:opacity-50"
            >
              {submitting ? 'Closing...' : 'Close Position'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ROLL MODAL
function RollModal({ contract, onClose, onSuccess }) {
  const [rollDate, setRollDate] = useState(new Date().toISOString().split('T')[0]);
  const [buybackPrice, setBuybackPrice] = useState('');
  const [buybackFee, setBuybackFee] = useState('0');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const premiumPerShare = parseFloat(contract.premium) || 0;
    const numContracts = parseFloat(contract.num_contracts) || 1;
    const totalOldPremium = premiumPerShare * 100 * numContracts;
    const openFee = parseFloat(contract.open_fee) || 0;
    const buybackPriceNum = parseFloat(buybackPrice) || 0;
    const buybackFeeNum = parseFloat(buybackFee) || 0;

    const oldProfit = totalOldPremium - openFee - (buybackPriceNum * 100 * numContracts) - buybackFeeNum;

    try {
      const { error } = await supabase
        .from('contracts')
        .update({
          status: 'Closed',
          close_date: rollDate,
          close_price: buybackPriceNum,
          close_fee: buybackFeeNum,
          profit: oldProfit.toFixed(2),
          rolled: true
        })
        .eq('id', contract.id);

      if (error) throw error;
      
      alert('✅ Contract rolled! Add the new contract manually.');
      onSuccess();
      onClose();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="data-card rounded-lg p-6 w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white text-lg font-semibold">Roll Contract</h3>
            <p className="text-gray-500 text-sm mt-1">{contract.symbol} ${contract.strike} {contract.type}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded text-sm text-purple-300">
          After rolling, add the new contract manually with updated expiration/strike/premium.
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="info-label block mb-2">ROLL DATE *</label>
            <input
              type="date"
              value={rollDate}
              onChange={(e) => setRollDate(e.target.value)}
              className="w-full bg-black/20 border border-gray-700 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-gray-600"
              required
            />
          </div>

          <div>
            <label className="info-label block mb-2">BUYBACK PRICE (per share) *</label>
            <input
              type="number"
              step="0.01"
              value={buybackPrice}
              onChange={(e) => setBuybackPrice(e.target.value)}
              className="w-full bg-black/20 border border-gray-700 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-gray-600"
              placeholder="0.50"
              required
            />
          </div>

          <div>
            <label className="info-label block mb-2">BUYBACK FEE</label>
            <input
              type="number"
              step="0.01"
              value={buybackFee}
              onChange={(e) => setBuybackFee(e.target.value)}
              className="w-full bg-black/20 border border-gray-700 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-gray-600"
              placeholder="0.65"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded font-medium transition disabled:opacity-50"
            >
              {submitting ? 'Rolling...' : 'Roll Contract'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ASSIGNED MODAL
function AssignedModal({ contract, onClose, onSuccess }) {
  const [assignmentDate, setAssignmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);
  const isPut = contract.type === 'Put';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const premiumPerShare = parseFloat(contract.premium) || 0;
    const numContracts = parseFloat(contract.num_contracts) || 1;
    const totalPremium = premiumPerShare * 100 * numContracts;
    const openFee = parseFloat(contract.open_fee) || 0;

    const profit = totalPremium - openFee;

    try {
      const { error } = await supabase
        .from('contracts')
        .update({
          status: 'Closed',
          close_date: assignmentDate,
          close_price: 0,
          close_fee: 0,
          profit: profit.toFixed(2)
        })
        .eq('id', contract.id);

      if (error) throw error;
      
      alert(`✅ Marked as assigned! ${isPut ? 'Add stock to portfolio manually' : 'Remove stock from portfolio manually'}.`);
      onSuccess();
      onClose();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const shares = parseFloat(contract.num_contracts) * 100;
  const totalCost = shares * parseFloat(contract.strike);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="data-card rounded-lg p-6 w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white text-lg font-semibold">Mark as Assigned</h3>
            <p className="text-gray-500 text-sm mt-1">{contract.symbol} ${contract.strike} {contract.type}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded text-sm text-orange-300">
          {isPut 
            ? `Purchased ${shares} shares at $${contract.strike}/share. Remember to add stock manually!`
            : `Sold ${shares} shares at $${contract.strike}/share. Remember to remove stock manually!`
          }
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="info-label block mb-2">ASSIGNMENT DATE *</label>
            <input
              type="date"
              value={assignmentDate}
              onChange={(e) => setAssignmentDate(e.target.value)}
              className="w-full bg-black/20 border border-gray-700 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-gray-600"
              required
            />
          </div>

          <div className="p-4 bg-gray-800/50 rounded text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Shares {isPut ? 'Purchased' : 'Sold'}:</span>
              <span className="text-white font-medium">{shares}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Price per Share:</span>
              <span className="text-white font-medium">${contract.strike}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total:</span>
              <span className="text-white font-medium">${totalCost.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded font-medium transition disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Mark Assigned'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function OptionsPage({ contracts, onRefresh, userId }) {
  const [updating, setUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedContract, setSelectedContract] = useState(null);

  const mainContracts = contracts.filter(c => !c.is_hedge);

  const handleUpdatePrices = async () => {
    setUpdating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const count = await updateOptionPrices(mainContracts, user.id);
      setLastUpdate(new Date());
      alert(`✅ Updated ${count} option contracts!`);
      onRefresh();
    } catch (error) {
      alert('Error updating prices: ' + error.message);
    } finally {
      setUpdating(false);
    }
  };

  const openModal = (modal, contract) => {
    setActiveModal(modal);
    setSelectedContract(contract);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedContract(null);
  };

  return (
    <div className="p-6">
      <div className="data-card rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
          <div>
            <div className="info-label">ALL CONTRACTS</div>
            {lastUpdate && (
              <div className="text-xs text-gray-500 mt-1">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </div>
            )}
          </div>
          <button
            onClick={handleUpdatePrices}
            disabled={updating || mainContracts.filter(c => c.status === 'Open').length === 0}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw size={16} className={updating ? 'animate-spin' : ''} />
            {updating ? 'Updating...' : 'Update Prices'}
          </button>
        </div>

        {mainContracts.length === 0 ? (
          <div className="px-5 py-12 text-center text-gray-500 text-sm">No contracts found</div>
        ) : (
          <>
            <div className="grid grid-cols-12 gap-4 px-5 py-3 text-xs neutral border-b border-gray-800" style={{ background: 'rgba(0,0,0,0.2)' }}>
              <div className="col-span-2">SYMBOL</div>
              <div className="col-span-1">TYPE</div>
              <div className="col-span-1">STATUS</div>
              <div className="col-span-1">STRIKE</div>
              <div className="col-span-2">EXPIRY</div>
              <div className="col-span-1 text-center">QTY</div>
              <div className="col-span-2 text-right">PREMIUM</div>
              <div className="col-span-1 text-right">P&L</div>
              <div className="col-span-1"></div>
            </div>

            {mainContracts.map((contract) => {
              const premiumPerShare = contract.net_premium !== null && contract.net_premium !== undefined 
                ? contract.net_premium 
                : parseFloat(contract.premium) || 0;
              const numContracts = parseFloat(contract.num_contracts) || 1;
              const totalPremium = premiumPerShare * 100 * numContracts;
              
              let netPL;
              if (contract.status === 'Closed') {
                netPL = parseFloat(contract.profit) || 0;
              } else if (contract.unrealized_pl !== null && contract.unrealized_pl !== undefined) {
                netPL = contract.unrealized_pl;
              } else {
                netPL = totalPremium - (parseFloat(contract.open_fee) || 0);
              }

              const isHedged = contract.hedge_strike !== null && contract.hedge_strike !== undefined;

              return (
                <div key={contract.id} className="data-row grid grid-cols-12 gap-4 px-5 py-4 items-center">
                  <div className="col-span-2">
                    <div className="text-white font-medium">{contract.symbol}</div>
                    {isHedged && (
                      <div className="flex items-center gap-1 text-xs text-blue-400 mt-1">
                        <Shield size={10} />
                        <span>{contract.strike}/{contract.hedge_strike}</span>
                      </div>
                    )}
                  </div>
                  <div className="col-span-1">
                    <span className={`text-xs px-2 py-1 rounded ${contract.type === 'Put' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                      {contract.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="col-span-1">
                    <span className={`text-xs px-2 py-1 rounded ${contract.status === 'Open' ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>
                      {contract.status}
                    </span>
                  </div>
                  <div className="col-span-1 neutral">${contract.strike}</div>
                  <div className="col-span-2 neutral text-sm">{new Date(contract.expiry).toLocaleDateString()}</div>
                  <div className="col-span-1 text-center neutral">{contract.num_contracts}</div>
                  <div className="col-span-2 text-right neutral">
                    ${totalPremium.toFixed(2)}
                    {contract.current_price && (
                      <div className="text-xs text-gray-500">Now: ${(contract.current_price * 100 * numContracts).toFixed(2)}</div>
                    )}
                  </div>
                  <div className={`col-span-1 text-right font-medium ${netPL >= 0 ? 'gain' : 'loss'}`}>
                    {netPL >= 0 ? '+' : ''}${netPL.toFixed(0)}
                  </div>
                  <div className="col-span-1 text-right flex gap-1">
                    {contract.status === 'Open' && (
                      <>
                        <button
                          onClick={() => openModal('close', contract)}
                          className="p-1 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded transition"
                          title="Close"
                        >
                          <DollarSign size={14} />
                        </button>
                        <button
                          onClick={() => openModal('roll', contract)}
                          className="p-1 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 rounded transition"
                          title="Roll"
                        >
                          <Repeat size={14} />
                        </button>
                        <button
                          onClick={() => openModal('assigned', contract)}
                          className="p-1 bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 rounded transition"
                          title="Assigned"
                        >
                          <AlertCircle size={14} />
                        </button>
                        {!isHedged && (
                          <button
                            onClick={() => openModal('hedge', contract)}
                            className="p-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded transition"
                            title="Hedge"
                          >
                            <Shield size={14} />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {activeModal === 'hedge' && selectedContract && (
        <HedgeModal
          contract={selectedContract}
          onClose={closeModal}
          onSuccess={onRefresh}
        />
      )}

      {activeModal === 'close' && selectedContract && (
        <CloseModal
          contract={selectedContract}
          onClose={closeModal}
          onSuccess={onRefresh}
        />
      )}

      {activeModal === 'roll' && selectedContract && (
        <RollModal
          contract={selectedContract}
          onClose={closeModal}
          onSuccess={onRefresh}
        />
      )}

      {activeModal === 'assigned' && selectedContract && (
        <AssignedModal
          contract={selectedContract}
          onClose={closeModal}
          onSuccess={onRefresh}
        />
      )}
    </div>
  );
}

// HOLDINGS PAGE WITH MANAGE BUTTON
function HoldingsPage({ stocks, onRefresh, onContractsRefresh, userId }) {
  const [updating, setUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [manageStock, setManageStock] = useState(null);
  
  const totalValue = stocks.reduce((sum, s) => sum + (s.shares * (s.current_price || s.avg_buy_price)), 0);

  const handleUpdatePrices = async () => {
    setUpdating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const count = await updateStockPrices(stocks, user.id);
      setLastUpdate(new Date());
      alert(`✅ Updated prices for ${count} stocks!`);
      onRefresh();
    } catch (error) {
      alert('Error updating prices: ' + error.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-6">
      <div className="data-card rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
          <div>
            <div className="info-label">STOCK HOLDINGS</div>
            {lastUpdate && (
              <div className="text-xs text-gray-500 mt-1">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-white text-lg font-semibold data-value">
              ${totalValue.toLocaleString(undefined, {maximumFractionDigits: 0})}
            </div>
            <button
              onClick={handleUpdatePrices}
              disabled={updating || stocks.length === 0}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition disabled:opacity-50 flex items-center gap-2"
            >
              <RefreshCw size={16} className={updating ? 'animate-spin' : ''} />
              {updating ? 'Updating...' : 'Update Prices'}
            </button>
          </div>
        </div>

        {stocks.length === 0 ? (
          <div className="px-5 py-12 text-center text-gray-500 text-sm">No stock holdings</div>
        ) : (
          <div className="divide-y divide-gray-800">
            {stocks.map((stock) => {
              const currentValue = stock.shares * (stock.current_price || stock.avg_buy_price);
              const costBasis = stock.shares * stock.avg_buy_price;
              const unrealizedPL = currentValue - costBasis;
              const plPercent = ((unrealizedPL / costBasis) * 100).toFixed(1);

              return (
                <div key={stock.id} className="px-5 py-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-white text-lg font-medium">{stock.ticker}</div>
                      <div className="text-xs neutral mt-1">
                        {stock.shares} shares @ ${stock.avg_buy_price}
                        {stock.current_price && stock.current_price !== stock.avg_buy_price && (
                          <span className="ml-2">• Current: ${stock.current_price.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <div className="text-white text-lg font-medium data-value">${currentValue.toFixed(2)}</div>
                        <div className={`text-sm font-medium ${unrealizedPL >= 0 ? 'gain' : 'loss'}`}>
                          {unrealizedPL >= 0 ? '+' : ''}${unrealizedPL.toFixed(2)} ({plPercent}%)
                        </div>
                      </div>
                      <button
                        onClick={() => setManageStock(stock)}
                        className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition"
                        title="Manage"
                      >
                        <Settings size={16} />
                      </button>
                    </div>
                  </div>
                  {stock.source && (
                    <div className="text-xs neutral">Source: {stock.source}</div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {manageStock && (
        <StockManageModal
          stock={manageStock}
          onClose={() => setManageStock(null)}
          onSuccess={onRefresh}
          onContractsSuccess={onContractsRefresh}
          userId={userId}
        />
      )}
    </div>
  );
}

function AnalyticsPage({ contracts, stocks }) {
  const mainContracts = contracts.filter(c => !c.is_hedge);
  
  const monthlyData = mainContracts.reduce((acc, c) => {
    const month = new Date(c.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    if (!acc[month]) {
      acc[month] = { month, premium: 0 };
    }
    const premiumPerShare = c.net_premium !== null && c.net_premium !== undefined 
      ? c.net_premium 
      : parseFloat(c.premium) || 0;
    const numContracts = parseFloat(c.num_contracts) || 1;
    acc[month].premium += premiumPerShare * 100 * numContracts;
    return acc;
  }, {});

  const monthlyChartData = Object.values(monthlyData).slice(-6);

  const puts = mainContracts.filter(c => c.type === 'Put').length;
  const calls = mainContracts.filter(c => c.type === 'Call').length;
  const pieData = [
    { name: 'Puts', value: puts },
    { name: 'Calls', value: calls }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {monthlyChartData.length > 0 && (
          <div className="data-card rounded-lg p-5">
            <div className="info-label mb-4">MONTHLY PREMIUM INCOME</div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2330" />
                <XAxis dataKey="month" tick={{ fill: '#8a8e99', fontSize: 12 }} />
                <YAxis tick={{ fill: '#8a8e99', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: '#131720', border: '1px solid #1e2330', borderRadius: '4px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="premium" fill="#00d4aa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {pieData.length > 0 && (
          <div className="data-card rounded-lg p-5">
            <div className="info-label mb-4">PUT VS CALL DISTRIBUTION</div>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPie>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#131720', border: '1px solid #1e2330', borderRadius: '4px' }}
                />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

function AddTradePage({ onSuccess, userId }) {
  const [tradeType, setTradeType] = useState('put');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Contract fields
  const [symbol, setSymbol] = useState('');
  const [strike, setStrike] = useState('');
  const [expiry, setExpiry] = useState('');
  const [premium, setPremium] = useState('');
  const [numContracts, setNumContracts] = useState('1');
  const [type, setType] = useState('Put');
  const [openFee, setOpenFee] = useState('0');
  const [sellDate, setSellDate] = useState(new Date().toISOString().split('T')[0]);

  // Hedge fields
  const [isHedged, setIsHedged] = useState(false);
  const [hedgeStrike, setHedgeStrike] = useState('');
  const [hedgePremium, setHedgePremium] = useState('');
  const [hedgeFee, setHedgeFee] = useState('0');
  const [hedgeDate, setHedgeDate] = useState(new Date().toISOString().split('T')[0]);

  // Stock fields
  const [ticker, setTicker] = useState('');
  const [shares, setShares] = useState('');
  const [avgBuyPrice, setAvgBuyPrice] = useState('');
  const [buyFee, setBuyFee] = useState('0');
  const [source, setSource] = useState('Assignment');
  const [buyDate, setBuyDate] = useState(new Date().toISOString().split('T')[0]);

  // Calculate net premium
  const premiumNum = parseFloat(premium) || 0;
  const hedgePremiumNum = parseFloat(hedgePremium) || 0;
  const hedgeFeeNum = parseFloat(hedgeFee) || 0;
  const netPremium = isHedged ? premiumNum - hedgePremiumNum - (hedgeFeeNum / 100) : premiumNum;

  const handleSubmitContract = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const contractData = {
      symbol: symbol.toUpperCase(),
      type,
      strike: parseFloat(strike),
      expiry,
      premium: parseFloat(premium),
      num_contracts: parseInt(numContracts),
      status: 'Open',
      current_price: parseFloat(strike),
      rolled: false,
      date: sellDate,
      open_fee: parseFloat(openFee),
      is_hedge: false,
      user_id: userId
    };

    if (isHedged) {
      contractData.hedge_strike = parseFloat(hedgeStrike);
      contractData.hedge_premium = parseFloat(hedgePremium);
      contractData.hedge_fee = parseFloat(hedgeFee);
      contractData.hedge_date = hedgeDate;
      contractData.net_premium = netPremium;
    }

    try {
      const { error } = await supabase.from('contracts').insert([contractData]);
      if (error) throw error;
      setSuccess(true);
      setSymbol('');
      setStrike('');
      setExpiry('');
      setPremium('');
      setNumContracts('1');
      setOpenFee('0');
      setIsHedged(false);
      setHedgeStrike('');
      setHedgePremium('');
      setHedgeFee('0');
      setTimeout(() => { setSuccess(false); onSuccess(); }, 2000);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitStock = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const stockData = {
      ticker: ticker.toUpperCase(),
      shares: parseInt(shares),
      avg_buy_price: parseFloat(avgBuyPrice),
      current_price: parseFloat(avgBuyPrice),
      buy_fee: parseFloat(buyFee),
      source,
      date_acquired: buyDate,
      user_id: userId
    };

    try {
      const { error } = await supabase.from('stocks').insert([stockData]);
      if (error) throw error;
      setSuccess(true);
      setTicker('');
      setShares('');
      setAvgBuyPrice('');
      setBuyFee('0');
      setTimeout(() => { setSuccess(false); onSuccess(); }, 2000);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setTradeType('put'); setType('Put'); }}
          className={`flex-1 px-4 py-2 rounded text-sm font-medium ${tradeType === 'put' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400'}`}
        >
          Sell Put
        </button>
        <button
          onClick={() => { setTradeType('call'); setType('Call'); }}
          className={`flex-1 px-4 py-2 rounded text-sm font-medium ${tradeType === 'call' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400'}`}
        >
          Sell Call
        </button>
        <button
          onClick={() => setTradeType('stock')}
          className={`flex-1 px-4 py-2 rounded text-sm font-medium ${tradeType === 'stock' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400'}`}
        >
          Add Stock
        </button>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded">
          ✓ Successfully added!
        </div>
      )}

      {tradeType === 'stock' ? (
        <form onSubmit={handleSubmitStock} className="data-card rounded-lg p-6 space-y-4">
          <FormInput label="Ticker Symbol" value={ticker} onChange={setTicker} placeholder="AAPL" required />
          <FormInput label="Number of Shares" value={shares} onChange={setShares} type="number" required />
          <FormInput label="Average Buy Price" value={avgBuyPrice} onChange={setAvgBuyPrice} type="number" step="0.01" required />
          <FormInput label="Buy Fee" value={buyFee} onChange={setBuyFee} type="number" step="0.01" />
          <div>
            <label className="info-label block mb-2">
              {source === 'Assignment' ? 'ASSIGNMENT DATE' : 'PURCHASE DATE'}
            </label>
            <input
              type="date"
              value={buyDate}
              onChange={(e) => setBuyDate(e.target.value)}
              className="w-full bg-black/20 border border-gray-700 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-gray-600"
              required
            />
          </div>
          <div>
            <label className="info-label block mb-2">SOURCE</label>
            <select value={source} onChange={(e) => setSource(e.target.value)} className="w-full bg-black/20 border border-gray-700 rounded px-4 py-3 text-white text-sm">
              <option value="Assignment">Assignment</option>
              <option value="Purchase">Purchase</option>
              <option value="Transfer">Transfer</option>
            </select>
          </div>
          <button type="submit" disabled={submitting} className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded font-medium disabled:opacity-50">
            {submitting ? 'Adding...' : 'Add Stock'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmitContract} className="data-card rounded-lg p-6 space-y-4">
          <FormInput label="Ticker Symbol" value={symbol} onChange={setSymbol} placeholder="AAPL" required />
          <FormInput label="Strike Price" value={strike} onChange={setStrike} type="number" step="0.01" required />
          <FormInput label="Expiration Date" value={expiry} onChange={setExpiry} type="date" required />
          <FormInput label="Sell Date" value={sellDate} onChange={setSellDate} type="date" required />
          <FormInput label="Premium per Share" value={premium} onChange={setPremium} type="number" step="0.01" placeholder="2.50" required />
          <FormInput label="Sell Fee" value={openFee} onChange={setOpenFee} type="number" step="0.01" placeholder="0.65" />
          <FormInput label="Number of Contracts" value={numContracts} onChange={setNumContracts} type="number" required />

          <div className="pt-4 border-t border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <label className="info-label">HEDGED?</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsHedged(false)}
                  className={`px-4 py-2 rounded text-sm font-medium transition ${!isHedged ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400'}`}
                >
                  No
                </button>
                <button
                  type="button"
                  onClick={() => setIsHedged(true)}
                  className={`px-4 py-2 rounded text-sm font-medium transition ${isHedged ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}
                >
                  Yes
                </button>
              </div>
            </div>

            {isHedged && (
              <div className="space-y-4 p-4 bg-blue-500/5 border border-blue-500/20 rounded">
                <div className="text-sm text-blue-400 mb-3 flex items-center gap-2">
                  <Shield size={14} />
                  <span>Hedge Leg Details</span>
                </div>
                
                <FormInput 
                  label="Hedge Strike Price" 
                  value={hedgeStrike} 
                  onChange={setHedgeStrike} 
                  type="number" 
                  step="0.01" 
                  placeholder="e.g., 200"
                  required={isHedged}
                />
                
                <div>
                  <label className="info-label block mb-2">PURCHASE DATE</label>
                  <input
                    type="date"
                    value={hedgeDate}
                    onChange={(e) => setHedgeDate(e.target.value)}
                    className="w-full bg-black/20 border border-gray-700 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-gray-600"
                    required={isHedged}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormInput 
                    label="Premium Paid" 
                    value={hedgePremium} 
                    onChange={setHedgePremium} 
                    type="number" 
                    step="0.01" 
                    placeholder="1.50"
                    required={isHedged}
                  />
                  <FormInput 
                    label="Purchase Fee" 
                    value={hedgeFee} 
                    onChange={setHedgeFee} 
                    type="number" 
                    step="0.01" 
                    placeholder="0.65"
                  />
                </div>

                {hedgePremium && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded">
                    <div className="text-xs text-gray-400 mb-1">Net Premium:</div>
                    <div className="text-white font-medium">
                      ${premiumNum.toFixed(2)} - ${hedgePremiumNum.toFixed(2)} - ${(hedgeFeeNum / 100).toFixed(2)} = 
                      <span className="text-green-400"> ${netPremium.toFixed(2)}</span> per share
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Per contract: ${(netPremium * 100).toFixed(2)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <button type="submit" disabled={submitting} className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded font-medium disabled:opacity-50">
            {submitting ? 'Adding...' : `Add ${type} Contract`}
          </button>
        </form>
      )}
    </div>
  );
}

function FormInput({ label, value, onChange, placeholder, type = 'text', step, required = false }) {
  return (
    <div>
      <label className="info-label block mb-2">{label} {required && <span className="text-red-500">*</span>}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        step={step}
        required={required}
        className="w-full bg-black/20 border border-gray-700 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-gray-600"
      />
    </div>
  );
}