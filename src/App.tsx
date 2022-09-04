import { useWallet } from 'context/WalletProvider/WalletProvider'
import { useModal } from 'hooks/useModal/useModal'
import { useEffect } from 'react'
import { Routes } from 'Routes/Routes'

export const App = () => {
  const { state } = useWallet()
  const { keepkeyPin, webUsbUnsupported } = useModal()

  useEffect(() => {
    if (!state.modal || !state.keepKeyPinRequestType) {
      if (keepkeyPin.isOpen)
        return keepkeyPin.close()
      return
    }
    keepkeyPin.open({})
  }, [state.modal, state.keepKeyPinRequestType, keepkeyPin])
  useEffect(() => {
    if (!navigator.usb) webUsbUnsupported.open({})
  }, [webUsbUnsupported])
  return <Routes />
}
