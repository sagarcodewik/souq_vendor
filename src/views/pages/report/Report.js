import React, { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts'
import { CIcon } from '@coreui/icons-react'
import {
  cilArrowTop,
  cilArrowBottom,
  cilDollar,
  cilCart,
  cilPeople,
  cilList,
  cilLayers,
} from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSalesReport } from '../../../redux/slice/report'
import Loader from '../../../components/loader/loader'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

const SalesReportDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d')
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const {t} = useTranslation('salereport')
  const { status, error, data } = useSelector((state) => state.report)

  // Helper function to get start & end date in UTC from timeRange
  const getDateRange = () => {
    const end = new Date()
    const start = new Date()

    // Set end date to end of day in UTC
    end.setUTCHours(23, 59, 59, 999)

    // Reset start date to avoid mutation issues
    if (timeRange === '7d') {
      start.setDate(end.getDate() - 6)
    } else if (timeRange === '30d') {
      start.setDate(end.getDate() - 29)
    } else if (timeRange === '90d') {
      start.setDate(end.getDate() - 89)
    }

    // Set start date to beginning of day in UTC
    start.setUTCHours(0, 0, 0, 0)

    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    }
  }

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const { startDate, endDate } = getDateRange()
      await dispatch(fetchSalesReport({ startDate, endDate }))
    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      setIsLoading(false)
    }
  }, [dispatch, timeRange])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Handle filter change
  const handleFilterChange = (newTimeRange) => {
    setTimeRange(newTimeRange)
  }

  if (status === 'loading' || isLoading) {
    return <Loader />
  }

  if (status === 'failed') {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
      </div>
    )
  }

  // Prepare sales trend data from API response
  const salesTrendData =
    data?.salesTrend?.map((item) => ({
      date: item.date,
      sales: item.sales,
      orders: item.orders,
    })) || []

  // Format date for display based on time range
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      if (timeRange === '7d') {
        return date.toLocaleDateString('en-US', { weekday: 'short' })
      } else if (timeRange === '30d') {
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
      } else {
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      }
    } catch (error) {
      return dateString
    }
  }

  // Utility: convert base color to HSL variations
  const generateDistinctColors = (count) => {
    const hues = [186, 206, 226, 246, 266, 286, 306, 326, 346, 6, 26, 46]
    return Array.from({ length: count }, (_, i) => {
      const hue = hues[i % hues.length]
      const lightness = 30 + (i * 40) / count
      return `hsl(${hue}, 75%, ${lightness}%)`
    })
  }

  const categoryColors = generateDistinctColors(12)

  // Prepare category data with consistent color assignment
  const categories = data?.categoryDistribution || []
  const categoryData = categories
    .filter((c) => c.value > 0)
    .map((category, index) => ({
      name: category.name,
      value: Number(category.value) || 0,
      color: categoryColors[index % categoryColors.length],
    }))

  // Prepare top products data
  const topProducts =
    data?.topProducts?.map((product) => ({
      ...product,
      trend: Math.random() > 0.5 ? 'up' : 'down',
    })) || []

  // Prepare recent orders
  const recentOrders = data?.recentOrders?.slice(0, 5) || []

  const MetricCard = ({ title, value, change, changeType, icon, subtitle, bgColor }) => (
    <div className="group position-relative overflow-hidden rounded-3 bg-white shadow-sm border-0 h-100 card-hover">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div
            className={`p-2 rounded-2 me-3 icon-container ${bgColor}`}
            style={{ transition: 'all 0.3s ease' }}
          >
            <CIcon icon={icon} className="text-white" style={{ width: '16px', height: '16px' }} />
          </div>
          <div
            className={`badge rounded-pill px-2 py-1 change-badge ${changeType === 'positive' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}
          >
            <span className="d-flex align-items-center">
              {changeType === 'positive' ? (
                <CIcon
                  icon={cilArrowTop}
                  className="me-1"
                  style={{ width: '12px', height: '12px' }}
                />
              ) : (
                <CIcon
                  icon={cilArrowBottom}
                  className="me-1"
                  style={{ width: '12px', height: '12px' }}
                />
              )}
              {change}%
            </span>
          </div>
        </div>
        <div>
          <p className="text-muted mb-1 small fw-medium">{title}</p>
          <h4 className="fw-bold mb-0 fs-5" style={{ color: '#095f69' }}>
            {value}
          </h4>
          {subtitle && <small className="text-muted">{subtitle}</small>}
        </div>
      </div>
      <style jsx>{`
        .card-hover {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
        }
        .icon-container {
          transition: all 0.3s ease;
        }
        .group:hover .icon-container {
          transform: scale(1.1) rotate(3deg);
        }
        .change-badge {
          transition: all 0.3s ease;
        }
        .group:hover .change-badge {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  )

  const ProductCard = ({ product, index }) => (
    <div className="group d-flex align-items-center p-3 bg-white rounded-3 shadow-sm border-0 mb-3 product-card">
      <div
        className="d-flex align-items-center justify-content-center me-3 product-rank"
        style={{
          width: '24px',
          height: '24px',
          backgroundColor: '#0b737f',
          borderRadius: '8px',
          transition: 'all 0.3s ease',
        }}
      >
        <span className="text-white fw-bold small">{index + 1}</span>
      </div>
      <div className="flex-fill">
        <h6 className="fw-bold mb-1 small product-name">{product.name}</h6>
        <small className="text-muted">{product.units} units sold</small>
      </div>
      <div className="text-end">
        <p className="fw-bold mb-1 small product-sales" style={{ color: '#0b737f' }}>
          {product.sales} SYP
        </p>
        <div
          className={`d-flex align-items-center justify-content-end small ${product.salesChange >= 0 ? 'text-success' : 'text-danger'}`}
        >
          {product.salesChange >= 0 ? (
            <CIcon icon={cilArrowTop} className="me-1" style={{ width: '12px', height: '12px' }} />
          ) : (
            <CIcon
              icon={cilArrowBottom}
              className="me-1"
              style={{ width: '12px', height: '12px' }}
            />
          )}
          <small>
            {product.salesChange >= 0 ? `+${product.salesChange}` : product.salesChange}%
          </small>
        </div>
      </div>
      <style jsx>{`
        .product-card {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .product-card:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
        }
        .product-card:hover .product-rank {
          transform: scale(1.1) rotate(6deg);
        }
        .product-card:hover .product-name {
          color: #0b737f !important;
        }
        .product-card:hover .product-sales {
          color: #28a745 !important;
        }
      `}</style>
    </div>
  )

  const OrderCard = ({ order }) => (
    <div className="group d-flex align-items-center p-3 bg-white rounded-3 shadow-sm border-0 mb-3 order-card">
      <div
        className="d-flex align-items-center justify-content-center me-3 order-icon"
        style={{
          width: '24px',
          height: '24px',
          backgroundColor: '#28a745',
          borderRadius: '8px',
          transition: 'all 0.3s ease',
        }}
      >
        <CIcon icon={cilList} className="text-white" style={{ width: '12px', height: '12px' }} />
      </div>
      <div className="flex-fill">
        <h6 className="fw-bold mb-1 small order-id">#{order.orderId}</h6>
        <p className="text-muted mb-1 small">{order.product}</p>
        <small className="text-muted">Qty: {order.quantity}</small>
      </div>
      <div className="text-end">
        <p className="fw-bold mb-2 small order-amount" style={{ color: '#0b737f' }}>
          {order.amount} SYP
        </p>
        <span
          className={`badge small ${order.status === 'delivered' ? 'bg-success' : order.status === 'processing' ? 'bg-warning' : 'bg-primary'} order-status`}
        >
          {order.status}
        </span>
      </div>
      <style jsx>{`
        .order-card {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .order-card:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
        }
        .order-card:hover .order-icon {
          transform: scale(1.1) rotate(12deg);
        }
        .order-card:hover .order-id {
          color: #28a745 !important;
        }
        .order-card:hover .order-amount {
          color: #17a2b8 !important;
        }
        .order-card:hover .order-status {
          transform: scale(1.05);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  )

  return (
    <div
      style={{
        backgroundColor: '#f8fafc',
        color: 'rgba(8, 85, 94, 0.95)',
        minHeight: '100vh',
        padding: '1rem',
      }}
    >
      <div className="container-fluid">
        {/* Compact Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-2 dashboard-title">{t('Sales Dashboard')}</h4>
                <p className="text-muted small">{t('Track your performance and grow your business')}</p>
              </div>
              <div className="d-flex align-items-center">
                <select
                  value={timeRange}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="form-select form-select-sm me-3 time-select"
                  style={{ width: 'auto' }}
                >
                  <option value="7d">{t('Last 7 days')}</option>
                  <option value="30d">{t('Last 30 days')}</option>
                  <option value="90d">{t('Last 3 months')}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards - Single Row */}
        <div className="row mb-4">
          <div className="col-6 col-lg-3 mb-3">
            <MetricCard
              title={t('Total Revenue')}
              value={`${data?.summary?.totalRevenue || 0} SYP`}
              change={`${data?.summary?.comparison?.revenueChange || 0}`}
              changeType={
                (data?.summary?.comparison?.revenueChange || 0) < 0 ? 'negative' : 'positive'
              }
              icon={cilDollar}
              subtitle={t("vs last period")}
              bgColor="bg-success"
            />
          </div>
          <div className="col-6 col-lg-3 mb-3">
            <MetricCard
              title={t("Total Orders")}
              value={data?.summary?.totalOrders || 0}
              change={`${data?.summary?.comparison?.ordersChange || 0}`}
              changeType={
                (data?.summary?.comparison?.ordersChange || 0) < 0 ? 'negative' : 'positive'
              }
              icon={cilCart}
              subtitle={t("vs last period")}
              bgColor="bg-primary"
            />
          </div>
          <div className="col-6 col-lg-3 mb-3">
            <MetricCard
              title={t("Active Customers")}
              value={data?.summary?.activeCustomers || 0}
              change={`${data?.summary?.comparison?.customersChange || 0}`}
              changeType={
                (data?.summary?.comparison?.customersChange || 0) < 0 ? 'negative' : 'positive'
              }
              icon={cilPeople}
              subtitle={t("vs last period")}
              bgColor="bg-info"
            />
          </div>
          <div className="col-6 col-lg-3 mb-3">
            <MetricCard
              title={t('Average Order Value')}
              value={`${data?.summary?.averageOrderValue || 0} SYP`}
              change={`${data?.summary?.comparison?.aovChange || 0}`}
              changeType={(data?.summary?.comparison?.aovChange || 0) < 0 ? 'negative' : 'positive'}
              icon={cilArrowTop}
              subtitle={t("vs last period")}
              bgColor="bg-warning"
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="row mb-4">
          {/* Sales Trend Chart - Larger */}
          <div className="col-lg-8 mb-4">
            <div className="card shadow-sm border-0 h-100 chart-card">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5 className="card-title mb-1">{t('Sales Overview')}</h5>
                    <p className="text-muted small mb-0">{t('Revenue trend over time')}</p>
                  </div>
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle me-2"
                      style={{ width: '8px', height: '8px', backgroundColor: '#0b737f' }}
                    ></div>
                    <small className="text-muted">{t("Sales (SYP)")}</small>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={salesTrendData}>
                    <defs>
                      <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0b737f" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0b737f" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={formatDate} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                      formatter={(value) => [`${value} SYP`, 'Sales']}
                      labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#0b737f"
                      strokeWidth={2}
                      fill="url(#salesGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Category Distribution - Compact */}
          <div className="col-lg-4 mb-4">
            <div className="card shadow-sm border-0 h-100 chart-card">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5 className="card-title mb-1">{t('Sales by Category')}</h5>
                    <p className="text-muted small mb-0">{t('Distribution')}</p>
                  </div>
                  <CIcon
                    icon={cilLayers}
                    style={{ color: '#0b737f', width: '16px', height: '16px' }}
                  />
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={1}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="row mt-3">
                  {categoryData.map((item, index) => (
                    <div key={index} className="col-6 mb-2">
                      <div className="d-flex align-items-center category-item">
                        <div
                          className="rounded-circle me-2"
                          style={{ width: '8px', height: '8px', backgroundColor: item.color }}
                        ></div>
                        <small className="text-muted me-1" style={{ fontSize: '11px' }}>
                          {item.name}
                        </small>
                        <span className="fw-semibold small ms-auto">{item.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Side by Side */}
        <div className="row">
          {/* Top Products - Compact */}
          <div className="col-lg-6 mb-4">
            <div className="card shadow-sm border-0 h-100 content-card">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5 className="card-title mb-1">{t('Top Performing Products')}</h5>
                    <p className="text-muted small mb-0">{t('Best performing items')}</p>
                  </div>
                  <CIcon
                    icon={cilLayers}
                    style={{ color: '#0b737f', width: '16px', height: '16px' }}
                  />
                </div>
                <div>
                  {topProducts.length > 0 ? (
                    topProducts
                      .slice(0, 3)
                      .map((product, index) => (
                        <ProductCard key={index} product={product} index={index} />
                      ))
                  ) : (
                    <p className="text-muted">No products data available</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders - Compact */}
          <div className="col-lg-6 mb-4">
            <div className="card shadow-sm border-0 h-100 content-card">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5 className="card-title mb-1">{t('Recent Orders')}</h5>
                    <p className="text-muted small mb-0">{t('Latest transactions')}</p>
                  </div>
                  <CIcon
                    icon={cilList}
                    style={{ color: '#0b737f', width: '16px', height: '16px' }}
                  />
                </div>
                <div>
                  {recentOrders.length > 0 ? (
                    recentOrders
                      .slice(0, 3)
                      .map((order) => <OrderCard key={order.orderId} order={order} />)
                  ) : (
                    <p className="text-muted">{t('No recent orders')}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .chart-card,
          .content-card {
            transition: all 0.3s ease;
          }
          .chart-card:hover,
          .content-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12) !important;
          }
          .dashboard-title:hover {
            color: #0b737f !important;
            transition: color 0.3s ease;
          }
          .time-select:hover {
            border-color: #0b737f !important;
            box-shadow: 0 0 0 0.2rem rgba(11, 115, 127, 0.25);
          }
          .update-time:hover {
            color: #0b737f !important;
            transition: color 0.3s ease;
          }
          .category-item:hover {
            background-color: rgba(11, 115, 127, 0.05);
            padding: 2px 4px;
            border-radius: 4px;
            transition: all 0.2s ease;
          }
        `}</style>
      </div>
    </div>
  )
}

export default SalesReportDashboard
