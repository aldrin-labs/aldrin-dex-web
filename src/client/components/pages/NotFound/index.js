import React from 'react'

import Heading from 'components/atoms/Heading'
import PageTemplate from 'components/templates/PageTemplate'
import Header from 'components/organisms/Header'
import Footer from 'components/organisms/Footer'

const NotFoundPage = () => (
  <PageTemplate header={<Header />} footer={<Footer />}>
    <Heading>404 Not Found</Heading>
  </PageTemplate>
)

export default NotFoundPage
