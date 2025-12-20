// ═══════════════════════════════════════════════════════════════════════════
// COMPLETE 50-MODULE CURRICULUM - BEGINNER LEVEL (Modules 1-15)
// Full LearningModule structure with sections, quizzes, tools, concepts
// ═══════════════════════════════════════════════════════════════════════════

import { LearningModule } from './modules';

export const CURRICULUM_BEGINNER: LearningModule[] = [
  {
    id: 'cur-01-stock-basics',
    title: '1. Stock Market Basics 101',
    description: 'Learn what stocks are, why companies issue them, and how stock exchanges work.',
    category: 'concepts',
    difficulty: 'beginner',
    durationMinutes: 12,
    rating: 4.9,
    totalRatings: 2450,
    icon: 'TrendingUp',
    concepts: ['stocks', 'ownership', 'exchanges'],
    tools: ['stock-snapshot'],
    sections: [
      {
        title: 'What is a Stock?',
        content: `Stocks represent ownership in a company. When you buy a share, you become a partial owner and are entitled to profits (dividends) and capital appreciation.

Companies issue shares to raise money for growth, expansion, or debt repayment instead of borrowing. Public companies trade on exchanges like NSE and BSE, where prices are determined by demand and supply.

**Key Points:**
- A share = partial ownership in a company
- Shareholders benefit from dividends and price appreciation
- Stock exchanges (NSE, BSE) provide the marketplace for trading
- Prices move based on supply and demand`
      },
      {
        title: 'India Example',
        content: `**Reliance Industries** raised capital by listing shares on Indian exchanges, allowing retail investors to participate in its growth.

When Reliance went public, ordinary Indians could buy shares and become part-owners of one of India's largest conglomerates. As the company grew, early shareholders saw massive wealth creation.`
      }
    ],
    quiz: {
      questions: [
        {
          question: 'What does owning a share mean?',
          options: ['Lending money to company', 'Owning part of company', 'Fixed income guarantee', 'Government backing'],
          correctIndex: 1,
          explanation: 'Owning a share means you own a part of the company. You become a partial owner with rights to dividends and voting.'
        },
        {
          question: 'Where are Indian stocks traded?',
          options: ['RBI', 'SEBI', 'NSE & BSE', 'Banks'],
          correctIndex: 2,
          explanation: 'NSE (National Stock Exchange) and BSE (Bombay Stock Exchange) are the two main stock exchanges in India.'
        },
        {
          question: 'Why do companies issue shares?',
          options: ['Charity', 'Raise capital', 'Pay taxes', 'Avoid regulation'],
          correctIndex: 1,
          explanation: 'Companies issue shares primarily to raise capital for growth, expansion, acquisitions, or debt repayment.'
        }
      ],
      passingScore: 67
    }
  },
  {
    id: 'cur-02-demat-account',
    title: '2. How to Open a Demat Account (India)',
    description: 'Step-by-step guide to opening a Demat and trading account in India.',
    category: 'tutorials',
    difficulty: 'beginner',
    durationMinutes: 10,
    rating: 4.8,
    totalRatings: 1890,
    icon: 'Wallet',
    concepts: ['demat', 'trading-account', 'kyc'],
    tools: [],
    sections: [
      {
        title: 'Understanding Demat & Trading Accounts',
        content: `A **Demat account** holds shares electronically (like a bank account for securities). A **trading account** is used to buy/sell shares.

In India, you must complete KYC (Know Your Customer) using:
- PAN card (mandatory)
- Aadhaar for e-KYC
- Bank account details
- Signature verification

**Depository Participants (DPs)** like Zerodha, Groww, ICICI Direct act as intermediaries between investors and depositories (NSDL/CDSL).`
      },
      {
        title: 'India Example',
        content: `**Opening a Demat via Zerodha:**
1. Visit Zerodha website/app
2. Enter mobile & email
3. Complete online KYC
4. PAN verification (instant)
5. Aadhaar OTP verification
6. Upload signature
7. Account activated in 24-48 hours

Most brokers now offer instant/same-day account opening with e-KYC.`
      }
    ],
    quiz: {
      questions: [
        {
          question: 'Demat account stores?',
          options: ['Cash', 'Physical shares', 'Electronic securities', 'Mutual fund NAV'],
          correctIndex: 2,
          explanation: 'Demat (Dematerialized) account stores your shares and securities in electronic form, eliminating physical certificates.'
        },
        {
          question: 'Mandatory document for Demat?',
          options: ['Passport', 'PAN', 'Driving license', 'Voter ID'],
          correctIndex: 1,
          explanation: 'PAN card is mandatory for opening a Demat account in India. It\'s used for tax identification and tracking.'
        },
        {
          question: 'NSDL & CDSL are?',
          options: ['Exchanges', 'Brokers', 'Depositories', 'Regulators'],
          correctIndex: 2,
          explanation: 'NSDL (National Securities Depository Limited) and CDSL (Central Depository Services Limited) are the two depositories in India that hold securities electronically.'
        }
      ],
      passingScore: 67
    }
  },
  {
    id: 'cur-03-nav-mutual-funds',
    title: '3. Understanding NAV in Mutual Funds',
    description: 'Learn how mutual fund NAV works and what it really means for your returns.',
    category: 'concepts',
    difficulty: 'beginner',
    durationMinutes: 8,
    rating: 4.7,
    totalRatings: 1650,
    icon: 'PieChart',
    concepts: ['nav', 'mutual-funds', 'aum'],
    tools: ['mf-explorer', 'mf-analyzer'],
    sections: [
      {
        title: 'What is NAV?',
        content: `**NAV (Net Asset Value)** is the per-unit value of a mutual fund. It is calculated daily as:

**NAV = (Total Assets − Liabilities) ÷ Units Outstanding**

Important: Returns depend on NAV **growth**, not NAV **level**.

A fund with NAV ₹500 is NOT more expensive than one with NAV ₹50. What matters is the percentage growth.`
      },
      {
        title: 'India Example',
        content: `If **SBI Bluechip Fund** NAV rises from ₹50 to ₹55:
- Return = (55-50)/50 × 100 = **10%**

Compare this to another fund with NAV rising from ₹500 to ₹550:
- Return = (550-500)/500 × 100 = **10%**

Same returns, different NAV levels. Don't let high NAV scare you away from good funds!`
      }
    ],
    quiz: {
      questions: [
        {
          question: 'NAV is calculated how often?',
          options: ['Monthly', 'Weekly', 'Daily', 'Yearly'],
          correctIndex: 2,
          explanation: 'NAV is calculated at the end of each trading day based on the closing prices of all securities in the fund\'s portfolio.'
        },
        {
          question: 'Higher NAV means expensive fund?',
          options: ['Yes', 'No', 'Always risky', 'Poor returns'],
          correctIndex: 1,
          explanation: 'No! A higher NAV simply means the fund has been around longer or performed well. What matters is NAV growth rate, not absolute NAV.'
        },
        {
          question: 'MF returns depend on?',
          options: ['NAV value', 'NAV growth', 'Fund age', 'Expense ratio only'],
          correctIndex: 1,
          explanation: 'Returns depend on NAV growth percentage, not the absolute NAV value. A 10% growth is 10% whether NAV is ₹10 or ₹1000.'
        }
      ],
      passingScore: 67
    }
  },
  {
    id: 'cur-04-order-types',
    title: '4. Buy vs Sell: Order Types',
    description: 'Master different order types to execute trades like a pro.',
    category: 'concepts',
    difficulty: 'beginner',
    durationMinutes: 10,
    rating: 4.8,
    totalRatings: 2100,
    icon: 'ArrowUpDown',
    concepts: ['market-order', 'limit-order', 'stop-loss'],
    tools: [],
    sections: [
      {
        title: 'Understanding Order Types',
        content: `**Market Order:** Executes instantly at best available price
- Pros: Guaranteed execution
- Cons: May experience slippage (worse price than expected)

**Limit Order:** Executes only at specified price or better
- Pros: Price control
- Cons: May not execute if price doesn't reach your level

**Stop-Loss Order:** Automatically sells if price falls to a certain level
- Used to limit losses on existing positions

**GTC (Good Till Cancelled):** Order remains active until executed or manually cancelled`
      },
      {
        title: 'India Example',
        content: `**Scenario:** You want to buy TCS currently trading at ₹3,510

**Market Order:** You might get filled at ₹3,512 (slippage)
**Limit Order at ₹3,500:** You'll only buy if price falls to ₹3,500 or below

For illiquid stocks, always use limit orders to avoid significant slippage.`
      }
    ],
    quiz: {
      questions: [
        {
          question: 'Market order risk?',
          options: ['No execution', 'Price slippage', 'Delays', 'Rejection'],
          correctIndex: 1,
          explanation: 'Market orders execute immediately but may experience slippage - getting filled at a worse price than expected, especially in volatile or illiquid stocks.'
        },
        {
          question: 'Stop-loss purpose?',
          options: ['Increase profit', 'Reduce tax', 'Limit loss', 'Avoid brokerage'],
          correctIndex: 2,
          explanation: 'Stop-loss orders automatically trigger a sell when price falls to a specified level, limiting your potential loss on a trade.'
        },
        {
          question: 'GTC means?',
          options: ['Good till close', 'Good till canceled', 'Guaranteed trade', 'Government trade'],
          correctIndex: 1,
          explanation: 'GTC (Good Till Cancelled) means the order stays active until it\'s either executed or you manually cancel it.'
        }
      ],
      passingScore: 67
    }
  },
  {
    id: 'cur-05-compound-interest',
    title: '5. Power of Compound Interest',
    description: 'Understand why Einstein called compound interest the 8th wonder of the world.',
    category: 'concepts',
    difficulty: 'beginner',
    durationMinutes: 12,
    rating: 4.9,
    totalRatings: 2800,
    icon: 'TrendingUp',
    concepts: ['compounding', 'sip', 'time-value'],
    tools: ['dividend-sip-tracker'],
    sections: [
      {
        title: 'The Magic of Compounding',
        content: `**Compounding** means earning returns on your returns. The magic formula:

**A = P(1 + r)^n**
- A = Final amount
- P = Principal
- r = Rate of return
- n = Number of periods

**Key Insight:** Time is more powerful than amount. Starting early beats investing more later.

**SIPs (Systematic Investment Plans)** leverage compounding AND rupee-cost averaging - you buy more units when prices are low.`
      },
      {
        title: 'India Example',
        content: `**₹5,000/month SIP at 12% for 20 years:**
- Total invested: ₹12 lakhs
- Final value: ₹~50 lakhs
- Wealth created: ₹38 lakhs just from compounding!

**Same SIP for 30 years:**
- Total invested: ₹18 lakhs
- Final value: ₹~1.75 crores

Those extra 10 years tripled your wealth!`
      }
    ],
    quiz: {
      questions: [
        {
          question: 'Compounding benefits from?',
          options: ['High risk', 'Time', 'Luck', 'Trading'],
          correctIndex: 1,
          explanation: 'Time is the most critical factor in compounding. The longer your money compounds, the more dramatic the growth becomes.'
        },
        {
          question: 'SIP advantage?',
          options: ['Market timing', 'Fixed price', 'Rupee averaging', 'Guaranteed returns'],
          correctIndex: 2,
          explanation: 'SIPs provide rupee-cost averaging - you automatically buy more units when prices are low and fewer when prices are high.'
        },
        {
          question: 'Simple vs compound interest difference?',
          options: ['Same', 'CI grows faster', 'SI grows faster', 'No math'],
          correctIndex: 1,
          explanation: 'Compound interest grows faster because you earn interest on interest. Simple interest only earns on the original principal.'
        }
      ],
      passingScore: 67
    }
  },
  {
    id: 'cur-06-risk-basics',
    title: '6. Understanding Risk Before Investing',
    description: 'Learn different types of investment risks and how to manage them.',
    category: 'concepts',
    difficulty: 'beginner',
    durationMinutes: 10,
    rating: 4.7,
    totalRatings: 1920,
    icon: 'AlertTriangle',
    concepts: ['risk', 'diversification', 'asset-allocation'],
    tools: ['risk-health-dashboard', 'portfolio-correlation'],
    sections: [
      {
        title: 'What is Investment Risk?',
        content: `**Risk** is the possibility of losing money or underperforming expectations.

**Types of Risk:**
- **Market Risk:** Overall market decline
- **Company Risk:** Specific company problems
- **Inflation Risk:** Purchasing power erosion
- **Liquidity Risk:** Can't sell when needed

**Risk Hierarchy (High to Low):**
Equity > Gold > Debt > Savings Account

**Diversification** reduces company-specific (unsystematic) risk but NOT market risk.`
      },
      {
        title: 'India Example',
        content: `**Risk Order for Indian Investors:**
1. Small-cap stocks (highest risk)
2. Mid-cap stocks
3. Large-cap stocks
4. Gold
5. Corporate Bonds
6. Government Bonds
7. Fixed Deposits
8. Savings Account (lowest risk)

Your risk tolerance depends on:
- Age (younger = more risk capacity)
- Income stability
- Financial goals
- Emergency fund size`
      }
    ],
    quiz: {
      questions: [
        {
          question: 'Risk tolerance depends on?',
          options: ['Age & income', 'Broker', 'Exchange', 'SEBI'],
          correctIndex: 0,
          explanation: 'Risk tolerance depends on personal factors like age, income stability, financial obligations, and investment timeline.'
        },
        {
          question: 'Diversification reduces?',
          options: ['Market risk', 'Company risk', 'Inflation', 'Taxes'],
          correctIndex: 1,
          explanation: 'Diversification reduces company-specific (unsystematic) risk. Market risk affects all stocks and cannot be diversified away.'
        },
        {
          question: 'High return usually means?',
          options: ['Low risk', 'High risk', 'No risk', 'Guaranteed'],
          correctIndex: 1,
          explanation: 'Risk and return are generally correlated. Higher potential returns almost always come with higher risk.'
        }
      ],
      passingScore: 67
    }
  },
  {
    id: 'cur-07-dividends',
    title: '7. Dividend Fundamentals',
    description: 'Understand how dividends work and key dates every investor should know.',
    category: 'concepts',
    difficulty: 'beginner',
    durationMinutes: 10,
    rating: 4.8,
    totalRatings: 1750,
    icon: 'Coins',
    concepts: ['dividends', 'dividend-yield', 'ex-date'],
    tools: ['dividend-crystal-ball', 'income-stability'],
    sections: [
      {
        title: 'Understanding Dividends',
        content: `**Dividends** are profit distributions from company to shareholders.

**Key Dates:**
1. **Announcement Date:** Company declares dividend
2. **Ex-Dividend Date:** Must own shares BEFORE this date to receive dividend
3. **Record Date:** Company checks who owns shares
4. **Payment Date:** Dividend credited to your account

**Dividend Yield = Annual Dividend / Stock Price × 100**

In India, dividends are taxable in investor's slab (not flat rate anymore).`
      },
      {
        title: 'India Example',
        content: `**Infosys** pays consistent dividends yearly - typically ₹15-20 per share.

If Infosys trades at ₹1,500 and pays ₹18 dividend:
- Dividend Yield = 18/1500 × 100 = **1.2%**

**Tax Treatment (India):**
- Dividends added to your income
- Taxed at your slab rate
- TDS of 10% if dividend > ₹5,000 per company`
      }
    ],
    quiz: {
      questions: [
        {
          question: 'Ex-dividend date means?',
          options: ['Payment date', 'Cut-off date for dividend eligibility', 'Record date', 'Bonus date'],
          correctIndex: 1,
          explanation: 'You must own shares BEFORE the ex-dividend date to receive the dividend. Buying on or after ex-date means no dividend.'
        },
        {
          question: 'Dividend yield formula?',
          options: ['Dividend ÷ Price', 'Price ÷ Dividend', 'NAV ÷ Dividend', 'EPS ÷ Price'],
          correctIndex: 0,
          explanation: 'Dividend Yield = Annual Dividend per Share / Current Stock Price × 100'
        },
        {
          question: 'Dividend tax in India?',
          options: ['Exempt', 'Flat 10%', 'Slab-based', 'Corporate pays only'],
          correctIndex: 2,
          explanation: 'Since FY 2020-21, dividends are taxable in the hands of investors at their applicable income tax slab rate.'
        }
      ],
      passingScore: 67
    }
  },
  {
    id: 'cur-08-reading-charts',
    title: '8. Reading a Stock Chart',
    description: 'Learn to read candlestick charts and identify basic trends.',
    category: 'analysis',
    difficulty: 'beginner',
    durationMinutes: 12,
    rating: 4.8,
    totalRatings: 2350,
    icon: 'BarChart',
    concepts: ['candlesticks', 'ohlc', 'trends'],
    tools: ['candlestick-hero', 'price-structure'],
    sections: [
      {
        title: 'Understanding Candlesticks',
        content: `**Candlesticks** show OHLC data:
- **O**pen: Starting price
- **H**igh: Highest price
- **L**ow: Lowest price
- **C**lose: Ending price

**Green/White candle:** Close > Open (Bullish)
**Red/Black candle:** Close < Open (Bearish)

**Trends:**
- **Uptrend:** Higher highs and higher lows
- **Downtrend:** Lower highs and lower lows
- **Sideways:** No clear direction

**Timeframes:** Choose based on investment horizon
- Traders: 5min, 15min, 1hr
- Investors: Daily, Weekly`
      },
      {
        title: 'India Example',
        content: `**Daily chart of Nifty 50** shows long-term trend - useful for investors.

Reading a candle:
- Long green body = Strong buying
- Long red body = Strong selling
- Long upper wick = Rejection at highs
- Long lower wick = Rejection at lows

Always match your chart timeframe to your trading/investment horizon.`
      }
    ],
    quiz: {
      questions: [
        {
          question: 'Long green candle means?',
          options: ['Strong selling', 'Strong buying', 'No volume', 'Gap down'],
          correctIndex: 1,
          explanation: 'A long green (bullish) candle indicates strong buying pressure where buyers pushed price significantly higher during that period.'
        },
        {
          question: 'OHLC stands for?',
          options: ['Open High Low Close', 'Order History', 'Options data', 'Volume data'],
          correctIndex: 0,
          explanation: 'OHLC = Open, High, Low, Close - the four key price points shown in each candlestick.'
        },
        {
          question: 'Investors prefer which timeframe?',
          options: ['1-min', '5-min', 'Daily/weekly', 'Tick'],
          correctIndex: 2,
          explanation: 'Long-term investors use daily or weekly charts to filter out short-term noise and focus on the bigger picture.'
        }
      ],
      passingScore: 67
    }
  },
  {
    id: 'cur-09-ipo-basics',
    title: '9. What is an IPO?',
    description: 'Learn how companies go public and how to participate in IPOs.',
    category: 'concepts',
    difficulty: 'beginner',
    durationMinutes: 10,
    rating: 4.7,
    totalRatings: 2100,
    icon: 'Rocket',
    concepts: ['ipo', 'primary-market', 'allotment'],
    tools: [],
    sections: [
      {
        title: 'Understanding IPOs',
        content: `**IPO (Initial Public Offering)** is when a private company goes public by selling shares to the public for the first time.

**Process:**
1. Company files DRHP with SEBI
2. SEBI approves after review
3. Price band announced
4. Subscription period (3-5 days)
5. Allotment (lottery for oversubscribed IPOs)
6. Listing on exchange

**Categories:**
- QIB (Qualified Institutional Buyers): 50%
- NII (Non-Institutional): 15%
- Retail: 35%

**ASBA:** Application Supported by Blocked Amount - money blocked, not debited until allotment.`
      },
      {
        title: 'India Example',
        content: `**Zomato IPO (2021):**
- Price Band: ₹72-76
- Oversubscribed: 38x
- Retail investors applied via ASBA
- Allotment by lottery
- Listed at ₹116 (52% premium)

Note: Not all IPOs give listing gains. Do your research - check valuations, business model, and financials.`
      }
    ],
    quiz: {
      questions: [
        {
          question: 'IPO full form?',
          options: ['Initial Public Offer', 'Indian Public Offer', 'Initial Price Offer', 'Institutional Public Offer'],
          correctIndex: 0,
          explanation: 'IPO stands for Initial Public Offering - the first time a company offers shares to the public.'
        },
        {
          question: 'Oversubscription means?',
          options: ['Low demand', 'Demand > supply', 'Guaranteed allotment', 'Loss'],
          correctIndex: 1,
          explanation: 'Oversubscription means more applications received than shares available - indicating high demand for the IPO.'
        },
        {
          question: 'IPO allotment is?',
          options: ['Guaranteed', 'Random lottery based', 'Fixed', 'Broker decides'],
          correctIndex: 1,
          explanation: 'For oversubscribed IPOs, retail allotment is done via lottery. Applying doesn\'t guarantee you\'ll get shares.'
        }
      ],
      passingScore: 67
    }
  },
  {
    id: 'cur-10-inflation',
    title: '10. Inflation & Your Money',
    description: 'Understand how inflation erodes wealth and why investing is essential.',
    category: 'concepts',
    difficulty: 'beginner',
    durationMinutes: 10,
    rating: 4.8,
    totalRatings: 1850,
    icon: 'TrendingDown',
    concepts: ['inflation', 'real-returns', 'purchasing-power'],
    tools: [],
    sections: [
      {
        title: 'Understanding Inflation',
        content: `**Inflation** is the rate at which prices increase, eroding your purchasing power.

**Real Return = Nominal Return − Inflation**

If your FD gives 6% and inflation is 5%:
- Real Return = 6% - 5% = **1%**
- Your wealth barely grows in real terms!

**Why Invest?**
Cash and low-yield instruments lose value over time. Investing in assets that beat inflation is essential for wealth preservation.`
      },
      {
        title: 'India Example',
        content: `**India's Average Inflation: ~5-6%**

Returns comparison:
- Savings Account: 3% → Real Return: -2% (losing money!)
- FD: 6% → Real Return: ~1%
- Debt Funds: 7% → Real Return: ~2%
- Equity (long-term): 12% → Real Return: ~7%

**₹1 lakh today at 6% inflation:**
- After 10 years, needs ₹1.79 lakhs to have same purchasing power
- After 20 years, needs ₹3.21 lakhs!`
      }
    ],
    quiz: {
      questions: [
        {
          question: 'Inflation reduces?',
          options: ['Income', 'Purchasing power', 'Interest rates', 'GDP'],
          correctIndex: 1,
          explanation: 'Inflation reduces purchasing power - the same amount of money buys fewer goods and services over time.'
        },
        {
          question: 'Real return formula?',
          options: ['Return + inflation', 'Return − inflation', 'Inflation ÷ return', 'None'],
          correctIndex: 1,
          explanation: 'Real Return = Nominal Return - Inflation Rate. This shows your actual wealth growth after accounting for price increases.'
        },
        {
          question: 'Best inflation hedge long-term?',
          options: ['Cash', 'Equity', 'Savings account', 'Gold only'],
          correctIndex: 1,
          explanation: 'Equity has historically been the best long-term inflation hedge, consistently delivering returns above inflation.'
        }
      ],
      passingScore: 67
    }
  },
  {
    id: 'cur-11-emergency-fund',
    title: '11. Emergency Fund',
    description: 'Why you need an emergency fund before investing.',
    category: 'concepts',
    difficulty: 'beginner',
    durationMinutes: 8,
    rating: 4.8,
    totalRatings: 1650,
    icon: 'Shield',
    concepts: ['emergency-fund', 'liquidity', 'financial-planning'],
    tools: [],
    sections: [
      {
        title: 'Why Emergency Fund First?',
        content: `**Emergency Fund** ensures liquidity during unexpected events:
- Job loss
- Medical emergencies
- Urgent home/car repairs
- Family emergencies

**Recommended Size: 6 months of expenses**

**Where to Keep:**
- Savings account (instant access)
- Liquid mutual funds (1-2 day access)
- Short-term FDs (some lock-in)

**NOT in:**
- Stocks (too volatile)
- Real estate (illiquid)
- Locked instruments`
      },
      {
        title: 'India Example',
        content: `**Calculation:**
Monthly expenses: ₹50,000
Emergency fund needed: ₹50,000 × 6 = **₹3 lakhs**

**Suggested Split:**
- ₹1 lakh in savings account (instant access)
- ₹2 lakhs in liquid fund (slightly better returns)

Build this BEFORE you start investing. It prevents you from selling investments at wrong times during emergencies.`
      }
    ],
    quiz: {
      questions: [
        {
          question: 'Emergency fund size?',
          options: ['1 month', '3 months', '6 months', '10 years'],
          correctIndex: 2,
          explanation: '6 months of expenses is the recommended emergency fund size - enough to cover most unexpected situations.'
        },
        {
          question: 'Where to keep emergency fund?',
          options: ['Equity', 'Crypto', 'Liquid funds/savings', 'Real estate'],
          correctIndex: 2,
          explanation: 'Emergency funds should be in highly liquid, low-risk instruments like savings accounts or liquid mutual funds.'
        },
        {
          question: 'Purpose of emergency fund?',
          options: ['Returns', 'Liquidity & safety', 'Tax saving', 'Trading'],
          correctIndex: 1,
          explanation: 'The primary purpose is liquidity and safety - having money available when you need it urgently.'
        }
      ],
      passingScore: 67
    }
  },
  {
    id: 'cur-12-tax-basics',
    title: '12. Tax Basics for Investors (India)',
    description: 'Understand capital gains tax on stocks and mutual funds.',
    category: 'concepts',
    difficulty: 'beginner',
    durationMinutes: 12,
    rating: 4.7,
    totalRatings: 1950,
    icon: 'Receipt',
    concepts: ['stcg', 'ltcg', 'taxation'],
    tools: ['tax-calculator'],
    sections: [
      {
        title: 'Capital Gains Tax in India',
        content: `**Equity Investments:**

**STCG (Short-Term Capital Gains):**
- Holding period: < 1 year
- Tax rate: **15%**

**LTCG (Long-Term Capital Gains):**
- Holding period: > 1 year
- Tax rate: **10%** (above ₹1 lakh exemption)

**Debt Funds (from April 2023):**
- All gains taxed at slab rate (no LTCG benefit)

**Remember:** Tax is on GAINS, not investment amount.`
      },
      {
        title: 'India Example',
        content: `**Example 1: STCG**
- Bought Infosys: ₹1,00,000
- Sold after 6 months: ₹1,20,000
- Gain: ₹20,000
- STCG Tax (15%): ₹3,000

**Example 2: LTCG**
- Bought Infosys: ₹1,00,000
- Sold after 2 years: ₹1,50,000
- Gain: ₹50,000
- First ₹1 lakh exempt, so no tax!

**Tax-Loss Harvesting:** Sell loss-making stocks before FY end to offset gains.`
      }
    ],
    quiz: {
      questions: [
        {
          question: 'Equity LTCG holding period?',
          options: ['6 months', '1 year', '2 years', '3 years'],
          correctIndex: 1,
          explanation: 'For equity investments, holding for more than 1 year qualifies for Long-Term Capital Gains treatment.'
        },
        {
          question: 'STCG tax on equity?',
          options: ['10%', '15%', 'Slab', 'Nil'],
          correctIndex: 1,
          explanation: 'Short-Term Capital Gains on equity is taxed at a flat rate of 15% (plus surcharge and cess).'
        },
        {
          question: 'Capital gains taxed under?',
          options: ['GST', 'Income tax', 'Wealth tax', 'Stamp duty'],
          correctIndex: 1,
          explanation: 'Capital gains are part of income tax - you report them in your ITR under "Capital Gains".'
        }
      ],
      passingScore: 67
    }
  },
  {
    id: 'cur-13-sip-vs-lumpsum',
    title: '13. SIP vs Lump Sum',
    description: 'When to use SIP and when lump sum investing makes sense.',
    category: 'strategies',
    difficulty: 'beginner',
    durationMinutes: 10,
    rating: 4.8,
    totalRatings: 2200,
    icon: 'Repeat',
    concepts: ['sip', 'lump-sum', 'rupee-cost-averaging'],
    tools: ['dividend-sip-tracker'],
    sections: [
      {
        title: 'SIP vs Lump Sum',
        content: `**SIP (Systematic Investment Plan):**
- Fixed amount at regular intervals
- Rupee-cost averaging (buy more when low)
- Reduces timing risk
- Builds discipline
- Best for: Regular income, beginners

**Lump Sum:**
- One-time large investment
- Works better in undervalued markets
- Higher short-term volatility
- Best for: Windfall money, market lows

**Research shows:** In 70% of cases, lump sum beats SIP (due to market's upward bias). But SIP wins psychologically.`
      },
      {
        title: 'India Example',
        content: `**March 2020 COVID Crash:**

**SIP investor:**
- Continued ₹10,000/month SIP
- Bought more units at lower prices
- Averaged down naturally

**Lump sum opportunity:**
- ₹1 lakh invested at Nifty 7,500
- By Dec 2020, Nifty at 13,500
- Return: 80% in 9 months!

**Best approach:** Regular SIP + opportunistic lump sum during crashes.`
      }
    ],
    quiz: {
      questions: [
        {
          question: 'SIP benefit?',
          options: ['Timing market', 'Discipline', 'Fixed returns', 'No volatility'],
          correctIndex: 1,
          explanation: 'SIP\'s biggest benefit is enforcing investment discipline and removing emotional decision-making from the process.'
        },
        {
          question: 'Lump sum suits?',
          options: ['High valuation', 'Overpriced markets', 'Market lows', 'Beginners'],
          correctIndex: 2,
          explanation: 'Lump sum investing works best when markets are at low valuations - you get more units for your money.'
        },
        {
          question: 'SIP invests?',
          options: ['Once', 'Daily', 'Regularly', 'Randomly'],
          correctIndex: 2,
          explanation: 'SIP invests a fixed amount at regular intervals - usually monthly, but can be weekly or quarterly.'
        }
      ],
      passingScore: 67
    }
  },
  {
    id: 'cur-14-bonds-fds',
    title: '14. Bonds & Fixed Deposits',
    description: 'Understanding fixed-income investments for stable returns.',
    category: 'concepts',
    difficulty: 'beginner',
    durationMinutes: 10,
    rating: 4.6,
    totalRatings: 1450,
    icon: 'Landmark',
    concepts: ['bonds', 'fixed-deposits', 'debt-instruments'],
    tools: [],
    sections: [
      {
        title: 'Fixed Income Basics',
        content: `**Bonds:**
- Debt instrument where you lend money
- Issuer pays regular interest (coupon)
- Principal returned at maturity
- Types: Government (G-Sec), Corporate, Tax-free

**Fixed Deposits (FDs):**
- Bank deposit with fixed tenure and rate
- Lower risk, lower returns
- Premature withdrawal penalty

**Key Risks:**
- **Credit Risk:** Issuer default
- **Interest Rate Risk:** Bond prices fall when rates rise
- **Inflation Risk:** Real returns may be negative`
      },
      {
        title: 'India Example',
        content: `**Government Bonds (G-Sec):**
- Issuer: RBI on behalf of Government
- Risk: Sovereign (safest)
- Returns: 7-7.5%

**Corporate Bonds:**
- Higher returns (8-10%)
- Higher credit risk
- Check credit rating (AAA safest)

**FD vs Debt Fund:**
- FD: Fixed return, taxed at slab
- Debt fund: Market-linked, taxed at slab (post-2023)

Government bonds are safer than corporate bonds.`
      }
    ],
    quiz: {
      questions: [
        {
          question: 'Bond risk mainly?',
          options: ['Inflation & credit', 'Liquidity only', 'Volume', 'Timing'],
          correctIndex: 0,
          explanation: 'Main bond risks are credit risk (issuer default) and inflation risk (returns may not beat inflation).'
        },
        {
          question: 'FD returns are?',
          options: ['Variable', 'Fixed', 'Market linked', 'Equity based'],
          correctIndex: 1,
          explanation: 'Fixed Deposits offer fixed returns - the interest rate is locked when you invest.'
        },
        {
          question: 'G-Sec issuer?',
          options: ['Banks', 'RBI on behalf of Govt', 'SEBI', 'NSE'],
          correctIndex: 1,
          explanation: 'Government Securities (G-Sec) are issued by RBI on behalf of the Government of India.'
        }
      ],
      passingScore: 67
    }
  },
  {
    id: 'cur-15-behavioral-finance',
    title: '15. Behavioral Finance Basics',
    description: 'Understand how emotions affect investment decisions.',
    category: 'concepts',
    difficulty: 'beginner',
    durationMinutes: 12,
    rating: 4.9,
    totalRatings: 2100,
    icon: 'Brain',
    concepts: ['behavioral-finance', 'fomo', 'loss-aversion'],
    tools: [],
    sections: [
      {
        title: 'Psychology of Investing',
        content: `**Common Biases:**

**Fear & Greed:** Drive bubbles and crashes
- Greed → Buy at tops
- Fear → Sell at bottoms

**FOMO (Fear of Missing Out):** Chasing hot stocks/trends

**Loss Aversion:** Losses hurt 2x more than equivalent gains feel good

**Herd Mentality:** Following the crowd blindly

**Confirmation Bias:** Seeking info that supports your view

**Key Truth:** Discipline beats intelligence in markets.`
      },
      {
        title: 'India Example',
        content: `**March 2020 COVID Crash:**
- Nifty fell from 12,000 to 7,500 (-40%)
- Panic selling everywhere
- Those who sold at bottom locked in losses
- Those who stayed or bought more made 70%+ returns

**How to overcome biases:**
1. Have a written investment plan
2. Maintain a trading journal
3. Set rules and follow them
4. Avoid checking portfolio daily
5. Don't follow social media tips`
      }
    ],
    quiz: {
      questions: [
        {
          question: 'FOMO stands for?',
          options: ['Fear of market options', 'Fear of missing out', 'Fund of mutual options', 'None'],
          correctIndex: 1,
          explanation: 'FOMO = Fear of Missing Out - the anxiety that others are profiting while you\'re not, leading to impulsive decisions.'
        },
        {
          question: 'Loss aversion means?',
          options: ['Avoiding risk', 'Loss hurts more than gain pleases', 'High risk appetite', 'Overconfidence'],
          correctIndex: 1,
          explanation: 'Loss aversion means the pain of losing ₹100 feels roughly twice as intense as the pleasure of gaining ₹100.'
        },
        {
          question: 'Best emotional control tool?',
          options: ['News', 'Tips', 'Journal & rules', 'Leverage'],
          correctIndex: 2,
          explanation: 'Maintaining a journal and following pre-set rules removes emotion from decision-making.'
        }
      ],
      passingScore: 67
    }
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// BEGINNER FLASHCARDS - 25 cards
// ═══════════════════════════════════════════════════════════════════════════

export interface CurriculumFlashcard {
  id: string;
  front: string;
  back: string;
  moduleRef?: string;
}

export const BEGINNER_FLASHCARDS: CurriculumFlashcard[] = [
  { id: 'bf-01', front: 'What is a stock?', back: 'Ownership in a company', moduleRef: 'cur-01-stock-basics' },
  { id: 'bf-02', front: 'NSE stands for?', back: 'National Stock Exchange', moduleRef: 'cur-01-stock-basics' },
  { id: 'bf-03', front: 'Demat purpose?', back: 'Electronic holding of securities', moduleRef: 'cur-02-demat-account' },
  { id: 'bf-04', front: 'NAV meaning?', back: 'Per unit MF value', moduleRef: 'cur-03-nav-mutual-funds' },
  { id: 'bf-05', front: 'SIP full form?', back: 'Systematic Investment Plan', moduleRef: 'cur-05-compound-interest' },
  { id: 'bf-06', front: 'Compounding benefit?', back: 'Time multiplies returns', moduleRef: 'cur-05-compound-interest' },
  { id: 'bf-07', front: 'Risk tolerance depends on?', back: 'Age & income', moduleRef: 'cur-06-risk-basics' },
  { id: 'bf-08', front: 'Dividend yield formula?', back: 'Dividend ÷ Price', moduleRef: 'cur-07-dividends' },
  { id: 'bf-09', front: 'Candlestick shows?', back: 'OHLC (Open, High, Low, Close)', moduleRef: 'cur-08-reading-charts' },
  { id: 'bf-10', front: 'IPO meaning?', back: 'Company going public', moduleRef: 'cur-09-ipo-basics' },
  { id: 'bf-11', front: 'Inflation effect?', back: 'Reduces purchasing power', moduleRef: 'cur-10-inflation' },
  { id: 'bf-12', front: 'Emergency fund size?', back: '6 months expenses', moduleRef: 'cur-11-emergency-fund' },
  { id: 'bf-13', front: 'STCG holding period?', back: '<1 year', moduleRef: 'cur-12-tax-basics' },
  { id: 'bf-14', front: 'LTCG equity tax?', back: '10% above ₹1 lakh', moduleRef: 'cur-12-tax-basics' },
  { id: 'bf-15', front: 'SIP advantage?', back: 'Rupee averaging', moduleRef: 'cur-13-sip-vs-lumpsum' },
  { id: 'bf-16', front: 'FD risk?', back: 'Inflation risk', moduleRef: 'cur-14-bonds-fds' },
  { id: 'bf-17', front: 'Bond issuer?', back: 'Government or company', moduleRef: 'cur-14-bonds-fds' },
  { id: 'bf-18', front: 'Market order?', back: 'Immediate execution at best price', moduleRef: 'cur-04-order-types' },
  { id: 'bf-19', front: 'Limit order?', back: 'Price control - executes at specified price', moduleRef: 'cur-04-order-types' },
  { id: 'bf-20', front: 'Stop loss?', back: 'Limits downside loss', moduleRef: 'cur-04-order-types' },
  { id: 'bf-21', front: 'Behavioral bias?', back: 'Emotional error in decision making', moduleRef: 'cur-15-behavioral-finance' },
  { id: 'bf-22', front: 'FOMO meaning?', back: 'Fear of missing out', moduleRef: 'cur-15-behavioral-finance' },
  { id: 'bf-23', front: 'Diversification benefit?', back: 'Risk reduction', moduleRef: 'cur-06-risk-basics' },
  { id: 'bf-24', front: 'Equity return type?', back: 'Capital appreciation + dividends', moduleRef: 'cur-01-stock-basics' },
  { id: 'bf-25', front: 'Gold role in portfolio?', back: 'Hedge/diversifier', moduleRef: 'cur-06-risk-basics' }
];
