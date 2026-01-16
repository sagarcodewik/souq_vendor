import React from 'react'
import { CFooter } from '@coreui/react'
import { useTranslation } from 'react-i18next'

const AppFooter = () => {
  const { t } = useTranslation('common')
  return (
    <CFooter className="px-4 justify-content-center text-center">
      <div>
        <b>© {new Date().getFullYear()} {t('footer_rights')}</b>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
