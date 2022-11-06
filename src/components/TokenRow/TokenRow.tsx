import {
  Input,
  InputGroup,
  InputGroupProps,
  InputLeftElement,
  InputProps,
  InputRightElement
} from '@chakra-ui/react'
import { useLocaleFormatter } from 'hooks/useLocaleFormatter/useLocaleFormatter'
import { Control, Controller, ControllerProps } from 'react-hook-form'
import NumberFormat from 'react-number-format'
import { Pioneer } from 'hooks/usePioneerSdk/usePioneerSdk'

const CryptoInput = (props: InputProps) => (
  <Input
    pr='4.5rem'
    pl='7.5rem'
    size='lg'
    type='number'
    variant='filled'
    placeholder='Enter amount'
    {...props}
  />
)

type TokenRowProps = {
  control: Control
  fieldName: string
  rules?: ControllerProps['rules']
  inputLeftElement?: React.ReactNode
  inputRightElement?: React.ReactNode
  setValue: React.Dispatch<React.SetStateAction<number>>
  setEnteringAmount?: React.Dispatch<React.SetStateAction<boolean>>
  value: number
  loading: boolean
} & InputGroupProps

export const TokenRow = ({
  control,
  fieldName,
  rules,
  inputLeftElement,
  inputRightElement,
  setValue,
  setEnteringAmount,
  value,
  loading,
  ...rest
}: TokenRowProps) => {
  const {
    number: { localeParts }
  } = useLocaleFormatter({ fiatType: 'USD' })
  const { updateAmountInNative } = Pioneer()
  const onTextChangeNative = (value: any) => {

    //Open Select modal.
    console.log("onTextChangeNative called! (asset input) value: ", value)
    updateAmountInNative(value.value)
    //update Amount In native

  }


  return (
    <InputGroup size='lg' {...rest}>
      {inputLeftElement && (
        <InputLeftElement ml={1} width='auto'>
          {inputLeftElement}
        </InputLeftElement>
      )}
      <Controller
        render={() => (
          <NumberFormat
            disabled={loading}
            inputMode='decimal'
            thousandSeparator={localeParts.group}
            decimalSeparator={localeParts.decimal}
            onFocus={() => setEnteringAmount && setEnteringAmount(true)}
            onBlur={() => setEnteringAmount && setEnteringAmount(false)}
            value={value}
            customInput={CryptoInput}
            onValueChange={onTextChangeNative}
            onChange={(e) => { setValue(Number(e.target.value)) }}
          />
        )}
        name={fieldName}
        control={control}
        rules={rules}
      />
      {inputRightElement && (
        <InputRightElement width='4.5rem'>{inputRightElement}</InputRightElement>
      )}
    </InputGroup>
  )
}
