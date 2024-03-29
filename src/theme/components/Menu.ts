import { mode } from '@chakra-ui/theme-tools'

const parts = ['item', 'command', 'list', 'button', 'groupTitle', 'divider']

function baseStyleList(props: Record<string, any>) {
  return {
    bg: mode(`#fff`, `gray.700`)(props),
    boxShadow: mode(`lg`, `dark-lg`)(props),
    color: 'inherit',
    minW: '3xs',
    py: '2',
    zIndex: 1,
    borderRadius: 'lg',
    borderWidth: '0px'
  }
}

function baseStyleItem(props: Record<string, any>) {
  return {
    py: '0.4rem',
    px: '0.8rem',
    transitionProperty: 'background',
    transitionDuration: 'ultra-fast',
    transitionTimingFunction: 'ease-in',
    _focus: {
      bg: mode(`gray.100`, `whiteAlpha.100`)(props)
    },
    _active: {
      bg: mode(`gray.200`, `whiteAlpha.200`)(props)
    },
    _expanded: {
      bg: mode(`gray.100`, `whiteAlpha.100`)(props)
    },
    _disabled: {
      opacity: 0.4,
      cursor: 'not-allowed'
    }
  }
}

const baseStyleGroupTitle = {
  mx: 4,
  my: 2,
  fontWeight: 'semibold',
  fontSize: 'sm'
}

const baseStyleCommand = {
  opacity: 0.6
}

const baseStyleDivider = {
  border: 0,
  borderBottom: '1px solid',
  borderColor: 'inherit',
  my: '0.5rem',
  opacity: 0.6
}

const baseStyleButton = {
  transitionProperty: 'common',
  transitionDuration: 'normal'
}

const baseStyle = (props: Record<string, any>) => ({
  button: baseStyleButton,
  list: baseStyleList(props),
  item: baseStyleItem(props),
  groupTitle: baseStyleGroupTitle,
  command: baseStyleCommand,
  divider: baseStyleDivider
})

export const MenuStyle = {
  parts,
  baseStyle
}
