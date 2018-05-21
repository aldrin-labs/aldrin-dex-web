import * as React from 'react'
import { Query } from 'react-apollo'
import { DocumentNode } from 'graphql'

import { Loading } from '@components/Loading'
import { ErrorFallback } from '@components/ErrorFallback'

export interface Props {
  query: DocumentNode
  component: React.ReactNode
  variables?: { [key: string]: any } | null
}

export default class QueryRenderer extends React.Component<Props> {
  render() {
    const { query, component, variables } = this.props

    return (
      <Query query={query} variables={variables}>
        {({ loading, error, data, refetch, networkStatus }) => {
          if (loading) {
            return <Loading centerAligned />
          } else if (error) {
            return <ErrorFallback error={error} />
          }

          const Component = component
          return <Component data={data} refetch={refetch} />
        }}
      </Query>
    )
  }
}
