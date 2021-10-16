import { Transfer } from '@pioneer-platform/pioneer-types'
import { Keyring } from '@shapeshiftoss/hdwallet-core'
import { Web3Provider } from '@ethersproject/providers'
import { API as OnboardAPI, Wallet } from 'bnc-onboard/dist/src/interfaces'
import { getLibrary, initOnboard } from 'lib/onboard'
const Datastore = require('nedb-promises')

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

import { pioneer } from 'hooks/usePioneerSdk/usePioneerSdk'
import {PioneerService} from "../../hooks/usePioneerSdk/Pioneer";

//TODO expand networks
const SUPPORTED_NETWORKS = [1]

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
  SET_BALANCES = 'SET_BALANCES',
  SET_PAIRING_CODE = 'SET_PAIRING_CODE',
  SET_USERNAME = 'SET_USERNAME',
  SET_WALLET_INFO = 'SET_WALLET_INFO',
  SET_INITIALIZED = 'SET_INITIALIZED',
  SET_IS_CONNECTED = 'SET_IS_CONNECTED',
  SET_WALLET_MODAL = 'SET_WALLET_MODAL',
  SET_SELECT_MODAL = 'SET_SELECT_MODAL',
  SET_ASSET_CONTEXT = 'SET_ASSET_CONTEXT',
  SET_WALLET_CONTEXT = 'SET_WALLET_CONTEXT',
  SET_CONTEXT = 'SET_CONTEXT',
  SET_EXCHANGE_CONTEXT = 'SET_EXCHANGE_CONTEXT',
  SET_INVOCATION_CONTEXT = 'SET_INVOCATION_CONTEXT',
  SET_TRADE_INPUT = 'SET_TRADE_INPUT',
  SET_TRADE_OUTPUT = 'SET_TRADE_OUTPUT',
  SET_TOTAL_VALUE_USD = 'SET_TOTAL_VALUE_USD',
  SET_EXCHANGE_INFO = 'SET_EXCHANGE_INFO',
  RESET_STATE = 'RESET_STATE'
}

export interface InitialState {
  status: any
  isInitPioneer: boolean | null
  isInitOnboard: boolean | null
  onboard: OnboardAPI | null
  account: string | null
  provider: Web3Provider | null
  blockNumber: number | null
  wallet: Wallet | null
  balances: any | null
  active: boolean
  keyring: Keyring
  adapters: Record<string, unknown> | null
  walletInfo: { name: string; icon: string } | null
  isConnected: boolean
  initialized: boolean
  modal: boolean
  modalSelect: boolean
  pioneer: any
  code: any
  username: any
  assetContext: string | null
  invocationContext: string | null
  context: string | null
  exchangeContext: string | null
  totalValueUsd: string | null
  tradeInputBalance: any
  tradeOutputBalance: any
  exchangeInfo: any
}

const initialState: InitialState = {
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
  keyring: new Keyring(),
  adapters: null,
  walletInfo: null,
  isConnected: false,
  initialized: false,
  modal: false,
  modalSelect: false,
  pioneer: null,
  code: null,
  username: null,
  assetContext: null,
  exchangeContext: null,
  invocationContext: null,
  context: null,
  totalValueUsd: null,
  tradeInputBalance: null,
  tradeOutputBalance: null,
  exchangeInfo:null
}

export interface IWalletContext {
  state: InitialState
  username: string | null
  assetContext: string | null
  dispatch: React.Dispatch<ActionTypes>
  connect: (adapter: any, icon: string, name: string) => Promise<void>
  disconnect: () => void
  setAssetContext: any
}

export type ActionTypes =
  | { type: WalletActions.SET_STATUS; payload: any }
  | { type: WalletActions.INIT_PIONEER; payload: boolean }
  | { type: WalletActions.INIT_ONBOARD; payload: boolean }
  | { type: WalletActions.SET_ADAPTERS; payload: Record<string, unknown> }
  | { type: WalletActions.SET_PIONEER; pioneer: any | null }
  | { type: WalletActions.SET_PAIRING_CODE; payload: String | null }
  | { type: WalletActions.SET_USERNAME; username: String | null }
  | { type: WalletActions.SET_TRADE_INPUT; payload: any }
  | { type: WalletActions.SET_TRADE_OUTPUT; payload: any }
  | { type: WalletActions.SET_ASSET_CONTEXT; asset: String | null }
  | { type: WalletActions.SET_WALLET_CONTEXT; context: String | null }
  | { type: WalletActions.SET_WALLET_INFO; payload: { name: string; icon: string } }
  | { type: WalletActions.SET_EXCHANGE_INFO; payload: any }
  | { type: WalletActions.SET_INITIALIZED; payload: boolean }
  | { type: WalletActions.SET_IS_CONNECTED; payload: boolean }
  | { type: WalletActions.SET_WALLET_MODAL; payload: boolean }
  | { type: WalletActions.SET_SELECT_MODAL; payload: boolean }
  | { type: WalletActions.RESET_STATE }
  | { type: WalletActions.SET_ONBOARD; payload: OnboardAPI }
  | { type: WalletActions.SET_BLOCK_NUMBER; payload: number | null }
  | { type: WalletActions.SET_ACCOUNT; payload: string }
  | { type: WalletActions.SET_PROVIDER; payload: Web3Provider }
  | { type: WalletActions.SET_WALLET; payload: Wallet }
  | { type: WalletActions.SET_BALANCES; payload: any }
  | { type: WalletActions.SET_ACTIVE; payload: boolean }
  | { type: WalletActions.SET_TOTAL_VALUE_USD; payload: string }
  | { type: WalletActions.SET_INVOCATION_CONTEXT; payload: string }
  | { type: WalletActions.SET_CONTEXT; payload: string }
  | { type: WalletActions.SET_EXCHANGE_CONTEXT; payload: string }

const reducer = (state: InitialState, action: ActionTypes) => {
  switch (action.type) {
    case WalletActions.SET_STATUS:
      return { ...state, status: action.payload }
    case WalletActions.INIT_ONBOARD:
      return { ...state, isInitOnboard: action.payload }
    case WalletActions.SET_ONBOARD:
      return { ...state, onboard: action.payload }
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
      return { ...state, pioneer: action.pioneer }
    case WalletActions.SET_PAIRING_CODE:
      return { ...state, code: action.payload }
    case WalletActions.SET_USERNAME:
      return { ...state, username: action.username }
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
    case WalletActions.SET_WALLET_MODAL:
      return { ...state, modal: action.payload }
    case WalletActions.SET_TRADE_INPUT:
      return { ...state, tradeInputBalance: action.payload }
    case WalletActions.SET_TRADE_OUTPUT:
      return { ...state, tradeOutputBalance: action.payload }
    case WalletActions.SET_SELECT_MODAL:
      return { ...state, modalSelect: action.payload }
    case WalletActions.RESET_STATE:
      return {
        ...state,
        code: null,
        walletInfo: null,
        isConnected: false,
        username: null,
        setAssetContext: null,
        pioneer: null,
        balances: null
      }
    default:
      return state
  }
}

const WalletContext = createContext<IWalletContext | null>(null)
let isPioneerStarted: boolean = false

export const WalletProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [type, setType] = useState<string | null>(null)
  let [username, setUsername] = useState<string | null>(null)
  const [network, setNetwork] = useState<number | null>(null)
  const [routePath, setRoutePath] = useState<string | readonly string[] | undefined>()
  let assetContext: string = "ETH"
  let onboard: OnboardAPI
  const pioneer = new PioneerService()
  let db = Datastore.create('/path/to/db.db')
  db.ensureIndex({fieldName:"test"})

  useEffect(() => {
    //console.log("Use Effect Called! state: ",state)
    dispatch({ type: WalletActions.SET_USERNAME, username })
  }, [])

  const setAssetContext = useCallback(
      async (ASSET:string) => {
        //dispatch({ type: WalletActions.SELECT_MODAL, payload: false })
        try {
          //set asset context

          // pioneer.setAssetContext(ASSET)
          //dispatch?
          return true
        } catch (error) {
          console.warn(error)
        }
      },
      []
  )

  /**
   * temp logging data here for dev use
   */
  const connect = useCallback(async (type: string) => {
    setType(type)
    console.log("type: ",type)
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
        console.log('keepkey connect selected!')
        break
      case 'onboard':
      case 'MetaMask':
        console.log("connect onboard/metamask!")
        dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: false })
        const selected = await state.onboard?.walletSelect()
        if (selected) {
          console.log("selected: ",selected)
          dispatch({ type: WalletActions.SET_WALLET_INFO, payload:{name:'MetaMask', icon:'Pioneer'} })
          const ready = await state.onboard?.walletCheck()
          if (ready) {
            console.log("ready: ",ready)
            dispatch({ type: WalletActions.SET_ACTIVE, payload: true })
            // onStartOnboard()
          } else {
            console.log("not ready: ",ready)
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
  }, [state?.onboard])

  const onStartPioneer = async function(){
    try{

      console.log("state init: ",state.isInitPioneer)
      if(!state.isInitPioneer){
        console.log("CHECKPOINT PIONEER")
        dispatch({ type: WalletActions.INIT_PIONEER, payload: true })
        console.log("state init2: ",state.isInitPioneer)
        //onboard
        let lastConnect = window.localStorage.getItem('selectedWallet')
        console.log('lastConnect: ', lastConnect)
        //only start once!
        isPioneerStarted = true
        let initResult = await pioneer.init()

        //pioneer status
        let status = await pioneer.getStatus()
        console.log("status: ",status)
        dispatch({ type: WalletActions.SET_STATUS, payload: status?.thorchain })
        dispatch({ type: WalletActions.SET_EXCHANGE_INFO, payload: status?.exchanges })
        console.log('status: ', status)

        console.log('Pioneer initResult: ', initResult)
        dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
        //pairing code
        if (initResult && initResult.code) {
          console.log('wallet not paired! code: ', initResult.code)
          //set code
          dispatch({ type: WalletActions.SET_PAIRING_CODE, payload: initResult.code })

          //open modal
          const previouslySelectedWallet = window.localStorage.getItem('selectedWallet')
          console.log("previouslySelectedWallet: ",previouslySelectedWallet)
          if (previouslySelectedWallet && onboard) {
            console.log("previouslySelectedWallet: CHECKPOINT1")
            //connectPrevious(previouslySelectedWallet)
          } else {
            console.log("previouslySelectedWallet: CHECKPOINT1 fail")
          }
        } else if (initResult) {
          //get user info
          //let userInfo = await pioneer.refresh()
          // console.log('userInfo: ', userInfo)
          username = initResult.username
          let context:any = initResult.context
          assetContext = initResult.assetContext
          setUsername(initResult.username)

          dispatch({ type: WalletActions.SET_ASSET_CONTEXT, asset:'ETH' })

          //TODO use remote context asset
          //get first ETH symbol in balances
          console.log("initResult.balances: ",initResult)
          if(initResult.balances){
            let ETHbalance = initResult.balances.filter((balance:any) => balance.symbol === 'ETH')[0]
            console.log("ETHbalance: ",ETHbalance)
          }


          dispatch({ type: WalletActions.SET_EXCHANGE_CONTEXT, payload:'thorchain' })
          dispatch({ type: WalletActions.SET_CONTEXT, payload:context })
          dispatch({ type: WalletActions.SET_USERNAME, username })
          dispatch({ type: WalletActions.SET_PIONEER, pioneer: initResult })
          dispatch({ type: WalletActions.SET_WALLET_INFO, payload:{name:'pioneer', icon:'Pioneer'} })
        }
        /*
          Pioneer events
        * */
        pioneer.events.on('message', async (event: any) => {
          //console.log('pioneer event: ', event)
          switch (event.type) {
            case 'context':
              // code block
              break
            case 'pairing':
              //console.log('pairing event!: ', event.username)
              dispatch({ type: WalletActions.SET_USERNAME, username: initResult.username })
              dispatch({ type: WalletActions.SET_PIONEER, pioneer: initResult })
              dispatch({ type: WalletActions.SET_WALLET_INFO, payload:{name:'pioneer', icon:'Pioneer'} })
              dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: false })
              break
            default:
              console.error(' message unknown type:',event)
          }
        })
      } else {
        console.log("ALREADY INIT PIONEER!")
      }
    }catch(e){
      console.error(e)
    }
  }

  const onStartOnboard = async function(){
    try{
      if(!pioneer.isInitialized){
        await onStartPioneer()
      }
      console.log("CHECKPOINT ONBOARD")
      console.log("state init: ",state.isInitPioneer)
      if(!state.isInitOnboard){
        dispatch({ type: WalletActions.INIT_ONBOARD, payload: true })

        console.log("start onboard!")
        onboard = initOnboard({
          network: network => {
            setNetwork(network)
          },
          address: address => {
            if(address){
              console.log("ADDRESS SET! ",address)
              dispatch({ type: WalletActions.SET_ACCOUNT, payload: address })
            }
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
        })
        dispatch({ type: WalletActions.SET_ONBOARD, payload: onboard })

        const previouslySelectedWallet = window.localStorage.getItem('selectedWallet')
        console.log("previouslySelectedWallet: ",previouslySelectedWallet)
        if(previouslySelectedWallet && onboard.walletSelect){
          const selected = await onboard.walletSelect(previouslySelectedWallet)
          console.log("selected ", selected)

          const ready = await onboard.walletCheck()
          if (ready && selected) {
            let stateOnboard = onboard.getState()
            console.log("stateOnboard ", stateOnboard)

            let pairWalletOnboard: any = {
              name: stateOnboard.wallet.name,
              network: 1,
              initialized: true,
              address: stateOnboard.address
            }
            console.log("Onboard state: FINAL ", pairWalletOnboard)
            if (pairWalletOnboard.name && pairWalletOnboard.address) {
              console.log("&&& CHECKPOINT register wallet: ")
              // let resultRegister = await pioneer.registerWallet(pairWalletOnboard)
              // console.log("&&& resultRegister: ", resultRegister)
              // if (pioneer.balances) {
              //   //TODO dispatch balances
              //   console.log("** pioneer.balances: ", pioneer.balances)
              //   dispatch({type: WalletActions.SET_BALANCES, payload: pioneer.balances})
              // }
              // if (pioneer.username) {
              //   dispatch({type: WalletActions.SET_USERNAME, username: 'metamask'})
              // }
              //
              // dispatch({type: WalletActions.SET_PIONEER, pioneer: pioneer})
              // dispatch({type: WalletActions.SET_WALLET_INFO, payload: {name: 'pioneer', icon: 'Pioneer'}})
              //
              // //console.log("Onboard state: ",state.onboard.getState())
              // //console.log("Onboard state: ",state)
              // dispatch({ type: WalletActions.SET_INITIALIZED, payload: true })
              // dispatch({type: WalletActions.SET_ACTIVE, payload: true})
              // dispatch({type: WalletActions.SET_IS_CONNECTED, payload: true})
            } else {
              console.error("Failed to start onboard! bad wallet info! info: ",pairWalletOnboard)
            }
          } else {
            console.error("Failed to start onboard! not ready!")
          }
        } else {
          console.error("Failed to start onboard! missing: ",state?.onboard)
        }
      } else {
        console.log("ALREADY INIT ONBOARD!")
      }
    }catch(e){
      console.error(e)
    }
  }

  const disconnect = useCallback(() => {
    setType(null)
    setRoutePath(undefined)
    //dispatch({ type: WalletActions.RESET_STATE })
  }, [])

  const onStart = async function (){
    try{
      console.log("ON START!!!! isStarted: ")

      let currentDb = await db.find()
      console.log("currentDb: ",currentDb)

      //isStarted = true
      // await onStartPioneer()
      // await onStartOnboard()
    }catch(e){
      console.error(e)
    }
  }

  useEffect(() => {
    onStart()
  }, []) // we explicitly only want this to happen once

  //end
  const value: IWalletContext = useMemo(
    () => ({ state, username, assetContext, dispatch, connect, disconnect, setAssetContext }),
    [state, username, assetContext, connect, disconnect, setAssetContext]
  )

  return (
    <WalletContext.Provider value={value}>
      {children}
      <WalletViewsRouter
        connect={connect}
        modalOpen={state.modal}
        type={type}
        routePath={routePath}
      />
    </WalletContext.Provider>
  )
}

export const useWallet = (): IWalletContext =>
  useContext(WalletContext as React.Context<IWalletContext>)
