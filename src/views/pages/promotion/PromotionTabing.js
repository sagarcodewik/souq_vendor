// import React from 'react'
// import { Megaphone, Sparkles } from 'lucide-react'
// import { useTranslation } from 'react-i18next'
// import { useNavigate, useLocation } from 'react-router-dom'

// const PromotionTabing = () => {
//   const navigate = useNavigate()
//   const location = useLocation()
//   const { t } = useTranslation('promotions')

//   const isPromotions = location.pathname === '/promotions'
//   const isBoosts = location.pathname === '/boosts'

//   return (
//     <div className="row g-2 mb-3 promotion-scope-header">
//       <div className="col-md-12">
//         <div className="scope-toggle-wrapper col-md-6 col-lg-4 col-xxl-3">
//           <div onClick={() => navigate('/promotions')} className={`scope-toggle-item ${isPromotions ? 'active' : 'inactive'}`} >
//             <Megaphone size={16} className="me-1" /> {t('Promotions')}
//           </div>
//           <div onClick={() => navigate('/boosts')} className={`scope-toggle-item ${isBoosts ? 'active' : 'inactive'}`} >
//             <Sparkles size={16} className="me-1" /> {t('Boosts')}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default PromotionTabing;


// import React from 'react'

// const index = () => {
//   return (
//     <>
//       <Formik initialValues={{ scopeType: 'product', duration: 1, }} onSubmit={() => {}}>
//       {({ values, setFieldValue }) => (
//         <div className="row g-2 mb-3 promotion-scope-header">
//           {/* TOGGLE */}
//           <div className="col-md-12">
//             <div className="scope-toggle-wrapper col-md-6 col-lg-4 col-xxl-3">
//               <div onClick={() => setFieldValue('scopeType', 'product')} className={`scope-toggle-item ${values.scopeType === 'product' ? 'active' : 'inactive'}`}>
//                 <Megaphone size={16} className="me-1" /> {t('Promotions')}
//               </div>
//               <div onClick={() => setFieldValue('scopeType', 'category')} className={`scope-toggle-item ${values.scopeType === 'category' ? 'active' : 'inactive'}`}>
//                 <Sparkles size={16} className="me-1" /> {t('Boosts')}
//               </div>
//             </div>
//           </div>
//           <div className="promotion-header d-flex justify-content-between align-items-center">
//             <h2 className="promotion-title mb-0">{t('Promotions')}</h2>
//             <button onClick={() => navigate('/promotions/create')} className="btn promotion-btn text-white">{t('New Promotion')}</button>
//           </div>
//         </div>
//       )}
//     </Formik>
//     </>
//   )
// }

// export default index
