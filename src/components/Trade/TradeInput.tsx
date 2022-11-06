import { ArrowDownIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  IconButton, Image,
  Input,
  InputProps, MenuGroup, MenuItem,
  Text,
  VStack
} from '@chakra-ui/react'
import { HelperToolTip } from 'components/HelperTooltip'
import { SlideTransition } from 'components/SlideTransition'
import { TokenButton } from 'components/TokenRow/TokenButton'
import { TokenRow } from 'components/TokenRow/TokenRow'
import { useLocaleFormatter } from 'hooks/useLocaleFormatter/useLocaleFormatter'
import { Controller, useFormContext } from 'react-hook-form'
import { Pioneer } from 'hooks/usePioneerSdk/usePioneerSdk'
import NumberFormat from 'react-number-format'
import { RouterProps } from 'react-router-dom'
import { useWallet, WalletActions } from "context/WalletProvider/WalletProvider";
import { useCallback, useEffect, useState } from "react";
import KEEPKEY_ICON from "../../assets/png/keepkey.png";
import { useModal } from 'hooks/useModal/useModal'
import { Balance } from 'context/WalletProvider/types'
import CalculatingGif from 'assets/gif/calculating.gif'

const FiatInput = (props: InputProps) => (
  <Input
    variant='unstyled'
    size='xl'
    textAlign='center'
    fontSize='3xl'
    mb={4}
    placeholder='$0.00'
    {...props}
  />
)

export const TradeInput = ({ history }: RouterProps) => {
  const { state, dispatch, setRoutePath, updateInvocation } = useWallet()
  const { assetContext, balances, exchangeContext, pioneer } = state
  const { getCryptoQuote, getFiatQuote, reset, setMaxInput } = Pioneer()
  const [inputAmount, setInputAmount] = useState(0)
  const [outputAmount, setOutputAmount] = useState(0)
  const [enteringAmount, setEnteringAmount] = useState(false)
  const [loading, setLoading] = useState(false)
  const [lastSwapQuote, setLastSwapQuote] = useState<{
    input?: {
      bal: Balance,
      amount?: number
    }
    output?: {
      bal: Balance,
      amount?: number
    }
  }>()

  let {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isDirty, isValid }
  } = useFormContext()
  const {
    number: { localeParts }
  } = useLocaleFormatter({ fiatType: 'USD' })

  const onSubmit = () => {
    console.log("onSubmit called! ")
    history.push('/trade/confirm')
  }

  const { selectAsset } = useModal()

  const onSelectModalInput = () => {
    //Open Select modal.
    console.log("onSelectModal called!")
    if (!state.keepkeyConnected) {
      console.log("wallet NOT connected!")
      return dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: true })
    }
    selectAsset.open({ selectType: 'input', extra: () => { setInputAmount(0) } })
    //set balance input

  }

  const onTextChangeFiat = () => {
    //Open Select modal.
    console.log("onTextChangeFiat called! (Fiat input)")
  }

  const onSelectModalOutput = () => {
    //Open Select modal.
    console.log("onSelectModalOutput called!")
    if (!state.keepkeyConnected) {
      console.log("wallet NOT connected!")
      return dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: true })
    }
    selectAsset.open({ selectType: 'output', extra: () => { setOutputAmount(0) } })
  }

  const onClear = () => {
    //Open Select modal.
    reset()
    //RESET_STATE
    // @ts-ignore
    dispatch({ type: WalletActions.RESET_STATE, payload: true })
  }


  useEffect(() => {
    // //  onUpdate()
    // // update()
    // if (state?.invocation?.state === 'created') {
    //   history.push('/trade/confirm')
    // }
    // if (state?.invocation?.state === 'broadcasted') {
    //   history.push('/trade/status')
    // }
  }, [history, state?.invocation])

  useEffect(() => {
    console.log('Trade Input: ', state.tradeState?.input)
    console.log('Trade Output: ', state.tradeState?.output)
  }, [state.tradeState])

  const switchAssets = useCallback(() => {
    if (!state.tradeState || !state.tradeState.input || !state.tradeState.output) return
    dispatch({
      type: WalletActions.SET_TRADE_STATE, payload: {
        ...state.tradeState,
        input: { ...state.tradeState.output, amount: 0 },
        output: { ...state.tradeState.input, amount: 0 }
      }
    })
    setInputAmount(0)
    setOutputAmount(0)
  }, [dispatch, state.tradeState])

  const cancelQuote = () => {
    setLoading(false)
    dispatch({
      type: WalletActions.SET_TRADE_STATE, payload: null
    })
    setInputAmount(0)
    setOutputAmount(0)
  }

  useEffect(() => {
    if (!state.tradeState || !state.tradeState.input || !state.tradeState.output || !state.pioneer) return
    if (lastSwapQuote) {
      if (lastSwapQuote.input && lastSwapQuote.output &&
        lastSwapQuote.input.bal.blockchain === state.tradeState.input.bal.blockchain &&
        lastSwapQuote.input.bal.symbol === state.tradeState.input.bal.symbol &&
        lastSwapQuote.input.amount === state.tradeState.input.amount &&
        lastSwapQuote.output.bal.blockchain === state.tradeState.output.bal.blockchain &&
        lastSwapQuote.output.bal.symbol === state.tradeState.output.bal.symbol) return
    }
    setLoading(true)
    let swap: any = {
      input: {
        blockchain: state.tradeState.input.bal.blockchain,
        asset: state.tradeState.input.bal.symbol,
      },
      output: {
        blockchain: state.tradeState.output?.bal.blockchain,
        asset: state.tradeState.output?.bal.symbol,
      },
      amount: state.tradeState.input.amount,
      noBroadcast: true
    }
    console.log("HOOK: swap", swap)
    //TODO
    console.log("pioneer: ", state.pioneer)
    if (state.pioneer) {
      let tx = {
        type: 'swap',
        payload: swap
      }
      try {
        state.pioneer.build(tx).then((invocationId) => {
          if (invocationId) {
            //SET_INVOCATION_ID
            dispatch({ type: WalletActions.SET_INVOCATION_ID, payload: invocationId })
            //TODO context is wallet?
            setValue('invocationContext', invocationId)
            setValue('invocationId', invocationId)

            if (!state.pioneer || !state.tradeState) return
            try {
              state.pioneer.getInvocation(invocationId).then((invocation) => {
                if (invocation) {
                  dispatch({ type: WalletActions.SET_INVOCATION, payload: invocation })
                  console.log("invocation: ", invocation)
                  //Set outAmount
                  if (!state.tradeState) return
                  dispatch({
                    type: WalletActions.SET_TRADE_STATE, payload: {
                      ...state.tradeState,
                      output: { bal: state.tradeState.output?.bal, amount: Number(invocation.invocation.tx.amountOut) }
                    }
                  })
                  setLastSwapQuote(state.tradeState)
                  setOutputAmount(Number(invocation.invocation.tx.amountOut))
                  setLoading(false)
                } else {
                  console.error("Failed to get invocation!")
                  setLoading(false)
                }
              })
            } catch (e) {
              setLoading(false)
            }
          } else {
            setLoading(false)
          }
        })
      } catch (e) {
        setLoading(false)
      }


    } else {
      console.log("Pioneer not set into state!")
    }
  }, [dispatch, lastSwapQuote, setValue, state.pioneer, state.tradeState])

  useEffect(() => {
    if (!state.tradeState || !state.tradeState.input) return
    if (inputAmount === 0) {
      let amt = state.tradeState.input.bal.balance - 0.002
      if (amt === inputAmount) return
      dispatch({
        type: WalletActions.SET_TRADE_STATE, payload: {
          ...state.tradeState,
          input: { ...state.tradeState.input, amount: amt }
        }
      })
      setInputAmount(amt)
      return
    } else {
      if (enteringAmount || state.tradeState.input.amount === inputAmount) return
      dispatch({
        type: WalletActions.SET_TRADE_STATE, payload: {
          ...state.tradeState,
          input: { ...state.tradeState.input, amount: inputAmount }
        }
      })
    }
  }, [dispatch, inputAmount, enteringAmount, state.tradeState])

  return (
    <SlideTransition>
      {/*<div>*/}
      {/*  <small>invocation: {state.invocationId}</small>*/}
      {/*</div>*/}
      {/*<div>*/}
      {/*  <small>status: {state?.invocation?.state}</small>*/}
      {/*</div>*/}
      {/*<div>*/}
      {/*  <small>walletIn: {state.walletInput.name} connected: {state.walletInput.isConnected}</small>*/}
      {/*</div>*/}
      {/*<div>*/}
      {/*  <small>walletOut: {state.walletOutput.name} connected: {state.walletOutput.isConnected}</small>*/}
      {/*</div>*/}
      {/*<div>*/}
      {/*  <small>sellAsset: {getValues('sellAsset.currency.symbol')} amount: {getValues('sellAsset.amount')}</small>*/}
      {/*</div>*/}
      {/*<div>*/}
      {/*  <small>buyAsset: {getValues('buyAsset.currency.symbol')} amount: {getValues('buyAsset.amount')}</small>*/}
      {/*</div>*/}

      {/*<Button*/}
      {/*    size='lg'*/}
      {/*    width='full'*/}
      {/*    colorScheme='green'*/}
      {/*    onClick={() => onClear()}*/}
      {/*>*/}
      {/*  Clear*/}
      {/*</Button>*/}
      {/*<Button*/}
      {/*  // size='lg'*/}
      {/*  // width='full'*/}
      {/*  colorScheme='yellow'*/}
      {/*  onClick={() => onUpdate()}*/}
      {/*>*/}
      {/*  update*/}
      {/*</Button>*/}
      <Box as='form' onSubmit={handleSubmit(onSubmit)} display={loading ? 'none' : 'block'}>
        <FormControl isInvalid={!!errors.fiatAmount}>
          {/*<Controller*/}
          {/*  render={({ field: { value } }) => (*/}
          {/*    <NumberFormat*/}
          {/*      inputMode='decimal'*/}
          {/*      thousandSeparator={localeParts.group}*/}
          {/*      decimalSeparator={localeParts.decimal}*/}
          {/*      prefix={localeParts.prefix}*/}
          {/*      suffix={localeParts.postfix}*/}
          {/*      value={value}*/}
          {/*      customInput={FiatInput}*/}
          {/*      onValueChange={onTextChangeFiat}*/}
          {/*    />*/}
          {/*  )}*/}
          {/*  name='fiatAmount'*/}
          {/*  control={control}*/}
          {/*  rules={{*/}
          {/*    validate: {*/}
          {/*      validNumber: value => !isNaN(Number(value)) || 'Amount must be a number',*/}
          {/*      greaterThanZero: value => Number(value) > 0 || 'Amount must be greater than 0'*/}
          {/*    }*/}
          {/*  }}*/}
          {/*/>*/}
          {/*<Image maxH={10} maxW={20} src={state.walletInput.icon} />*/}
          <FormErrorMessage>{errors.fiatAmount && errors.fiatAmount.message}</FormErrorMessage>
        </FormControl>
        <FormControl>
          <TokenRow
            value={inputAmount}
            setValue={setInputAmount}
            setEnteringAmount={setEnteringAmount}
            control={control}
            fieldName='sellAsset.amount'
            rules={{ required: true }}
            loading={loading}
            inputLeftElement={
              <TokenButton
                onClick={onSelectModalInput}
                logo={state.tradeState?.input?.bal.image ?? ""}
                symbol={state.tradeState?.input?.bal.symbol ?? ""}
                disabled={loading}
              />
            }
            inputRightElement={
              <Button
                h='1.75rem'
                size='sm'
                variant='ghost'
                colorScheme='blue'
                onClick={setMaxInput}
                disabled={loading}
              >
                Max
              </Button>
            }
          />
          <small>balance: {state.tradeState?.input?.bal.symbol}: {Number(state.tradeState?.input?.bal.balance)?.toFixed(6)} {Number(state.tradeState?.input?.bal.valueUsd)?.toFixed(2)}(USD)</small>
        </FormControl>
        <FormControl
          rounded=''
          my={6}
          pl={6}
          pr={2}
          display='flex'
          alignItems='center'
          justifyContent='space-between'
        >
          <IconButton onClick={switchAssets} isLoading={loading} aria-label='Switch' isRound icon={<ArrowDownIcon />} />
          <Box display='flex' alignItems='center' color='gray.500'>
            <Text fontSize='sm'>{state.tradeState?.input?.bal.priceUsd}</Text>
            <HelperToolTip label='The price is ' />
          </Box>
        </FormControl>
        <FormControl mb={6}>
          <TokenRow
            value={outputAmount}
            setValue={setOutputAmount}
            control={control}
            fieldName='buyAsset.amount'
            rules={{ required: true }}
            loading={loading}
            inputLeftElement={
              <TokenButton
                onClick={onSelectModalOutput}
                isLoading={loading}
                logo={state.tradeState?.output?.bal.image ?? ""}
                symbol={state.tradeState?.output?.bal.symbol ?? ""}
              />
            }
          />
          {/*<Image maxH={10} maxW={20} src={state.walletOutput.icon} />*/}
        </FormControl>
        <Button
          type='submit'
          size='lg'
          width='full'
          colorScheme='green'
          isLoading={loading}
          onClick={onSubmit}
        // isDisabled={isDirty || !isValid}
        >
          Preview Trade
        </Button>
      </Box>

      <VStack display={loading ? 'flex': 'none'} alignItems='center' justifyContent='center' w="100%">
        <Text fontWeight='bold' fontSize='xl'>Generating a Quote</Text>
        <Image borderRadius='5%' src={CalculatingGif} />
        <Button onClick={cancelQuote} colorScheme='red'>Cancel</Button>
      </VStack>

    </SlideTransition>
  )
}
