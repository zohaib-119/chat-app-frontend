'use client'

function _optionalChain(ops) {
  let lastAccessLHS = undefined
  let value = ops[0]
  let i = 1
  while (i < ops.length) {
    const op = ops[i]
    const fn = ops[i + 1]
    i += 2
    if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) {
      return undefined
    }
    if (op === 'access' || op === 'optionalAccess') {
      lastAccessLHS = value
      value = fn(value)
    } else if (op === 'call' || op === 'optionalCall') {
      value = fn((...args) => value.call(lastAccessLHS, ...args))
      lastAccessLHS = undefined
    }
  }
  return value
}
;

import {
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from '@chakra-ui/react'

export const toaster = createToaster({
  placement: 'bottom-end',
  pauseOnPageIdle: true,
})

// Theme-aware toast styles
const getToastStyles = (type) => {
  const baseStyles = {
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    boxShadow: '0 10px 40px var(--shadow-color)',
    padding: '16px',
    backdropFilter: 'blur(10px)',
  }

  // Type-specific accent colors
  const typeStyles = {
    success: {
      borderLeft: '4px solid var(--success)',
    },
    error: {
      borderLeft: '4px solid var(--error)',
    },
    warning: {
      borderLeft: '4px solid var(--warning)',
    },
    info: {
      borderLeft: '4px solid var(--primary)',
    },
    loading: {
      borderLeft: '4px solid var(--primary)',
    },
  }

  return { ...baseStyles, ...(typeStyles[type] || typeStyles.info) }
}

const titleStyles = {
  color: 'var(--text-primary)',
  fontWeight: '600',
  fontSize: '14px',
}

const descriptionStyles = {
  color: 'var(--text-secondary)',
  fontSize: '13px',
  lineHeight: '1.5',
}

const actionTriggerStyles = {
  backgroundColor: 'var(--primary)',
  color: 'white',
  padding: '6px 12px',
  borderRadius: '6px',
  fontSize: '13px',
  fontWeight: '500',
  cursor: 'pointer',
  border: 'none',
  transition: 'all 0.2s ease',
}

const closeTriggerStyles = {
  color: 'var(--text-muted)',
  cursor: 'pointer',
  padding: '4px',
  borderRadius: '6px',
  transition: 'all 0.2s ease',
}

// Custom indicator styles based on toast type
const getIndicatorColor = (type) => {
  const colors = {
    success: 'var(--success)',
    error: 'var(--error)',
    warning: 'var(--warning)',
    info: 'var(--primary)',
    loading: 'var(--primary)',
  }
  return colors[type] || colors.info
}

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: '4' }}>
        {(toast) => (
          <Toast.Root 
            width={{ md: 'sm' }}
            style={getToastStyles(toast.type)}
          >
            {toast.type === 'loading' ? (
              <Spinner 
                size='sm' 
                style={{ color: 'var(--primary)' }}
              />
            ) : (
              <Toast.Indicator style={{ color: getIndicatorColor(toast.type) }} />
            )}
            <Stack gap='1' flex='1' maxWidth='100%'>
              {toast.title && (
                <Toast.Title style={titleStyles}>
                  {toast.title}
                </Toast.Title>
              )}
              {toast.description && (
                <Toast.Description style={descriptionStyles}>
                  {toast.description}
                </Toast.Description>
              )}
            </Stack>
            {toast.action && (
              <Toast.ActionTrigger style={actionTriggerStyles}>
                {toast.action.label}
              </Toast.ActionTrigger>
            )}
            {_optionalChain([
              toast,
              'access',
              (_) => _.meta,
              'optionalAccess',
              (_2) => _2.closable,
            ]) && <Toast.CloseTrigger style={closeTriggerStyles} />}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  )
}
