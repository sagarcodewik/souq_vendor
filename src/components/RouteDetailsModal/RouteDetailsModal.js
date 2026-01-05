import React, { useState, useEffect } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CBadge,
  CProgress,
  CCard,
  CCardBody,
  CTooltip,
  CAvatar,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilLocationPin,
  cilCheckCircle,
  cilClock,
  cilTruck,
  cilMap,
  cilUser,
  cilSpeedometer,
  cilDollar,
  cilWarning,
  cilArrowRight,
  cilCheck,
  cilXCircle,
} from '@coreui/icons'

const RouteDetailsModal = ({ visible, setVisible, legs = [] }) => {
  const [animatingLeg, setAnimatingLeg] = useState(null)
  const [hoveredLeg, setHoveredLeg] = useState(null)

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color: 'warning',
        label: 'Pending',
        icon: cilClock,
        gradient: 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)',
      },
      'driver-assigned': {
        color: 'info',
        label: 'Driver Assigned',
        icon: cilUser,
        gradient: 'linear-gradient(135deg, #0dcaf0 0%, #0d6efd 100%)',
      },
      picked: {
        color: 'primary',
        label: 'Picked Up',
        icon: cilTruck,
        gradient: 'linear-gradient(135deg, #0d6efd 0%, #6610f2 100%)',
      },
      'in-transit': {
        color: 'primary',
        label: 'In Transit',
        icon: cilArrowRight,
        gradient: 'linear-gradient(135deg, #6610f2 0%, #d63384 100%)',
      },
      delivered: {
        color: 'success',
        label: 'Delivered',
        icon: cilCheck,
        gradient: 'linear-gradient(135deg, #198754 0%, #20c997 100%)',
      },
      cancelled: {
        color: 'danger',
        label: 'Cancelled',
        icon: cilXCircle,
        gradient: 'linear-gradient(135deg, #dc3545 0%, #fd5e53 100%)',
      },
    }

    const config = statusConfig[status] || {
      color: 'secondary',
      label: status,
      icon: cilClock,
      gradient: 'linear-gradient(135deg, #6c757d 0%, #adb5bd 100%)',
    }

    return (
      <div
        className="d-inline-flex align-items-center px-3 py-1 rounded-pill text-white fw-semibold shadow-sm"
        style={{
          background: config.gradient,
          fontSize: '0.8rem',
          letterSpacing: '0.5px',
          textShadow: '0 1px 2px rgba(0,0,0,0.2)',
        }}
      >
        <CIcon icon={config.icon} size="sm" className="me-2" />
        {config.label}
      </div>
    )
  }

  const formatAddress = (location) => {
    if (!location) return '—'
    const { street, city, state, country } = location
    return [street, city, state, country].filter(Boolean).join(', ') || '—'
  }

  const formatDateTime = (date) => {
    if (!date) return '—'
    const dateObj = new Date(date)
    const now = new Date()
    const diffHours = Math.abs(now - dateObj) / 36e5

    if (diffHours < 24) {
      return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    return dateObj.toLocaleDateString()
  }

  const calculateProgress = (legs) => {
    if (!legs.length) return 0
    const completed = legs.filter((leg) => leg.status === 'delivered').length
    return Math.round((completed / legs.length) * 100)
  }

  const getVehicleIcon = (vehicleType) => {
    switch (vehicleType?.toLowerCase()) {
      case 'truck':
        return '🚛'
      case 'van':
        return '🚐'
      case 'motorcycle':
        return '🏍️'
      case 'car':
        return '🚗'
      default:
        return '🚚'
    }
  }

  const progress = calculateProgress(legs)

  useEffect(() => {
    if (visible) {
      legs.forEach((_, index) => {
        setTimeout(() => {
          setAnimatingLeg(index)
          setTimeout(() => setAnimatingLeg(null), 300)
        }, index * 100)
      })
    }
  }, [visible, legs])

  return (
    <>
      <CModal
        visible={visible}
        onClose={() => setVisible(false)}
        size="xl"
        scrollable
        className="route-modal"
      >
        <CModalHeader className="border-0 pb-0">
          <CModalTitle className="d-flex align-items-center">
            <div
              className="d-flex align-items-center justify-content-center me-3 rounded-circle shadow-lg"
              style={{
                width: '50px',
                height: '50px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                animation: 'pulse 2s infinite',
              }}
            >
              <CIcon icon={cilMap} size="lg" className="text-white" />
            </div>
            <div>
              <h4 className="mb-1 text-gradient fw-bold">Delivery Route Details</h4>
              <small className="text-muted">Track your shipment progress</small>
            </div>
          </CModalTitle>
        </CModalHeader>

        <CModalBody className="px-4">
          {/* Progress Overview */}
          <CCard className="border-0 shadow-lg mb-4 overflow-hidden">
            <div
              className="position-absolute w-100 h-100"
              style={{
                background:
                  'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                top: 0,
                left: 0,
              }}
            />
            <CCardBody className="position-relative">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 fw-bold text-dark">🚀 Route Progress</h5>
                <CBadge
                  color="primary"
                  className="px-3 py-2 rounded-pill shadow-sm"
                  style={{ fontSize: '0.9rem' }}
                >
                  {legs.filter((l) => l.status === 'delivered').length} / {legs.length} Delivered
                </CBadge>
              </div>
              <CProgress
                height={12}
                value={progress}
                className="mb-2 shadow-sm"
                style={{
                  background: 'rgba(255,255,255,0.3)',
                  borderRadius: '10px',
                  overflow: 'hidden',
                }}
              >
                <div
                  className="progress-bar"
                  style={{
                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '10px',
                    transition: 'all 0.8s ease',
                  }}
                />
              </CProgress>
              <small className="text-muted fw-semibold">{progress}% Complete</small>
            </CCardBody>
          </CCard>

          {legs.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-3" style={{ fontSize: '4em', opacity: 0.3 }}>
                📦
              </div>
              <h5 className="text-muted">No route legs available</h5>
              <p className="text-muted mb-0">Your delivery route will appear here once created.</p>
            </div>
          ) : (
            <div className="route-legs-container">
              {legs.map((leg, index) => (
                <div
                  key={index}
                  className={`leg-item ${hoveredLeg === index ? 'leg-hovered' : ''}`}
                  onMouseEnter={() => setHoveredLeg(index)}
                  onMouseLeave={() => setHoveredLeg(null)}
                  style={{
                    transform: animatingLeg === index ? 'scale(1.02)' : 'scale(1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    marginBottom: '2rem',
                  }}
                >
                  <CCard
                    className="border-0 shadow-lg overflow-hidden h-100"
                    style={{
                      background:
                        hoveredLeg === index
                          ? 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.95) 100%)'
                          : 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(10px)',
                      border:
                        hoveredLeg === index
                          ? '2px solid rgba(102, 126, 234, 0.3)'
                          : '1px solid rgba(255,255,255,0.2)',
                    }}
                  >
                    {/* Animated Top Border */}
                    <div
                      className="position-absolute w-100"
                      style={{
                        top: 0,
                        height: '4px',
                        background:
                          leg.status === 'delivered'
                            ? 'linear-gradient(90deg, #198754 0%, #20c997 100%)'
                            : leg.status === 'in-transit'
                              ? 'linear-gradient(90deg, #6610f2 0%, #d63384 100%)'
                              : 'linear-gradient(90deg, #ffc107 0%, #fd7e14 100%)',
                        transform: hoveredLeg === index ? 'scaleX(1)' : 'scaleX(0.7)',
                        transformOrigin: 'left',
                        transition: 'transform 0.3s ease',
                      }}
                    />

                    <CCardBody className="p-4">
                      {/* Leg Header */}
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <div className="d-flex align-items-center">
                          <div
                            className="d-flex align-items-center justify-content-center me-3 rounded-circle shadow-lg text-white fw-bold"
                            style={{
                              width: '40px',
                              height: '40px',
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              fontSize: '1rem',
                            }}
                          >
                            {leg.sequence}
                          </div>
                          <div>
                            <h5 className="mb-1 fw-bold text-dark">Leg {leg.sequence}</h5>
                            <small className="text-muted">
                              {getVehicleIcon(leg.vehicleType)} {leg.vehicleType || 'Standard'}
                            </small>
                          </div>
                        </div>
                        {getStatusBadge(leg.status)}
                      </div>

                      {/* Route Visualization */}
                      <div className="position-relative mb-4">
                        <div className="d-flex align-items-center">
                          {/* From Location */}
                          <div className="flex-shrink-0 me-3">
                            <CTooltip content="Pickup Location">
                              <div
                                className="d-flex align-items-center justify-content-center rounded-circle shadow-lg"
                                style={{
                                  width: '50px',
                                  height: '50px',
                                  background: 'linear-gradient(135deg, #dc3545 0%, #fd5e53 100%)',
                                  animation: hoveredLeg === index ? 'bounce 1s infinite' : 'none',
                                }}
                              >
                                <CIcon icon={cilLocationPin} size="lg" className="text-white" />
                              </div>
                            </CTooltip>
                          </div>

                          {/* Animated Route Line */}
                          <div className="flex-grow-1 position-relative mx-3">
                            <div
                              className="position-absolute w-100"
                              style={{
                                top: '50%',
                                height: '4px',
                                background:
                                  'linear-gradient(90deg, #dc3545 0%, #667eea 50%, #198754 100%)',
                                borderRadius: '2px',
                                transform: 'translateY(-50%)',
                              }}
                            />
                            <div
                              className="position-absolute"
                              style={{
                                top: '50%',
                                left: '50%',
                                width: '20px',
                                height: '20px',
                                background: '#667eea',
                                borderRadius: '50%',
                                transform: 'translate(-50%, -50%)',
                                animation:
                                  leg.status === 'in-transit' ? 'pulse 1.5s infinite' : 'none',
                              }}
                            >
                              <CIcon
                                icon={cilTruck}
                                size="sm"
                                className="text-white position-absolute"
                                style={{ top: '3px', left: '3px' }}
                              />
                            </div>
                          </div>

                          {/* To Location */}
                          <div className="flex-shrink-0 ms-3">
                            <CTooltip content="Delivery Location">
                              <div
                                className="d-flex align-items-center justify-content-center rounded-circle shadow-lg"
                                style={{
                                  width: '50px',
                                  height: '50px',
                                  background: 'linear-gradient(135deg, #198754 0%, #20c997 100%)',
                                  animation:
                                    leg.status === 'delivered' ? 'pulse 2s infinite' : 'none',
                                }}
                              >
                                <CIcon icon={cilLocationPin} size="lg" className="text-white" />
                              </div>
                            </CTooltip>
                          </div>
                        </div>
                      </div>

                      {/* Location Details */}
                      <div className="row mb-4">
                        <div className="col-md-6">
                          <div
                            className="p-3 rounded-3 h-100"
                            style={{
                              background:
                                'linear-gradient(135deg, rgba(220, 53, 69, 0.1) 0%, rgba(253, 94, 83, 0.1) 100%)',
                              border: '1px solid rgba(220, 53, 69, 0.2)',
                            }}
                          >
                            <h6 className="fw-bold text-danger mb-2">📍 Pickup Location</h6>
                            <p className="mb-1 small text-dark">{formatAddress(leg.from)}</p>
                            {leg.from?.latitude && leg.from?.longitude && (
                              <small className="text-muted">
                                📍 {leg.from.latitude.toFixed(4)}, {leg.from.longitude.toFixed(4)}
                              </small>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div
                            className="p-3 rounded-3 h-100"
                            style={{
                              background:
                                'linear-gradient(135deg, rgba(25, 135, 84, 0.1) 0%, rgba(32, 201, 151, 0.1) 100%)',
                              border: '1px solid rgba(25, 135, 84, 0.2)',
                            }}
                          >
                            <h6 className="fw-bold text-success mb-2">🎯 Delivery Location</h6>
                            <p className="mb-1 small text-dark">{formatAddress(leg.to)}</p>
                            {leg.to?.latitude && leg.to?.longitude && (
                              <small className="text-muted">
                                📍 {leg.to.latitude.toFixed(4)}, {leg.to.longitude.toFixed(4)}
                              </small>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="row g-3 mb-4">
                        <div className="col-6 col-md-3">
                          <div className="text-center p-3 rounded-3 bg-light">
                            <div className="fs-4 mb-1">💰</div>
                            <div className="fw-bold text-primary">
                              {leg.cost ? `${leg.cost} SYP` : '—'}
                            </div>
                            <small className="text-muted">Cost</small>
                          </div>
                        </div>
                        <div className="col-6 col-md-3">
                          <div className="text-center p-3 rounded-3 bg-light">
                            <div className="fs-4 mb-1">🚀</div>
                            <div className="fw-bold text-info">{formatDateTime(leg.startedAt)}</div>
                            <small className="text-muted">Started</small>
                          </div>
                        </div>
                        <div className="col-6 col-md-3">
                          <div className="text-center p-3 rounded-3 bg-light">
                            <div className="fs-4 mb-1">✅</div>
                            <div className="fw-bold text-success">
                              {formatDateTime(leg.completedAt)}
                            </div>
                            <small className="text-muted">Completed</small>
                          </div>
                        </div>
                        <div className="col-6 col-md-3">
                          <div className="text-center p-3 rounded-3 bg-light">
                            <div className="fs-4 mb-1">{getVehicleIcon(leg.vehicleType)}</div>
                            <div className="fw-bold text-secondary">
                              {leg.vehicleType || 'Standard'}
                            </div>
                            <small className="text-muted">Vehicle</small>
                          </div>
                        </div>
                      </div>

                      {/* Driver Info */}
                      {leg.driverId && (
                        <div
                          className="p-3 rounded-3 mb-3"
                          style={{
                            background:
                              'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                            border: '1px solid rgba(102, 126, 234, 0.2)',
                          }}
                        >
                          <div className="d-flex align-items-center">
                            <CAvatar
                              size="md"
                              className="me-3"
                              style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                fontWeight: 'bold',
                              }}
                            >
                              <CIcon icon={cilUser} />
                            </CAvatar>
                            <div>
                              <h6 className="mb-1 fw-bold">👨‍✈️ Driver Assigned</h6>
                              <p className="mb-0 text-muted">
                                Driver ID: <strong>{leg.driverId}</strong>
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Rejected Drivers */}
                      {leg.rejectedDrivers && leg.rejectedDrivers.length > 0 && (
                        <div
                          className="p-3 rounded-3"
                          style={{
                            background:
                              'linear-gradient(135deg, rgba(220, 53, 69, 0.1) 0%, rgba(253, 94, 83, 0.1) 100%)',
                            border: '1px solid rgba(220, 53, 69, 0.2)',
                          }}
                        >
                          <h6 className="fw-bold text-danger mb-2">❌ Rejected Drivers</h6>
                          <div className="row g-2">
                            {leg.rejectedDrivers.map((rejection, idx) => (
                              <div key={idx} className="col-12">
                                <div className="d-flex align-items-center p-2 bg-white rounded-2 shadow-sm">
                                  <div
                                    className="d-flex align-items-center justify-content-center me-2 rounded-circle text-white"
                                    style={{
                                      width: '30px',
                                      height: '30px',
                                      background:
                                        'linear-gradient(135deg, #dc3545 0%, #fd5e53 100%)',
                                      fontSize: '0.7rem',
                                    }}
                                  >
                                    <CIcon icon={cilXCircle} size="sm" />
                                  </div>
                                  <div className="flex-grow-1">
                                    <div className="fw-semibold small">
                                      Driver {rejection.driverId}
                                    </div>
                                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                                      {rejection.reason || 'No reason provided'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CCardBody>
                  </CCard>
                </div>
              ))}
            </div>
          )}
        </CModalBody>

        <CModalFooter className="border-0 pt-0">
          <div className="w-100 d-flex justify-content-between align-items-center">
            <div className="text-muted small">
              📦 Tracking {legs.length} delivery leg{legs.length !== 1 ? 's' : ''}
            </div>
            <CButton
              color="primary"
              variant="ghost"
              onClick={() => setVisible(false)}
              className="px-4 py-2 rounded-pill shadow-sm fw-semibold"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                color: 'white',
              }}
            >
              Close Details
            </CButton>
          </div>
        </CModalFooter>
      </CModal>

      {/* Custom Styles */}
      <style jsx>{`
        .route-modal .modal-content {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.95) 0%,
            rgba(248, 249, 250, 0.95) 100%
          ) !important;
          backdrop-filter: blur(20px) !important;
          border: none !important;
          border-radius: 20px !important;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15) !important;
        }

        .text-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .leg-item {
          position: relative;
        }

        .leg-hovered {
          z-index: 2;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes bounce {
          0%,
          20%,
          53%,
          80%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          40%,
          43% {
            transform: translate3d(0, -8px, 0);
          }
          70% {
            transform: translate3d(0, -4px, 0);
          }
          90% {
            transform: translate3d(0, -2px, 0);
          }
        }

        .route-legs-container {
          max-height: 600px;
          overflow-y: auto;
          padding-right: 8px;
        }

        .route-legs-container::-webkit-scrollbar {
          width: 6px;
        }

        .route-legs-container::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 3px;
        }

        .route-legs-container::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 3px;
        }

        .route-legs-container::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #5a67d8 0%, #667eea 100%);
        }
      `}</style>
    </>
  )
}

export default RouteDetailsModal
