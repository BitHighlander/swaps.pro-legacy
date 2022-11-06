import {
    Box, Button, Circle, Flex, HStack, Image, Stack, Text, Tooltip, Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    VStack,
} from "@chakra-ui/react";
import { Invocation as InvocationType } from "@pioneer-platform/pioneer-types";
import { FC } from "react";
import { useHistory } from "react-router-dom";
import { RiRefreshLine } from "react-icons/ri"
import { FaArrowUp, FaCheck } from "react-icons/fa"
import { MdSwapHoriz, MdDeleteForever, MdOpenInNew } from "react-icons/md"
import { useWallet } from "context/WalletProvider/WalletProvider";
import { truncate } from "lodash";
import moment from "moment";


export const Invocation: FC<{ invocation: InvocationType }> = ({ invocation }) => {
    const history = useHistory()
    const { state } = useWallet()

    const openInvocation = function (id?: string) {
        if (!id) return
        history.push(`/status/${id}`)
    }

    const deleteInvocation = async function (id?: string) {
        if (!id) return
        let result = await state.pioneer.deleteInvocation(id)
        console.log("deleting result: ", result)
    }

    console.log(invocation)
    return (
        <Accordion allowMultiple allowToggle alignItems='center' justifyContent='center' w="100%" spacing={8} p={2} pb={invocation.date ? 4 : 2} bgColor={"gray.700"} borderRadius="50px">
            <AccordionItem border="none">
                <AccordionButton p={0} _focus={{ outline: 'none' }}>
                    <VStack>
                        {
                            invocation.date &&
                            <HStack p={2}>
                                <Text>Date: </Text>
                                <Text> {moment(invocation.date).format('MMMM Do YYYY, h:mm:ss a')}</Text>
                            </HStack>
                        }
                        <HStack alignItems='center' justifyContent='center' w="100%" spacing={8}>
                            <Tooltip label={invocation.state}>
                                <Flex alignItems='center' justifyContent='center' p={2} bgColor={invocation.state === "broadcasted" ? "green.400" : "gray.600"} borderRadius="100%">
                                    {invocation.state === "broadcasted" ? <FaCheck size={40} /> : <RiRefreshLine size={40} />}
                                </Flex>
                            </Tooltip>
                            <Tooltip label={invocation.type}>
                                <Flex alignItems='center' justifyContent='center' p={2} bgColor={"gray.600"} borderRadius="100%">
                                    {invocation.type === "sendToAddress" ? <FaArrowUp size={40} /> : <MdSwapHoriz size={40} />}
                                </Flex>
                            </Tooltip>

                            <Tooltip label={invocation.network}>
                                <Flex alignItems='center' justifyContent='center' p={2} bgColor={"gray.600"} borderRadius="100%" height="60px" width="60px">
                                    <Image borderRadius="100%" src={`https://static.coincap.io/assets/icons/${invocation.network.toLowerCase()}@2x.png`} />
                                </Flex>
                            </Tooltip>

                            <Tooltip label="Open Invocation">
                                <Flex alignItems='center' justifyContent='center' p={2} bgColor={"gray.600"} borderRadius="100%" onClick={() => openInvocation(invocation.invocationId)}>
                                    <MdOpenInNew size={40} />
                                </Flex>
                            </Tooltip>

                            <Tooltip label="Delete Invocation">
                                <Flex alignItems='center' justifyContent='center' p={2} bgColor={"red.600"} borderRadius="100%" onClick={() => deleteInvocation(invocation.invocationId)}>
                                    <MdDeleteForever size={40} />
                                </Flex>
                            </Tooltip>
                        </HStack>
                    </VStack>
                </AccordionButton>
                <AccordionPanel pb={4} >
                    <VStack spacing={4} alignItems='left' justifyContent='left'>
                        <HStack>
                            <Text>ID: </Text>
                            <Text> {truncate(invocation.invocationId, { length: 40 })}</Text>
                        </HStack>
                        <HStack>
                            <Text>State: </Text>
                            <Text> {truncate(invocation.state, { length: 40 })}</Text>
                        </HStack>
                        <HStack>
                            <Text>Type: </Text>
                            <Text> {truncate(invocation.type, { length: 40 })}</Text>
                        </HStack>
                        <HStack>
                            <Text>Network: </Text>
                            <Text> {truncate(invocation.network, { length: 40 })}</Text>
                        </HStack>
                        {
                            invocation.date && <HStack>
                                <Text>Date: </Text>
                                <Text> {moment(invocation.date).format('MMMM Do YYYY, h:mm:ss a')}</Text>
                            </HStack>}
                    </VStack>
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    )
}


