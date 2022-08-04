import { ModalCloseButton } from '@chakra-ui/modal'
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    VStack,
} from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { useModal } from 'hooks/useModal/useModal'
import { Balance } from 'context/WalletProvider/types'
import { FaCheck, FaClipboard } from 'react-icons/fa'

export type ReceiveAssetModalProps = { balance: Balance }

export const ReceiveAssetModal = ({ balance }: ReceiveAssetModalProps) => {
    const initRef = useRef<HTMLInputElement | null>(null)
    const finalRef = useRef<HTMLDivElement | null>(null)

    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (!copied) return
        setTimeout(() => {
            setCopied(false)
        }, 2000)
    }, [copied])

    const {
        receiveAsset: { close, isOpen },
    } = useModal()

    const onClose = () => {
        close()
    }


    if (!balance) return (
        <Modal
            initialFocusRef={initRef}
            finalFocusRef={finalRef}
            isCentered
            closeOnOverlayClick
            closeOnEsc
            isOpen={isOpen}
            onClose={onClose}
        >
            Error
        </Modal>
    )


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
            <ModalContent justifyContent='center' px={3} pt={3} pb={6} overflow='scroll'>
                <ModalHeader textAlign='center'>
                    <h2>Receive {balance.symbol}</h2>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody alignItems='center' justifyContent='center'>
                    <VStack spacing={4}>
                        <Input value={balance.address} placeholder={`Unable to load ${balance.symbol} address`} />
                        {balance.address && <Button
                            disabled={copied}
                            leftIcon={copied ? <FaCheck /> : <FaClipboard />}
                            onClick={(e) => {
                                if (!balance.address) return
                                navigator.clipboard.writeText(balance.address).then(() => {
                                    setCopied(true)
                                });
                            }} colorScheme={copied ? "green" : "blue"}>{copied ? 'Copied!' : 'Copy Address'}</Button>}
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}