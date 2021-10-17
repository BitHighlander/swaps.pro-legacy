import {ModalBody, ModalHeader, Stack, Button, Image, useClipboard} from '@chakra-ui/react'
import { RawText } from 'components/Text'
import { useWallet } from 'context/WalletProvider/WalletProvider'
import React, {useEffect} from 'react'

export const Send = ({ }: any) => {
    const { state } = useWallet()
    const { code } = state

    useEffect(() => {
        console.log("code: ",code)
    }, [code])

    return (
        <>
            <ModalHeader>Send Monies</ModalHeader>
            <ModalBody>
                hi
            </ModalBody>
        </>
    )
}
