export type AnalyticsMetric = { label: string; value: number | string; helper?: string }

export function buildAnalyticsMetrics(input: { revenue: number; orders: number; customers: number; lowStock: number }): AnalyticsMetric[] {
  return [
    { label: 'Revenue', value: `₹${input.revenue.toLocaleString('en-IN')}`, helper: 'Verified orders' },
    { label: 'Orders', value: input.orders, helper: 'All order records' },
    { label: 'Customers', value: input.customers, helper: 'Known customers' },
    { label: 'Low stock', value: input.lowStock, helper: 'Variants needing attention' },
  ]
}
