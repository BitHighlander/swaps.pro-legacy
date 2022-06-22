import { ArrowBackIcon } from '@chakra-ui/icons'
import { Box, Button, Divider, IconButton, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { Card } from 'components/Card'
import { HelperToolTip } from 'components/HelperTooltip'
import { Row } from 'components/Row'
import { SlideTransition } from 'components/SlideTransition'
import { useFormContext } from 'react-hook-form'
import { RouterProps } from 'react-router-dom'
import { AssetToAsset } from './AssetToAsset'
import { useWallet, WalletActions } from "context/WalletProvider/WalletProvider";


export const TradeConfirm = ({ history }: RouterProps) => {
  const { getValues } = useFormContext()
  const { sellAsset, buyAsset } = getValues()
  const { buildTransaction, state, dispatch } = useWallet()
  console.log("state.invocation: ",state.invocation)
  let onSubmit = async function(){
    try{
      console.log("onSubmit")
      const currentSellAsset = getValues('sellAsset')
      const currentBuyAsset = getValues('buyAsset')
      console.log("currentSellAsset: ",currentSellAsset)
      console.log("onSubmit: ",currentBuyAsset)

      //submit transaction
      let result = await buildTransaction(currentSellAsset,currentBuyAsset)
      console.log("result:  ",result)
      history.push('/trade/status')
    }catch(e){
      console.error(e)
    }
  }

  return (
    <SlideTransition>
      <Card variant='unstyled'>
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
            <Card.Heading textAlign='center'>invocation: {state.invocation.invocationId}</Card.Heading>
          </SimpleGrid>
          <AssetToAsset
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
          />
        </Card.Header>
        <Divider />
        <Card.Body pb={0} px={0}>
          <Stack spacing={4}>
            <Row>
              <Row.Label>type:{state.invocation.invocation.type}</Row.Label>
            </Row>
            <Row>
              <Row.Label>network:{state.invocation.invocation.network}</Row.Label>
            </Row>
            <Row>
              <HelperToolTip label='Hops are how many transactions are needed to complete the swap'>
              <Row.Label>hops: {state.invocation.invocation.route.result.swaps.length}</Row.Label>
              </HelperToolTip>
            </Row>
            <Row>
              <HelperToolTip label='Hops are how many transactions are needed to complete the swap'>
                <Row.Label>swapperId:{state.invocation.invocation.route.result.swaps[0].swapperId}</Row.Label>
              </HelperToolTip>
            </Row>
            {state.invocation.invocation.route.result.swaps.map((value, i) => {
              return <>
                <HelperToolTip label='protocol used to complete the swap'>
                  <Row.Label>swap:{i}</Row.Label>
                </HelperToolTip>
                <HelperToolTip label='protocol used to complete the swap'>
                  <Row.Label>swapperId:</Row.Label>
                  <Box textAlign='right'>
                    <Text></Text>
                    <Text color='gray.500'>{value.swapperId}</Text>
                  </Box>
                </HelperToolTip>
                <HelperToolTip label='protocol used to complete the swap'>
                  <Row.Label>time avg:{value.timeStat.avg}</Row.Label>
                </HelperToolTip>
                <HelperToolTip label='protocol used to complete the swap'>
                  <Row.Label>time min:{value.timeStat.min}</Row.Label>
                </HelperToolTip>
                <HelperToolTip label='protocol used to complete the swap'>
                  <Row.Label>time min:{value.timeStat.max}</Row.Label>
                </HelperToolTip>
              </>
            })}

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
            <Row>
              <HelperToolTip label='This is the rate'>
                <Row.Label>Rate:</Row.Label>
              </HelperToolTip>
              <Box textAlign='right'>
                <Text>1 ETH = 3,557.29 USDC</Text>
                <Text color='gray.500'>@0x</Text>
              </Box>
            </Row>
            <Row>
              <HelperToolTip label='This is the Miner Fee'>
                <Row.Label>Miner Fee</Row.Label>
              </HelperToolTip>
              <Row.Value>$67.77</Row.Value>
            </Row>
            <Row>
              <HelperToolTip label='This is the Miner Fee'>
                <Row.Label>Swap Fee</Row.Label>
              </HelperToolTip>
              <Row.Value>$0.00</Row.Value>
            </Row>
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
            Confirm and Trade
          </Button>
        </Card.Footer>
      </Card>
    </SlideTransition>
  )
}
