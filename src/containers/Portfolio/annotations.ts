/* tslint:disable */
//  This file was automatically generated and should not be edited.

export interface getKeysQuery {
  getProfile:  {
    portfolioId: string | null,
    keys:  Array< {
      _id: string,
      name: string | null,
      apiKey: string | null,
      secret: string | null,
      date: string | null,
      exchange:  {
        name: string | null,
        symbol: string | null,
      } | null,
    } | null > | null,
  } | null,
};

export interface getPortfolioQuery {
  getProfile:  {
    portfolioId: string | null,
    portfolio:  {
      name: string | null,
      processing: boolean | null,
      assetIds: Array< string | null > | null,
      assets:  Array< {
        _id: string,
        assetId: string | null,
        exchangeId: string | null,
        keyId: string | null,
        value: number | null,
        realizedProfit: number | null,
        unrealizedProfit: number | null,
        totalProfit: number | null,
        asset:  {
          name: string | null,
          symbol: string | null,
          priceUSD: string | null,
        } | null,
        exchange:  {
          name: string | null,
        } | null,
        key:  {
          name: string | null,
          apiKey: string | null,
        } | null,
      } | null > | null,
    } | null,
  } | null,
};
