import React from 'react'

const ForwarderRefHoc = (Component: React.Component) => 
    React.forwardRef((props, ref) => 
        <Component {...props} forwardedRef={ref} />
    )


export default ForwarderRefHoc;
