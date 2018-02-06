

type Exchange = {
    value: string,
    name: string,
    desc: string
};

type Filter = {
    name: string,
    value: string
};

type SymbolInfo = { // https://github.com/tradingview/charting_library/wiki/Symbology#symbolinfo-structure
    name: string,
    ticker: string,
    description: string,
    type: string,
    session: string,
    exchange: string,
    listed_exchange: string,
    timezone: string,
    minmov: number,
    pricesacel: number,
    minmove2: number,
    fractional: boolean,
    has_intraday: boolean,
    supported_resolutions: [any],
    intraday_multipliers: [any],
    has_seconds: boolean,
    seconds_multipliers: [any],
    has_daily: boolean,
    has_weekly_and_monthly: boolean,
    has_empty_bars: boolean,
    force_session_rebuild: boolean,
    has_no_volume: boolean,
    volume_precision: number,
    data_status: string,
    expired: boolean,
    expiration_date: number,
    sector: string,
    industry: string,   // Industry for stocks to be displayed in Symbol Info.
    currency_code: string   // Currency to be displayed in Symbol Info.
}

type Meta = {
    noData: boolean,
    nextTime: any
}

type ConfigurationData = {
    exchanges: [Exchange],
    symbols_types: [Filter],
    supported_resolutions: string,
    supports_marks: boolean,
    supports_timescale_marks: boolean,
    supports_time: boolean
};

class JSAPI {
    constructor(){}
    public onReady(callback: (configurationData: ConfigurationData) => void): void {
        const exchanges: [Exchange] =
        [
            {name: 'poloniex', value: 'polo', desc: 'poloniex exchange'},
            {name: 'poloniex1', value: 'polo1', desc: 'poloniex exchange1'},
            {name: 'poloniex2', value: 'polo2', desc: 'poloniex exchange2'}
        ];
        const config: ConfigurationData = {
            exchanges: exchanges,
            symbols_types: [{name: 'asdf', value: 'asd'}],
            supported_resolutions: '000-999',
            supports_marks: true,
            supports_timescale_marks: true,
            supports_time: true
        }
        callback(config);
    }
    
    public searchSymbols(
        userInput: string, 
        exchange: string,
        symbolType: string,
        onResultReadyCallback: () => void
    ) {

    }

    public resolveSymbol(
        symbolName: string,
        onSymbolResolvedCallback: (symbolInfo: SymbolInfo) => void,
        onResolveErrorCallback: (reason: string) => void
    ) {

    }

    public getBars(
        symbolInfo: SymbolInfo,
        resolution: string,
        from: any,
        to: any,
        onHistoryCallback: (bars: [string], meta: Meta) => void,
        onErrorCallback: (reason: string) => void,

    ) {
        
    }

    public subscribeBars(
        symbolInfo: SymbolInfo,
         resolution: string,
         onRealtimeCallback: () => void,
         subscriberUID: object,
         onResetCacheNeededCallback: () => void) {
    }

    public unsubscribeBars(subscriberUID: object) {

    }

    public calculateHistoryDepth(
        resolution: string,
        resolutionBack: string,
        intervalBack: [any]
    ) {

    }

    getMarks(
        symbolInfo: SymbolInfo,
        startDate: any,
        endDate: any,
        onDataCallback: (marks: [any]) => void,
        resolution: string
    ) {

    }

    getTimescaleMarks(
        symbolInfo: SymbolInfo,
        startDate: any,
        endDate: any,
        onDataCallback: (marks: [any]) => void,
        resolution: string
    ){

    }

    getServerTime(
        callback: (unixTime: any) => void
    ){

    }
};