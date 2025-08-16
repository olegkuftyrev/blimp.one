// src/utils/plCalculations.js
// P&L calculation utilities that can be imported by any component

import { safe } from './calcUtils.js';

// Daypart calculations
export function calculateDayparts(values) {
  const dayparts = {
    "Breakfast %": safe(values["Breakfast %"]),
    "Lunch %": safe(values["Lunch %"]),
    "Afternoon %": safe(values["Afternoon %"]),
    "Evening %": safe(values["Evening %"]),
  };
  
  const busiestEntry = Object.entries(dayparts).reduce(
    (max, cur) => (cur[1] > max[1] ? cur : max),
    ["", -Infinity]
  );
  
  return {
    dayparts,
    busiestLabel: busiestEntry[0],
    busiestValue: busiestEntry[1]
  };
}

// OLO (Online Ordering) calculations
export function calculateOLO(values) {
  const netSales = safe(values["Net Sales"]);
  const thirdParty = safe(values["3rd Party Digital Sales"]);
  const pandaDigital = safe(values["Panda Digital Sales"]);
  
  const oloPercent = netSales > 0 ? ((thirdParty + pandaDigital) / netSales) * 100 : 0;
  
  return {
    oloPercent,
    thirdParty,
    pandaDigital
  };
}

// COGS and Labor percentage calculations
export function calculatePercentages(values) {
  const netSales = safe(values["Net Sales"]);
  const cogs = safe(values["Cost of Goods Sold"]);
  const totalLabor = safe(values["Total Labor"]);
  
  const cogsPercent = netSales > 0 ? (cogs / netSales) * 100 : 0;
  const laborPercent = netSales > 0 ? (totalLabor / netSales) * 100 : 0;
  const primeCost = cogsPercent + laborPercent;
  
  return {
    cogsPercent,
    laborPercent,
    primeCost,
    cogs,
    totalLabor
  };
}

// Rent calculations
export function calculateRent(values) {
  const rentKeys = [
    "Rent - MIN",
    "Rent - Storage",
    "Rent - Percent",
    "Rent - Other",
    "Rent - Deferred Preopening",
  ];
  
  const rentActual = rentKeys.reduce((sum, k) => sum + safe(values[k]), 0);
  const rentPrior = rentKeys.reduce((sum, k) => sum + safe(values[`Prior ${k}`]), 0);
  const rentDiff = rentActual - rentPrior;
  const rentPctDiff = rentPrior ? (rentDiff / rentPrior) * 100 : 0;
  
  return {
    rentActual,
    rentPrior,
    rentDiff,
    rentPctDiff
  };
}

// Repairs calculations
export function calculateRepairs(values) {
  const repairsAct = safe(values["Repairs"]);
  const repairsPri = safe(values["Prior Repairs"]);
  const repairsDiff = repairsAct - repairsPri;
  const repairsPct = repairsPri ? (repairsDiff / repairsPri) * 100 : 0;
  
  return {
    repairsAct,
    repairsPri,
    repairsDiff,
    repairsPct
  };
}

// Maintenance calculations
export function calculateMaintenance(values) {
  const maintAct = safe(values["Maintenance"]);
  const maintPri = safe(values["Prior Maintenance"]);
  const maintDiff = maintAct - maintPri;
  const maintPct = maintPri ? (maintDiff / maintPri) * 100 : 0;
  
  return {
    maintAct,
    maintPri,
    maintDiff,
    maintPct
  };
}

// Net Sales calculations with prior comparison
export function calculateNetSales(values) {
  const actual = safe(values['Net Sales']);
  const prior = safe(values['Prior Net Sales']);
  const delta = actual - prior;
  const deltaPercent = prior ? (delta / prior) * 100 : 0;
  
  return {
    actual,
    prior,
    delta,
    deltaPercent
  };
}

// SST (Same Store Transactions) calculations
export function calculateSST(values) {
  const actual = safe(values["Total Transactions"]);
  const prior = safe(values["Prior Total Transactions"]);
  const delta = actual - prior;
  const deltaPercent = prior ? (delta / prior) * 100 : 0;
  
  return {
    actual,
    prior,
    delta,
    deltaPercent
  };
}

// Labor metrics calculations
export function calculateLaborMetrics(values) {
  const direct = safe(values['Direct Labor']);
  const mgmt = safe(values['Management Labor']);
  const tax = safe(values['Taxes and Benefits']);
  const totalLabor = direct + mgmt + tax;
  const hourlyWage = safe(values['Average Hourly Wage']);
  const overtimeHrs = safe(values['Overtime Hours']);
  
  const netSales = safe(values['Net Sales']);
  const laborPercent = netSales > 0 ? (totalLabor / netSales) * 100 : 0;
  const totalHours = hourlyWage > 0 ? (totalLabor / hourlyWage) : 0;
  const productivity = totalHours > 0 ? (netSales / totalHours) : 0;
  
  return {
    direct,
    mgmt,
    tax,
    totalLabor,
    hourlyWage,
    overtimeHrs,
    laborPercent,
    totalHours,
    productivity
  };
}

// Controllable Profit calculations
export function calculateControllableProfit(values, rows, actualIdx) {
  const netSales = safe(values['Net Sales']);
  const cogs = safe(values['Cost of Goods Sold']);
  const controllables = safe(values['Total Controllables']);
  
  // Find last Advertising before Controllable Profit
  function getLastAdvertisingBeforeCP(rows, actualIdx) {
    if (!rows || !actualIdx) return 0;
    const cpIndex = rows.findIndex(row => row[0] === 'Controllable Profit');
    if (cpIndex === -1) return 0;
    for (let i = cpIndex - 1; i >= 0; i--) {
      if ((rows[i][0] || '').toString().trim() === 'Advertising') {
        return safe(rows[i][actualIdx]);
      }
    }
    return 0;
  }
  
  const advertising = getLastAdvertisingBeforeCP(rows, actualIdx);
  const labor = safe(values['Total Labor']);
  
  const cp = netSales - (cogs + labor + controllables + advertising);
  const cpPrior = safe(values['Prior Controllable Profit']);
  const cpChange = cp - cpPrior;
  const cpPercent = netSales > 0 ? (cp / netSales) * 100 : 0;
  
  return {
    cp,
    cpPrior,
    cpChange,
    cpPercent,
    advertising
  };
}

// Restaurant Contribution calculations
export function calculateRestaurantContribution(cp, values) {
  const fixed = safe(values['Total Fixed Cost']);
  const restaurant = cp - fixed;
  const restaurantPercent = safe(values['Net Sales']) > 0 ? (restaurant / safe(values['Net Sales'])) * 100 : 0;
  
  return {
    restaurant,
    restaurantPercent,
    fixed
  };
}

// Cash Flow calculations
export function calculateCashFlow(restaurant, values) {
  const amort = safe(values['Amortization']);
  const depr = safe(values['Depreciation']);
  const cashflow = restaurant + amort + depr;
  
  return {
    cashflow,
    amort,
    depr
  };
}

// Flow Thru calculations
export function calculateFlowThru(cp, values) {
  const cpPrior = safe(values['Prior Controllable Profit']);
  const netSales = safe(values['Net Sales']);
  const priorNetSales = safe(values['Prior Net Sales']);
  
  const deltaCP = cp - cpPrior;
  const deltaNetSales = netSales - priorNetSales;
  const flowThru = deltaNetSales !== 0 ? (deltaCP / deltaNetSales) * 100 : 0;
  
  return {
    flowThru,
    deltaCP,
    deltaNetSales
  };
}

// Check Average calculation
export function calculateCheckAverage(values) {
  const netSales = safe(values["Net Sales"]);
  const transactions = safe(values["Total Transactions"]);
  const checkAvg = transactions > 0 ? netSales / transactions : 0;
  
  return {
    checkAvg,
    transactions
  };
}

// Complete P&L calculations object
export function calculateAllPLMetrics(values, rows, actualIdx) {
  const netSales = calculateNetSales(values);
  const dayparts = calculateDayparts(values);
  const olo = calculateOLO(values);
  const percentages = calculatePercentages(values);
  const rent = calculateRent(values);
  const repairs = calculateRepairs(values);
  const maintenance = calculateMaintenance(values);
  const sst = calculateSST(values);
  const checkAvg = calculateCheckAverage(values);
  const labor = calculateLaborMetrics(values);
  const cp = calculateControllableProfit(values, rows, actualIdx);
  const rc = calculateRestaurantContribution(cp.cp, values);
  const cashFlow = calculateCashFlow(rc.restaurant, values);
  const flowThru = calculateFlowThru(cp.cp, values);
  
  return {
    netSales,
    dayparts,
    olo,
    percentages,
    rent,
    repairs,
    maintenance,
    sst,
    checkAvg,
    labor,
    cp,
    rc,
    cashFlow,
    flowThru
  };
}
