import React from 'react'

import { Progress } from 'semantic-ui-react'

const ProgressBar = ({uploadState,percentUploaded}) => (
 
 
 uploadState ==='uploadimg' &&   (
<Progress
className="progress__bar"
percent={percentUploaded}
progress
indicating
size="medium"
inverted
styles={{
    margin:'0.3rem 0 0 0 !important'
}}
/>
    
    )
)

export default ProgressBar
