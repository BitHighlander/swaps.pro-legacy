/*
    Wallet Provider
      This provider manages all wallet connections

    supported:
      onboard.js
      pioneer SDK
      keplr plugin
      KeepKey SDK

    Notes:
      This project uses the Pioneer SDK to manage all pubkeys and tx lifecycle hooks
    docs: https://ahead-respect-850.notion.site/Pioneer-Developer-Platform-de0ed9bdaaf44133b6fb1a29e4d29bdf
 */
import { Keyring } from '@shapeshiftoss/hdwallet-core'
import { Web3Provider } from '@ethersproject/providers'
// import { API as OnboardAPI, Wallet } from 'bnc-onboard/dist/src/interfaces'
import { getLibrary, initOnboard } from 'lib/onboard'
import KEEPKEY_ICON from 'assets/png/keepkey.png'
// import { PioneerService } from './Pioneer'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer
} from 'react'
import { useState } from 'react'

import { SUPPORTED_WALLETS } from './config'
import { WalletViewsRouter } from './WalletViewsRouter'
import * as keepkeyWebUSB from "@shapeshiftoss/hdwallet-keepkey-webusb";
import { v4 as uuidv4 } from "uuid";
import { SDK } from '@pioneer-sdk/sdk'
import * as core from "@shapeshiftoss/hdwallet-core";
import { PinMatrixRequestType } from './KeepKey/KeepKeyTypes'
import { useKeepKeyEventHandler } from './KeepKey/hooks/useKeepKeyEventHandler'
import { useModal } from 'hooks/useModal/useModal'
import { Balance, Invocation } from './types'


let {
  baseAmountToNative,
} = require("@pioneer-platform/pioneer-coins")
//TODO expand networks
const SUPPORTED_NETWORKS = [1]

// keepkey

export const VALID_ENTROPY_NUMBERS = [128, 192, 256] as const
export const VALID_ENTROPY = VALID_ENTROPY_NUMBERS.map(entropy => entropy.toString())
export type Entropy = typeof VALID_ENTROPY[number]

export type Outcome = 'success' | 'error'
export type DeviceDisposition = 'initialized' | 'recovering' | 'initializing'

export type DeviceState = {
  awaitingDeviceInteraction: boolean
  lastDeviceInteractionStatus: Outcome | undefined
  disposition: DeviceDisposition | undefined
  recoverWithPassphrase: boolean | undefined
  recoveryEntropy: Entropy
  recoveryCharacterIndex: number | undefined
  recoveryWordIndex: number | undefined
}

const initialDeviceState: DeviceState = {
  awaitingDeviceInteraction: false,
  lastDeviceInteractionStatus: undefined,
  disposition: undefined,
  recoverWithPassphrase: undefined,
  recoveryEntropy: VALID_ENTROPY[0],
  recoveryCharacterIndex: undefined,
  recoveryWordIndex: undefined,
}

// keepkey end

export enum WalletActions {
  SET_STATUS = 'SET_STATUS',
  INIT_PIONEER = 'INIT_PIONEER',
  INIT_ONBOARD = 'INIT_ONBOARD',
  SET_ONBOARD = 'SET_ONBOARD',
  SET_BLOCK_NUMBER = 'SET_BLOCK_NUMBER',
  SET_ACCOUNT = 'SET_ACCOUNT',
  SET_PROVIDER = 'SET_PROVIDER',
  SET_WALLET = 'SET_WALLET',
  SET_ACTIVE = 'SET_ACTIVE',
  SET_ADAPTERS = 'SET_ADAPTERS',
  SET_PIONEER = 'SET_PIONEER',
  SET_KEEPKEY = 'SET_KEEPKEY',
  SET_KEEPKEY_CONNECTED = 'SET_KEEPKEY_CONNECTED',
  SET_ONBOARD_CONNECTED = 'SET_ONBOARD_CONNECTED',
  SET_KEPLR_CONNECTED = 'SET_KEPLR_CONNECTED',
  SET_BALANCES = 'SET_BALANCES',
  SET_PAIRING_CODE = 'SET_PAIRING_CODE',
  SET_USERNAME = 'SET_USERNAME',
  SET_WALLET_INFO = 'SET_WALLET_INFO',
  SET_INITIALIZED = 'SET_INITIALIZED',
  SET_IS_CONNECTED = 'SET_IS_CONNECTED',
  SET_WALLET_MODAL = 'SET_WALLET_MODAL',
  SET_INPUT_WALLET = 'SET_INPUT_WALLET',
  SET_OUTPUT_WALLET = 'SET_OUTPUT_WALLET',
  SET_SELECT_MODAL_TYPE = 'SET_SELECT_MODAL_TYPE',
  SET_SELECT_MODAL = 'SET_SELECT_MODAL',
  SET_ASSET_CONTEXT = 'SET_ASSET_CONTEXT',
  SET_WALLET_CONTEXT = 'SET_WALLET_CONTEXT',
  SET_CONTEXT = 'SET_CONTEXT',
  SET_EXCHANGE_CONTEXT = 'SET_EXCHANGE_CONTEXT',
  SET_INVOCATION = 'SET_INVOCATION',
  SET_INVOCATION_ID = 'SET_INVOCATION_ID',
  SET_INVOCATION_CONTEXT = 'SET_INVOCATION_CONTEXT',
  SET_TRADE_STATE = 'SET_TRADE_STATE',
  SET_TRADE_STATUS = 'SET_TRADE_STATUS',
  SET_TRADE_FULLFILLMENT_TXID = 'SET_TRADE_FULLFILLMENT_TXID',
  SET_INVOCATION_TXID = 'SET_INVOCATION_TXID',
  SET_TOTAL_VALUE_USD = 'SET_TOTAL_VALUE_USD',
  SET_EXCHANGE_INFO = 'SET_EXCHANGE_INFO',
  SET_KEPLR = 'SET_KEPLR',
  SET_KEPLR_CONTEXT = 'SET_KEPLR_CONTEXT',
  SET_KEPLR_NETWORK = 'SET_KEPLR_NETWORK',
  SET_KEEPKEY_STATUS = 'SET_KEEPKEY_STATUS',
  SET_KEEPKEY_STATE = 'SET_KEEPKEY_STATE',
  RESET_STATE = 'RESET_STATE',
  OPEN_KEEPKEY_PIN = 'OPEN_KEEPKEY_PIN',
  SET_DEVICE_STATE = 'SET_DEVICE_STATE',
  SET_KEEPKEY_ADAPTER = 'SET_KEEPKEY_ADAPTER'
}

export interface InitialState {
  keyring: Keyring
  status: any
  isInitPioneer: boolean | null
  isInitOnboard: boolean | null
  onboard: any | null
  account: string | null
  provider: Web3Provider | null
  blockNumber: number | null
  wallet: any | null
  balances: Balance[] | null
  active: boolean
  adapters: Record<string, unknown> | null
  walletInfo: { name: string; icon: string } | null
  isConnected: boolean
  initialized: boolean
  modal: boolean
  modalSelect: boolean
  pioneer: SDK | null
  keepkey: any
  keepkeyConnected: boolean
  onboardConnected: boolean
  keplrConnected: boolean
  walletInput: { name: string; icon: string; isConnected: boolean } | null
  walletOutput: { name: string; icon: string; isConnected: boolean } | null
  code: any
  username: any
  assetContext: Balance | null
  invocationId: string | null
  invocation: Invocation | null
  invocationContext: string | null
  context: any
  exchangeContext: string | null
  totalValueUsd: string | null
  tradeState: {
    input?: {
      bal: Balance,
      amount?: number
    }
    output?: {
      bal: Balance,
      amount?: number
    }
    fiatAmount?: number
  } | null
  exchangeInfo: any
  selectType: any
  tradeStatus: string | null,
  fullfillmentTxid: string | null,
  invocationTxid: string | null,
  keplr: any,
  keplrContext: string | null,
  keplrNetworkContext: any
  keepkeyStatus: string | null,
  keepkeyState: number,
  deviceId: string,
  deviceState: DeviceState,
  keepKeyPinRequestType: PinMatrixRequestType | null
  keepkeyAdapter: any
}

const initialState: InitialState = {
  keyring: new Keyring(),
  isInitPioneer: false,
  isInitOnboard: false,
  status: null,
  onboard: null,
  blockNumber: null,
  account: null,
  provider: null,
  wallet: null,
  balances: null,
  active: false,
  adapters: null,
  walletInfo: null,
  isConnected: false,
  initialized: false,
  modal: false,
  modalSelect: false,
  selectType: null,
  pioneer: null,
  keepkey: null,
  keepkeyConnected: false,
  onboardConnected: false,
  keplrConnected: false,
  walletInput: { name: 'not connected', icon: '', isConnected: false },
  walletOutput: { name: 'not connected', icon: '', isConnected: false },
  code: null,
  username: null,
  assetContext: null,
  exchangeContext: null,
  invocationId: null,
  invocationContext: null,
  context: null,
  invocation: null,
  totalValueUsd: null,
  tradeState: null,
  tradeStatus: null,
  fullfillmentTxid: null,
  invocationTxid: null,
  exchangeInfo: null,
  keplr: null,
  keplrContext: null,
  keplrNetworkContext: null,
  keepkeyStatus: null,
  keepkeyState: 0,
  deviceId: '',
  deviceState: initialDeviceState,
  keepKeyPinRequestType: null,
  keepkeyAdapter: null
}

export interface IWalletContext {
  setRoutePath: any
  buildTransaction: any
  updateInvocation: any
  state: InitialState
  username: string | null
  dispatch: React.Dispatch<ActionTypes>
  connect: (adapter: any, icon: string, name: string) => Promise<void>
  disconnect: () => void,
  setDeviceState: (deviceState: Partial<DeviceState>) => void
}

export type ActionTypes =
  | { type: WalletActions.SET_STATUS; payload: any }
  | { type: WalletActions.INIT_PIONEER; payload: boolean }
  | { type: WalletActions.INIT_ONBOARD; payload: boolean }
  | { type: WalletActions.SET_ADAPTERS; payload: Record<string, unknown> }
  | { type: WalletActions.SET_PIONEER; payload: SDK | null }
  | { type: WalletActions.SET_KEEPKEY; payload: any | null }
  | { type: WalletActions.SET_PAIRING_CODE; payload: String | null }
  | { type: WalletActions.SET_USERNAME; payload: String | null }
  | {
    type: WalletActions.SET_TRADE_STATE; payload: {
      input?: {
        bal: Balance,
        amount?: number
      }
      output?: {
        bal: Balance,
        amount?: number
      }
      fiatAmount?: number
    } | null
  } | { type: WalletActions.SET_TRADE_STATUS; payload: string }
  | { type: WalletActions.SET_TRADE_FULLFILLMENT_TXID; payload: string }
  | { type: WalletActions.SET_KEEPKEY_STATUS; payload: string }
  | { type: WalletActions.SET_KEEPKEY_STATE; payload: number }
  | { type: WalletActions.SET_KEEPKEY_CONNECTED; payload: boolean }
  | { type: WalletActions.SET_ONBOARD_CONNECTED; payload: boolean }
  | { type: WalletActions.SET_KEPLR_CONNECTED; payload: boolean }
  | { type: WalletActions.SET_ASSET_CONTEXT; payload: Balance | null }
  | { type: WalletActions.SET_WALLET_CONTEXT; context: String | null }
  | { type: WalletActions.SET_WALLET_INFO; payload: { name: string; icon: string } }
  | { type: WalletActions.SET_EXCHANGE_INFO; payload: any }
  | { type: WalletActions.SET_INITIALIZED; payload: boolean }
  | { type: WalletActions.SET_IS_CONNECTED; payload: boolean }
  | { type: WalletActions.SET_WALLET_MODAL; payload: boolean }
  | { type: WalletActions.SET_INPUT_WALLET; payload: any }
  | { type: WalletActions.SET_OUTPUT_WALLET; payload: any }
  | { type: WalletActions.SET_SELECT_MODAL_TYPE; payload: string }
  | { type: WalletActions.SET_SELECT_MODAL; payload: boolean }
  | { type: WalletActions.SET_ONBOARD; payload: any }
  | { type: WalletActions.SET_BLOCK_NUMBER; payload: number | null }
  | { type: WalletActions.SET_ACCOUNT; payload: string }
  | { type: WalletActions.SET_PROVIDER; payload: Web3Provider }
  | { type: WalletActions.SET_WALLET; payload: any }
  | { type: WalletActions.SET_BALANCES; payload: any }
  | { type: WalletActions.SET_ACTIVE; payload: boolean }
  | { type: WalletActions.SET_TOTAL_VALUE_USD; payload: string }
  | { type: WalletActions.SET_INVOCATION_ID; payload: string }
  | { type: WalletActions.SET_INVOCATION; payload: string }
  | { type: WalletActions.SET_INVOCATION_CONTEXT; payload: string }
  | { type: WalletActions.SET_INVOCATION_TXID; payload: string }
  | { type: WalletActions.SET_CONTEXT; payload: string }
  | { type: WalletActions.SET_EXCHANGE_CONTEXT; payload: string }
  | { type: WalletActions.SET_KEPLR; payload: string }
  | { type: WalletActions.SET_KEPLR_CONTEXT; payload: string }
  | { type: WalletActions.SET_KEPLR_NETWORK; payload: any }
  | { type: WalletActions.SET_DEVICE_STATE; payload: Partial<DeviceState> }
  | { type: WalletActions.SET_KEEPKEY_ADAPTER; payload: any }
  | {
    type: WalletActions.OPEN_KEEPKEY_PIN
    payload: {
      deviceId: string
      pinRequestType?: PinMatrixRequestType
      showBackButton?: boolean
    }
  }
  | { type: WalletActions.RESET_STATE }

const reducer = (state: InitialState, action: ActionTypes) => {
  switch (action.type) {
    case WalletActions.SET_STATUS:
      return { ...state, status: action.payload }
    case WalletActions.INIT_ONBOARD:
      return { ...state, isInitOnboard: action.payload }
    case WalletActions.SET_ONBOARD:
      return { ...state, onboard: action.payload }
    case WalletActions.SET_KEEPKEY:
      return { ...state, keepkey: action.payload }
    case WalletActions.SET_BLOCK_NUMBER:
      return { ...state, blockNumber: action.payload }
    case WalletActions.SET_ACCOUNT:
      return { ...state, account: action.payload }
    case WalletActions.SET_PROVIDER:
      return { ...state, provider: action.payload }
    case WalletActions.SET_WALLET:
      return { ...state, wallet: action.payload }
    case WalletActions.SET_BALANCES:
      return { ...state, balances: action.payload }
    case WalletActions.SET_ACTIVE:
      return { ...state, active: action.payload }
    case WalletActions.SET_ADAPTERS:
      return { ...state, adapters: action.payload }
    case WalletActions.SET_PIONEER:
      return { ...state, pioneer: action.payload }
    case WalletActions.SET_KEPLR:
      return { ...state, keplr: action.payload }
    case WalletActions.SET_KEPLR_CONTEXT:
      return { ...state, keplrContext: action.payload }
    case WalletActions.SET_KEPLR_NETWORK:
      return { ...state, keplrNetworkContext: { name: action?.payload?.name, icon: action?.payload?.icon } }
    case WalletActions.SET_PAIRING_CODE:
      return { ...state, code: action.payload }
    case WalletActions.SET_USERNAME:
      return { ...state, username: action.payload }
    case WalletActions.SET_WALLET_INFO:
      return { ...state, walletInfo: { name: action?.payload?.name, icon: action?.payload?.icon } }
    case WalletActions.SET_INITIALIZED:
      return { ...state, initialized: action.payload }
    case WalletActions.SET_EXCHANGE_INFO:
      return { ...state, exchangeInfo: action.payload }
    case WalletActions.SET_EXCHANGE_CONTEXT:
      return { ...state, exchangeContext: action.payload }
    case WalletActions.SET_CONTEXT:
      return { ...state, context: action.payload }
    case WalletActions.SET_INVOCATION_CONTEXT:
      return { ...state, invocationContext: action.payload }
    case WalletActions.SET_TOTAL_VALUE_USD:
      return { ...state, totalValueUsd: action.payload }
    case WalletActions.SET_IS_CONNECTED:
      return { ...state, isConnected: action.payload }
    case WalletActions.SET_ASSET_CONTEXT:
      return { ...state, assetContext: action.payload }
    case WalletActions.SET_WALLET_MODAL:
      return { ...state, modal: action.payload }
    case WalletActions.SET_SELECT_MODAL_TYPE:
      return { ...state, selectType: action.payload }
    case WalletActions.SET_TRADE_STATE:
      return { ...state, tradeState: action.payload }
    case WalletActions.SET_TRADE_STATUS:
      return { ...state, tradeStatus: action.payload }
    case WalletActions.SET_KEEPKEY_STATUS:
      return { ...state, keepkeyStatus: action.payload }
    case WalletActions.SET_KEEPKEY_STATE:
      return { ...state, keepkeyState: action.payload }
    case WalletActions.SET_KEEPKEY_CONNECTED:
      return { ...state, keepkeyConnected: action.payload }
    case WalletActions.SET_ONBOARD_CONNECTED:
      return { ...state, onboardConnected: action.payload }
    case WalletActions.SET_OUTPUT_WALLET:
      return { ...state, walletOutput: action.payload }
    case WalletActions.SET_INPUT_WALLET:
      return { ...state, walletInput: action.payload }
    case WalletActions.SET_KEPLR_CONNECTED:
      return { ...state, keplrConnected: action.payload }
    case WalletActions.SET_TRADE_FULLFILLMENT_TXID:
      return { ...state, fullfillmentTxid: action.payload }
    case WalletActions.SET_INVOCATION:
      return { ...state, invocation: action.payload }
    case WalletActions.SET_INVOCATION_ID:
      return { ...state, invocationId: action.payload }
    case WalletActions.SET_INVOCATION_TXID:
      return { ...state, invocationTxid: action.payload }
    case WalletActions.SET_SELECT_MODAL:
      return { ...state, modalSelect: action.payload }
    case WalletActions.SET_KEEPKEY_ADAPTER:
      return { ...state, keepkeyAdapter: action.payload }
    case WalletActions.SET_DEVICE_STATE:
      const { deviceState } = state
      const {
        awaitingDeviceInteraction = deviceState.awaitingDeviceInteraction,
        lastDeviceInteractionStatus = deviceState.lastDeviceInteractionStatus,
        disposition = deviceState.disposition,
        recoverWithPassphrase = deviceState.recoverWithPassphrase,
        recoveryEntropy = deviceState.recoveryEntropy,
      } = action.payload
      return {
        ...state,
        deviceState: {
          ...deviceState,
          awaitingDeviceInteraction,
          lastDeviceInteractionStatus,
          disposition,
          recoverWithPassphrase,
          recoveryEntropy,
        },
      }
    case WalletActions.OPEN_KEEPKEY_PIN: {
      const { showBackButton, deviceId, pinRequestType } = action.payload
      return {
        ...state,
        modal: true,
        showBackButton: showBackButton ?? false,
        deviceId,
        keepKeyPinRequestType: pinRequestType ?? null
      }
    }
    case WalletActions.RESET_STATE:
      return {
        ...state,
        code: null,
        walletInfo: null,
        isConnected: false,
        username: null,
        setAssetContext: null,
        keepkeyConnected: null,
        keplrConnected: null,
        onboardConnected: null,
        invocationId: null,
        invocation: null,
        walletInput: null,
        walletOutput: null,
        pioneer: null,
        keplr: null,
        onboard: null,
        balances: null
      }
    default:
      return state
  }
}

const WalletContext = createContext<IWalletContext | null>(null)
let isPioneerStarted: boolean = false
// const pioneer = new PioneerService()
let onboard: any

export const WalletProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [type, setType] = useState<string | null>(null)
  let [username, setUsername] = useState<string | null>(null)
  const [network, setNetwork] = useState<number | null>(null)
  const [routePath, setRoutePath] = useState<string | readonly string[] | undefined>()

  /*
      SDK

   */


  /*
      Pioneer SDK transaction protocal

   */


  const buildTransaction = useCallback(
    async (currentSellAsset: any, currentBuyAsset: any) => {
      if (
        // state?.provider &&
        // state?.account &&
        state?.username &&
        state?.status &&
        state?.balances &&
        state?.invocationContext &&
        state?.invocationId &&
        state?.pioneer) {
        console.log("Build TX~!")
        await updateInvocation()


        console.log("current status: ", state.invocation.status)
        //if invocation already signed!
        if (state.invocation.status === '') {

        }

        // await pioneer.App.updateContext()
        // await pioneer.init()
        // if(!pioneer.username){
        //   throw Error("Pioneer username is required!")
        // }
        let contextInput = currentSellAsset.currency.context
        console.log("contextInput: ", contextInput)
        console.log("currentSellAsset.currency: ", currentSellAsset.currency)
        //wallets
        // console.log("wallets: ",pioneer.wallets)

        //get walletDescription for context
        //state.balances.filter((balance:any) => balance.symbol === state.tradeOutput)[0]

        //TODO switch on context/wallet?
        //if onboard
        //if keplr
        console.log("currentSellAsset: ", currentSellAsset)
        console.log("currentBuyAsset: ", currentBuyAsset)

        console.log("context: ", state.context)
        console.log("assetContext: ", state.assetContext)

        //get protocal
        console.log("invocationContext: ", state.invocationContext)

        let symbolIn = currentSellAsset?.currency?.symbol
        let symbolOut = currentBuyAsset?.currency?.symbol

        let blockchainIn = currentSellAsset?.currency?.blockchain
        let blockchainOut = currentBuyAsset?.currency?.blockchain

        let invocationId
        if (symbolIn && symbolOut && blockchainIn && blockchainOut) {
          //build quote
          let invocation = await state.pioneer.getInvocation(state.invocationId)
          console.log("invocation: ", invocation)

          try {
            //buildSwap
            let swapBuilt = await state.pioneer.sign(state.invocationId)
            console.log("swapBuilt: ", swapBuilt)
            //get txid
            let payload = {
              noBroadcast: false,
              sync: false,
              invocationId: state.invocationId
            }
            //executeSwap
            let executionResp = await state.pioneer.broadcast(payload)
            console.log("executionResp: ", executionResp)

            //TODO update state
            //TODO update txid of send

          } catch (e) {
            //TODO delete invocation?

            alert(e)
            throw Error("failed to build swap!")
          }

        } else {
          console.log(' cant update, missing params! ',
            { symbolIn, symbolOut, blockchainIn, blockchainOut }
          )
          throw Error("failed to build swap!")
        }




        //start loop
        // let isConfirmed = false
        // let isFullfilled = false
        // let fullfillmentTxid = false
        // let interval:any
        // let checkStatus = async function(){
        //   try{
        //     let invocationStatus = await state.pioneer.getInvocation(invocationId)
        //     console.log("invocationStatus: ",invocationStatus.state)
        //
        //     if(invocationStatus && invocationStatus.isConfirmed){
        //       isConfirmed = true
        //       dispatch({ type: WalletActions.SET_TRADE_STATUS, payload:'confirmed' })
        //       console.log('WINNING! TX CONFIRMED!')
        //       //TODO push to state?
        //     } else {
        //       console.log('not confirmed!')
        //     }
        //
        //     if(invocationStatus && invocationStatus.isFullfilled && invocationStatus.fullfillmentTxid){
        //       console.log('WINNING2! TX FULLFILLED YOU GOT PAID BRO!')
        //       dispatch({ type: WalletActions.SET_TRADE_STATUS, payload:'fullfilled' })
        //       dispatch({ type: WalletActions.SET_TRADE_FULLFILLMENT_TXID, payload:invocationStatus.fullfillmentTxid })
        //       fullfillmentTxid = invocationStatus.fullfillmentTxid
        //       isFullfilled = true
        //       //TODO push to state?
        //       console.log("destroyed interval: ",interval)
        //       interval.destroy()
        //     } else {
        //       console.log('not fullfilled!')
        //     }
        //   }catch(e){
        //     console.error(e)
        //   }
        // }
        // interval = setInterval(checkStatus,6000)


      } else {
        //state?.provider && state?.account && state?.assetContext && state?.status
        // if(!state?.provider) console.error("Wallet not initialized")
        // if(!state?.account) console.error("state missing account")
        if (!state?.invocationId) console.error("state missing invocationId")
        if (!state?.invocationContext) console.error("state missing invocationContext")
        if (!state?.assetContext) console.error("state missing assetContext")
        if (!state?.status) console.error("state missing status")
        if (!state?.balances) console.error("state missing balances")
        if (!state?.pioneer) console.error("state missing pioneer")
        console.error("Failed to buildTx")
      }
    },
    [
      // state?.provider,
      // state?.account,
      state?.username,
      state?.status,
      state?.assetContext,
      state?.balances,
      state?.invocationId,
      state?.invocationContext,
      state?.pioneer
    ]
  )


  const updateInvocation = useCallback(
    async () => {
      if (state?.pioneer, state?.invocationId) {
        console.log("update invocation~!")
        let invocation = await state.pioneer.getInvocation(state.invocationId)
        dispatch({ type: WalletActions.SET_INVOCATION, payload: invocation })
      } else {
        if (!state?.pioneer) console.error("state missing pioneer")
        if (!state?.invocationId) console.error("state missing invocationId")
        console.error("Failed to get invocationId")
      }
    },
    [
      state?.pioneer,
      state?.invocationId
    ]
  )

  /**
   * temp logging data here for dev use
   */
  const connect = useCallback(async (type: string) => {
    setType(type)

    switch (type) {
      case 'pioneer':
        console.log('Pioneer connect selected!')
        setRoutePath(SUPPORTED_WALLETS[type]?.routes[0]?.path ?? undefined)
        break
      case 'native':
        console.log('Swap connect selected!')
        break
      case 'kepler':
        console.log('Kepler connect selected!')
        break
      case 'keepkey':
        // setRoutePath(SUPPORTED_WALLETS[type]?.routes[0]?.path ?? undefined)

        try {
          let wallet = await state.keepkeyAdapter.pairDevice(undefined /*tryDebugLink=*/);
          console.log("wallet: ", wallet)

          if (wallet) {
            const deviceId = await wallet.getDeviceID()
            localStorage.setItem('deviceId', deviceId)
            let pioneerResp = await state.pioneer.pairWallet(wallet)
            console.log("pioneerResp: ", pioneerResp)
            //@TODO get this from pioneer?
            let walletInfo = {
              name: 'keepkey',
              icon: KEEPKEY_ICON,
              blockchains: 32,
              walletId: "keepkey-01",
              isConnected: true
            }

            //@TODO support multiple wallet paired!
            dispatch({ type: WalletActions.SET_INPUT_WALLET, payload: walletInfo })
            dispatch({ type: WalletActions.SET_OUTPUT_WALLET, payload: walletInfo })

            dispatch({ type: WalletActions.SET_KEEPKEY_CONNECTED, payload: true })
            dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: false })
          }
        } catch (e) {
          alert(e)
        }



        // let status = await pioneer.getStatus()
        // if(status) dispatch({ type: WalletActions.SET_STATUS, payload: status })

        //on event Prompt Pin
        //listen to events
        // pioneerEvents.on(["*", "*", core.Events.PIN_REQUEST], () => {
        //   console.log("openPin!")
        //   // dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: true })
        // });
        // if(pioneer.balances) dispatch({ type: WalletActions.SET_BALANCES, payload:pioneer.balances })
        // if(pioneer.context) dispatch({ type: WalletActions.SET_CONTEXT, payload:pioneer.context })
        // if(pioneer.username) dispatch({ type: WalletActions.SET_USERNAME, payload:pioneer.username })

        //close
        // dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: false })
        //
        // dispatch({ type: WalletActions.SET_WALLET_INFO, payload:{name:'keepkey', icon:'KeepKey'} })
        //
        // dispatch({ type: WalletActions.SET_ACTIVE, payload: true })
        // dispatch({ type: WalletActions.SET_ASSET_CONTEXT, payload:'ETH' })
        // dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })

        break
      case 'onboard':
      case 'MetaMask':
        console.log("connect onboard/metamask!")
        dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: false })
        const selected = await state.onboard?.walletSelect()
        if (selected) {
          console.log("selected: ", selected)
          dispatch({ type: WalletActions.SET_WALLET_INFO, payload: { name: 'MetaMask', icon: 'Pioneer' } })
          const ready = await state.onboard?.walletCheck()
          if (ready) {
            console.log("ready: ", ready)
            dispatch({ type: WalletActions.SET_ACTIVE, payload: true })
            dispatch({ type: WalletActions.SET_ASSET_CONTEXT, payload: 'ETH' })
            dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
          } else {
            console.log("not ready: ", ready)
            //dont think I want to do this? keep memory of what used
            // dispatch({ type: WalletActions.SET_ACTIVE, payload: false })
            // window.localStorage.removeItem('selectedWallet')
          }
        }
        break
      case 'xdefi':
        console.log('xdefi connect selected!')
        break
      default:
        throw Error('Wallet not supported: ' + type)
    }
  }, [state?.onboard, state?.pioneer, state?.username])

  const disconnect = useCallback(() => {
    setType(null)
    setRoutePath(undefined)
    dispatch({ type: WalletActions.RESET_STATE })
  }, [])

  const connectPrevious = useCallback(
    async (previous: string) => {
      try {
        const selected = await state.onboard?.walletSelect(previous)
        if (!selected) dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
        if (selected && state?.onboard?.walletCheck) {
          const ready = await state.onboard.walletCheck()
          if (ready && state.isInitPioneer) {

            dispatch({ type: WalletActions.SET_ASSET_CONTEXT, payload: 'ETH' })
            dispatch({ type: WalletActions.SET_ACTIVE, payload: true })
            dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
          } else if (ready) {
            console.log("ready to start!")
            //starting pioneer!
            console.log("starting pioneer!")
            //start pioneer
            // let initResult = await pioneer.init()
            // console.log("initResult: ",initResult)
          } else {
            dispatch({ type: WalletActions.SET_ACTIVE, payload: false })
            dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
            window.localStorage.removeItem('selectedWallet')
          }
        }
      } catch (error) {
        console.warn(error)
        disconnect()
        window.localStorage.removeItem('selectedWallet')
      }
    },
    [disconnect, state.onboard]
  )

  const setBlockNumber = useCallback(
    (blockNumber: number) => {
      if (state?.provider && blockNumber !== state.blockNumber) {
        dispatch({ type: WalletActions.SET_BLOCK_NUMBER, payload: blockNumber })
      }
    },
    [state.blockNumber, state?.provider]
  )

  useEffect(() => {

    const keepkeyAdapter = keepkeyWebUSB.WebUSBKeepKeyAdapter.useKeyring(state.keyring);
    keepkeyAdapter.initialize().then(() => {
      dispatch({ type: WalletActions.SET_KEEPKEY_ADAPTER, payload: keepkeyAdapter })
    })

    //Start Onboard.js
    let networkId = 1
    //TODO support more networks
    const onboard = initOnboard({
      network: network => {
        setNetwork(network)
      },
      address: address => {
        dispatch({ type: WalletActions.SET_ACCOUNT, payload: address })
      },
      wallet: (wallet: Wallet) => {
        if (wallet.provider) {
          dispatch({ type: WalletActions.SET_WALLET, payload: wallet })
          dispatch({ type: WalletActions.SET_PROVIDER, payload: getLibrary(wallet.provider) })
          window.localStorage.setItem('selectedWallet', wallet.name as string)
        } else {
          disconnect()
        }
      }
    }, networkId)

    dispatch({ type: WalletActions.SET_ONBOARD, payload: onboard })

    async function startPioneer() {
      try {
        console.log("onStartPioneer")
        //
        let queryKey: string | null = localStorage.getItem('queryKey')
        let username: string | null = localStorage.getItem('username')
        if (!queryKey) {
          console.log("Creating new queryKey~!")
          queryKey = 'key:' + uuidv4()
          localStorage.setItem('queryKey', queryKey)
        }
        if (!username) {
          console.log("Creating new username~!")
          username = 'user:' + uuidv4()
          username = username.substring(0, 13);
          console.log("Creating new username~! username: ", username)
          localStorage.setItem('username', username)
        }

        //TODO dont get blockchains here
        let blockchains = [
          'bitcoin', 'ethereum', 'thorchain', 'bitcoincash', 'litecoin', 'binance', 'cosmos', 'dogecoin', 'osmosis'
        ]

        const config: any = {
          blockchains,
          username,
          queryKey,
          service: process.env.REACT_APP_PIONEER_SERVICE || 'swaps.pro',
          url: process.env.REACT_APP_APP_URL,
          wss: process.env.REACT_APP_URL_PIONEER_SOCKET,
          spec: process.env.REACT_APP_URL_PIONEER_SPEC,
          paths: []
        }
        console.log("config: ", config)

        //Pioneer SDK
        let pioneer = new SDK(config.spec, config)


        let user = await pioneer.init(state.wallet)
        console.log("user: ", user)

        dispatch({ type: WalletActions.SET_PIONEER, payload: pioneer })

        console.log("user: ", user)
        // if(status) dispatch({ type: WalletActions.SET_STATUS, payload: status })

        if (pioneer && pioneer.markets) {
          dispatch({ type: WalletActions.SET_STATUS, payload: pioneer.markets })
        }

        if (pioneer && pioneer.isPaired) {
          console.log("app is paired! loading user")
          const deviceId = localStorage.getItem('deviceId')
          if (deviceId) {
            const wallet = state.keyring.get(deviceId)
            console.log('WALLET LOADED FROM MEMORY: ', wallet)
            if (wallet) {
              let pioneerResp = await pioneer.pairWallet(wallet)
              console.log("pioneerResp: ", pioneerResp)
              //@TODO get this from pioneer?
              let walletInfo = {
                name: 'keepkey',
                icon: KEEPKEY_ICON,
                blockchains: 32,
                walletId: "keepkey-01",
                isConnected: true
              }

              //@TODO support multiple wallet paired!
              dispatch({ type: WalletActions.SET_INPUT_WALLET, payload: walletInfo })
              dispatch({ type: WalletActions.SET_OUTPUT_WALLET, payload: walletInfo })

              dispatch({ type: WalletActions.SET_KEEPKEY_CONNECTED, payload: true })
              dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: false })
            }
          }
          //sit init
          dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
          //set context
          dispatch({ type: WalletActions.SET_ASSET_CONTEXT, payload: 'ETH' })

          console.log("pioneer: ", pioneer)
          console.log("username: ", pioneer.username)

          console.log('balances', JSON.stringify(pioneer.balances))
          if (pioneer.balances) dispatch({ type: WalletActions.SET_BALANCES, payload: pioneer.balances })
          if (pioneer.context) dispatch({ type: WalletActions.SET_CONTEXT, payload: pioneer.context })
          //invocationContext
          if (pioneer.context) dispatch({ type: WalletActions.SET_INVOCATION_CONTEXT, payload: pioneer.context })
          if (pioneer.username) dispatch({ type: WalletActions.SET_USERNAME, payload: pioneer.username })
          dispatch({ type: WalletActions.SET_WALLET_INFO, payload: { name: 'pioneer', icon: 'Pioneer' } })
        } else {
          console.log("app is not paired! can not start. please connect a wallet")
          dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: true })
        }

        //@TODO get wallets
        //@TODO get this from pioneer?
        let walletInfo: any = {
          name: 'keepkey',
          icon: KEEPKEY_ICON,
          blockchains: 32,
          walletId: "keepkey-01",
          isConnected: false
        }

        //@TODO support multiple wallet paired!
        dispatch({ type: WalletActions.SET_INPUT_WALLET, payload: walletInfo })
        dispatch({ type: WalletActions.SET_OUTPUT_WALLET, payload: walletInfo })

        //try to connect

        // console.log("initResult: ",initResult)
        //
        // if(initResult.code) dispatch({ type: WalletActions.SET_PAIRING_CODE, payload: initResult.code })
        // //pioneer status
        // let status = await pioneer.getStatus()
        // if(status) dispatch({ type: WalletActions.SET_STATUS, payload: status })


        // pioneer.events.on('message', async (event: any) => {
        //   console.log('pioneer event: ', event)
        //   switch (event.type) {
        //     case 'context':
        //       console.log("context event! event: ",event)
        //       break
        //     case 'pairing':
        //       console.log('Paired!', event)
        //       //set context
        //       dispatch({ type: WalletActions.SET_ASSET_CONTEXT, payload:'ETH' })
        //       dispatch({ type: WalletActions.SET_EXCHANGE_CONTEXT, payload:'thorchain' })
        //       if(pioneer.balances) dispatch({ type: WalletActions.SET_BALANCES, payload:pioneer.balances })
        //       if(pioneer.context) dispatch({ type: WalletActions.SET_CONTEXT, payload:pioneer.context })
        //       if(pioneer.username) dispatch({ type: WalletActions.SET_USERNAME, payload:pioneer.username })
        //       if(pioneer) dispatch({ type: WalletActions.SET_PIONEER, payload: pioneer })
        //       //console.log('pairing event!: ', event.username)
        //       dispatch({ type: WalletActions.SET_USERNAME, payload: initResult.username })
        //       dispatch({ type: WalletActions.SET_WALLET_INFO, payload:{name:'pioneer', icon:'Pioneer'} })
        //       dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: false })
        //       break
        //     default:
        //       console.error(' message unknown type:',event)
        //   }
        // })
      } catch (e) {
        console.error(e)
      }
    }
    startPioneer()

    //start keplr
    async function startKeplr() {
      try {
        console.log("onStartKeplr")
        // @ts-ignore
        if (!window.getOfflineSigner || !window.keplr) {
          alert("Please install keplr extension");
        }
        //cosmos info
        let cosmosInfo = {
          rpc: 'https://rpc-cosmoshub.keplr.app',
          rest: 'https://lcd-cosmoshub.keplr.app',
          chainId: 'cosmoshub-4',
          chainName: 'Cosmos Hub',
          coinImageUrl: 'https://app.osmosis.zone/public/assets/tokens/cosmos.svg',
        }
        const chainId = cosmosInfo.chainId;

        //TODO if pair process iterate over all chains and register addresses?
        // @ts-ignore
        // await window.keplr.enable(chainId);
        // @ts-ignore
        // const offlineSigner = window.getOfflineSigner(chainId);
        // const accounts = await offlineSigner.getAccounts();
        // console.log("accounts: ",accounts)
        // let pairWalletKeplr:any = {
        //   name:'keplr',
        //   format:'keplr',
        //   wallet:accounts,
        //   chainId:chainId
        // }
        // console.log("pairWalletKeplr: ",pairWalletKeplr)
        // pioneer.pairWallet(pairWalletKeplr)
        // dispatch({ type: WalletActions.SET_KEPLR, payload: offlineSigner })
        // dispatch({ type: WalletActions.SET_KEPLR_CONTEXT, payload: accounts[0].address })
        // dispatch({ type: WalletActions.SET_KEPLR_NETWORK, payload: {icon:cosmosInfo.coinImageUrl,name:chainId} })
      } catch (e) {
        console.error(e)
      }
    }
    // startKeplr()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // we explicitly only want this to happen once

  //fuck useEffect
  // useEffect(() => {
  //   if(state.pioneer && state.pioneer.isPaired){
  //     console.log("app is paired!
  //     loading user")
  //     //sit init
  //     dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
  //     //set context
  //     dispatch({ type: WalletActions.SET_ASSET_CONTEXT, payload:'ETH' })
  //     if(state.pioneer.balances) dispatch({ type: WalletActions.SET_BALANCES, payload:state.pioneer.balances })
  //     if(state.pioneer.context) dispatch({ type: WalletActions.SET_CONTEXT, payload:state.pioneer.context })
  //     if(state.pioneer.username) dispatch({ type: WalletActions.SET_USERNAME, payload:state.pioneer.username })
  //     dispatch({ type: WalletActions.SET_WALLET_INFO, payload:{name:'pioneer', icon:'Pioneer'} })
  //   } else {
  //     console.log("app is not paired! can not start. please connect a wallet")
  //   }
  // }, [state.pioneer,state.pioneer?.isPaired])
  //
  // useEffect(() => {
  //   if(state.pioneer){
  //     state.pioneer.init()
  //   }
  // }, [state.pioneer])

  useEffect(() => {
    const previouslySelectedWallet = window.localStorage.getItem('selectedWallet')
    if (previouslySelectedWallet && state.onboard && !state.active) {
      void connectPrevious(previouslySelectedWallet)
    } else if (!previouslySelectedWallet && state.onboard) {
      dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
    }
  }, [state.onboard, disconnect, state.active, connectPrevious])

  useEffect(() => {
    if (state.wallet && state.active && state.account && pioneer.isInitialized) {
      //register
      console.log("Register MetaMask Account")
      let pairWalletOnboard: any = {
        name: 'MetaMask',
        format: 'onboard',
        network: 1,
        initialized: true,
        address: state.account
      }
      console.log("pairWalletOnboard: ", pairWalletOnboard)
      // pioneer.pairWallet(pairWalletOnboard)
      // if(pioneer.username) dispatch({ type: WalletActions.SET_USERNAME, payload:pioneer.username})

      dispatch({ type: WalletActions.SET_IS_CONNECTED, payload: true })
    } else {
      dispatch({ type: WalletActions.SET_IS_CONNECTED, payload: false })
    }
  }, [state.account, state.active, state.wallet])

  const setDeviceState = useCallback((deviceState: Partial<DeviceState>) => {
    dispatch({
      type: WalletActions.SET_DEVICE_STATE,
      payload: deviceState,
    })
  }, [])

  useEffect(() => {
    if (network && state.active && state.wallet && !SUPPORTED_NETWORKS.includes(network)) {
      disconnect()
    }
  }, [network, state.active, state.wallet, disconnect])



  useKeepKeyEventHandler(state, dispatch, connect, setDeviceState)


  //end
  const value: IWalletContext = useMemo(
    () => ({ state, buildTransaction, setRoutePath, username, dispatch, connect, disconnect, updateInvocation, setDeviceState }),
    [state, buildTransaction, setRoutePath, username, connect, disconnect, updateInvocation, setDeviceState]
  )

  return (
    <WalletContext.Provider value={value}>
      {children}
      <WalletViewsRouter
        connect={connect}
        modalOpen={state.modal}
        modalSelectOpen={state.modalSelect}
        type={type}
        routePath={routePath}
      />
    </WalletContext.Provider>
  )
}

export const useWallet = (): IWalletContext =>
  useContext(WalletContext as React.Context<IWalletContext>)
