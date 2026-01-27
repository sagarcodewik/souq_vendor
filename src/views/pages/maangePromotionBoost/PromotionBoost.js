import React, { useState } from 'react'
import { CButton, CFormLabel, CFormInput,} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import { Formik, Field, ErrorMessage } from 'formik'
import { ArrowRight, Box, Layers, Megaphone, Sparkles, Tag } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import styles from './promotionBoost.module.scss'

const PromotionBoost = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [activeTab, setActiveTab] = useState('promotions')
  return (
    <div className={styles.container}>
      <Formik
        initialValues={{
          scopeType: 'product',
          duration: 1,
        }}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <div className="row g-4 mb-4">
            <div className="col-md-12">
              <div className="d-flex p-1 bg-light rounded-pill border col-md-6 col-lg-4 col-xx-3">
                <div onClick={() => setFieldValue('scopeType', 'product')} className={`flex-fill text-center py-2 rounded-pill cursor-pointer fw-semibold ${values.scopeType === 'product' ? 'bg-white shadow-sm text-primary' : 'text-muted'}`}>
                 <Megaphone size={16} className="me-1" /> {t('Promotions')}
                </div>
                <div onClick={() => setFieldValue('scopeType', 'category')} className={`flex-fill text-center py-2 rounded-pill cursor-pointer fw-semibold ${values.scopeType === 'category' ? 'bg-white shadow-sm text-primary' : 'text-muted'}`}>
                  <Sparkles size={16} className="me-1" /> {t('Boosts')}
                </div>
              </div>
            </div>
            <div className="col-md-6"><h3 className="fw-bold mb-0">{t('Promotions & Boosts')}</h3></div>
            <div className="col-md-6 d-flex justify-content-md-end justify-content-start mt-2 mt-md-0">
            <CButton type="button" className="btn-enhanced d-inline-flex align-items-center" style={{background: 'linear-gradient(135deg, #15686eff 0%, #53d8ddff 100%)', color: '#fff', padding: '10px 18px', borderRadius: '10px', whiteSpace: 'nowrap', maxHeight: 'fit-content',}}>
              {t('Continue')} <ArrowRight size={18} className="ms-2" />
            </CButton>
            </div>
          </div>
        )}
      </Formik>

      <div className={styles.segmentWrapper}>
        <button
          className={` ${styles.segmentBtn} ${
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
        <h5 className={styles.title}>Promotions & Boosts</h5>

        <div className={styles.buttonWrapper}>
          {activeTab === 'promotions' && (
            <CButton onClick={() => navigate('/promotions/create')}>
              New Promotions
            </CButton>
          )}
          {activeTab === 'boosts' && (
            <CButton onClick={() => navigate('/boosts/create')}>
              New Boosts
            </CButton>
          )}
        </div>
      </div>
    </div>
  )
}

export default PromotionBoost