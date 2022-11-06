import { FC } from 'react'
import { ChevronRightIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { Flex, Text, Image, HStack, FlexProps } from '@chakra-ui/react'
import { shortenAddress } from 'utils/helpers'
import { InitialState, useWallet, WalletActions } from 'context/WalletProvider/WalletProvider'
import {SUPPORTED_WALLETS} from "../../../../context/WalletProvider/config";
import KEEPKEY_ICON from 'assets/png/keepkey.png'

export const KeepKeyButton: FC<FlexProps> = props => {
    const { state, dispatch, setRoutePath } = useWallet()
    const { pioneer, context, walletInfo } = state

    const connectKeepkey = () => {
        dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: true })
    }

    return (
        <Flex
            borderRadius='full'
            bg='whiteAlpha.400'
            justifyContent='space-between'
            p={1}
            color='white'
            alignItems='center'
            _hover={{ cursor: 'pointer', bg: 'whiteAlpha.500' }}
            {...props}
        >
            {state.keepkeyConnected ? (
                <HStack>
                    <Image paddingLeft='10px' maxH={12} maxW={12} src={KEEPKEY_ICON} />
                    <Text fontSize='sm'>{context && shortenAddress(context, 4)}</Text>
                    {/*<ChevronDownIcon h={8} w={8} />*/}
                </HStack>
            ) : (
                <div onClick={connectKeepkey}>
                    <Text fontSize='sm' ml={2}>
                        Connect KeepKey
                    </Text>
                </div>
            )}
        </Flex>
    )
}
