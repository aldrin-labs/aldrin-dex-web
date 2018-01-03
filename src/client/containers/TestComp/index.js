import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
//import query from './TestComp.graphql'

const styles = theme => ({
  root: theme.typography.button,
})

function TestComp(props) {
  return <div className={props.classes.root}>This div looks like a button.</div>
}

TestComp.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(TestComp)
