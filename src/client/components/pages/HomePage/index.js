import React from 'react'

import PageTemplate from 'components/templates/PageTemplate'
import Header from 'components/organisms/Header'
import Footer from 'components/organisms/Footer'

const HomePage = ({ children }) => (
  <PageTemplate header={<Header />} footer={<Footer />}>
    {children}
  </PageTemplate>
)

export default HomePage
