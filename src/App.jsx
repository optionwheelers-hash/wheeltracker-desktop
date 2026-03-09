// PROFESSIONAL DESKTOP APP.JSX FOR WHEELTRACKER
// Replace your src/App.jsx with this entire file

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Home, List, Plus, Briefcase, BarChart3, LogOut, RefreshCw, Edit2, X } from 'lucide-react';
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
        // Send password reset email
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setMessage('Password reset email sent! Check your inbox.');
        setEmail('');
      } else if (isSignUp) {
        // Sign up
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
        // Sign in
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
async function fetchStockPrice(ticker) {
  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${FINNHUB_API_KEY}`
    );
    const data = await response.json();
    return data.c && data.c > 0 ? data.c : null; // c = current price
  } catch (error) {
    console.error(`Error fetching ${ticker}:`, error);
    return null;
  }
}
async function fetchOptionData(ticker, strike, expiry, type) {
  try {
    // Format expiry for Yahoo (YYYY-MM-DD to Unix timestamp)
    const expiryDate = new Date(expiry);
    const expiryTimestamp = Math.floor(expiryDate.getTime() / 1000);
    
    // Yahoo Finance API endpoint (free, no key needed)
    const response = await fetch(
      `https://query2.finance.yahoo.com/v7/finance/options/${ticker}?date=${expiryTimestamp}`
    );
    const data = await response.json();
    
    if (!data.optionChain?.result?.[0]) return null;
    
    const chain = data.optionChain.result[0];
    const options = type === 'Call' ? chain.options[0]?.calls : chain.options[0]?.puts;
    
    if (!options) return null;
    
    // Find the matching option by strike price
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
      // Greeks (if available)
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
    
    // Delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 1100));
  }
  
  // Update database
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
      // Calculate current market value
      const currentPrice = optionData.lastPrice || ((optionData.bid + optionData.ask) / 2);
      const originalPremium = parseFloat(contract.premium) || 0;
      const numContracts = parseFloat(contract.num_contracts) || 1;
      
      // Current value vs what we sold it for
      const soldFor = originalPremium * 100 * numContracts;
      const currentValue = currentPrice * 100 * numContracts;
      const unrealizedPL = soldFor - currentValue; // Profit if we sold and price decreased
      
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
    
    // Delay to avoid overwhelming API
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Update database
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
      {/* Sidebar */}
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

      {/* Main Content */}
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
          {currentPage === 'options' && <OptionsPage contracts={contracts} onRefresh={fetchContracts} />}
          {currentPage === 'holdings' && <HoldingsPage stocks={stocks} />}
          {currentPage === 'analytics' && <AnalyticsPage contracts={contracts} stocks={stocks} />}
          {currentPage === 'add' && <AddTradePage onSuccess={() => { fetchContracts(); fetchStocks(); }} userId={user.id} />}
        </div>
      </div>
    </div>
  );
}

function DashboardPage({ contracts, stocks }) {
  const totalPremiums = contracts.reduce((sum, c) => {
    const premiumPerShare = parseFloat(c.premium) || 0;
    const numContracts = parseFloat(c.num_contracts) || 1;
    const totalPremium = premiumPerShare * 100 * numContracts;
    const openFee = parseFloat(c.open_fee) || 0;
    return sum + (totalPremium - openFee);
  }, 0);

  const closedContracts = contracts.filter(c => c.status === 'Closed');
  const openContracts = contracts.filter(c => c.status === 'Open');
  const realizedProfit = closedContracts.reduce((sum, c) => sum + (parseFloat(c.profit) || 0), 0);
  const stockValue = stocks.reduce((sum, s) => sum + (s.shares * (s.current_price || s.avg_buy_price)), 0);
  const stockCostBasis = stocks.reduce((sum, s) => sum + (s.shares * s.avg_buy_price), 0);
  const stockUnrealizedPL = stockValue - stockCostBasis;
  const totalGain = realizedProfit + stockUnrealizedPL;
  const totalROI = stockCostBasis > 0 ? ((totalGain / stockCostBasis) * 100).toFixed(2) : 0;
  const winRate = closedContracts.length > 0 ? ((closedContracts.filter(c => parseFloat(c.profit) > 0).length / closedContracts.length) * 100).toFixed(1) : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Top Stats */}
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
          <div className="text-sm neutral">{contracts.length} total contracts</div>
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

      {/* Two Column Layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column (2/3) */}
        <div className="col-span-2 space-y-6">
          {/* Open Positions Table */}
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
                  const premiumPerShare = parseFloat(contract.premium) || 0;
                  const numContracts = parseFloat(contract.num_contracts) || 1;
                  const totalPremium = premiumPerShare * 100 * numContracts;
                  const netPL = totalPremium - (parseFloat(contract.open_fee) || 0);

                  return (
                    <div key={contract.id} className="data-row grid grid-cols-12 gap-4 px-5 py-4 items-center">
                      <div className="col-span-2 text-white font-medium">{contract.symbol}</div>
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

        {/* Right Column (1/3) */}
        <div className="space-y-6">
          {/* Stock Holdings */}
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

          {/* Performance Breakdown */}
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

function OptionsPage({ contracts, onRefresh }) {
  const [updating, setUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  const handleUpdatePrices = async () => {
    setUpdating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const count = await updateOptionPrices(contracts, user.id);
      setLastUpdate(new Date());
      alert(`✅ Updated ${count} option contracts!`);
      onRefresh();
    } catch (error) {
      alert('Error updating options: ' + error.message);
    } finally {
      setUpdating(false);
    }
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
            disabled={updating || contracts.filter(c => c.status === 'Open').length === 0}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw size={16} className={updating ? 'animate-spin' : ''} />
            {updating ? 'Updating...' : 'Update Prices'}
          </button>
        </div>

        {contracts.length === 0 ? (
          <div className="px-5 py-12 text-center text-gray-500 text-sm">No contracts found</div>
        ) : (
          <>
            <div className="grid grid-cols-12 gap-4 px-5 py-3 text-xs neutral border-b border-gray-800" style={{ background: 'rgba(0,0,0,0.2)' }}>
              <div className="col-span-2">SYMBOL</div>
              <div className="col-span-1">TYPE</div>
              <div className="col-span-1">STATUS</div>
              <div className="col-span-2">STRIKE</div>
              <div className="col-span-2">EXPIRY</div>
              <div className="col-span-1 text-center">QTY</div>
              <div className="col-span-2 text-right">PREMIUM</div>
              <div className="col-span-1 text-right">P&L</div>
            </div>

            {contracts.map((contract) => {
              const premiumPerShare = parseFloat(contract.premium) || 0;
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

              return (
                <div key={contract.id} className="data-row grid grid-cols-12 gap-4 px-5 py-4 items-center">
                  <div className="col-span-2 text-white font-medium">{contract.symbol}</div>
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
                  <div className="col-span-2 neutral">${contract.strike}</div>
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
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

function HoldingsPage({ stocks, onRefresh }) {
  const [updating, setUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  
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
                    <div className="text-right">
                      <div className="text-white text-lg font-medium data-value">${currentValue.toFixed(2)}</div>
                      <div className={`text-sm font-medium ${unrealizedPL >= 0 ? 'gain' : 'loss'}`}>
                        {unrealizedPL >= 0 ? '+' : ''}${unrealizedPL.toFixed(2)} ({plPercent}%)
                      </div>
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
    </div>
  );
}

function AnalyticsPage({ contracts, stocks }) {
  const monthlyData = contracts.reduce((acc, c) => {
    const month = new Date(c.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    if (!acc[month]) {
      acc[month] = { month, premium: 0 };
    }
    const premiumPerShare = parseFloat(c.premium) || 0;
    const numContracts = parseFloat(c.num_contracts) || 1;
    acc[month].premium += premiumPerShare * 100 * numContracts;
    return acc;
  }, {});

  const monthlyChartData = Object.values(monthlyData).slice(-6);

  const puts = contracts.filter(c => c.type === 'Put').length;
  const calls = contracts.filter(c => c.type === 'Call').length;
  const pieData = [
    { name: 'Puts', value: puts },
    { name: 'Calls', value: calls }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Monthly Premium Chart */}
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

        {/* Put vs Call Distribution */}
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

  // Stock fields
  const [ticker, setTicker] = useState('');
  const [shares, setShares] = useState('');
  const [avgBuyPrice, setAvgBuyPrice] = useState('');
  const [buyFee, setBuyFee] = useState('0');
  const [source, setSource] = useState('Assignment');

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
      user_id: userId
    };

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

