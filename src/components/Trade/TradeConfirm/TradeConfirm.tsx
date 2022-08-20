import { ArrowBackIcon } from '@chakra-ui/icons'
import { Box, Button, Divider, IconButton, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { Card } from 'components/Card'
import { HelperToolTip } from 'components/HelperTooltip'
import { Row } from 'components/Row'
import { SlideTransition } from 'components/SlideTransition'
import { useFormContext } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import { AssetToAsset } from './AssetToAsset'
import { useWallet, WalletActions } from "context/WalletProvider/WalletProvider";
import { useState } from 'react'


export const TradeConfirm = () => {
  const { buildTransaction, state, dispatch } = useWallet()
  const history = useHistory()

  console.log("state.invocation: ", state.invocation)
  let onSubmit = async function () {
    if (!state.invocation) return
    try {
      console.log("onSubmit")
      //TODO show *Look down at keepkey icon!

      //submit transaction
      // @ts-ignore
      let swapBuilt = await state.pioneer.sign(state.invocation.invocationId)
      console.log("swapBuilt: ", swapBuilt)
      //get txid
      let payload = {
        noBroadcast: false,
        sync: false,
        invocationId: state.invocation.invocationId
      }
      //executeSwap
      // @ts-ignore
      let executionResp = await state.pioneer.broadcast(payload)
      console.log("executionResp: ", executionResp)

      //open invocation!
      history.push(`/trade/status`)
    } catch (e) {
      console.error(e)
    }
  }

  if (!state.invocation) return <div>Loading...</div>


  return (
    <SlideTransition>
      <Card variant='unstyled'>
        <div>
          <h3>Review Transaction:</h3>
        </div>
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

            {/*<Card.Heading textAlign='center'>Confirm Trade</Card.Heading>*/}
            <small>
              <Card.Heading textAlign='center'>invocation: {state.invocation.invocationId}</Card.Heading>
            </small>
          </SimpleGrid>
          <AssetToAsset
            buyAsset={{
              symbol: state.tradeState?.output?.bal?.symbol ?? "",
              amount: state.tradeState?.output?.amount ?? 0,
              icon: state.tradeState?.output?.bal?.image ?? ""
            }}
            sellAsset={{
              symbol: state.tradeState?.input?.bal?.symbol ?? "",
              amount: state.tradeState?.input?.amount ?? 0,
              icon: state.tradeState?.input?.bal?.image ?? ""
            }}
            mt={6}
          />
        </Card.Header>
        <Divider />
        <Card.Body pb={0} px={0}>
          <Stack spacing={4}>
            <Row>
              <Row.Label>status:{state.invocation.state}</Row.Label>
            </Row>
            <Row>
              <Row.Label>type:{state.invocation.invocation.type}</Row.Label>
            </Row>
            <Row>
              <Row.Label>network:{state.invocation.invocation.network}</Row.Label>
            </Row>
            <Row>
              <HelperToolTip label='Hops are how many transactions are needed to complete the swap'>
                <Row.Label>hops: {state.invocation.invocation.tx.swaps.length}</Row.Label>
              </HelperToolTip>
            </Row>
            <Row>
              {state.invocation.invocation.tx.swaps.map((value: any, i: any) => {
                return <>
                  <HelperToolTip label='protocol used to complete the swap'>
                    <Row.Label>swapperId:</Row.Label>
                    <Box textAlign='right'>
                      <Text></Text>
                      <Text color='gray.500'>{value.swapperId}</Text>
                    </Box>
                  </HelperToolTip>
                  {/*<HelperToolTip label='protocol used to complete the swap'>*/}
                  {/*  <Row.Label>time avg:{value.timeStat.avg}</Row.Label>*/}
                  {/*</HelperToolTip>*/}
                  {/*<HelperToolTip label='protocol used to complete the swap'>*/}
                  {/*  <Row.Label>time min:{value.timeStat.min}</Row.Label>*/}
                  {/*</HelperToolTip>*/}
                  {/*<HelperToolTip label='protocol used to complete the swap'>*/}
                  {/*  <Row.Label>time min:{value.timeStat.max}</Row.Label>*/}
                  {/*</HelperToolTip>*/}
                </>
              })}
            </Row>

            <Row>

            </Row>

            {/*{state.invocation.invocation.route.result.swaps.map((swap:any, i:any){*/}
            {/*    <>*/}
            {/*      <HelperToolTip label='protocol used to complete the swap'>*/}
            {/*        <Row.Label>swap:{i}</Row.Label>*/}
            {/*      </HelperToolTip>*/}
            {/*      <HelperToolTip label='protocol used to complete the swap'>*/}
            {/*        <Row.Label>swapperId:{swap.swapperId}</Row.Label>*/}
            {/*      </HelperToolTip>*/}
            {/*    </>*/}
            {/*})}*/}

            {/*<Row>*/}
            {/*  <HelperToolTip label='This is the rate'>*/}
            {/*    <Row.Label>Rate:</Row.Label>*/}
            {/*  </HelperToolTip>*/}
            {/*  <Box textAlign='right'>*/}
            {/*    <Text>1 ETH = 3,557.29 USDC</Text>*/}
            {/*    <Text color='gray.500'>@0x</Text>*/}
            {/*  </Box>*/}
            {/*</Row>*/}

            {/*<Row>*/}
            {/*  <HelperToolTip label='This is the Miner Fee'>*/}
            {/*    <Row.Label>Miner Fee</Row.Label>*/}
            {/*  </HelperToolTip>*/}
            {/*  <Row.Value>$67.77</Row.Value>*/}
            {/*</Row>*/}

            {/*<Row>*/}
            {/*  <HelperToolTip label='This is the Miner Fee'>*/}
            {/*    <Row.Label>Swap Fee</Row.Label>*/}
            {/*  </HelperToolTip>*/}
            {/*  <Row.Value>$0.00</Row.Value>*/}
            {/*</Row>*/}

          </Stack>
        </Card.Body>
        <Card.Footer px={0} py={0}>
          <Button
            colorScheme='blue'
            size='lg'
            width='full'
            mt={6}
            onClick={onSubmit}
          >
            Confirm and Sign Transaction
          </Button>
        </Card.Footer>
      </Card>
    </SlideTransition>
  )
}
