import React, { useState } from 'react'
import { CButton } from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import styles from './promotionBoost.module.scss'

const PromotionBoost = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('promotions')

  return (
    <div className={styles.container}>

      <div className={styles.segmentWrapper}>
        <button
          className={`${styles.segmentBtn} ${
            activeTab === 'promotions' ? styles.active : ''
          }`}
          onClick={() => setActiveTab('promotions')}
        >
          Promotions
        </button>

        <button
          className={`${styles.segmentBtn} ${
            activeTab === 'boosts' ? styles.active : ''
          }`}
          onClick={() => setActiveTab('boosts')}
        >
          Boosts
        </button>
      </div>
      <div className={styles.headerRow}>
        <h4 className={styles.title}>Promotions & Boosts</h4>

        <div className={styles.buttonWrapper}>
          {activeTab === 'promotions' && (
            <CButton
              className={styles.primaryBtn}
              onClick={() => navigate('/promotions/create')}
            >
              New Promotions
            </CButton>
          )}

          {activeTab === 'boosts' && (
            <CButton
              className={styles.secondaryBtn}
              onClick={() => navigate('/boosts/create')}
            >
              New Boosts
            </CButton>
          )}
        </div>
      </div>
    </div>
  )
}

export default PromotionBoost
