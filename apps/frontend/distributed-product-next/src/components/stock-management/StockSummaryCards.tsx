// src/components/stock-management/StockSummaryCards.tsx

import type { StockSummary } from "@/types/stock.type";

interface StockSummaryCardsProps {
  summary: StockSummary;
}

export default function StockSummaryCards({ summary }: StockSummaryCardsProps) {
  return (
    <div className="stock-summary-row">
      <div className="stock-summary-card">
        <div className="stock-summary-icon blue">📦</div>
        <div>
          <div className="stock-summary-value">{summary.totalProducts}</div>
          <div className="stock-summary-label">Total products</div>
        </div>
      </div>

      <div className="stock-summary-card">
        <div className="stock-summary-icon green">✅</div>
        <div>
          <div className="stock-summary-value">
            {summary.unitsInStock.toLocaleString("th-TH")}
          </div>
          <div className="stock-summary-label">Units in stock</div>
        </div>
      </div>

      <div className="stock-summary-card">
        <div className="stock-summary-icon amber">⚠️</div>
        <div>
          <div className="stock-summary-value">{summary.lowStock}</div>
          <div className="stock-summary-label">Low stock (&lt; 10)</div>
        </div>
      </div>

      <div className="stock-summary-card">
        <div className="stock-summary-icon red">⛔</div>
        <div>
          <div className="stock-summary-value">{summary.outOfStock}</div>
          <div className="stock-summary-label">Out of stock</div>
        </div>
      </div>
    </div>
  );
}