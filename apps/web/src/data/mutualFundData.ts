// ═══════════════════════════════════════════════════════════════════════════
// MUTUAL FUND DATA
// Comprehensive dataset of 200 Indian mutual funds
// ═══════════════════════════════════════════════════════════════════════════

export interface MutualFundData {
  rank: number;
  name: string;
  category: 'Equity' | 'Debt' | 'Hybrid' | 'Index' | 'International' | 'Commodity' | 'Solution';
  subCategory: string;
  returns1Y: number;
  returns3Y: number;
  returns5Y: number;
  aum: number; // in Crores
  expenseRatio: number;
  riskLevel: 'Low' | 'Low-Moderate' | 'Moderate' | 'Moderate-High' | 'High' | 'Very High';
  minSip: number;
  minLumpsum: number;
  exitLoad: string;
  fundManager: string;
  launchDate: string;
}

export const MUTUAL_FUND_DATA: MutualFundData[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // EQUITY - MID CAP
  // ═══════════════════════════════════════════════════════════════════════════
  { rank: 1, name: "Motilal Oswal Midcap Fund", category: "Equity", subCategory: "Mid Cap", returns1Y: 23.79, returns3Y: 21.02, returns5Y: 28.62, aum: 38003, expenseRatio: 1.54, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "1% if <1Y", fundManager: "Niket Shah", launchDate: "Feb 2014" },
  { rank: 2, name: "HDFC Mid Cap Opportunities Fund", category: "Equity", subCategory: "Mid Cap", returns1Y: 22.45, returns3Y: 32.18, returns5Y: 25.68, aum: 75234, expenseRatio: 1.36, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Chirag Setalvad", launchDate: "Jun 2007" },
  { rank: 3, name: "Nippon India Growth Fund", category: "Equity", subCategory: "Mid Cap", returns1Y: 21.32, returns3Y: 30.45, returns5Y: 25.15, aum: 31245, expenseRatio: 1.53, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Manish Gunwani", launchDate: "Oct 1995" },
  { rank: 51, name: "PGIM India Midcap Opportunities Fund", category: "Equity", subCategory: "Mid Cap", returns1Y: 24.56, returns3Y: 23.45, returns5Y: 23.32, aum: 11284, expenseRatio: 0.46, riskLevel: "High", minSip: 1000, minLumpsum: 5000, exitLoad: "0.5% if <1Y", fundManager: "Aniruddha Naha", launchDate: "Dec 2013" },
  { rank: 52, name: "Kotak Emerging Equity Fund", category: "Equity", subCategory: "Mid Cap", returns1Y: 21.34, returns3Y: 20.12, returns5Y: 19.67, aum: 48765, expenseRatio: 1.52, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Pankaj Tibrewal", launchDate: "Mar 2007" },
  { rank: 54, name: "Edelweiss Mid Cap Fund", category: "Equity", subCategory: "Mid Cap", returns1Y: 22.78, returns3Y: 24.47, returns5Y: 25.16, aum: 8666, expenseRatio: 0.38, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Trideep Bhattacharya", launchDate: "Dec 2007" },
  { rank: 55, name: "Mahindra Manulife Mid Cap Fund", category: "Equity", subCategory: "Mid Cap", returns1Y: 20.12, returns3Y: 19.34, returns5Y: 18.45, aum: 3456, expenseRatio: 0.46, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "1% if <1Y", fundManager: "Fatema Pacha", launchDate: "Nov 2018" },
  { rank: 56, name: "Invesco India Mid Cap Fund", category: "Equity", subCategory: "Mid Cap", returns1Y: 19.87, returns3Y: 18.76, returns5Y: 17.89, aum: 5432, expenseRatio: 1.82, riskLevel: "High", minSip: 500, minLumpsum: 1000, exitLoad: "1% if <1Y", fundManager: "Pranav Gokhale", launchDate: "Apr 2007" },
  { rank: 63, name: "Sundaram Mid Cap Fund", category: "Equity", subCategory: "Mid Cap", returns1Y: 19.56, returns3Y: 18.67, returns5Y: 17.78, aum: 12345, expenseRatio: 1.58, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "S Krishnakumar", launchDate: "Jul 2002" },
  { rank: 64, name: "Taurus Mid Cap Fund", category: "Equity", subCategory: "Mid Cap", returns1Y: 17.23, returns3Y: 16.34, returns5Y: 15.45, aum: 567, expenseRatio: 2.15, riskLevel: "High", minSip: 500, minLumpsum: 1000, exitLoad: "1% if <1Y", fundManager: "Prasanna Pathak", launchDate: "Apr 1994" },

  // ═══════════════════════════════════════════════════════════════════════════
  // EQUITY - SMALL CAP
  // ═══════════════════════════════════════════════════════════════════════════
  { rank: 4, name: "Quant Small Cap Fund", category: "Equity", subCategory: "Small Cap", returns1Y: 19.68, returns3Y: 23.73, returns5Y: 32.45, aum: 30170, expenseRatio: 1.59, riskLevel: "Very High", minSip: 1000, minLumpsum: 5000, exitLoad: "1% if <1Y", fundManager: "Sanjeev Sharma", launchDate: "Jan 2013" },
  { rank: 5, name: "Nippon India Small Cap Fund", category: "Equity", subCategory: "Small Cap", returns1Y: 19.51, returns3Y: 21.76, returns5Y: 28.92, aum: 68572, expenseRatio: 1.39, riskLevel: "Very High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Samir Rachh", launchDate: "Sep 2010" },
  { rank: 6, name: "Axis Small Cap Fund", category: "Equity", subCategory: "Small Cap", returns1Y: 16.52, returns3Y: 19.56, returns5Y: 25.34, aum: 26769, expenseRatio: 1.59, riskLevel: "Very High", minSip: 500, minLumpsum: 500, exitLoad: "1% if <1Y", fundManager: "Anupam Tiwari", launchDate: "Nov 2013" },
  { rank: 57, name: "Tata Small Cap Fund", category: "Equity", subCategory: "Small Cap", returns1Y: 18.34, returns3Y: 17.56, returns5Y: 16.78, aum: 9876, expenseRatio: 1.72, riskLevel: "Very High", minSip: 500, minLumpsum: 5000, exitLoad: "1% if <1Y", fundManager: "Chandraprakash Padiyar", launchDate: "Nov 2018" },
  { rank: 58, name: "Franklin India Smaller Companies Fund", category: "Equity", subCategory: "Small Cap", returns1Y: 17.89, returns3Y: 16.78, returns5Y: 15.89, aum: 14567, expenseRatio: 1.78, riskLevel: "Very High", minSip: 500, minLumpsum: 5000, exitLoad: "1% if <1Y", fundManager: "R Janakiraman", launchDate: "Jan 2006" },
  { rank: 59, name: "HSBC Small Cap Fund", category: "Equity", subCategory: "Small Cap", returns1Y: 16.45, returns3Y: 15.67, returns5Y: 14.89, aum: 16789, expenseRatio: 1.68, riskLevel: "Very High", minSip: 500, minLumpsum: 5000, exitLoad: "1% if <1Y", fundManager: "Ankur Arora", launchDate: "May 2014" },
  { rank: 60, name: "Union Small Cap Fund", category: "Equity", subCategory: "Small Cap", returns1Y: 15.78, returns3Y: 14.89, returns5Y: 13.78, aum: 2345, expenseRatio: 1.82, riskLevel: "Very High", minSip: 500, minLumpsum: 1000, exitLoad: "1% if <1Y", fundManager: "Vinay Paharia", launchDate: "Jun 2014" },
  { rank: 65, name: "Bandhan Small Cap Fund", category: "Equity", subCategory: "Small Cap", returns1Y: 14.56, returns3Y: 13.67, returns5Y: 12.78, aum: 4567, expenseRatio: 1.85, riskLevel: "Very High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Manish Gunwani", launchDate: "Feb 2020" },
  { rank: 66, name: "SBI Small Cap Fund", category: "Equity", subCategory: "Small Cap", returns1Y: 17.12, returns3Y: 16.23, returns5Y: 15.34, aum: 33456, expenseRatio: 1.45, riskLevel: "Very High", minSip: 500, minLumpsum: 500, exitLoad: "1% if <1Y", fundManager: "R Srinivasan", launchDate: "Sep 2009" },

  // ═══════════════════════════════════════════════════════════════════════════
  // EQUITY - LARGE CAP
  // ═══════════════════════════════════════════════════════════════════════════
  { rank: 41, name: "Quant Large Cap Fund", category: "Equity", subCategory: "Large Cap", returns1Y: 18.45, returns3Y: 17.23, returns5Y: 16.89, aum: 2345, expenseRatio: 1.62, riskLevel: "High", minSip: 1000, minLumpsum: 5000, exitLoad: "1% if <1Y", fundManager: "Sanjeev Sharma", launchDate: "Mar 2001" },
  { rank: 42, name: "Sundaram Large Cap Fund", category: "Equity", subCategory: "Large Cap", returns1Y: 15.67, returns3Y: 14.56, returns5Y: 13.52, aum: 1234, expenseRatio: 1.45, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Rohit Seksaria", launchDate: "Feb 1997" },
  { rank: 43, name: "Canara Robeco Bluechip Equity Fund", category: "Equity", subCategory: "Large Cap", returns1Y: 16.78, returns3Y: 15.89, returns5Y: 14.67, aum: 12345, expenseRatio: 1.53, riskLevel: "High", minSip: 1000, minLumpsum: 5000, exitLoad: "1% if <1Y", fundManager: "Shridatta Bhandwaldar", launchDate: "Aug 2010" },
  { rank: 44, name: "ICICI Prudential Bluechip Fund", category: "Equity", subCategory: "Large Cap", returns1Y: 17.23, returns3Y: 16.45, returns5Y: 15.23, aum: 62345, expenseRatio: 1.35, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Anish Tawakley", launchDate: "May 2008" },
  { rank: 45, name: "SBI Bluechip Fund", category: "Equity", subCategory: "Large Cap", returns1Y: 15.89, returns3Y: 15.12, returns5Y: 14.45, aum: 52678, expenseRatio: 1.42, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "1% if <1Y", fundManager: "Sohini Andani", launchDate: "Feb 2006" },
  { rank: 46, name: "Axis Bluechip Fund", category: "Equity", subCategory: "Large Cap", returns1Y: 14.56, returns3Y: 13.78, returns5Y: 12.89, aum: 42345, expenseRatio: 1.52, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "1% if <1Y", fundManager: "Shreyash Devalkar", launchDate: "Jan 2010" },
  { rank: 47, name: "Mirae Asset Large Cap Fund", category: "Equity", subCategory: "Large Cap", returns1Y: 16.45, returns3Y: 15.67, returns5Y: 14.89, aum: 45678, expenseRatio: 1.38, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "1% if <1Y", fundManager: "Gaurav Misra", launchDate: "Apr 2008" },
  { rank: 48, name: "Kotak Bluechip Fund", category: "Equity", subCategory: "Large Cap", returns1Y: 15.34, returns3Y: 14.67, returns5Y: 13.78, aum: 8765, expenseRatio: 1.51, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Harsha Upadhyaya", launchDate: "Dec 1998" },
  { rank: 49, name: "Nippon India Large Cap Fund", category: "Equity", subCategory: "Large Cap", returns1Y: 16.12, returns3Y: 15.34, returns5Y: 14.12, aum: 25678, expenseRatio: 1.48, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Sailesh Raj Bhan", launchDate: "Aug 2007" },
  { rank: 50, name: "HDFC Top 100 Fund", category: "Equity", subCategory: "Large Cap", returns1Y: 17.89, returns3Y: 16.78, returns5Y: 15.56, aum: 35678, expenseRatio: 1.35, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Rahul Baijal", launchDate: "Oct 1996" },
  { rank: 61, name: "Baroda BNP Paribas Large Cap Fund", category: "Equity", subCategory: "Large Cap", returns1Y: 14.23, returns3Y: 13.45, returns5Y: 12.67, aum: 3456, expenseRatio: 1.62, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "1% if <1Y", fundManager: "Sanjay Chawla", launchDate: "Sep 2004" },
  { rank: 62, name: "DSP Large Cap Fund", category: "Equity", subCategory: "Large Cap", returns1Y: 15.12, returns3Y: 14.34, returns5Y: 13.45, aum: 2345, expenseRatio: 1.55, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Abhishek Singh", launchDate: "Apr 1997" },

  // ═══════════════════════════════════════════════════════════════════════════
  // EQUITY - FLEXI CAP
  // ═══════════════════════════════════════════════════════════════════════════
  { rank: 16, name: "HDFC Flexi Cap Fund", category: "Equity", subCategory: "Flexi Cap", returns1Y: 21.06, returns3Y: 18.86, returns5Y: 19.34, aum: 94069, expenseRatio: 1.35, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Roshi Jain", launchDate: "Jan 1995" },
  { rank: 17, name: "Quant Flexi Cap Fund", category: "Equity", subCategory: "Flexi Cap", returns1Y: 16.10, returns3Y: 20.07, returns5Y: 24.56, aum: 6867, expenseRatio: 1.79, riskLevel: "High", minSip: 1000, minLumpsum: 5000, exitLoad: "1% if <1Y", fundManager: "Sanjeev Sharma", launchDate: "Sep 2008" },
  { rank: 18, name: "Parag Parikh Flexi Cap Fund", category: "Equity", subCategory: "Flexi Cap", returns1Y: 18.92, returns3Y: 22.34, returns5Y: 23.78, aum: 72456, expenseRatio: 1.33, riskLevel: "High", minSip: 1000, minLumpsum: 1000, exitLoad: "2% if <1Y", fundManager: "Rajeev Thakkar", launchDate: "May 2013" },
  { rank: 53, name: "PGIM India Flexi Cap Fund", category: "Equity", subCategory: "Flexi Cap", returns1Y: 19.45, returns3Y: 18.34, returns5Y: 17.89, aum: 7654, expenseRatio: 1.58, riskLevel: "High", minSip: 1000, minLumpsum: 5000, exitLoad: "0.5% if <1Y", fundManager: "Aniruddha Naha", launchDate: "Mar 2015" },
  { rank: 67, name: "JM Flexicap Fund", category: "Equity", subCategory: "Flexi Cap", returns1Y: 18.34, returns3Y: 17.45, returns5Y: 16.56, aum: 2345, expenseRatio: 1.72, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "1% if <1Y", fundManager: "Satish Ramanathan", launchDate: "Sep 2008" },
  { rank: 68, name: "360 ONE Flexicap Fund", category: "Equity", subCategory: "Flexi Cap", returns1Y: 16.78, returns3Y: 15.89, returns5Y: 14.78, aum: 1234, expenseRatio: 1.85, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "1% if <1Y", fundManager: "Mayur Patel", launchDate: "Dec 2016" },

  // ═══════════════════════════════════════════════════════════════════════════
  // EQUITY - VALUE & CONTRA
  // ═══════════════════════════════════════════════════════════════════════════
  { rank: 19, name: "HSBC Value Fund", category: "Equity", subCategory: "Value", returns1Y: 19.94, returns3Y: 18.04, returns5Y: 17.89, aum: 14553, expenseRatio: 1.71, riskLevel: "High", minSip: 500, minLumpsum: 5000, exitLoad: "1% if <1Y", fundManager: "Gautam Bhupal", launchDate: "May 2018" },
  { rank: 20, name: "SBI Contra Fund", category: "Equity", subCategory: "Contra", returns1Y: 18.97, returns3Y: 19.37, returns5Y: 21.45, aum: 49838, expenseRatio: 1.48, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "1% if <1Y", fundManager: "Dinesh Balachandran", launchDate: "Jul 1999" },

  // ═══════════════════════════════════════════════════════════════════════════
  // EQUITY - THEMATIC (INFRASTRUCTURE)
  // ═══════════════════════════════════════════════════════════════════════════
  { rank: 7, name: "ICICI Prudential Infrastructure Fund", category: "Equity", subCategory: "Thematic - Infrastructure", returns1Y: 24.18, returns3Y: 21.31, returns5Y: 22.45, aum: 8160, expenseRatio: 1.85, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Ihab Dalwai", launchDate: "Aug 2005" },
  { rank: 10, name: "Franklin Build India Fund", category: "Equity", subCategory: "Thematic - Infrastructure", returns1Y: 22.48, returns3Y: 19.91, returns5Y: 21.34, aum: 3068, expenseRatio: 1.98, riskLevel: "High", minSip: 500, minLumpsum: 5000, exitLoad: "1% if <1Y", fundManager: "Ajay Argal", launchDate: "Sep 2009" },
  { rank: 11, name: "Nippon India Power & Infra Fund", category: "Equity", subCategory: "Thematic - Infrastructure", returns1Y: 22.26, returns3Y: 19.43, returns5Y: 20.89, aum: 7301, expenseRatio: 1.83, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Kinjal Desai", launchDate: "May 2004" },
  { rank: 12, name: "DSP India T.I.G.E.R. Fund", category: "Equity", subCategory: "Thematic - Infrastructure", returns1Y: 21.65, returns3Y: 19.39, returns5Y: 20.12, aum: 5419, expenseRatio: 1.85, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Charanjit Singh", launchDate: "Jun 2004" },
  { rank: 13, name: "Canara Robeco Infrastructure Fund", category: "Equity", subCategory: "Thematic - Infrastructure", returns1Y: 21.47, returns3Y: 18.92, returns5Y: 19.45, aum: 917, expenseRatio: 2.27, riskLevel: "High", minSip: 1000, minLumpsum: 5000, exitLoad: "1% if <1Y", fundManager: "Vishal Mishra", launchDate: "Dec 2005" },
  { rank: 14, name: "Bandhan Infrastructure Fund", category: "Equity", subCategory: "Thematic - Infrastructure", returns1Y: 19.76, returns3Y: 18.04, returns5Y: 18.23, aum: 1566, expenseRatio: 2.11, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Vishal Biraia", launchDate: "Mar 2008" },
  { rank: 15, name: "Kotak Infrastructure Fund", category: "Equity", subCategory: "Thematic - Infrastructure", returns1Y: 19.14, returns3Y: 17.99, returns5Y: 18.56, aum: 2376, expenseRatio: 2.00, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Harish Krishnan", launchDate: "Feb 2008" },

  // ═══════════════════════════════════════════════════════════════════════════
  // EQUITY - THEMATIC (PSU)
  // ═══════════════════════════════════════════════════════════════════════════
  { rank: 8, name: "SBI PSU Fund", category: "Equity", subCategory: "Thematic - PSU", returns1Y: 25.82, returns3Y: 18.29, returns5Y: 19.67, aum: 5763, expenseRatio: 1.85, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "1% if <1Y", fundManager: "Dinesh Balachandran", launchDate: "Jul 2010" },
  { rank: 9, name: "Invesco India PSU Equity Fund", category: "Equity", subCategory: "Thematic - PSU", returns1Y: 24.65, returns3Y: 19.78, returns5Y: 18.92, aum: 1445, expenseRatio: 2.12, riskLevel: "High", minSip: 500, minLumpsum: 1000, exitLoad: "1% if <1Y", fundManager: "Amit Nigam", launchDate: "Nov 2009" },
  { rank: 91, name: "Aditya Birla Sun Life PSU Equity Fund", category: "Equity", subCategory: "Thematic - PSU", returns1Y: 24.12, returns3Y: 23.23, returns5Y: 22.34, aum: 4567, expenseRatio: 1.78, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Dhaval Gala", launchDate: "Dec 2019" },
  { rank: 92, name: "Quant PSU Fund", category: "Equity", subCategory: "Thematic - PSU", returns1Y: 26.34, returns3Y: 25.45, returns5Y: 24.56, aum: 2345, expenseRatio: 1.65, riskLevel: "High", minSip: 1000, minLumpsum: 5000, exitLoad: "1% if <1Y", fundManager: "Sanjeev Sharma", launchDate: "Jan 2013" },

  // ═══════════════════════════════════════════════════════════════════════════
  // EQUITY - THEMATIC (BANKING)
  // ═══════════════════════════════════════════════════════════════════════════
  { rank: 69, name: "ICICI Prudential Banking & Financial Services Fund", category: "Equity", subCategory: "Thematic - Banking", returns1Y: 22.34, returns3Y: 21.45, returns5Y: 20.56, aum: 8765, expenseRatio: 1.78, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Roshan Chutkey", launchDate: "Aug 2008" },
  { rank: 70, name: "SBI Banking & Financial Services Fund", category: "Equity", subCategory: "Thematic - Banking", returns1Y: 20.12, returns3Y: 19.23, returns5Y: 18.34, aum: 7654, expenseRatio: 1.82, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "1% if <1Y", fundManager: "Milind Agrawal", launchDate: "Feb 2015" },
  { rank: 71, name: "Nippon India Banking & Financial Services Fund", category: "Equity", subCategory: "Thematic - Banking", returns1Y: 21.56, returns3Y: 20.67, returns5Y: 19.78, aum: 6543, expenseRatio: 1.75, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Vinay Sharma", launchDate: "May 2003" },
  { rank: 72, name: "Tata Banking & Financial Services Fund", category: "Equity", subCategory: "Thematic - Banking", returns1Y: 19.45, returns3Y: 18.56, returns5Y: 17.67, aum: 2345, expenseRatio: 1.88, riskLevel: "High", minSip: 500, minLumpsum: 5000, exitLoad: "1% if <1Y", fundManager: "Amey Sathe", launchDate: "Dec 2015" },
  { rank: 73, name: "UTI Banking & Financial Services Fund", category: "Equity", subCategory: "Thematic - Banking", returns1Y: 18.78, returns3Y: 17.89, returns5Y: 16.89, aum: 1234, expenseRatio: 1.92, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "1% if <1Y", fundManager: "Vetri Subramaniam", launchDate: "Apr 2014" },

  // ═══════════════════════════════════════════════════════════════════════════
  // EQUITY - THEMATIC (PHARMA)
  // ═══════════════════════════════════════════════════════════════════════════
  { rank: 74, name: "SBI Healthcare Opportunities Fund", category: "Equity", subCategory: "Thematic - Pharma", returns1Y: 12.34, returns3Y: 11.45, returns5Y: 10.56, aum: 3456, expenseRatio: 1.85, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "1% if <1Y", fundManager: "Tanmaya Desai", launchDate: "Jul 1999" },
  { rank: 75, name: "Nippon India Pharma Fund", category: "Equity", subCategory: "Thematic - Pharma", returns1Y: 11.89, returns3Y: 10.78, returns5Y: 9.89, aum: 8765, expenseRatio: 1.78, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Sailesh Raj Bhan", launchDate: "Jun 2004" },
  { rank: 76, name: "UTI Healthcare Fund", category: "Equity", subCategory: "Thematic - Pharma", returns1Y: 13.45, returns3Y: 12.56, returns5Y: 11.67, aum: 2345, expenseRatio: 1.82, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "1% if <1Y", fundManager: "Kamal Gada", launchDate: "Jun 1999" },
  { rank: 77, name: "Tata India Pharma & Healthcare Fund", category: "Equity", subCategory: "Thematic - Pharma", returns1Y: 10.78, returns3Y: 9.89, returns5Y: 8.78, aum: 1234, expenseRatio: 1.92, riskLevel: "High", minSip: 500, minLumpsum: 5000, exitLoad: "1% if <1Y", fundManager: "Meeta Shetty", launchDate: "Dec 2015" },
  { rank: 78, name: "ICICI Prudential Pharma Healthcare & Diagnostics Fund", category: "Equity", subCategory: "Thematic - Pharma", returns1Y: 12.12, returns3Y: 11.23, returns5Y: 10.34, aum: 4567, expenseRatio: 1.80, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Dharmesh Kakkad", launchDate: "Jul 2018" },

  // ═══════════════════════════════════════════════════════════════════════════
  // EQUITY - THEMATIC (IT)
  // ═══════════════════════════════════════════════════════════════════════════
  { rank: 79, name: "ICICI Prudential Technology Fund", category: "Equity", subCategory: "Thematic - IT", returns1Y: 8.45, returns3Y: 7.56, returns5Y: 25.67, aum: 14567, expenseRatio: 1.78, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Vaibhav Dusad", launchDate: "Mar 2000" },
  { rank: 80, name: "Tata Digital India Fund", category: "Equity", subCategory: "Thematic - IT", returns1Y: 9.12, returns3Y: 8.23, returns5Y: 24.56, aum: 11234, expenseRatio: 1.72, riskLevel: "High", minSip: 500, minLumpsum: 5000, exitLoad: "1% if <1Y", fundManager: "Meeta Shetty", launchDate: "Dec 2015" },
  { rank: 81, name: "SBI Technology Opportunities Fund", category: "Equity", subCategory: "Thematic - IT", returns1Y: 7.89, returns3Y: 6.78, returns5Y: 23.45, aum: 5678, expenseRatio: 1.85, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "1% if <1Y", fundManager: "Saurabh Pant", launchDate: "Jan 2013" },
  { rank: 82, name: "Aditya Birla Sun Life Digital India Fund", category: "Equity", subCategory: "Thematic - IT", returns1Y: 8.78, returns3Y: 7.89, returns5Y: 24.12, aum: 6789, expenseRatio: 1.75, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Kunal Sangoi", launchDate: "Jan 2000" },
  { rank: 83, name: "Franklin India Technology Fund", category: "Equity", subCategory: "Thematic - IT", returns1Y: 6.45, returns3Y: 5.56, returns5Y: 22.34, aum: 1234, expenseRatio: 1.92, riskLevel: "High", minSip: 500, minLumpsum: 5000, exitLoad: "1% if <1Y", fundManager: "Varun Sharma", launchDate: "Aug 1998" },

  // ═══════════════════════════════════════════════════════════════════════════
  // EQUITY - THEMATIC (CONSUMPTION)
  // ═══════════════════════════════════════════════════════════════════════════
  { rank: 84, name: "Tata India Consumer Fund", category: "Equity", subCategory: "Thematic - Consumption", returns1Y: 15.67, returns3Y: 14.78, returns5Y: 13.89, aum: 2345, expenseRatio: 1.85, riskLevel: "High", minSip: 500, minLumpsum: 5000, exitLoad: "1% if <1Y", fundManager: "Sonam Udasi", launchDate: "Dec 2015" },
  { rank: 85, name: "ICICI Prudential FMCG Fund", category: "Equity", subCategory: "Thematic - Consumption", returns1Y: 14.23, returns3Y: 13.34, returns5Y: 12.45, aum: 1234, expenseRatio: 1.88, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Sharmila D'mello", launchDate: "Mar 1999" },
  { rank: 86, name: "SBI Consumption Opportunities Fund", category: "Equity", subCategory: "Thematic - Consumption", returns1Y: 16.12, returns3Y: 15.23, returns5Y: 14.34, aum: 3456, expenseRatio: 1.82, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "1% if <1Y", fundManager: "Saurabh Pant", launchDate: "Jul 2016" },
  { rank: 87, name: "Mirae Asset Great Consumer Fund", category: "Equity", subCategory: "Thematic - Consumption", returns1Y: 17.45, returns3Y: 16.56, returns5Y: 15.67, aum: 4567, expenseRatio: 1.75, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "1% if <1Y", fundManager: "Ankit Jain", launchDate: "Mar 2011" },
  { rank: 88, name: "Nippon India Consumption Fund", category: "Equity", subCategory: "Thematic - Consumption", returns1Y: 15.34, returns3Y: 14.45, returns5Y: 13.56, aum: 2345, expenseRatio: 1.78, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Kinjal Desai", launchDate: "Oct 2004" },

  // ═══════════════════════════════════════════════════════════════════════════
  // EQUITY - THEMATIC (DEFENCE)
  // ═══════════════════════════════════════════════════════════════════════════
  { rank: 89, name: "HDFC Defence Fund", category: "Equity", subCategory: "Thematic - Defence", returns1Y: 28.45, returns3Y: 27.56, returns5Y: 26.67, aum: 5678, expenseRatio: 1.85, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Abhishek Poddar", launchDate: "Jun 2023" },
  { rank: 90, name: "Motilal Oswal Nifty India Defence Index Fund", category: "Index", subCategory: "Thematic - Defence", returns1Y: 32.12, returns3Y: 31.23, returns5Y: 30.34, aum: 3456, expenseRatio: 0.45, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "Nil", fundManager: "Swapnil Mayekar", launchDate: "Jun 2024" },

  // ═══════════════════════════════════════════════════════════════════════════
  // EQUITY - ELSS (TAX SAVING)
  // ═══════════════════════════════════════════════════════════════════════════
  { rank: 112, name: "Mirae Asset Tax Saver Fund", category: "Equity", subCategory: "ELSS", returns1Y: 18.45, returns3Y: 17.56, returns5Y: 16.67, aum: 25678, expenseRatio: 1.38, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "Nil", fundManager: "Neelesh Surana", launchDate: "Dec 2015" },
  { rank: 113, name: "SBI Long Term Equity Fund", category: "Equity", subCategory: "ELSS", returns1Y: 16.78, returns3Y: 15.89, returns5Y: 14.78, aum: 28765, expenseRatio: 1.45, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "Nil", fundManager: "Dinesh Balachandran", launchDate: "Mar 1993" },
  { rank: 114, name: "Axis Long Term Equity Fund", category: "Equity", subCategory: "ELSS", returns1Y: 14.23, returns3Y: 13.34, returns5Y: 12.45, aum: 38765, expenseRatio: 1.52, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "Nil", fundManager: "Jinesh Gopani", launchDate: "Dec 2009" },
  { rank: 115, name: "HDFC Tax Saver", category: "Equity", subCategory: "ELSS", returns1Y: 17.12, returns3Y: 16.23, returns5Y: 15.34, aum: 16789, expenseRatio: 1.42, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "Nil", fundManager: "Roshi Jain", launchDate: "Mar 1996" },
  { rank: 116, name: "ICICI Prudential Long Term Equity Fund", category: "Equity", subCategory: "ELSS", returns1Y: 15.67, returns3Y: 14.78, returns5Y: 13.89, aum: 15678, expenseRatio: 1.48, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "Nil", fundManager: "Harish Bihani", launchDate: "Aug 1999" },
  { rank: 117, name: "Kotak Tax Saver", category: "Equity", subCategory: "ELSS", returns1Y: 16.45, returns3Y: 15.56, returns5Y: 14.67, aum: 6789, expenseRatio: 1.52, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "Nil", fundManager: "Harsha Upadhyaya", launchDate: "Nov 2005" },
  { rank: 118, name: "Nippon India Tax Saver Fund", category: "Equity", subCategory: "ELSS", returns1Y: 15.23, returns3Y: 14.34, returns5Y: 13.45, aum: 14567, expenseRatio: 1.55, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "Nil", fundManager: "Dhrumil Shah", launchDate: "Apr 2005" },
  { rank: 119, name: "DSP Tax Saver Fund", category: "Equity", subCategory: "ELSS", returns1Y: 17.89, returns3Y: 16.78, returns5Y: 15.89, aum: 16789, expenseRatio: 1.48, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "Nil", fundManager: "Rohit Singhania", launchDate: "Jan 2007" },
  { rank: 120, name: "Canara Robeco Equity Tax Saver", category: "Equity", subCategory: "ELSS", returns1Y: 16.12, returns3Y: 15.23, returns5Y: 14.34, aum: 8765, expenseRatio: 1.58, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "Nil", fundManager: "Shridatta Bhandwaldar", launchDate: "Mar 1993" },
  { rank: 121, name: "Quant Tax Plan", category: "Equity", subCategory: "ELSS", returns1Y: 19.56, returns3Y: 18.67, returns5Y: 17.78, aum: 5678, expenseRatio: 1.62, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "Nil", fundManager: "Sanjeev Sharma", launchDate: "Apr 2000" },

  // ═══════════════════════════════════════════════════════════════════════════
  // HYBRID - MULTI ASSET
  // ═══════════════════════════════════════════════════════════════════════════
  { rank: 21, name: "Quant Multi Asset Fund", category: "Hybrid", subCategory: "Multi Asset", returns1Y: 17.23, returns3Y: 19.86, returns5Y: 22.34, aum: 3245, expenseRatio: 1.08, riskLevel: "Moderate-High", minSip: 1000, minLumpsum: 5000, exitLoad: "1% if <1Y", fundManager: "Sanjeev Sharma", launchDate: "Apr 2021" },
  { rank: 22, name: "ICICI Prudential Multi Asset Fund", category: "Hybrid", subCategory: "Multi Asset", returns1Y: 19.31, returns3Y: 17.76, returns5Y: 19.20, aum: 75067, expenseRatio: 1.36, riskLevel: "Moderate-High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Sankaran Naren", launchDate: "Oct 2002" },
  { rank: 23, name: "UTI Multi Asset Allocation Fund", category: "Hybrid", subCategory: "Multi Asset", returns1Y: 18.56, returns3Y: 19.32, returns5Y: 18.67, aum: 5678, expenseRatio: 1.24, riskLevel: "Moderate-High", minSip: 500, minLumpsum: 500, exitLoad: "1% if <1Y", fundManager: "V Srivatsa", launchDate: "Oct 2021" },
  { rank: 24, name: "Nippon India Multi Asset Fund", category: "Hybrid", subCategory: "Multi Asset", returns1Y: 17.89, returns3Y: 19.29, returns5Y: 17.45, aum: 2345, expenseRatio: 1.15, riskLevel: "Moderate-High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Ashutosh Bhargava", launchDate: "Aug 2020" },
  { rank: 95, name: "SBI Multi Asset Allocation Fund", category: "Hybrid", subCategory: "Multi Asset", returns1Y: 16.45, returns3Y: 15.56, returns5Y: 14.67, aum: 8765, expenseRatio: 1.35, riskLevel: "Moderate-High", minSip: 500, minLumpsum: 500, exitLoad: "1% if <1Y", fundManager: "Gaurav Mehta", launchDate: "Dec 2020" },
  { rank: 96, name: "HDFC Multi Asset Fund", category: "Hybrid", subCategory: "Multi Asset", returns1Y: 15.78, returns3Y: 14.89, returns5Y: 13.78, aum: 4567, expenseRatio: 1.42, riskLevel: "Moderate-High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Gopal Agrawal", launchDate: "Aug 2023" },

  // ═══════════════════════════════════════════════════════════════════════════
  // HYBRID - AGGRESSIVE HYBRID
  // ═══════════════════════════════════════════════════════════════════════════
  { rank: 25, name: "ICICI Prudential Equity & Debt Fund", category: "Hybrid", subCategory: "Aggressive Hybrid", returns1Y: 18.48, returns3Y: 17.73, returns5Y: 12.77, aum: 49223, expenseRatio: 1.53, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Mittul Kalawadia", launchDate: "Nov 1999" },
  { rank: 27, name: "JM Aggressive Hybrid Fund", category: "Hybrid", subCategory: "Aggressive Hybrid", returns1Y: 15.23, returns3Y: 14.87, returns5Y: 13.56, aum: 811, expenseRatio: 2.26, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "1% if <1Y", fundManager: "Asit Bhandarkar", launchDate: "Apr 1995" },
  { rank: 28, name: "Bank of India Mid & Small Cap Equity & Debt", category: "Hybrid", subCategory: "Aggressive Hybrid", returns1Y: 14.99, returns3Y: 15.34, returns5Y: 14.23, aum: 1321, expenseRatio: 2.13, riskLevel: "High", minSip: 500, minLumpsum: 1000, exitLoad: "1% if <1Y", fundManager: "Alok Singh", launchDate: "Dec 2019" },
  { rank: 29, name: "UTI Aggressive Hybrid Fund", category: "Hybrid", subCategory: "Aggressive Hybrid", returns1Y: 14.96, returns3Y: 14.08, returns5Y: 10.61, aum: 6718, expenseRatio: 1.86, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "1% if <1Y", fundManager: "V Srivatsa", launchDate: "Jan 1995" },
  { rank: 30, name: "Edelweiss Aggressive Hybrid Fund", category: "Hybrid", subCategory: "Aggressive Hybrid", returns1Y: 14.95, returns3Y: 14.45, returns5Y: 13.78, aum: 3413, expenseRatio: 1.87, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Bhavesh Jain", launchDate: "Jan 2013" },
  { rank: 93, name: "Kotak Equity Hybrid Fund", category: "Hybrid", subCategory: "Aggressive Hybrid", returns1Y: 13.45, returns3Y: 12.56, returns5Y: 11.67, aum: 5678, expenseRatio: 1.72, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Hiten Shah", launchDate: "Nov 1999" },
  { rank: 94, name: "Union Aggressive Hybrid Fund", category: "Hybrid", subCategory: "Aggressive Hybrid", returns1Y: 12.78, returns3Y: 11.89, returns5Y: 10.78, aum: 1234, expenseRatio: 1.92, riskLevel: "High", minSip: 500, minLumpsum: 1000, exitLoad: "1% if <1Y", fundManager: "Vinay Paharia", launchDate: "Jun 2011" },

  // ═══════════════════════════════════════════════════════════════════════════
  // HYBRID - DYNAMIC ASSET ALLOCATION / BALANCED ADVANTAGE
  // ═══════════════════════════════════════════════════════════════════════════
  { rank: 26, name: "HDFC Balanced Advantage Fund", category: "Hybrid", subCategory: "Dynamic Asset Allocation", returns1Y: 17.11, returns3Y: 16.36, returns5Y: 15.89, aum: 107971, expenseRatio: 1.34, riskLevel: "Moderate-High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Gopal Agrawal", launchDate: "Sep 2000" },
  { rank: 159, name: "Aditya Birla Sun Life Balanced Advantage Fund", category: "Hybrid", subCategory: "Dynamic Asset Allocation", returns1Y: 14.56, returns3Y: 13.67, returns5Y: 12.78, aum: 8765, expenseRatio: 1.42, riskLevel: "Moderate-High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Mohit Sharma", launchDate: "Apr 2006" },
  { rank: 160, name: "ICICI Prudential Balanced Advantage Fund", category: "Hybrid", subCategory: "Dynamic Asset Allocation", returns1Y: 13.89, returns3Y: 12.78, returns5Y: 11.89, aum: 62345, expenseRatio: 1.35, riskLevel: "Moderate-High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Manish Banthia", launchDate: "Dec 2006" },
  { rank: 161, name: "Kotak Balanced Advantage Fund", category: "Hybrid", subCategory: "Dynamic Asset Allocation", returns1Y: 12.45, returns3Y: 11.56, returns5Y: 10.67, aum: 18765, expenseRatio: 1.48, riskLevel: "Moderate-High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Abhishek Bisen", launchDate: "Aug 2018" },
  { rank: 162, name: "SBI Balanced Advantage Fund", category: "Hybrid", subCategory: "Dynamic Asset Allocation", returns1Y: 14.12, returns3Y: 13.23, returns5Y: 12.34, aum: 34567, expenseRatio: 1.38, riskLevel: "Moderate-High", minSip: 500, minLumpsum: 500, exitLoad: "1% if <1Y", fundManager: "Dinesh Ahuja", launchDate: "Aug 2021" },
  { rank: 163, name: "Nippon India Balanced Advantage Fund", category: "Hybrid", subCategory: "Dynamic Asset Allocation", returns1Y: 13.45, returns3Y: 12.56, returns5Y: 11.67, aum: 9876, expenseRatio: 1.45, riskLevel: "Moderate-High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Ashutosh Bhargava", launchDate: "Nov 2004" },
  { rank: 164, name: "DSP Dynamic Asset Allocation Fund", category: "Hybrid", subCategory: "Dynamic Asset Allocation", returns1Y: 12.78, returns3Y: 11.89, returns5Y: 10.78, aum: 5678, expenseRatio: 1.52, riskLevel: "Moderate-High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Ravi Gehani", launchDate: "Feb 2014" },
  { rank: 165, name: "Edelweiss Balanced Advantage Fund", category: "Hybrid", subCategory: "Dynamic Asset Allocation", returns1Y: 13.12, returns3Y: 12.23, returns5Y: 11.34, aum: 12345, expenseRatio: 1.42, riskLevel: "Moderate-High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Bhavesh Jain", launchDate: "Aug 2009" },

  // ═══════════════════════════════════════════════════════════════════════════
  // HYBRID - EQUITY SAVINGS
  // ═══════════════════════════════════════════════════════════════════════════
  { rank: 102, name: "ICICI Prudential Equity Savings Fund", category: "Hybrid", subCategory: "Equity Savings", returns1Y: 10.23, returns3Y: 9.45, returns5Y: 8.56, aum: 6789, expenseRatio: 1.25, riskLevel: "Moderate", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Manish Banthia", launchDate: "Dec 2014" },
  { rank: 103, name: "Kotak Equity Savings Fund", category: "Hybrid", subCategory: "Equity Savings", returns1Y: 9.78, returns3Y: 8.89, returns5Y: 7.89, aum: 4567, expenseRatio: 1.32, riskLevel: "Moderate", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Abhishek Bisen", launchDate: "Oct 2014" },
  { rank: 104, name: "SBI Equity Savings Fund", category: "Hybrid", subCategory: "Equity Savings", returns1Y: 10.56, returns3Y: 9.67, returns5Y: 8.78, aum: 3456, expenseRatio: 1.28, riskLevel: "Moderate", minSip: 500, minLumpsum: 500, exitLoad: "1% if <1Y", fundManager: "Dinesh Ahuja", launchDate: "Mar 2015" },
  { rank: 105, name: "HDFC Equity Savings Fund", category: "Hybrid", subCategory: "Equity Savings", returns1Y: 9.45, returns3Y: 8.56, returns5Y: 7.67, aum: 5678, expenseRatio: 1.35, riskLevel: "Moderate", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Anil Bamboli", launchDate: "Sep 2004" },
  { rank: 106, name: "Aditya Birla Sun Life Equity Savings Fund", category: "Hybrid", subCategory: "Equity Savings", returns1Y: 10.12, returns3Y: 9.23, returns5Y: 8.34, aum: 2345, expenseRatio: 1.42, riskLevel: "Moderate", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Mohit Sharma", launchDate: "Apr 2015" },

  // ═══════════════════════════════════════════════════════════════════════════
  // HYBRID - ARBITRAGE
  // ═══════════════════════════════════════════════════════════════════════════
  { rank: 107, name: "ICICI Prudential Equity Arbitrage Fund", category: "Hybrid", subCategory: "Arbitrage", returns1Y: 7.89, returns3Y: 7.34, returns5Y: 6.45, aum: 18765, expenseRatio: 0.98, riskLevel: "Low", minSip: 100, minLumpsum: 100, exitLoad: "0.25% if <1M", fundManager: "Kayzad Eghlim", launchDate: "Dec 2006" },
  { rank: 108, name: "Kotak Equity Arbitrage Fund", category: "Hybrid", subCategory: "Arbitrage", returns1Y: 7.67, returns3Y: 7.12, returns5Y: 6.23, aum: 52345, expenseRatio: 0.95, riskLevel: "Low", minSip: 100, minLumpsum: 100, exitLoad: "0.25% if <1M", fundManager: "Hiten Shah", launchDate: "Sep 2005" },
  { rank: 109, name: "SBI Arbitrage Opportunities Fund", category: "Hybrid", subCategory: "Arbitrage", returns1Y: 7.45, returns3Y: 6.89, returns5Y: 6.01, aum: 8765, expenseRatio: 1.02, riskLevel: "Low", minSip: 500, minLumpsum: 5000, exitLoad: "0.25% if <1M", fundManager: "Neeraj Kumar", launchDate: "Nov 2006" },
  { rank: 110, name: "Nippon India Arbitrage Fund", category: "Hybrid", subCategory: "Arbitrage", returns1Y: 7.78, returns3Y: 7.23, returns5Y: 6.34, aum: 15678, expenseRatio: 0.92, riskLevel: "Low", minSip: 100, minLumpsum: 100, exitLoad: "0.25% if <1M", fundManager: "Ashutosh Bhargava", launchDate: "Sep 2010" },
  { rank: 111, name: "HDFC Arbitrage Fund", category: "Hybrid", subCategory: "Arbitrage", returns1Y: 7.56, returns3Y: 7.01, returns5Y: 6.12, aum: 12345, expenseRatio: 0.95, riskLevel: "Low", minSip: 100, minLumpsum: 100, exitLoad: "0.25% if <1M", fundManager: "Anil Bamboli", launchDate: "Oct 2007" },

  // ═══════════════════════════════════════════════════════════════════════════
  // DEBT - FLOATING RATE
  // ═══════════════════════════════════════════════════════════════════════════
  { rank: 31, name: "SBI Floating Rate Debt Fund", category: "Debt", subCategory: "Floating Rate", returns1Y: 7.82, returns3Y: 7.45, returns5Y: 6.20, aum: 15678, expenseRatio: 0.35, riskLevel: "Low-Moderate", minSip: 500, minLumpsum: 5000, exitLoad: "Nil", fundManager: "Rajeev Radhakrishnan", launchDate: "Sep 2004" },
  { rank: 32, name: "DSP Floater Fund", category: "Debt", subCategory: "Floating Rate", returns1Y: 7.76, returns3Y: 7.38, returns5Y: 6.19, aum: 4567, expenseRatio: 0.32, riskLevel: "Low-Moderate", minSip: 100, minLumpsum: 100, exitLoad: "Nil", fundManager: "Vikram Chopra", launchDate: "Sep 2020" },
  { rank: 97, name: "ICICI Prudential Floating Interest Fund", category: "Debt", subCategory: "Floating Rate", returns1Y: 7.56, returns3Y: 7.23, returns5Y: 6.34, aum: 12345, expenseRatio: 0.38, riskLevel: "Low-Moderate", minSip: 100, minLumpsum: 100, exitLoad: "Nil", fundManager: "Rahul Goswami", launchDate: "Oct 2003" },

  // ═══════════════════════════════════════════════════════════════════════════
  // DEBT - MEDIUM DURATION
  // ═══════════════════════════════════════════════════════════════════════════
  { rank: 33, name: "Aditya Birla Sun Life Medium Term Fund", category: "Debt", subCategory: "Medium Duration", returns1Y: 11.40, returns3Y: 9.47, returns5Y: 6.38, aum: 2864, expenseRatio: 1.57, riskLevel: "Moderate", minSip: 1000, minLumpsum: 1000, exitLoad: "2% if <1Y", fundManager: "Mohit Sharma", launchDate: "Mar 2009" },
  { rank: 34, name: "Nippon India Medium Duration Fund", category: "Debt", subCategory: "Medium Duration", returns1Y: 9.65, returns3Y: 8.78, returns5Y: 7.12, aum: 1234, expenseRatio: 1.52, riskLevel: "Moderate", minSip: 100, minLumpsum: 500, exitLoad: "2% if <1Y", fundManager: "Vivek Sharma", launchDate: "Jan 2014" },
  { rank: 99, name: "Kotak Medium Term Fund", category: "Debt", subCategory: "Medium Duration", returns1Y: 9.45, returns3Y: 8.89, returns5Y: 7.78, aum: 3456, expenseRatio: 1.25, riskLevel: "Moderate", minSip: 100, minLumpsum: 100, exitLoad: "2% if <18M", fundManager: "Deepak Agrawal", launchDate: "Sep 2014" },

  // ═══════════════════════════════════════════════════════════════════════════
  // DEBT - GILT
  // ═══════════════════════════════════════════════════════════════════════════
  { rank: 35, name: "HDFC NIFTY G-Sec Index Fund", category: "Debt", subCategory: "Gilt", returns1Y: 8.45, returns3Y: 8.12, returns5Y: 7.89, aum: 2345, expenseRatio: 0.20, riskLevel: "Low", minSip: 100, minLumpsum: 100, exitLoad: "Nil", fundManager: "Anupam Joshi", launchDate: "Dec 2001" },
  { rank: 100, name: "SBI Magnum Gilt Fund", category: "Debt", subCategory: "Gilt", returns1Y: 8.23, returns3Y: 7.89, returns5Y: 7.12, aum: 7654, expenseRatio: 0.55, riskLevel: "Low", minSip: 500, minLumpsum: 5000, exitLoad: "Nil", fundManager: "Dinesh Ahuja", launchDate: "Dec 2000" },
  { rank: 199, name: "HDFC Gilt Fund", category: "Debt", subCategory: "Gilt", returns1Y: 8.12, returns3Y: 7.78, returns5Y: 6.89, aum: 2345, expenseRatio: 0.48, riskLevel: "Low", minSip: 100, minLumpsum: 100, exitLoad: "Nil", fundManager: "Anupam Joshi", launchDate: "Jul 2001" },
  { rank: 200, name: "ICICI Prudential Gilt Fund", category: "Debt", subCategory: "Gilt", returns1Y: 8.05, returns3Y: 7.71, returns5Y: 6.82, aum: 5678, expenseRatio: 0.50, riskLevel: "Low", minSip: 100, minLumpsum: 100, exitLoad: "Nil", fundManager: "Rahul Goswami", launchDate: "Aug 1999" },

  // ═══════════════════════════════════════════════════════════════════════════
  // DEBT - CREDIT RISK
  // ═══════════════════════════════════════════════════════════════════════════
  { rank: 36, name: "Bank of India Credit Risk Fund", category: "Debt", subCategory: "Credit Risk", returns1Y: 19.10, returns3Y: 7.94, returns5Y: 6.02, aum: 107, expenseRatio: 1.52, riskLevel: "High", minSip: 500, minLumpsum: 1000, exitLoad: "3% if <1Y", fundManager: "Alok Singh", launchDate: "Apr 2015" },
  { rank: 37, name: "DSP Credit Risk Fund", category: "Debt", subCategory: "Credit Risk", returns1Y: 13.51, returns3Y: 9.37, returns5Y: 4.33, aum: 209, expenseRatio: 1.22, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <18M", fundManager: "Vikram Chopra", launchDate: "May 2003" },
  { rank: 38, name: "Aditya Birla Sun Life Credit Risk Fund", category: "Debt", subCategory: "Credit Risk", returns1Y: 10.46, returns3Y: 8.65, returns5Y: 8.48, aum: 1094, expenseRatio: 1.67, riskLevel: "High", minSip: 1000, minLumpsum: 1000, exitLoad: "3% if <1Y", fundManager: "Mohit Sharma", launchDate: "Jun 2009" },
  { rank: 39, name: "Baroda BNP Paribas Credit Risk Fund", category: "Debt", subCategory: "Credit Risk", returns1Y: 8.11, returns3Y: 7.69, returns5Y: 6.31, aum: 199, expenseRatio: 1.61, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "3% if <1Y", fundManager: "Vikram Kotak", launchDate: "Apr 2015" },
  { rank: 40, name: "ICICI Prudential Credit Risk Fund", category: "Debt", subCategory: "Credit Risk", returns1Y: 8.05, returns3Y: 7.84, returns5Y: 9.04, aum: 5936, expenseRatio: 1.40, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Rahul Goswami", launchDate: "Jun 2010" },
  { rank: 101, name: "UTI Credit Risk Fund", category: "Debt", subCategory: "Credit Risk", returns1Y: 9.12, returns3Y: 8.45, returns5Y: 7.34, aum: 567, expenseRatio: 1.45, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "3% if <1Y", fundManager: "Ritesh Nambiar", launchDate: "Jan 2014" },

  // ═══════════════════════════════════════════════════════════════════════════
  // DEBT - LIQUID
  // ═══════════════════════════════════════════════════════════════════════════
  { rank: 166, name: "ICICI Prudential Liquid Fund", category: "Debt", subCategory: "Liquid", returns1Y: 7.23, returns3Y: 6.89, returns5Y: 5.78, aum: 52345, expenseRatio: 0.20, riskLevel: "Low", minSip: 100, minLumpsum: 100, exitLoad: "Nil if 7D+", fundManager: "Rahul Goswami", launchDate: "Nov 1998" },
  { rank: 167, name: "SBI Liquid Fund", category: "Debt", subCategory: "Liquid", returns1Y: 7.12, returns3Y: 6.78, returns5Y: 5.67, aum: 78654, expenseRatio: 0.22, riskLevel: "Low", minSip: 500, minLumpsum: 500, exitLoad: "Nil if 7D+", fundManager: "Rajeev Radhakrishnan", launchDate: "Jun 1998" },
  { rank: 168, name: "HDFC Liquid Fund", category: "Debt", subCategory: "Liquid", returns1Y: 7.18, returns3Y: 6.84, returns5Y: 5.72, aum: 65432, expenseRatio: 0.21, riskLevel: "Low", minSip: 100, minLumpsum: 100, exitLoad: "Nil if 7D+", fundManager: "Anupam Joshi", launchDate: "Oct 1999" },
  { rank: 169, name: "Axis Liquid Fund", category: "Debt", subCategory: "Liquid", returns1Y: 7.08, returns3Y: 6.74, returns5Y: 5.62, aum: 42345, expenseRatio: 0.18, riskLevel: "Low", minSip: 500, minLumpsum: 500, exitLoad: "Nil if 7D+", fundManager: "Devang Shah", launchDate: "Oct 2009" },
  { rank: 170, name: "Kotak Liquid Fund", category: "Debt", subCategory: "Liquid", returns1Y: 7.15, returns3Y: 6.81, returns5Y: 5.69, aum: 38765, expenseRatio: 0.19, riskLevel: "Low", minSip: 100, minLumpsum: 100, exitLoad: "Nil if 7D+", fundManager: "Deepak Agrawal", launchDate: "Nov 1998" },
  { rank: 171, name: "Nippon India Liquid Fund", category: "Debt", subCategory: "Liquid", returns1Y: 7.21, returns3Y: 6.87, returns5Y: 5.75, aum: 32456, expenseRatio: 0.20, riskLevel: "Low", minSip: 100, minLumpsum: 100, exitLoad: "Nil if 7D+", fundManager: "Anju Chhajer", launchDate: "Dec 1998" },

  // ═══════════════════════════════════════════════════════════════════════════
  // DEBT - SHORT DURATION / ULTRA SHORT
  // ═══════════════════════════════════════════════════════════════════════════
  { rank: 98, name: "Axis Short Term Fund", category: "Debt", subCategory: "Short Duration", returns1Y: 8.12, returns3Y: 7.78, returns5Y: 6.89, aum: 8765, expenseRatio: 0.78, riskLevel: "Low-Moderate", minSip: 500, minLumpsum: 5000, exitLoad: "Nil", fundManager: "Devang Shah", launchDate: "Jan 2010" },
  { rank: 172, name: "ICICI Prudential Ultra Short Term Fund", category: "Debt", subCategory: "Ultra Short Duration", returns1Y: 7.45, returns3Y: 7.12, returns5Y: 6.23, aum: 18765, expenseRatio: 0.35, riskLevel: "Low-Moderate", minSip: 100, minLumpsum: 100, exitLoad: "Nil", fundManager: "Rahul Goswami", launchDate: "Jan 2009" },
  { rank: 173, name: "Aditya Birla Sun Life Savings Fund", category: "Debt", subCategory: "Ultra Short Duration", returns1Y: 7.38, returns3Y: 7.05, returns5Y: 6.16, aum: 45678, expenseRatio: 0.38, riskLevel: "Low-Moderate", minSip: 100, minLumpsum: 100, exitLoad: "Nil", fundManager: "Kaustubh Gupta", launchDate: "Apr 2003" },
  { rank: 174, name: "HDFC Ultra Short Term Fund", category: "Debt", subCategory: "Ultra Short Duration", returns1Y: 7.32, returns3Y: 6.98, returns5Y: 6.09, aum: 15678, expenseRatio: 0.36, riskLevel: "Low-Moderate", minSip: 100, minLumpsum: 100, exitLoad: "Nil", fundManager: "Anupam Joshi", launchDate: "Oct 2018" },
  { rank: 175, name: "SBI Magnum Ultra Short Duration Fund", category: "Debt", subCategory: "Ultra Short Duration", returns1Y: 7.28, returns3Y: 6.94, returns5Y: 6.05, aum: 14567, expenseRatio: 0.40, riskLevel: "Low-Moderate", minSip: 500, minLumpsum: 500, exitLoad: "Nil", fundManager: "Rajeev Radhakrishnan", launchDate: "May 1999" },
  { rank: 176, name: "Kotak Savings Fund", category: "Debt", subCategory: "Ultra Short Duration", returns1Y: 7.35, returns3Y: 7.02, returns5Y: 6.13, aum: 12345, expenseRatio: 0.38, riskLevel: "Low-Moderate", minSip: 100, minLumpsum: 100, exitLoad: "Nil", fundManager: "Deepak Agrawal", launchDate: "Aug 2004" },

  // ═══════════════════════════════════════════════════════════════════════════
  // DEBT - LONG DURATION
  // ═══════════════════════════════════════════════════════════════════════════
  { rank: 180, name: "ICICI Prudential Long Term Bond Fund", category: "Debt", subCategory: "Long Duration", returns1Y: 9.12, returns3Y: 8.45, returns5Y: 7.89, aum: 3456, expenseRatio: 1.15, riskLevel: "Moderate", minSip: 100, minLumpsum: 100, exitLoad: "Nil", fundManager: "Rahul Goswami", launchDate: "Mar 1998" },
  { rank: 181, name: "SBI Magnum Long Duration Fund", category: "Debt", subCategory: "Long Duration", returns1Y: 8.89, returns3Y: 8.23, returns5Y: 7.67, aum: 2345, expenseRatio: 1.08, riskLevel: "Moderate", minSip: 500, minLumpsum: 5000, exitLoad: "Nil", fundManager: "Rajeev Radhakrishnan", launchDate: "Jun 2000" },
  { rank: 182, name: "HDFC Long Duration Debt Fund", category: "Debt", subCategory: "Long Duration", returns1Y: 8.78, returns3Y: 8.12, returns5Y: 7.56, aum: 1234, expenseRatio: 0.95, riskLevel: "Moderate", minSip: 100, minLumpsum: 100, exitLoad: "Nil", fundManager: "Anupam Joshi", launchDate: "Dec 2022" },
  { rank: 183, name: "Nippon India Nivesh Lakshya Fund", category: "Debt", subCategory: "Long Duration", returns1Y: 8.67, returns3Y: 8.01, returns5Y: 7.45, aum: 8765, expenseRatio: 0.32, riskLevel: "Moderate", minSip: 100, minLumpsum: 100, exitLoad: "Nil", fundManager: "Pranay Sinha", launchDate: "Jul 2019" },
  { rank: 184, name: "Kotak Long Duration Fund", category: "Debt", subCategory: "Long Duration", returns1Y: 8.56, returns3Y: 7.89, returns5Y: 7.34, aum: 567, expenseRatio: 0.88, riskLevel: "Moderate", minSip: 100, minLumpsum: 100, exitLoad: "Nil", fundManager: "Deepak Agrawal", launchDate: "Mar 2023" },

  // ═══════════════════════════════════════════════════════════════════════════
  // DEBT - CORPORATE BOND
  // ═══════════════════════════════════════════════════════════════════════════
  { rank: 185, name: "ICICI Prudential Corporate Bond Fund", category: "Debt", subCategory: "Corporate Bond", returns1Y: 8.34, returns3Y: 7.89, returns5Y: 7.23, aum: 32456, expenseRatio: 0.42, riskLevel: "Low-Moderate", minSip: 100, minLumpsum: 100, exitLoad: "Nil", fundManager: "Rahul Goswami", launchDate: "Aug 2009" },
  { rank: 186, name: "HDFC Corporate Bond Fund", category: "Debt", subCategory: "Corporate Bond", returns1Y: 8.23, returns3Y: 7.78, returns5Y: 7.12, aum: 35678, expenseRatio: 0.45, riskLevel: "Low-Moderate", minSip: 100, minLumpsum: 100, exitLoad: "Nil", fundManager: "Anupam Joshi", launchDate: "May 2010" },
  { rank: 187, name: "Aditya Birla Sun Life Corporate Bond Fund", category: "Debt", subCategory: "Corporate Bond", returns1Y: 8.12, returns3Y: 7.67, returns5Y: 7.01, aum: 28765, expenseRatio: 0.48, riskLevel: "Low-Moderate", minSip: 100, minLumpsum: 100, exitLoad: "Nil", fundManager: "Kaustubh Gupta", launchDate: "Mar 1997" },
  { rank: 188, name: "Kotak Corporate Bond Fund", category: "Debt", subCategory: "Corporate Bond", returns1Y: 8.01, returns3Y: 7.56, returns5Y: 6.89, aum: 15678, expenseRatio: 0.40, riskLevel: "Low-Moderate", minSip: 100, minLumpsum: 100, exitLoad: "Nil", fundManager: "Deepak Agrawal", launchDate: "Sep 2007" },
  { rank: 189, name: "SBI Corporate Bond Fund", category: "Debt", subCategory: "Corporate Bond", returns1Y: 7.89, returns3Y: 7.45, returns5Y: 6.78, aum: 18765, expenseRatio: 0.52, riskLevel: "Low-Moderate", minSip: 500, minLumpsum: 500, exitLoad: "Nil", fundManager: "Rajeev Radhakrishnan", launchDate: "Jul 2016" },

  // ═══════════════════════════════════════════════════════════════════════════
  // DEBT - BANKING & PSU
  // ═══════════════════════════════════════════════════════════════════════════
  { rank: 190, name: "HDFC Banking and PSU Debt Fund", category: "Debt", subCategory: "Banking & PSU", returns1Y: 8.12, returns3Y: 7.67, returns5Y: 7.01, aum: 12345, expenseRatio: 0.38, riskLevel: "Low-Moderate", minSip: 100, minLumpsum: 100, exitLoad: "Nil", fundManager: "Anupam Joshi", launchDate: "May 2014" },
  { rank: 191, name: "ICICI Prudential Banking & PSU Debt Fund", category: "Debt", subCategory: "Banking & PSU", returns1Y: 8.01, returns3Y: 7.56, returns5Y: 6.89, aum: 9876, expenseRatio: 0.42, riskLevel: "Low-Moderate", minSip: 100, minLumpsum: 100, exitLoad: "Nil", fundManager: "Rahul Goswami", launchDate: "Jan 2010" },
  { rank: 192, name: "Kotak Banking and PSU Debt Fund", category: "Debt", subCategory: "Banking & PSU", returns1Y: 7.89, returns3Y: 7.45, returns5Y: 6.78, aum: 8765, expenseRatio: 0.35, riskLevel: "Low-Moderate", minSip: 100, minLumpsum: 100, exitLoad: "Nil", fundManager: "Deepak Agrawal", launchDate: "Dec 1998" },
  { rank: 193, name: "Aditya Birla Sun Life Banking & PSU Debt Fund", category: "Debt", subCategory: "Banking & PSU", returns1Y: 7.78, returns3Y: 7.34, returns5Y: 6.67, aum: 10234, expenseRatio: 0.40, riskLevel: "Low-Moderate", minSip: 100, minLumpsum: 100, exitLoad: "Nil", fundManager: "Kaustubh Gupta", launchDate: "May 2015" },
  { rank: 194, name: "SBI Banking & PSU Fund", category: "Debt", subCategory: "Banking & PSU", returns1Y: 7.67, returns3Y: 7.23, returns5Y: 6.56, aum: 15678, expenseRatio: 0.45, riskLevel: "Low-Moderate", minSip: 500, minLumpsum: 500, exitLoad: "Nil", fundManager: "Rajeev Radhakrishnan", launchDate: "Sep 2009" },

  // ═══════════════════════════════════════════════════════════════════════════
  // HYBRID - CONSERVATIVE HYBRID
  // ═══════════════════════════════════════════════════════════════════════════
  { rank: 195, name: "ICICI Prudential Regular Savings Fund", category: "Hybrid", subCategory: "Conservative Hybrid", returns1Y: 10.45, returns3Y: 9.56, returns5Y: 8.67, aum: 4567, expenseRatio: 1.35, riskLevel: "Moderate", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Manish Banthia", launchDate: "Dec 2010" },
  { rank: 196, name: "HDFC Hybrid Debt Fund", category: "Hybrid", subCategory: "Conservative Hybrid", returns1Y: 10.23, returns3Y: 9.34, returns5Y: 8.45, aum: 3456, expenseRatio: 1.42, riskLevel: "Moderate", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Anil Bamboli", launchDate: "Sep 2000" },
  { rank: 197, name: "SBI Conservative Hybrid Fund", category: "Hybrid", subCategory: "Conservative Hybrid", returns1Y: 9.89, returns3Y: 9.01, returns5Y: 8.12, aum: 9876, expenseRatio: 1.28, riskLevel: "Moderate", minSip: 500, minLumpsum: 500, exitLoad: "1% if <1Y", fundManager: "Dinesh Ahuja", launchDate: "Dec 2018" },
  { rank: 198, name: "Kotak Debt Hybrid Fund", category: "Hybrid", subCategory: "Conservative Hybrid", returns1Y: 9.67, returns3Y: 8.78, returns5Y: 7.89, aum: 2345, expenseRatio: 1.38, riskLevel: "Moderate", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Abhishek Bisen", launchDate: "Dec 2014" },
  { rank: 199, name: "Aditya Birla Sun Life Regular Savings Fund", category: "Hybrid", subCategory: "Conservative Hybrid", returns1Y: 9.45, returns3Y: 8.56, returns5Y: 7.67, aum: 1234, expenseRatio: 1.45, riskLevel: "Moderate", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Mohit Sharma", launchDate: "May 2004" },
  { rank: 122, name: "UTI Nifty 50 Index Fund", category: "Index", subCategory: "Large Cap", returns1Y: 15.78, returns3Y: 14.89, returns5Y: 13.78, aum: 22345, expenseRatio: 0.18, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "Nil", fundManager: "Sharwan Goyal", launchDate: "Mar 2000" },
  { rank: 123, name: "HDFC Index Fund - Nifty 50 Plan", category: "Index", subCategory: "Large Cap", returns1Y: 15.67, returns3Y: 14.78, returns5Y: 13.67, aum: 18765, expenseRatio: 0.20, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "Nil", fundManager: "Krishan Daga", launchDate: "Jul 2002" },
  { rank: 124, name: "ICICI Prudential Nifty 50 Index Fund", category: "Index", subCategory: "Large Cap", returns1Y: 15.56, returns3Y: 14.67, returns5Y: 13.56, aum: 9876, expenseRatio: 0.15, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "Nil", fundManager: "Kayzad Eghlim", launchDate: "Feb 2002" },
  { rank: 125, name: "SBI Nifty Index Fund", category: "Index", subCategory: "Large Cap", returns1Y: 15.45, returns3Y: 14.56, returns5Y: 13.45, aum: 7654, expenseRatio: 0.18, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "Nil", fundManager: "Raviprakash Sharma", launchDate: "Jan 2002" },
  { rank: 126, name: "Axis Nifty 50 Index Fund", category: "Index", subCategory: "Large Cap", returns1Y: 15.34, returns3Y: 14.45, returns5Y: 13.34, aum: 3456, expenseRatio: 0.12, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "Nil", fundManager: "Aditya Pagaria", launchDate: "Jul 2019" },
  { rank: 127, name: "Motilal Oswal Nifty Midcap 150 Index Fund", category: "Index", subCategory: "Mid Cap", returns1Y: 22.34, returns3Y: 21.45, returns5Y: 20.56, aum: 4567, expenseRatio: 0.30, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "Nil", fundManager: "Swapnil Mayekar", launchDate: "Sep 2019" },
  { rank: 128, name: "Nippon India Nifty Midcap 150 Index Fund", category: "Index", subCategory: "Mid Cap", returns1Y: 22.12, returns3Y: 21.23, returns5Y: 20.34, aum: 3456, expenseRatio: 0.28, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "Nil", fundManager: "Himanshu Mange", launchDate: "Feb 2021" },
  { rank: 129, name: "UTI Nifty Next 50 Index Fund", category: "Index", subCategory: "Large & Mid Cap", returns1Y: 18.45, returns3Y: 17.56, returns5Y: 16.67, aum: 8765, expenseRatio: 0.25, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "Nil", fundManager: "Sharwan Goyal", launchDate: "Jun 2018" },
  { rank: 130, name: "ICICI Prudential Nifty Next 50 Index Fund", category: "Index", subCategory: "Large & Mid Cap", returns1Y: 18.23, returns3Y: 17.34, returns5Y: 16.45, aum: 5678, expenseRatio: 0.22, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "Nil", fundManager: "Kayzad Eghlim", launchDate: "Jun 2010" },
  { rank: 132, name: "Motilal Oswal Nifty Smallcap 250 Index Fund", category: "Index", subCategory: "Small Cap", returns1Y: 19.45, returns3Y: 18.56, returns5Y: 17.67, aum: 2345, expenseRatio: 0.35, riskLevel: "Very High", minSip: 500, minLumpsum: 500, exitLoad: "Nil", fundManager: "Swapnil Mayekar", launchDate: "Sep 2019" },

  // ═══════════════════════════════════════════════════════════════════════════
  // INTERNATIONAL FUNDS
  // ═══════════════════════════════════════════════════════════════════════════
  { rank: 135, name: "Franklin India Feeder - Franklin US Opportunities Fund", category: "International", subCategory: "US Equity", returns1Y: 12.34, returns3Y: 11.45, returns5Y: 15.67, aum: 5678, expenseRatio: 1.52, riskLevel: "High", minSip: 500, minLumpsum: 5000, exitLoad: "1% if <1Y", fundManager: "Sandeep Manam", launchDate: "Feb 2012" },
  { rank: 136, name: "ICICI Prudential US Bluechip Equity Fund", category: "International", subCategory: "US Equity", returns1Y: 11.78, returns3Y: 10.89, returns5Y: 14.78, aum: 3456, expenseRatio: 1.85, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Mittul Kalawadia", launchDate: "Jul 2012" },
  { rank: 138, name: "Motilal Oswal Nasdaq 100 FOF", category: "International", subCategory: "US Equity", returns1Y: 15.67, returns3Y: 14.78, returns5Y: 22.34, aum: 8765, expenseRatio: 0.52, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "1% if <15D", fundManager: "Swapnil Mayekar", launchDate: "Mar 2018" },
  { rank: 139, name: "Kotak NASDAQ 100 FOF", category: "International", subCategory: "US Equity", returns1Y: 14.89, returns3Y: 13.78, returns5Y: 21.45, aum: 4567, expenseRatio: 0.55, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <7D", fundManager: "Devender Singhal", launchDate: "Feb 2021" },
  { rank: 140, name: "Edelweiss Greater China Equity Off-shore Fund", category: "International", subCategory: "China Equity", returns1Y: 2.34, returns3Y: 1.45, returns5Y: 5.67, aum: 234, expenseRatio: 2.05, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "1% if <1Y", fundManager: "Bhavesh Jain", launchDate: "Feb 2011" },
  { rank: 141, name: "Nippon India Japan Equity Fund", category: "International", subCategory: "Japan Equity", returns1Y: 8.45, returns3Y: 7.56, returns5Y: 9.67, aum: 567, expenseRatio: 2.12, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Kinjal Desai", launchDate: "Aug 2014" },

  // ═══════════════════════════════════════════════════════════════════════════
  // COMMODITY - GOLD & SILVER
  // ═══════════════════════════════════════════════════════════════════════════
  { rank: 144, name: "SBI Gold Fund", category: "Commodity", subCategory: "Gold", returns1Y: 14.56, returns3Y: 13.67, returns5Y: 12.78, aum: 2345, expenseRatio: 0.45, riskLevel: "Moderate", minSip: 500, minLumpsum: 5000, exitLoad: "1% if <15D", fundManager: "Raviprakash Sharma", launchDate: "Sep 2011" },
  { rank: 145, name: "HDFC Gold Fund", category: "Commodity", subCategory: "Gold", returns1Y: 14.23, returns3Y: 13.34, returns5Y: 12.45, aum: 3456, expenseRatio: 0.48, riskLevel: "Moderate", minSip: 100, minLumpsum: 100, exitLoad: "1% if <15D", fundManager: "Krishan Daga", launchDate: "Oct 2011" },
  { rank: 146, name: "ICICI Prudential Regular Gold Savings Fund", category: "Commodity", subCategory: "Gold", returns1Y: 14.12, returns3Y: 13.23, returns5Y: 12.34, aum: 1234, expenseRatio: 0.42, riskLevel: "Moderate", minSip: 100, minLumpsum: 100, exitLoad: "1% if <15D", fundManager: "Kayzad Eghlim", launchDate: "Sep 2011" },
  { rank: 147, name: "Kotak Gold Fund", category: "Commodity", subCategory: "Gold", returns1Y: 13.89, returns3Y: 12.78, returns5Y: 11.89, aum: 2345, expenseRatio: 0.52, riskLevel: "Moderate", minSip: 100, minLumpsum: 100, exitLoad: "1% if <15D", fundManager: "Abhishek Bisen", launchDate: "Mar 2011" },
  { rank: 148, name: "Nippon India Gold Savings Fund", category: "Commodity", subCategory: "Gold", returns1Y: 14.34, returns3Y: 13.45, returns5Y: 12.56, aum: 4567, expenseRatio: 0.45, riskLevel: "Moderate", minSip: 100, minLumpsum: 100, exitLoad: "1% if <15D", fundManager: "Mehul Dama", launchDate: "Mar 2011" },
  { rank: 149, name: "Axis Gold Fund", category: "Commodity", subCategory: "Gold", returns1Y: 13.78, returns3Y: 12.89, returns5Y: 11.78, aum: 1234, expenseRatio: 0.48, riskLevel: "Moderate", minSip: 500, minLumpsum: 500, exitLoad: "1% if <15D", fundManager: "Ashish Naik", launchDate: "Oct 2011" },
  { rank: 150, name: "SBI Silver ETF FOF", category: "Commodity", subCategory: "Silver", returns1Y: 18.45, returns3Y: 17.56, returns5Y: 16.67, aum: 567, expenseRatio: 0.42, riskLevel: "Moderate-High", minSip: 500, minLumpsum: 5000, exitLoad: "1% if <15D", fundManager: "Raviprakash Sharma", launchDate: "Jan 2022" },
  { rank: 151, name: "ICICI Prudential Silver ETF FOF", category: "Commodity", subCategory: "Silver", returns1Y: 18.23, returns3Y: 17.34, returns5Y: 16.45, aum: 345, expenseRatio: 0.45, riskLevel: "Moderate-High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <15D", fundManager: "Kayzad Eghlim", launchDate: "Jan 2022" },

  // ═══════════════════════════════════════════════════════════════════════════
  // SOLUTION ORIENTED - RETIREMENT & CHILDREN
  // ═══════════════════════════════════════════════════════════════════════════
  { rank: 152, name: "HDFC Retirement Savings Fund - Equity Plan", category: "Solution", subCategory: "Retirement", returns1Y: 16.78, returns3Y: 15.89, returns5Y: 14.78, aum: 5678, expenseRatio: 1.45, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "Nil if 60+", fundManager: "Shobhit Mehrotra", launchDate: "Feb 2016" },
  { rank: 153, name: "ICICI Prudential Retirement Fund - Pure Equity", category: "Solution", subCategory: "Retirement", returns1Y: 17.23, returns3Y: 16.34, returns5Y: 15.45, aum: 2345, expenseRatio: 1.52, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "Nil if 60+", fundManager: "Mittul Kalawadia", launchDate: "Feb 2019" },
  { rank: 154, name: "Tata Retirement Savings Fund - Progressive Plan", category: "Solution", subCategory: "Retirement", returns1Y: 15.56, returns3Y: 14.67, returns5Y: 13.78, aum: 1234, expenseRatio: 1.65, riskLevel: "High", minSip: 500, minLumpsum: 5000, exitLoad: "1% if <5Y", fundManager: "Chandraprakash Padiyar", launchDate: "Nov 2011" },
  { rank: 155, name: "HDFC Children's Gift Fund", category: "Solution", subCategory: "Children", returns1Y: 17.89, returns3Y: 16.78, returns5Y: 15.67, aum: 8765, expenseRatio: 1.35, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "3% if <3Y", fundManager: "Chirag Setalvad", launchDate: "Feb 1999" },
  { rank: 156, name: "ICICI Prudential Child Care Fund - Gift Plan", category: "Solution", subCategory: "Children", returns1Y: 16.45, returns3Y: 15.56, returns5Y: 14.45, aum: 3456, expenseRatio: 1.48, riskLevel: "High", minSip: 100, minLumpsum: 100, exitLoad: "1% if <1Y", fundManager: "Manish Banthia", launchDate: "Aug 2001" },
  { rank: 157, name: "SBI Magnum Children's Benefit Fund", category: "Solution", subCategory: "Children", returns1Y: 15.78, returns3Y: 14.89, returns5Y: 13.78, aum: 2345, expenseRatio: 1.52, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "Nil if 18+", fundManager: "Dinesh Ahuja", launchDate: "Feb 2002" },
  { rank: 158, name: "UTI Children's Career Fund - Investment Plan", category: "Solution", subCategory: "Children", returns1Y: 16.12, returns3Y: 15.23, returns5Y: 14.12, aum: 1234, expenseRatio: 1.58, riskLevel: "High", minSip: 500, minLumpsum: 500, exitLoad: "2% if <3Y", fundManager: "Ajay Tyagi", launchDate: "Feb 2004" },
];

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

export function getFundsByCategory(category: string): MutualFundData[] {
  return MUTUAL_FUND_DATA.filter(f => f.category === category);
}

export function getFundsBySubCategory(subCategory: string): MutualFundData[] {
  return MUTUAL_FUND_DATA.filter(f => f.subCategory === subCategory);
}

export function getTopPerformers(n: number = 10): MutualFundData[] {
  return [...MUTUAL_FUND_DATA].sort((a, b) => b.returns1Y - a.returns1Y).slice(0, n);
}

export function getLowExpenseRatioFunds(maxExpense: number = 0.5): MutualFundData[] {
  return MUTUAL_FUND_DATA.filter(f => f.expenseRatio <= maxExpense);
}

export function getHighRatedFunds(): MutualFundData[] {
  return MUTUAL_FUND_DATA.filter(f => f.returns3Y > 15);
}

export function searchFunds(query: string): MutualFundData[] {
  const lowerQuery = query.toLowerCase();
  return MUTUAL_FUND_DATA.filter(f => 
    f.name.toLowerCase().includes(lowerQuery) ||
    f.subCategory.toLowerCase().includes(lowerQuery) ||
    f.fundManager.toLowerCase().includes(lowerQuery)
  );
}

// Category counts for explorer
export const CATEGORY_COUNTS = {
  equity: MUTUAL_FUND_DATA.filter(f => f.category === 'Equity').length,
  debt: MUTUAL_FUND_DATA.filter(f => f.category === 'Debt').length,
  hybrid: MUTUAL_FUND_DATA.filter(f => f.category === 'Hybrid').length,
  index: MUTUAL_FUND_DATA.filter(f => f.category === 'Index').length,
  international: MUTUAL_FUND_DATA.filter(f => f.category === 'International').length,
  commodity: MUTUAL_FUND_DATA.filter(f => f.category === 'Commodity').length,
  solution: MUTUAL_FUND_DATA.filter(f => f.category === 'Solution').length,
};

// Sub-category list
export const SUB_CATEGORIES = [
  // Equity
  'Large Cap', 'Mid Cap', 'Small Cap', 'Flexi Cap', 'Value', 'Contra', 'ELSS',
  'Thematic - Infrastructure', 'Thematic - PSU', 'Thematic - Banking', 
  'Thematic - Pharma', 'Thematic - IT', 'Thematic - Consumption', 'Thematic - Defence',
  // Hybrid
  'Multi Asset', 'Aggressive Hybrid', 'Dynamic Asset Allocation', 'Equity Savings', 'Arbitrage',
  // Debt
  'Floating Rate', 'Medium Duration', 'Short Duration', 'Ultra Short Duration',
  'Liquid', 'Gilt', 'Credit Risk', 'Corporate Bond', 'Banking & PSU',
  // Others
  'Gold', 'Silver', 'US Equity', 'Japan Equity', 'China Equity',
  'Retirement', 'Children'
];

// AMC List
export const AMC_LIST = [
  'HDFC', 'ICICI Prudential', 'SBI', 'Axis', 'Kotak', 'Nippon India',
  'Aditya Birla Sun Life', 'UTI', 'DSP', 'Mirae Asset', 'Tata',
  'Franklin Templeton', 'Edelweiss', 'Motilal Oswal', 'PGIM India',
  'Quant', 'Canara Robeco', 'Invesco India', 'HSBC', 'Bandhan',
  'Sundaram', 'JM Financial', 'Baroda BNP Paribas', 'Union', 'Bank of India'
];
