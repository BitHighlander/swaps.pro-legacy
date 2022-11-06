import { debounce } from 'lodash'
import { useCallback, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useWallet, WalletActions } from "context/WalletProvider/WalletProvider";
// import { TradeAsset, TradeState } from 'components/Trade/Trade'

const debounceTime = 1000

export enum TradeActions {
    BUY = 'BUY',
    SELL = 'SELL'
}


export const Pioneer = () => {
    const { state, dispatch, WalletActions, setRoutePath } = useWallet()
    const { assetContext, balances, tradeOutput, status, pioneer } = state
    const {
        setValue,
        getValues,
        formState: { errors, isDirty, isValid }
    } = useFormContext()
    const [quote, trade] = useWatch({ name: ['quote', 'trade'] })
    const [debounceObj, setDebounceObj] = useState<{ cancel: () => void }>()

    const getCryptoQuote = async (
        amount: Pick<any, 'buyAmount' | 'sellAmount'>,
        sellAsset: any,
        buyAsset: any,
        action?: any
    ) => {
        console.log("getFiatQuote: ", { amount, sellAsset, buyAsset, action })
        setValue('quote', 'foobar')
    }

    const getFiatQuote = async (
        fiatAmount: string,
        sellAsset: any,
        buyAsset: any,
        action?: any
    ) => {
        console.log("getFiatQuote: ", { fiatAmount, sellAsset, buyAsset, action })
        setValue('quote', 'foobar')
        // setValue('sellAsset.fiatRate', 'foobar')
        // setValue('buyAsset.fiatRate', 'foobar')
    }

    const setMaxInput = async (
    ) => {
        console.log("HOOK: setMaxInput")
        console.log("onMax called!")
        console.log("balance: ", getValues('sellAsset.currency.balance'))
        let balance = getValues('sellAsset.currency.balance')
        let amount = getValues('sellAsset.balance')
        setValue('sellAsset.amount', balance)
        console.log("amount: ", amount)
        let sellAsset = getValues('sellAsset.currency')
        console.log("sellAsset: ", sellAsset)

        //valueUsd
        let amountUsd = getValues('sellAsset.currency.valueUsd')
        setValue('fiatAmount', amountUsd)
        console.log("amountUsd: ", amountUsd)
        console.log("formState: ", { errors, isDirty, isValid })
        // update()
    }

    //selectExchange
    const selectExchange = async (exchange: string) => {
        console.log("HOOK: selectExchange: ", exchange)
    }

    const selectInput = async (asset: string) => {
        console.log("HOOK: selectInput: ", asset)
    }

    const selectOutput = async (asset: string) => {
        console.log("HOOK: selectOutput: ", asset)
    }

    const updateAmountInNative = async (value: any) => {
        console.log("HOOK: updateAmountInNative value: ", value)
        // setValue('sellAsset.amount',value)
        // update()
        //update amount Out fiat
    }

    const switchAssets = async (
    ) => {
        console.log("HOOK: switchAssets")

        const currentSellAsset = getValues('sellAsset')
        const currentBuyAsset = getValues('buyAsset')
        console.log("HOOK: sellAsset: ", currentSellAsset)
        console.log("HOOK: buyAsset", currentBuyAsset)
        setValue('buyAsset', currentSellAsset)
        setValue('sellAsset', currentBuyAsset)

        // update()
    }


    // const update = async (
    // ) => {

    //     console.log("HOOK: update")
    //     console.log("HOOK: assetContext: ", assetContext)

    //     if (!state.tradeState || !state.tradeState.input || !state.tradeState.output) return console.log("Assets missing: ", state.tradeInput, state.tradeOutput)

    //     // status
    //     const currentSellAsset = state.tradeState?.input.bal
    //     const currentBuyAsset = state.tradeState?.output.bal
    //     console.log("HOOK: currentSellAsset", currentSellAsset)
    //     console.log("HOOK: currentBuyAsset", currentBuyAsset)


    //     let symbolIn = currentSellAsset.symbol
    //     let symbolOut = currentBuyAsset.symbol

    //     let blockchainIn = currentSellAsset.blockchain
    //     let blockchainOut = currentBuyAsset.blockchain


       
    //     if (balances) {
    //         if (!state.tradeState.input.amount) {
    //             console.log("balances: ", balances)
    //             let balance = state.tradeState.input.bal
    //             dispatch({
    //                 type: WalletActions.SET_TRADE_STATE, payload: {
    //                     ...state.tradeState,
    //                     fiatAmount: 1,
    //                     input: { ...state.tradeState.input, amount: balance?.balance - 0.002 }
    //                 }
    //             })
    //         }
    //     } else {
    //         console.log(' cant update, no balances ')
    //     }

    //     //if input wallet connected
    //     if (state.walletInput && !state.walletInput.isConnected) {
    //         setValue('isDirty', true)
    //     }

    //     if (status) {
    //         console.log("** STATUS: ", status)
    //         if (!state.invocationId) {
    //             if (symbolIn && symbolOut && blockchainIn && blockchainOut) {
    //                 //build quote
    //                 let swap: any = {
    //                     input: {
    //                         blockchain: blockchainIn,
    //                         asset: symbolIn,
    //                     },
    //                     output: {
    //                         blockchain: "bitcoin",
    //                         asset: "BTC",
    //                     },
    //                     amount: state.tradeState.input.amount,
    //                     noBroadcast: true
    //                 }
    //                 console.log("HOOK: swap", swap)
    //                 //TODO
    //                 console.log("pioneer: ", state.pioneer)
    //                 if (state.pioneer) {
    //                     let tx = {
    //                         type: 'swap',
    //                         payload: swap
    //                     }
    //                     let invocationId = await state.pioneer.build(tx)
    //                     if (invocationId) {
    //                         //SET_INVOCATION_ID
    //                         dispatch({ type: WalletActions.SET_INVOCATION_ID, payload: invocationId })
    //                         //TODO context is wallet?
    //                         setValue('invocationContext', invocationId)
    //                         setValue('invocationId', invocationId)

    //                         let invocation = await state.pioneer.getInvocation(invocationId)
    //                         if (invocation) {
    //                             dispatch({ type: WalletActions.SET_INVOCATION, payload: invocation })
    //                             console.log("invocation: ", invocation)
    //                             //Set outAmount
    //                             dispatch({
    //                                 type: WalletActions.SET_TRADE_STATE, payload: {
    //                                     ...state.tradeState,
    //                                     output: { ...state.tradeState.output, amount: invocation.invocation.tx.amountOut }
    //                                 }
    //                             })
    //                         } else {
    //                             console.error("Failed to get invocation!")
    //                         }

    //                     }

    //                 } else {
    //                     console.log("Pioneer not set into state!")
    //                 }
    //             } else {
    //                 console.log(' cant update, missing params! ',
    //                     { symbolIn, symbolOut, blockchainIn, blockchainOut }
    //                 )
    //             }
    //         } else {
    //             //TODO if edited values then create new?
    //             setValue('invocationId', state.invocationId)

    //             let invocation = await state.pioneer.getInvocation(state.invocationId)
    //             if (invocation) {
    //                 dispatch({ type: WalletActions.SET_INVOCATION, payload: invocation })
    //                 console.log("invocation: ", invocation)
    //             }


    //             // let amountOut = invocation?.invocation?.route?.result?.outputAmount
    //             // console.log("amountOut: ",amountOut)
    //             // setValue('buyAsset.amount',amountOut)
    //             //
    //             // //swap
    //             // let swapRead = invocation?.invocation?.swap
    //             // console.log("swapRead: ",swapRead)
    //             //
    //             // //let currencyOut
    //             // let currencyOut = swapRead.output.asset
    //             //
    //             // //@TODO get from status block (can receive asset with no balance)
    //             // // let currencyInfo = status.tokens.filter((balance:any) => balance.symbol === currencyOut)[0]
    //             // // console.log("currencyInfo: ",currencyInfo)
    //             //
    //             // //output
    //             // let balanceOutput = balances.filter((balance:any) => balance.symbol === currencyOut)[0]
    //             // console.log("balanceOutput: ",balanceOutput)
    //             //
    //             // //balanceOutput
    //             // setValue('buyAsset.currency',balanceOutput)
    //             // setValue('buyAsset.currency.image',balanceOutput?.image)
    //             // setValue('buyAsset.currency.symbol',balanceOutput?.symbol)
    //         }
    //     } else {
    //         console.log(' cant update, no market status ')
    //     }

    // }

    const reset = () => {
        dispatch({
            type: WalletActions.SET_TRADE_STATE, payload: {
                ...state.tradeState,
                fiatAmount: undefined,
                input: { amount: undefined },
                output: { amount: undefined }
            }
        })
    }

    return {
        reset,
        updateAmountInNative,
        getCryptoQuote,
        getFiatQuote,
        setMaxInput,
        selectInput,
        selectOutput,
        switchAssets,
      //  update,
        selectExchange
    }
}
