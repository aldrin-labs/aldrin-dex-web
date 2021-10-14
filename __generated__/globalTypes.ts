/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface AssetBySymbolByExchangeInputType {
  search?: string | null;
  limit?: number | null;
  exchange?: string | null;
  splitter?: string | null;
  marketType?: number | null;
}

export interface EntryOrderType {
  price?: number | null;
  side?: string | null;
  type?: number | null;
  orderType?: string | null;
  amount?: number | null;
  activatePrice?: number | null;
  entryDeviation?: number | null;
  placeWithoutLoss?: boolean | null;
}

export interface FundingRateInputType {
  exchange?: string | null;
  symbol?: string | null;
}

export interface LeverageInputType {
  keyId: string;
  pair: string;
}

export interface MarkPriceInputType {
  exchange?: string | null;
  symbol?: string | null;
}

export interface MarketStatisticsByPairInputType {
  exchange?: string | null;
  symbol?: string | null;
  marketType?: number | null;
}

export interface accountSettingsInputType {
  themeMode: string;
}

export interface activeStrategiesInput {
  activeExchangeKey: string;
  marketType: number;
  allKeys?: boolean | null;
  specificPair?: string | null;
  perPage?: number | null;
  page?: number | null;
}

export interface asset {
  _id?: string | null;
  coin?: string | null;
  exchange?: string | null;
  percent?: string | null;
  amount?: string | null;
  diff?: string | null;
  isCustomAsset?: boolean | null;
  priceSnapshot?: number | null;
  percentSnapshot?: number | null;
}

export interface authorizationSettingsInputType {
  mfaEnabled: boolean;
}

export interface cancelOrderInput {
  keyId: string;
  orderId: string;
  pair: string;
  marketType: number;
  type?: string | null;
}

export interface changeTemplateStatusInput {
  keyId: string;
  strategyId: string;
  status: string;
}

export interface confirmWithdrawalInputType {
  keyId: string;
  hash: string;
}

export interface createOrderParams {
  symbol: string;
  side: string;
  type: string;
  amount: number;
  price?: number | null;
  postOnly?: boolean | null;
  stopPrice?: number | null;
  reduceOnly?: boolean | null;
  workingType?: string | null;
  timeInForce?: string | null;
  positionSide?: string | null;
  marketType?: number | null;
  leverage?: number | null;
  isFuturesWarsKey?: boolean | null;
  params?: extraOrderParams | null;
}

export interface createPortfolioInputType {
  name?: string | null;
}

export interface deviceInputSettings {
  name?: string | null;
  type?: string | null;
  fcmToken?: string | null;
  macAddress?: string | null;
  ipAddress?: string | null;
  lastLoginTime?: number | null;
  lastGeo?: string | null;
  countryCode?: string | null;
  cookies?: boolean | null;
  flashVersion?: string | null;
  mobile?: boolean | null;
  os?: string | null;
  osVersion?: string | null;
  screen?: string | null;
}

export interface disableStrategyInput {
  keyId: string;
  strategyId: string;
}

export interface dustFilterInput {
  percentage?: number | null;
  usd?: number | null;
  btc?: number | null;
}

export interface entryPointParams {
  price?: number | null;
  side?: string | null;
  orderType?: string | null;
  amount?: number | null;
  activatePrice?: number | null;
  entryDeviation?: number | null;
  leverage?: number | null;
}

export interface entryPointStrategyInput {
  keyId: string;
  strategyId: string;
  params?: entryPointParams | null;
}

export interface executeRebalanceInput {
  keyId: string;
  portfolioId: string;
}

export interface extraOrderParams {
  type?: string | null;
  maxIfNotEnough?: boolean | null;
  update?: boolean | null;
  price?: number | null;
  stopPrice?: number | null;
  timeInForce?: string | null;
  smartOrder?: smartOrder | null;
}

export interface fundsInput {
  activeExchangeKey: string;
}

export interface futuresHistoryInput {
  startDate: number;
  endDate: number;
  page: number;
  perPage: number;
}

export interface futuresTransferInput {
  keyId: string;
  asset: string;
  amount: number;
  type: number;
}

export interface generateBrokerKeyInputType {
  isFuturesWarsKey: boolean;
  roomId: string;
}

export interface getActivePositionsInputType {
  keyId: string;
  allKeys?: boolean | null;
  specificPair?: string | null;
}

export interface getActiveRoundByKeyIdInput {
  keyId?: string | null;
}

export interface getActiveRoundInputType {
  roomId?: string | null;
}

export interface getAssetDetailInputType {
  keyId?: string | null;
  symbol?: string | null;
}

export interface getDepositInput {
  keyId: string;
  symbol: string;
}

export interface getPlannedRoundByKeyIdInput {
  keyId?: string | null;
}

export interface getRebalanceInput {
  keyId: string;
  portfolioId: string;
}

export interface inputPortfolio {
  id: string;
  name?: string | null;
}

export interface isFuturesWarsKeyInputType {
  keyId?: string | null;
}

export interface joinFuturesWarsRoundInputType {
  keyId?: string | null;
  amount?: number | null;
}

export interface listenSerumOrdersByTVAlertsInputType {
  publicKey: string;
  token: string;
}

export interface onboardingInput {
  instructions?: boolean | null;
  portfolioName?: boolean | null;
  exchangeKey?: boolean | null;
  congratulations?: boolean | null;
}

export interface openOrderInput {
  page?: number | null;
  perPage?: number | null;
  activeExchangeKey: string;
  marketType: number;
  allKeys?: boolean | null;
  specificPair?: string | null;
}

export interface optionsPortfolio {
  forAll?: boolean | null;
  userId?: string | null;
  accessLevel?: number | null;
}

export interface orderHistoryInput {
  startDate: number;
  endDate: number;
  activeExchangeKey: string;
}

export interface ordersHealthcheckInput {
  keyId: string;
  pair: string;
}

export interface paginatedOrderHistoryInput {
  page: number;
  perPage: number;
  marketType: number;
  startDate: number;
  endDate: number;
  activeExchangeKey: string;
  allKeys?: boolean | null;
  specificPair?: string | null;
}

export interface portfolioActionsInputType {
  page: number;
  perPage: number;
  startDate?: number | null;
  endDate?: number | null;
  filterCoin?: string | null;
  includeTrades?: boolean | null;
  includeFutures?: boolean | null;
  includeExchangeTransactions?: boolean | null;
  specificKey?: specificKeyInputType | null;
}

export interface portfolioSettingsInput {
  portfolioId?: string | null;
  dustFilter?: dustFilterInput | null;
  selectedKeys?: (string | null)[] | null;
  selectedRebalanceKeys?: (string | null)[] | null;
  selectedWallets?: (string | null)[] | null;
}

export interface profileSettingsInput {
  selectedKey?: string | null;
}

export interface rebalanceInput {
  keyId: string;
  portfolioId: string;
  rebalanceTimePeriod: number;
  total?: string | null;
  timestampSnapshot: number;
  assets: asset[];
}

export interface reimportKeyInput {
  keyId: string;
}

export interface renameExchangeKeyInputType {
  keyId: string;
  name: string;
}

export interface selectTradingKeyInput {
  keyId: string;
}

export interface smartOrder {
  entrySpreadHunter?: boolean | null;
  entryWaitingTime?: number | null;
  takeProfitSpreadHunter?: boolean | null;
  takeProfitWaitingTime?: number | null;
  accountId?: string | null;
  leverage?: number | null;
  pair?: string | null;
  side?: string | null;
  marketType?: number | null;
  cancelIfAnyActive?: boolean | null;
  skipInitialSetup?: boolean | null;
  entryOrder?: EntryOrderType | null;
  trailingExit?: boolean | null;
  trailingExitPrice?: number | null;
  trailingExitExternal?: boolean | null;
  waitingEntryTimeout?: number | null;
  activationMoveStep?: number | null;
  activationMoveTimeout?: number | null;
  entryLevels?: (EntryOrderType | null)[] | null;
  exitLevels?: (EntryOrderType | null)[] | null;
  timeoutWhenProfit?: number | null;
  timeoutIfProfitable?: number | null;
  continueIfEnded?: boolean | null;
  timeoutLoss?: number | null;
  timeoutWhenLoss?: number | null;
  stopLossType?: string | null;
  stopLoss?: number | null;
  hedgeLossDeviation?: number | null;
  hedging?: boolean | null;
  hedgeMode?: boolean | null;
  forcedLoss?: number | null;
  isTemplate?: boolean | null;
  templateToken?: string | null;
  templateStatus?: string | null;
  templateMode?: string | null;
  templateAlertMessage?: string | null;
  takeProfitExternal?: boolean | null;
  takeProfitPrice?: number | null;
  stopLossExternal?: boolean | null;
  mandatoryForcedLoss?: boolean | null;
  stopLossPrice?: number | null;
  forcedLossPrice?: number | null;
  closeStrategyAfterFirstTAP?: boolean | null;
  placeEntryAfterTAP?: boolean | null;
  internalId?: string | null;
  hash?: string | null;
}

export interface specificKeyInputType {
  enabled?: boolean | null;
  specificKeyId?: string | null;
}

export interface stopLossParams {
  stopLoss?: number | null;
  forcedLoss?: number | null;
  stopLossType?: string | null;
  timeoutLoss?: number | null;
  timeoutWhenLoss?: number | null;
  stopLossExternal?: boolean | null;
  forcedStopLossStopByAlert?: boolean | null;
  stopLossPlotEnabled?: boolean | null;
  stopLossPlot?: string | null;
  mandatoryForcedLoss?: boolean | null;
}

export interface stopLossStrategyInput {
  keyId: string;
  strategyId: string;
  params?: stopLossParams | null;
}

export interface strategiesHistoryInput {
  activeExchangeKey: string;
  startDate: number;
  endDate: number;
  marketType: number;
  perPage: number;
  page: number;
  allKeys?: boolean | null;
  specificPair?: string | null;
}

export interface takeProfitParams {
  exitLevels?: (EntryOrderType | null)[] | null;
  trailingExit?: boolean | null;
  timeoutWhenProfit?: number | null;
  timeoutIfProfitable?: number | null;
  takeProfitExternal?: boolean | null;
  forcedTakeProfitStopByAlert?: boolean | null;
  takeProfitPlotEnabled?: boolean | null;
  takeProfitPlot?: string | null;
}

export interface takeProfitStrategyInput {
  keyId: string;
  strategyId: string;
  params?: takeProfitParams | null;
}

export interface tooltipInputSettings {
  portfolioMain?: boolean | null;
  portfolioIndustry?: boolean | null;
  portfolioRebalance?: boolean | null;
  portfolioCorrelation?: boolean | null;
  portfolioOptimization?: boolean | null;
  transactionPage?: boolean | null;
  chartPage?: boolean | null;
  chartPagePopup?: boolean | null;
  multiChartPage?: boolean | null;
  smartTerminal?: boolean | null;
  onboarding?: onboardingInput | null;
}

export interface tradeHistoryInput {
  page: number;
  perPage: number;
  startDate: number;
  endDate: number;
  activeExchangeKey: string;
  marketType: number;
  allKeys?: boolean | null;
  specificPair?: string | null;
}

export interface transferInternalInputType {
  keyIdFrom: string;
  keyIdTo: string;
  symbol: string;
  amount: number;
}

export interface updateFavoritePairsInputType {
  favoritePairs?: (string | null)[] | null;
}

export interface updateFuturesBalancesInput {
  keyId: string;
}

export interface updateLeverageInput {
  keyId: string;
  leverage: number;
  pair: string;
}

export interface updateOrderInput {
  keyId: string;
  orderId: string;
  pair: string;
}

export interface updatePositionInput {
  keyId: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
