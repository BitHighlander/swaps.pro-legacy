import { ModalCloseButton } from '@chakra-ui/modal'
import {
    Box,
    Center,
    Grid,
    GridItem,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text
} from '@chakra-ui/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslate } from 'react-polyglot'
import { useModal } from 'hooks/useModal/useModal'
import { AssetIcon } from 'components/AssetIcon'
import { useForm } from 'react-hook-form'
import { useWallet, WalletActions } from 'context/WalletProvider/WalletProvider'
import { SwapCurrency } from 'lib/assets/getTokenList'
import { Balance } from 'context/WalletProvider/types'

export type SelectAssetModalProps = { liveOnly?: boolean, selectType: 'input' | 'output', extra?: any }

export const SelectAssetModal = ({ liveOnly = true, selectType, extra }: SelectAssetModalProps) => {
    const initRef = useRef<HTMLInputElement | null>(null)
    const finalRef = useRef<HTMLDivElement | null>(null)

    const {
        selectAsset: { close, isOpen },
    } = useModal()

    const onClose = () => {
        close()
    }


    const { state, dispatch } = useWallet()
    const { balances, exchangeContext, exchangeInfo, status, assetContext } = state
    const [sortedAssets, setSortedAssets] = useState<SwapCurrency[]>([])
    const [filteredAssets, setFilteredAssets] = useState<SwapCurrency[]>([])
    const [liveChains, setLiveChains] = useState<Array<string>>()


    const { register, watch } = useForm<{ search: string }>({
        mode: 'onChange',
        defaultValues: {
            search: ''
        }
    })
    const translate = useTranslate()
    let selectOptions: any = []

    const searchString = watch('search')
    const searching = useMemo(() => searchString.length > 0, [searchString])

    const onSelectAsset = function (asset: Balance) {
        console.log("onSelectAsset: ", asset)
        close()
        dispatch({ type: WalletActions.SET_ASSET_CONTEXT, payload: asset })
        if (selectType === 'input') {
            dispatch({
                type: WalletActions.SET_TRADE_STATE, payload:
                    state.tradeState ? {
                        ...state.tradeState,
                        input: { ...state.tradeState.input, bal: asset, amount: 0 }
                    } : { input: { bal: asset } }
            })
            if (extra) extra()
        } else {
            dispatch({
                type: WalletActions.SET_TRADE_STATE, payload:
                    state.tradeState ? {
                        ...state.tradeState,
                        output: { ...state.tradeState.output, bal: asset, amount: 0 }
                    } : { output: { bal: asset } }
            })
            if (extra) extra()
        }
        dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: false })
    }

    const fetchTokens = useCallback(async () => {
        try {
            selectOptions = balances
        } catch (e) {
            console.warn(e)
        }
    }, [])

    // useEffect(() => {
    //     fetchTokens()
    //     axios.get('https://pioneers.dev/api/v1/blockchains').then((resp) => {
    //         setLiveChains(Object.values(resp.data.live))
    //     })
    // }, []) // run only once

    useEffect(() => {
        if (!state.pioneer || !liveOnly) return
        console.log("state.pioneer.pioneer: ", state.pioneer.pioneer)
        console.log("state.pioneer: ", state.pioneer)
        state.pioneer.pioneer.instance.Blockchains().then((chains: any) => {
            setLiveChains(Object.values(chains.data.live))
        })
    }, [state.pioneer, liveOnly])


    return (
        <Modal
            initialFocusRef={initRef}
            finalFocusRef={finalRef}
            isCentered
            closeOnOverlayClick
            closeOnEsc
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalOverlay />
            <ModalContent justifyContent='center' px={3} pt={3} pb={6} height='75%' overflow='scroll'>
                <ModalHeader textAlign='center'>
                    <h2>Select an {selectType} currency</h2>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody alignItems='center' justifyContent='center'>
                    <Input placeholder="Search name or paste contract" />
                    <Box flex={1} height='15em' >
                        <Tabs>
                            <TabList>
                                {liveChains?.map((chain) => <Tab>{chain}</Tab>)}
                            </TabList>
                            <TabPanels>
                                {liveChains?.map((chain) => {
                                    return <TabPanel>
                                        <Grid templateColumns='repeat(2, 1fr)' gap={6}>
                                            {balances?.filter((bal: any) => bal.blockchain === chain).map((bal: any) => (
                                                <GridItem w='100%'>
                                                    <Center>
                                                        <button onClick={() => onSelectAsset(bal)} >
                                                            <AssetIcon src={bal?.image} boxSize='40px' />
                                                            <Text>{bal.symbol}</Text>
                                                            <Text>balance: {bal.balance}</Text>
                                                        </button>
                                                    </Center>
                                                </GridItem>
                                            ))}
                                        </Grid>
                                    </TabPanel>
                                })}
                            </TabPanels>
                        </Tabs>
                    </Box>
                </ModalBody>
                <ModalFooter flexDir='column'>
                    <small>Manage Token lists</small>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}