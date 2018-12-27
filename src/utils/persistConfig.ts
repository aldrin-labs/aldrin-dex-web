import { getPersistor } from '@core/graphql/apolloClient'

export const persistor = getPersistor(localStorage)