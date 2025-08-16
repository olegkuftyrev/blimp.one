// src/utils/metricBuilders.js
// Utility functions for building metric arrays that can be imported by any component

import { safe } from './calcUtils.js';

// Build Sales metrics array
export function buildSalesMetrics(calculations) {
  const { netSales, sst, checkAvg, olo } = calculations;
  
  return [
    {
      label: "Net Sales",
      value: `Act: $${netSales.actual.toLocaleString()}`,
      detail: `Pri: $${netSales.prior.toLocaleString()}`,
      delta: `Δ $${netSales.delta.toLocaleString()} (${netSales.deltaPercent.toFixed(2)}%)`,
      color: netSales.delta >= 0 ? "green.500" : "red.500",
      formula: "(Actual Net Sales - Prior Net Sales) / Prior Net Sales * 100",
    },
    {
      label: "SST%",
      value: `${sst.deltaPercent.toFixed(2)}%`,
      detail: `This Year: ${sst.actual.toLocaleString()}`,
      delta: `Last Year: ${sst.prior.toLocaleString()}`,
      color: sst.deltaPercent >= 0 ? "green.500" : "red.500",
      formula: "(This Year Transactions – Last Year Transactions)/Last Year Transactions",
    },
    { 
      label: "Check Average", 
      value: `$${checkAvg.checkAvg.toFixed(2)}`,
      formula: "Net Sales / Total Transactions",
    },
    { 
      label: "Total Transactions", 
      value: `${checkAvg.transactions}`,
      formula: "Total Transactions",
    },
    { 
      label: "OLO %", 
      value: `${olo.oloPercent.toFixed(2)}%`,
      formula: "(3rd Party + Panda Digital) / Net Sales * 100",
    },
  ];
}

// Build Financial metrics array
export function buildFinancialMetrics(calculations) {
  const { percentages, cashFlow, flowThru } = calculations;
  
  return [
    {
      label: "Prime Cost",
      value: `${percentages.primeCost.toFixed(2)}%`,
      color: percentages.primeCost > 60 ? "red.500" : "green.500",
      formula: "COGS % + Labor %",
    },
    {
      label: "COGS $",
      value: `$${percentages.cogs.toLocaleString()}`,
      formula: "Cost of Goods Sold",
    },
    {
      label: "COGS %",
      value: `${percentages.cogsPercent.toFixed(2)}%`,
      color: percentages.cogsPercent >= 30 ? "red.500" : "green.500",
      formula: "COGS / Net Sales * 100",
    },
    {
      label: "Cash Flow",
      value: `$${cashFlow.cashflow.toLocaleString()}`,
      formula: "RC + Amortization + Depreciation",
    },
    {
      label: "Flow Thru %",
      value: `${flowThru.flowThru.toFixed(2)}%`,
      color: flowThru.flowThru >= 0 ? "green.500" : "red.500",
      formula: "(CP Actual - CP Prior) / (Net Sales Actual - Net Sales Prior) * 100",
    },
  ];
}

// Build CP & RC metrics array
export function buildCPRCMetrics(calculations, values) {
  const { cp } = calculations;
  
  return [
    {
      label: "Controllable Profit $",
      value: `Act: $${cp.cp.toLocaleString()}`,
      detail: `Pri: $${cp.cpPrior.toLocaleString()}`,
      delta: `CP Improvement: $${cp.cpChange.toLocaleString()}`,
      color: cp.cpChange >= 0 ? "green.500" : "red.500",
      formula: "Net Sales - (COGS + Labor + Controllables + Advertising)",
      isCP: true,
    },
    {
      label: "CP %",
      value: `${cp.cpPercent.toFixed(2)}%`,
      formula: "CP / Net Sales * 100",
    },
    {
      label: "Adjusted CP",
      value: `$${(cp.cp + (cp.advertising || 0)).toLocaleString()}`,
      formula: "CP + Bonus + Workers Comp",
    },
    {
      label: "Total Controllables",
      value: `$${safe(values['Total Controllables']).toLocaleString()}`,
      formula: "Total Controllables",
    },
  ];
}

// Build Facility metrics array
export function buildFacilityMetrics(calculations) {
  const { rent, repairs, maintenance } = calculations;
  
  return [
    {
      label: "Rent Total",
      value: `Act: $${rent.rentActual.toLocaleString()}`,
      detail: `Pri: $${rent.rentPrior.toLocaleString()}`,
      delta: `Δ $${rent.rentDiff.toLocaleString()} (${rent.rentPctDiff.toFixed(2)}%)`,
      isRent: true,
      formula: "Rent - MIN + Storage + Percent + Other + Deferred",
    },
    {
      label: "Repairs",
      value: `Act: $${repairs.repairsAct.toLocaleString()}`,
      detail: `Pri: $${repairs.repairsPri.toLocaleString()}`,
      delta: `Δ $${repairs.repairsDiff.toLocaleString()} (${repairs.repairsPct.toFixed(2)}%)`,
      isRepairs: true,
      formula: "Repairs (Actual vs Prior)",
    },
    {
      label: "Maintenance",
      value: `Act: $${maintenance.maintAct.toLocaleString()}`,
      detail: `Pri: $${maintenance.maintPri.toLocaleString()}`,
      delta: `Δ $${maintenance.maintDiff.toLocaleString()} (${maintenance.maintPct.toFixed(2)}%)`,
      isMaintenance: true,
      formula: "Maintenance (Actual vs Prior)",
    },
  ];
}

// Build Labor metrics array
export function buildLaborMetrics(calculations) {
  const { labor } = calculations;
  
  return [
    {
      label: "Labor Total",
      value: `$${labor.totalLabor.toLocaleString()}`,
      formula: "Direct + Management + Taxes",
    },
    {
      label: "Labor %",
      value: `${labor.laborPercent.toFixed(2)}%`,
      color: labor.laborPercent > 30 ? "red.500" : "black",
      formula: "Total Labor / Net Sales * 100",
    },
    {
      label: "Direct Labor",
      value: `$${labor.direct.toLocaleString()}`,
      formula: "Direct Labor",
    },
    {
      label: "Management Labor",
      value: `$${labor.mgmt.toLocaleString()}`,
      formula: "Management Labor",
    },
    {
      label: "Taxes & Benefits",
      value: `$${labor.tax.toLocaleString()}`,
      formula: "Taxes and Benefits",
    },
    {
      label: "Average Hourly Wage",
      value: `$${labor.hourlyWage.toFixed(2)}`,
      formula: "Average Hourly Wage",
    },
    {
      label: "Total Labor Hours",
      value: `${labor.totalHours.toFixed(0)}`,
      formula: "Total Labor $ / Average Hourly Wage",
    },
    {
      label: "Productivity",
      value: `$${labor.productivity.toFixed(2)}`,
      color: labor.productivity > 100 ? "green.500" : "red.500",
      formula: "Net Sales / Total Labor Hours",
    },
    {
      label: "Overtime Hours",
      value: `${labor.overtimeHrs}`,
      color: labor.overtimeHrs > 5 ? "red.500" : "green.500",
      formula: "Overtime Hours",
    },
  ];
}

// Build Restaurant Contribution metrics for CP & RC section
export function buildRestaurantContributionMetrics(calculations) {
  const { rc } = calculations;
  
  return [
    {
      label: "Restaurant Contribution",
      value: `$${rc.restaurant.toLocaleString()}`,
      formula: "CP - Fixed Cost",
    },
    {
      label: "Restaurant Contribution %",
      value: `${rc.restaurantPercent.toFixed(2)}%`,
      formula: "RC / Net Sales * 100",
    },
  ];
}
