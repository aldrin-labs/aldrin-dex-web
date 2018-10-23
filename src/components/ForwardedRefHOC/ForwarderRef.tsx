import React from 'react'

const ForwarderRefHoc = (Component: React.Component) => {
  return React.forwardRef((props, ref) => {
      return <Component {...props} forwardedRef={ref} />
  })
}

export default ForwarderRefHoc;
