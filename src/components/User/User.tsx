
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { useWallet, WalletActions } from "../../context/WalletProvider/WalletProvider";
import { Card } from "../Card";
import {
    Box,
    Button,
    Divider,
    Flex,
    IconButton,
    SimpleGrid,
    Spinner,
    Stack,
    TabPanel,
    TabPanels,
    Tabs, Text, VStack
} from "@chakra-ui/react";
import { Link, useHistory } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { AssetToAsset } from "../Trade/TradeStatus/AssetToAsset";
import { Page } from "../Layout/Page";
import { HelperToolTip } from "../HelperTooltip";
import { Row } from "../Row";
import { Invocation } from './Invocation';

export const User = () => {
    const { username, state, dispatch, updateInvocation, setRoutePath } = useWallet()
    console.log("pioneer.username: ", username)
    const deleteInvocation = async function (invocationId: any) {
        console.log("deleting invocation: ", invocationId)
        let result = await state.pioneer.deleteInvocation(invocationId)
        console.log("deleting result: ", result)
    }

    if (state.pioneer) {
        console.log("pioneer.username: ", state.pioneer)
        console.log("pioneer.username: ", state.pioneer.username)
        return (
            <div>
                <Card variant='unstyled'>
                    <Card.Header px={0} pt={0}>
                        <SimpleGrid alignItems='center' mx={-2}>
                            <Card.Heading textAlign='center'>Username: {state.pioneer.username}<small></small></Card.Heading>
                        </SimpleGrid>
                    </Card.Header>
                    <Divider />
                    {/*<Card.Body pb={0} px={0}>*/}
                    {/*    <Stack spacing={4}>*/}
                    {/*        <br />*/}
                    {/*        <small>queryKey: {state.pioneer.queryKey}</small>*/}
                    {/*        <small>context: {state.pioneer.context}</small>*/}
                    {/*        <br />*/}
                    {/*    </Stack>*/}
                    {/*</Card.Body>*/}
                    {/*<Card.Body pb={0} px={0}>*/}
                    {/*    <Stack spacing={4}>*/}
                    {/*        <br />*/}
                    {/*        <small>blockchains: {state.pioneer.blockchains.toString()}</small>*/}
                    {/*        <br />*/}
                    {/*    </Stack>*/}
                    {/*</Card.Body>*/}
                    <Card.Body pb={0} px={0}>
                        <Stack align="center" spacing={4}>
                            <br />
                            {/*<small>invocations: {state.pioneer.invocations.length}</small>*/}
                            <h4>Your Transactions</h4>
                            <br />
                        </Stack>
                        <VStack spacing={2}>
                            {state.pioneer.invocations.sort((a: any, b: any) => Number(b.date) - Number(a.date)).map((invocation: any) => <Invocation invocation={invocation} />)}
                        </VStack>


                    </Card.Body>
                    {/*<Card.Body pb={0} px={0}>*/}
                    {/*    <Stack spacing={4}>*/}
                    {/*        <br />*/}
                    {/*        <small>pubkeys: {state.pioneer.pubkeys.toString()}</small>*/}
                    {/*        <br />*/}
                    {/*    </Stack>*/}
                    {/*</Card.Body>*/}

                    {/*<Card.Body pb={0} px={0}>*/}
                    {/*    <Stack spacing={4}>*/}
                    {/*        <br />*/}
                    {/*        <small>inputs: {state.pioneer.availableInputs.toString()}</small>*/}
                    {/*        <br />*/}
                    {/*    </Stack>*/}
                    {/*</Card.Body>*/}
                    {/*<Card.Body pb={0} px={0}>*/}
                    {/*    <Stack spacing={4}>*/}
                    {/*        <br />*/}
                    {/*        <small>outputs: {state.pioneer.availableOutputs.toString()}</small>*/}
                    {/*        <br />*/}
                    {/*    </Stack>*/}
                    {/*</Card.Body>*/}
                    <Card.Body pb={0} px={0}>
                        {/*<Stack spacing={4}>*/}
                        {/*    <br />*/}
                        {/*    <small>wallets: {state.pioneer.wallets.toString()}</small>*/}
                        {/*    <br />*/}
                        {/*</Stack>*/}
                    </Card.Body>
                    <Card.Footer px={0} py={0}>
                        {/*<Button*/}
                        {/*    colorScheme='blue'*/}
                        {/*    size='lg'*/}
                        {/*    mt={6}*/}
                        {/*// onClick={() => history.push('/trade/input')}*/}
                        {/*>*/}

                        {/*</Button>*/}
                    </Card.Footer>
                </Card>
            </div>
        )
    } else {
        return (
            <Box d='flex' width='full' justifyContent='center' alignItems='center'>
                <div>
                    <Page>
                        <Flex maxWidth={{ base: 'auto', '2xl': '1464px' }} mx='auto' px={16}>
                            <Stack flex={1} spacing={4} justifyContent='center' alignItems='center'>
                                <Card maxW="460px" mx="auto" flex={1} justifyContent='center' alignItems='center'>
                                    <Tabs isFitted variant='soft-rounded' defaultIndex={0}>
                                        <TabPanels>
                                            <TabPanel>
                                                loading user...
                                                <Spinner
                                                    thickness="4px"
                                                    speed="0.65s"
                                                    emptyColor="gray.200"
                                                    color="blue.500"
                                                    size="xl"
                                                />
                                            </TabPanel>
                                        </TabPanels>
                                    </Tabs>
                                </Card>
                            </Stack>
                        </Flex>
                    </Page>
                </div>
            </Box>
        )
    }

}
