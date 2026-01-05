import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDailySales } from '../../redux/slice/dashboard'
import { CRow, CCol, CWidgetStatsA } from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilDollar, cilClipboard, cilLoopCircular } from '@coreui/icons'
import styles from './widget.module.scss'
import Loader from '../../components/loader/loader'
const WidgetsDropdown = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    totalSales = 0,
    pendingOrders = 0,
    returnedOrders = 0,
    status = 'idle',
  } = useSelector((state) => state.dashboard ?? {})

  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const today = new Date().toISOString().split('T')[0]
    dispatch(fetchDailySales({ timezone, date: today }))
  }, [dispatch])

  const handleNavigate = (path) => () => navigate(path)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US').format(amount)
  }

  const widgets = [
    {
      id: 'total-sales',
      title: 'Sale Report',
      subtitle: "Today's Revenue",
      value: `${formatCurrency(totalSales)} SYP`,
      icon: cilDollar,
      path: '/sale-report',
      gradient: 'salesGradient',
      iconColor: 'salesIcon',
    },
    {
      id: 'pending-orders',
      title: 'Order Requests',
      subtitle: 'Awaiting Processing',
      value: pendingOrders,
      icon: cilClipboard,
      path: '/order-request',
      gradient: 'ordersGradient',
      iconColor: 'ordersIcon',
    },
    {
      id: 'returned-orders',
      title: 'Returned Orders',
      subtitle: 'This Month',
      value: returnedOrders,
      icon: cilLoopCircular,
      path: '/dashboard/return-order',
      gradient: 'returnsGradient',
      iconColor: 'returnsIcon',
    },
  ]

  return (
    <div className={styles.widgetsContainer}>
      <CRow className={styles.widgetsRow}>
        {widgets.map((widget, index) => (
          <CCol key={widget.id} xs={12} sm={6} lg={3} className={styles.widgetCol}>
            <div
              className={styles.widgetWrapper}
              onClick={handleNavigate(widget.path)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`${styles.widgetCard} ${styles[widget.gradient]}`}>
                {/* Background Pattern */}
                <div className={styles.widgetPattern}></div>

                {/* Main Content */}
                <div className={styles.widgetContent}>
                  <div className={styles.widgetHeader}>
                    <div className={styles.widgetTitleSection}>
                      <h3 className={styles.widgetTitle}>{widget.title}</h3>
                      <p className={styles.widgetSubtitle}>{widget.subtitle}</p>
                    </div>

                    <div className={`${styles.widgetIcon} ${styles[widget.iconColor]}`}>
                      <CIcon icon={widget.icon} size="xl" />
                    </div>
                  </div>

                  <div className={styles.widgetBody}>
                    <div className={styles.widgetValue}>{widget.value}</div>

                    {/* <div className={styles.widgetFooter}>
                      <div
                        className={`${styles.widgetTrend} ${
                          widget.trendDirection === 'up' ? styles.trendUp : styles.trendDown
                        }`}
                      >
                        <span className={styles.trendIcon}>
                          {widget.trendDirection === 'up' ? '↗' : '↘'}
                        </span>
                        <span className={styles.trendValue}>{widget.trend}</span>
                      </div>
                      <span className={styles.widgetPeriod}>vs last period</span>
                    </div> */}
                  </div>
                </div>

                {/* Hover Effect */}
                <div className={styles.widgetHoverEffect}></div>

                {/* Status Indicator */}
                <div className={styles.widgetStatus}>
                  <div className={styles.statusDot}></div>
                </div>
              </div>
            </div>
          </CCol>
        ))}
      </CRow>

      {/* Loading State */}
      {status === 'loading' && <Loader />}
    </div>
  )
}

export default WidgetsDropdown
