/* tslint:disable */
//  This file was automatically generated and should not be edited.

export interface ProfileQueryQueryVariables {
  id: string,
};

export interface ProfileQueryQuery {
  assetById:  {
    _id: string,
    name: string | null,
    symbol: string | null,
    nameTrue: string | null,
    priceUSD: string | null,
    maxSupply: number | null,
    totalSupply: number | null,
    availableSupply: number | null,
    percentChangeDay: string | null,
  } | null,
};
