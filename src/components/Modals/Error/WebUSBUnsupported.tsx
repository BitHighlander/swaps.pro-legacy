import { ModalCloseButton } from '@chakra-ui/modal'
import {
    HStack,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    VStack,
    Link,
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { useRef } from 'react'
import { useModal } from 'hooks/useModal/useModal'
import { GoAlert } from 'react-icons/go'

export const WebUSBUnsupported = () => {
    const initRef = useRef<HTMLInputElement | null>(null)
    const finalRef = useRef<HTMLDivElement | null>(null)

    const {
        webUsbUnsupported: { close, isOpen },
    } = useModal()

    const onClose = () => {
        close()
    }

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
                    <HStack spacing={4}>
                        <GoAlert color='yellow' size={40} />
                        <h2>Incompatible Browser</h2>
                    </HStack>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody alignItems='center' justifyContent='center'>
                    <VStack spacing={4} alignItems='left' justifyContent='left'>
                        <Text>This browser does not support
                            <Link px={1} isExternal href='https://developer.mozilla.org/en-US/docs/Web/API/WebUSB_API' fontWeight='bold'>
                                WebUSB <ExternalLinkIcon />
                            </Link>
                            which is a crucial library for swaps.pro
                        </Text>
                        <Text>Please switch to a different browser that supports<Link px={1} isExternal href='https://developer.mozilla.org/en-US/docs/Web/API/WebUSB_API' fontWeight='bold'>
                            WebUSB <ExternalLinkIcon />
                        </Link></Text>
                        <Text>We recommend trying<Link px={1} isExternal href='https://www.google.com/chrome/' fontWeight='bold'>
                            Google Chrome <ExternalLinkIcon />
                        </Link></Text>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}