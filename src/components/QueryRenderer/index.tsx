import * as React from 'react'
import { Query } from 'react-apollo'
import { DocumentNode } from 'graphql'

import { Loading } from '@components/Loading'
import { ErrorFallback } from '@components/ErrorFallback'

export interface IProps {
  query: DocumentNode
  component: React.ReactNode
  placeholder: React.ReactElement<{}>
  renderWithPlaceholder: boolean
  variables?: { [key: string]: any } | null
  [key: string]: any
}

export default class QueryRenderer extends React.Component<IProps> {
  render() {
    const {
      query,
      component,
      variables,
      renderWithPlaceholder,
      placeholder,
      ...rest
    } = this.props

    return (
      <Query query={query} variables={variables}>
        {({ loading, error, data, refetch, networkStatus, fetchMore }) => {
          if (loading && renderWithPlaceholder) {
            return <>{placeholder && placeholder()}</>
          } else if (loading) {
            return <Loading centerAligned />
          } else if (error) {
            return <ErrorFallback error={error} />
          }

          const Component = component

          return (
            <Component
              data={data}
              refetch={refetch}
              fetchMore={fetchMore}
              {...rest}
            />
          )
        }}
      </Query>
    )
  }
}
