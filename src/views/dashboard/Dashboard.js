import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import Loader from '../../components/loader/loader'
import { DashboardProductheaders } from '../../utils/header'
import { fetchProducts } from '../../redux/slice/productSlice'
import { fetchDailySales } from '../../redux/slice/dashboard'
import { useTranslation } from 'react-i18next'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts'
import styles from './dashboard.module.scss'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation('dashboard')
  const {
    products,
    status: productStatus,
    totalRecords: productTotalRecords,
  } = useSelector((state) => state.products)
  const { topCustomers } = useSelector((state) => state.dashboard ?? {})
  const [productCurrentPage, setProductCurrentPage] = useState(1)
  const [ProductPageSize] = useState(100000)
  const [ProductSortKey, setProductSortKey] = useState('productName')
  const [ProductSortDirection, setProductSortDirection] = useState('asc')

  const loadProducts = useCallback(() => {
    dispatch(
      fetchProducts({
        page: productCurrentPage,
        pageSize: ProductPageSize,
        sortKey: ProductSortKey,
        sortDirection: ProductSortDirection,
      }),
    )
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const today = new Date().toISOString().split('T')[0]
    dispatch(fetchDailySales({ timezone, date: today }))
  }, [dispatch, productCurrentPage, ProductPageSize, ProductSortKey, ProductSortDirection])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const CustomizedAxisTick = ({ x, y, payload }) => {
    const words =
      payload.value.length > 10
        ? [payload.value.slice(0, 10), payload.value.slice(10)]
        : [payload.value]

    return (
      <g transform={`translate(${x},${y})`}>
        {words.map((word, index) => (
          <text
            key={index}
            x={0}
            y={index * 11}
            dy={16}
            textAnchor="middle"
            fontSize={11}
            fill="#64748B"
            fontWeight="500"
          >
            {word}
          </text>
        ))}
      </g>
    )
  }

  const handleProductPageChange = (page) => {
    setProductCurrentPage(page)
  }

  const handleProductSort = (key, direction) => {
    setProductSortKey(key)
    setProductSortDirection(direction === 'asc' ? 'asc' : 'desc')
    setProductCurrentPage(1)
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const { name, stock, image } = payload[0].payload
      return (
        <div className={styles.customTooltip}>
          {image && (
            <div className={styles.tooltipImageWrapper}>
              <img src={image} alt={name} className={styles.tooltipImage} />
            </div>
          )}
          <div className={styles.tooltipContent}>
            <p className={styles.tooltipTitle}>{name}</p>
            <p className={styles.tooltipStock}>
              Stock: <span>{stock}</span>
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  const getStockColor = (stock) => {
    if (stock <= 5) return '#EF4444' // Red
    if (stock <= 20) return '#F59E0B' // Yellow
    return '#10B981' // Green
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.widgetsSection}>
        <WidgetsDropdown className="mb-4" />
      </div>

      {/* Inventory Overview Chart */}
      {products?.length > 0 && (
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>{t('InventoryOverview')}</h3>
            <div className={styles.chartSubtitle}>{t('Real-time stock levels across all products')}</div>
          </div>

          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={products.map((p) => ({
                  name:
                    p.productName.length > 20 ? p.productName.slice(0, 18) + '…' : p.productName,
                  stock: p.stockQuantity || 0,
                  image:
                    Array.isArray(p.images) && p.images.length > 0
                      ? p.images[0]
                      : p.variants?.[0]?.images?.[0],
                }))}
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
              >
                <defs>
                  <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0.3} />
                  </linearGradient>
                </defs>

                <XAxis
                  dataKey="name"
                  interval={0}
                  height={70}
                  tick={<CustomizedAxisTick />}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 12, fontWeight: '500' }}
                />
                <Tooltip content={<CustomTooltip />} />

                <Bar dataKey="stock" barSize={30} radius={[4, 4, 0, 0]}>
                  {products.map((p, index) => (
                    <Cell key={`cell-${index}`} fill={getStockColor(p.stockQuantity || 0)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Stock Legend */}
          <div className={styles.stockLegend}>
            <div className={styles.legendItem}>
              <div className={`${styles.legendColor} ${styles.lowStock}`}></div>
              <span>{t('Low Stock (≤5)')}</span>
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.legendColor} ${styles.mediumStock}`}></div>
              <span>{t('Medium Stock (6-20)')}</span>
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.legendColor} ${styles.highStock}`}></div>
              <span>{t('High Stock (>20)')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Top Customers Section */}
      <div className={styles.customersSection}>
        <div className={styles.customersCard}>
          <div className={styles.customersHeader}>
            <h3 className={styles.customersTitle}>{t('Top Customers')}</h3>
            <div className={styles.customersSubtitle}>{t('Highest performing customers this period')}</div>
          </div>

          <div className={styles.customersGrid}>
            {topCustomers?.length > 0 ? (
              topCustomers.slice(0, 3).map((customer, index) => (
                <div key={index} className={styles.customerCard}>
                  <div className={styles.customerRank}>#{index + 1}</div>

                  <div
                    className={`${styles.customerAvatar} ${
                      index === 0
                        ? styles.goldGradient
                        : index === 1
                          ? styles.silverGradient
                          : index === 2
                            ? styles.bronzeGradient
                            : styles.defaultGradient
                    }`}
                  >
                    <span>{customer?.name?.charAt(0).toUpperCase() || '?'}</span>
                  </div>

                  <div className={styles.customerInfo}>
                    <h4 className={styles.customerName}>{customer.name}</h4>
                    <div className={styles.customerStats}>
                      <div className={styles.statItem}>
                        <span className={styles.statValue}>
                          {Number(customer.totalSpent).toLocaleString()} SYP
                        </span>
                        <span className={styles.statLabel}>{t('Total Sales')}</span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statValue}>{customer.totalOrders}</span>
                        <span className={styles.statLabel}>{t('Orders')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.noCustomers}>{t('No top customers available')}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
