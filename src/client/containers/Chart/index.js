import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
//import query from './TestComp.graphql'

import Header from '../../components/organisms/Header'

const styles = theme => ({
  root: theme.typography.button,
})

const Chart = () => (
  <div>
    <Header />
  </div>
)

Chart.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Chart)
