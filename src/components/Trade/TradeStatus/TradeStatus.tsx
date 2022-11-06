import { ArrowBackIcon } from '@chakra-ui/icons'
import {
    Box,
    Button,
    Divider,
    Flex,
    IconButton,
    SimpleGrid,
    Spinner,
    Stack,
    TabList,
    TabPanels,
    Tabs,
    Tab,
    TabPanel,
    Image,
    Text,
    HStack,
    VStack
} from '@chakra-ui/react'
import { Card } from 'components/Card'
import { Row } from 'components/Row'
import { useHistory, useParams } from 'react-router-dom'
import { useWallet, WalletActions } from "../../../context/WalletProvider/WalletProvider";
import React, { useEffect, useState } from 'react'
import { Page } from 'components/Layout/Page'
import { StackedProgressBar } from './StackedProgressBar'
import CalculatingGif from 'assets/gif/calculating.gif'
import ShiftingGif from 'assets/gif/shifting.gif'
import CompletedGif from 'assets/gif/completed.gif'
import { FaClipboard } from 'react-icons/fa'
import { CopyIconButton } from './CopyIconButton'

export const TradeStatus = () => {
    const history = useHistory()
    const { invocationId } = useParams<{ invocationId: string }>()

    const [tabIndex, setTabIndex] = React.useState(0)
    const { state, updateInvocation, dispatch } = useWallet()
    const [step, setStep] = useState(0)
    const [imageSrc, setImageSrc] = useState(CalculatingGif)

    const [fromAddress, setFromAddress] = useState("")
    const [toAddress, setToAddress] = useState("")


    useEffect(() => {
        if (!invocationId) return
        let invoId = invocationId
        if (state.invocationId) invoId = state.invocationId
        if (!invoId) return
        if (!state.pioneer) return

        state.pioneer.getInvocation(invoId).then((invocation: any) => {
            dispatch({ type: WalletActions.SET_INVOCATION, payload: invocation })
            dispatch({ type: WalletActions.SET_INVOCATION_ID, payload: invoId })
        })
    }, [dispatch, invocationId, state.invocationId, state.pioneer])

    useEffect(() => {
        return () => {
            dispatch({ type: WalletActions.SET_INVOCATION, payload: null })
            dispatch({ type: WalletActions.SET_INVOCATION_ID, payload: null })
        }
    }, [dispatch])

    useEffect(() => {
        if (!state.invocation || !state.balances) return
        if (state.invocation.type !== "swap") return
        let fAddress = state.balances.find((b) => state.invocation && b.symbol === state.invocation.invocation.swap.input.asset && b.blockchain === state.invocation.invocation.swap.input.blockchain)?.address
        let tAddress = state.balances.find((b) => state.invocation && b.symbol === state.invocation.invocation.swap.output.asset && b.blockchain === state.invocation.invocation.swap.output.blockchain)?.address

        if (fAddress) setFromAddress(fAddress)
        if (tAddress) setToAddress(tAddress)
    }, [state.balances, state.invocation])

    const handleTabsChange = (index) => {
        console.log("index: ", index)
        setTabIndex(index)
    }

    useEffect(() => {
        if (step <= 1) setImageSrc(CalculatingGif)
        else if (step <= 2) setImageSrc(ShiftingGif)
        else if (step <= 4) setImageSrc(CompletedGif)
    }, [step])

    if (!state.invocation || !state.invocationId) return (
        <>
            Fetching Invocation
            <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
            /></>
    )

    const { invocationContext, fullfillmentTxid, invocationTxid, tradeStatus } = state
    console.log("invocation: ", state.invocation)


    const onUpdate = async function () {
        //Open Select modal.
        updateInvocation()

        if (!state.invocation) return
        // signedTx/broadcasted/complete/fullfilled
        switch (state.invocation.state) {
            case 'signedTx':
                setStep(1)
                break;
            case 'broadcasted':
                setStep(2)
                break;
            case 'complete':
                setStep(3)
                break;
            case 'fullfilled':
                setStep(4)
                break;

            default:
                break;
        }


        //get txid
        // let payload = {
        //     noBroadcast:false,
        //     sync:true,
        //     invocationId:state.invocationId
        // }
        // try{
        //     let resultBroadcast = await state.pioneer.broadcast(payload)
        //     console.log("resultBroadcast: ",resultBroadcast)
        // }catch(e){
        //     console.error("status page can not broadcast: e: ",e)
        // }



    }

    return (
        <Box d='flex' width='full' justifyContent='center' alignItems='center'>
            <div>
                <Page>
                    <Flex maxWidth={{ base: 'auto', '2xl': '1464px' }} mx='auto' px={16}>
                        <Stack flex={1} spacing={4} justifyContent='center' alignItems='center'>
                            <Card mx="auto" flex={1} justifyContent='center' alignItems='center' p={2}>
                                <Card.Header px={0} pt={0}>
                                    <SimpleGrid gridTemplateColumns='25px 1fr 25px' alignItems='center' mx={-2}>
                                        <IconButton
                                            icon={<ArrowBackIcon />}
                                            aria-label='Back'
                                            variant='ghost'
                                            fontSize='xl'
                                            isRound
                                            onClick={() => history.push('/trade/input')}
                                        />
                                        <Card.Heading textAlign='center'>type: {state.invocation.type}
                                        </Card.Heading>
                                    </SimpleGrid>
                                </Card.Header>

                                <VStack alignItems='left' justifyContent='left' spacing={4} py={2}>
                                    <HStack>
                                        <Text>Invocation ID: {state.invocation.invocationId}</Text>
                                        <CopyIconButton copyString={state.invocation.invocationId} />
                                    </HStack>
                                    <Text>State: {state.invocation.state}</Text>
                                    <HStack>
                                        <Text>Network:</Text>
                                        <Image h={6} src={`https://static.coincap.io/assets/icons/${state.invocation.network.toLowerCase()}@2x.png`} />
                                        <Text>{state.invocation.network}</Text>
                                    </HStack>
                                    {state.invocation.type === 'swap' && <HStack>
                                        <Text>From Address:</Text>
                                        <Image h={6} src={`https://static.coincap.io/assets/icons/${state.invocation.invocation.swap.input.asset.toLowerCase()}@2x.png`} />
                                        <Text>{fromAddress}</Text>
                                        <CopyIconButton copyString={fromAddress} />
                                    </HStack>}
                                    {state.invocation.type === 'swap' && <HStack>
                                        <Text>To Address:</Text>
                                        <Image h={6} src={`https://static.coincap.io/assets/icons/${state.invocation.invocation.swap.output.asset.toLowerCase()}@2x.png`} />
                                        <Text>{toAddress}</Text>
                                        <CopyIconButton copyString={toAddress} />
                                    </HStack>}
                                </VStack>

                                <Image w='90vh' src={imageSrc} />
                                {state.invocation.type === 'sendToAddress' && <div>
                                    <Tabs align='center' variant='soft' colorScheme='green' index={tabIndex} onChange={handleTabsChange}>
                                        <TabList>
                                            <Tab bg='green.500'>TX built</Tab>
                                            <Tab bg='yellow.500'>TX signed</Tab>
                                            <Tab bg='blue.500'>TX confirmed</Tab>
                                        </TabList>
                                        <TabPanels>
                                            <TabPanel>
                                                <p>one!</p>
                                            </TabPanel>
                                            <TabPanel>
                                                <p>two!</p>
                                            </TabPanel>
                                            <TabPanel>
                                                <p>
                                                    Transaction is confirmed!
                                                    <br />
                                                    You can view your transaction here:
                                                </p>
                                            </TabPanel>
                                        </TabPanels>
                                    </Tabs>
                                </div>}

                                {state.invocation.type === 'swap' && <div>


                                    {/* <AssetToAsset
                                        buyAsset={{
                                            symbol: buyAsset?.currency?.symbol,
                                            amount: buyAsset.amount,
                                            icon: buyAsset?.currency?.image
                                        }}
                                        sellAsset={{
                                            symbol: sellAsset?.currency?.symbol,
                                            amount: sellAsset.amount,
                                            icon: sellAsset?.currency?.image
                                        }}
                                        mt={6}
                                        /> */}

                                    <StackedProgressBar step={step} />
                                </div>}



                                <Divider />
                                <Button
                                    size='sm'
                                    colorScheme='green'
                                    onClick={() => onUpdate()}
                                >
                                    update
                                </Button>
                                <Card.Body pb={0} px={0}>
                                    <Stack spacing={4}>

                                        {/*    {state.invocation.invocation.route.result.swaps.map((value, i) => {*/}
                                        {/*        return <>*/}
                                        {/*            <HelperToolTip label='protocol used to complete the swap'>*/}
                                        {/*                <Row.Label>swap:{i}</Row.Label>*/}
                                        {/*            </HelperToolTip>*/}
                                        {/*            <HelperToolTip label='protocol used to complete the swap'>*/}
                                        {/*                <Row.Label>swapperId:</Row.Label>*/}
                                        {/*                <Box textAlign='right'>*/}
                                        {/*                    <Text></Text>*/}
                                        {/*                    <Text color='gray.500'>{value.swapperId}</Text>*/}
                                        {/*                </Box>*/}
                                        {/*            </HelperToolTip>*/}
                                        {/*            <HelperToolTip label='protocol used to complete the swap'>*/}
                                        {/*                <Row.Label>time avg:{value.timeStat.avg}</Row.Label>*/}
                                        {/*            </HelperToolTip>*/}
                                        {/*            <HelperToolTip label='protocol used to complete the swap'>*/}
                                        {/*                <Row.Label>time min:{value.timeStat.min}</Row.Label>*/}
                                        {/*            </HelperToolTip>*/}
                                        {/*            <HelperToolTip label='protocol used to complete the swap'>*/}
                                        {/*                <Row.Label>time max:{value.timeStat.max}</Row.Label>*/}
                                        {/*            </HelperToolTip>*/}
                                        {/*        </>*/}
                                        {/*    })}*/}
                                        {/*<small> txid: {state.invocation.signedTx?.txid}</small>*/}
                                        {/*<small>is confirmed: {state.invocation.isConfirmed}</small>*/}
                                        {/*<small>is fullfilled: {state.invocation.isFullfilled}</small>*/}
                                        <br />
                                    </Stack>
                                </Card.Body>
                                <Card.Footer px={0} py={0}>
                                    <Button
                                        colorScheme='blue'
                                        size='lg'
                                        width='full'
                                        mt={6}
                                    // onClick={() => history.push('/trade/input')}
                                    >
                                        Exit
                                    </Button>
                                </Card.Footer>
                            </Card>
                        </Stack>
                    </Flex>
                </Page>
            </div>
        </Box>

    )
}
