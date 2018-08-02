import * as React from 'react'
import { Query } from 'react-apollo'
import { DocumentNode } from 'graphql'

import { Loading } from '@components/Loading'
import { ErrorFallback } from '@components/ErrorFallback'

export interface IProps {
  query: DocumentNode
  component: React.ReactNode
  placeholder?: React.ReactElement<{}>
  renderWithPlaceholder?: boolean
  variables?: { [key: string]: any } | null
  [key: string]: any
}

export default class QueryRenderer extends React.Component<IProps> {
  render() {
    const {
      query,
      component,
      variables,
      subscriptionArgs,
      renderWithPlaceholder,
      placeholder: Placeholder,
      ...rest
    } = this.props

    console.log(subscriptionArgs)

    return (
      <Query query={query} variables={variables}>
        {({
          loading,
          error,
          data,
          refetch,
          networkStatus,
          fetchMore,
          subscribeToMore,
          ...result
        }) => {
          if (loading && renderWithPlaceholder) {
            return (
              <>
                {Placeholder && (
                  <div style={{ margin: '0 auto' }}>
                    <Placeholder />{' '}
                  </div>
                )}
              </>
            )
          } else if (loading) {
            return <Loading centerAligned />
          } else if (error) {
            return <ErrorFallback error={error} />
          }

          const Component = component

          return subscriptionArgs ? (
            <Component
              data={data}
              refetch={refetch}
              fetchMore={fetchMore}
              subscribeToMore={() =>
                subscribeToMore({
                  document: subscriptionArgs.subscription,
                  variables: { ...subscriptionArgs.variables },
                  updateQuery: subscriptionArgs.updateQueryFunction,
                })
              }
              {...result}
              {...rest}
            />
          ) : (
            <Component data={data} fetchMore={fetchMore} {...rest} />
          )
        }}
      </Query>
    )
  }
}
