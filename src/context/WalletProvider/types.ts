export interface Balance {
    needsMemo?: boolean;
    blockchain: string;
    symbol: string;
    asset: string;
    path: string;
    pathMaster: string;
    master: string;
    pubkey: string;
    script_type: string;
    network: string;
    created: number;
    tags: string[];
    context: string;
    isToken: boolean;
    lastUpdated: number;
    balance: number;
    source?: string;
    priceUsd: string;
    valueUsd: string;
    onCoinCap: boolean;
    image: string;
    protocols: string[];
    xpub?: string;
    type?: Type;
    address?: string;
    name?: string;
    contract?: string;
    protocal?: string;
    decimals?: number;
    balanceNative?: number;
}

export enum Type {
    Address = "address",
    Erc20 = "ERC20",
    Xpub = "xpub",
}

export interface Invocation {
    _id: string;
    state: string;
    date: number;
    network: string;
    type: string;
    invocationId: string;
    context: string;
    username: string;
    tags: string[];
    invocation: InvocationClass;
    notary: string;
    notarySig: NotarySig;
    unsignedTx: UnsignedTx;
    signedTx: SignedTx;
    broadcast: Broadcast;
}

export interface Broadcast {
    success: boolean;
    result: Result;
}

export interface Result {
    success: boolean;
}

export interface InvocationClass {
    type: string;
    network: string;
    context: string;
    username: string;
    swap: InvocationSwap;
    tx: Tx;
    invocationId: string;
}

export interface InvocationSwap {
    input: Put;
    output: Put;
    amount: number;
    noBroadcast: boolean;
}

export interface Put {
    blockchain: string;
    asset: string;
}

export interface Tx {
    success: boolean;
    invocationId: string;
    amountIn: number;
    amountOut: string;
    input: Put;
    output: Put;
    swaps: SwapElement[];
}

export interface SwapElement {
    swapperId: string;
    swapperType: string;
    from: From;
    to: From;
    fromAmount: string;
    fromAmountPrecision: null;
    fromAmountMinValue: null;
    fromAmountMaxValue: null;
    fromAmountRestrictionType: null;
    toAmount: string;
    fee: Fee[];
    estimatedTimeInSeconds: number;
    swapChainType: string;
    routes: null;
    recommendedSlippage: RecommendedSlippage;
    warnings: any[];
    timeStat: TimeStat;
    includesDestinationTx: boolean;
    internalSwaps: null;
    maxRequiredSign: number;
    fromAsset: Asset;
    toAsset: Asset;
}

export interface Fee {
    asset: Asset;
    expenseType: string;
    amount: string;
    name: string;
}

export interface Asset {
    blockchain: string;
    symbol: string;
    address: null;
}

export interface From {
    symbol: string;
    logo: string;
    address: null;
    blockchain: string;
    decimals: number;
}

export interface RecommendedSlippage {
    error: boolean;
    slippage: string;
}

export interface TimeStat {
    min: number;
    avg: number;
    max: number;
}

export interface NotarySig {
}

export interface SignedTx {
    r: string;
    s: string;
    v: number;
    serialized: string;
    txid: string;
}

export interface UnsignedTx {
    addressNList: number[];
    nonce: string;
    gasPrice: string;
    gasLimit: string;
    value: string;
    to: string;
    data: string;
}

