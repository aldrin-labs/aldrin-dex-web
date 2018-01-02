import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { TextField, Button } from 'material-ui'
import styled from 'styled-components'
import Done from 'material-ui-icons/Done'
// import query from './TestComp.graphql'

import HomePage from 'components/pages/HomePage'

const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  menu: {
    width: 200,
  },
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
})

class TextFields extends React.Component {
  state = {
    name: 'Cat in the Hat',
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    })
  }

  render() {
    const { classes } = this.props

    return (
      <form className={classes.container} noValidate autoComplete="off">
        <ColumnWrapper>
          <TextField
            id="name"
            label="Name"
            className={classes.textField}
            value={this.state.name}
            onChange={this.handleChange('name')}
            margin="normal"
          />
          <TextField
            id="password"
            label="Password"
            className={classes.textField}
            type="password"
            autoComplete="current-password"
            margin="normal"
          />
          <Button
            type="submit"
            className={classes.button}
            raised
            color="primary"
          >
            Done
            <Done className={classes.rightIcon} />
          </Button>
        </ColumnWrapper>
      </form>
    )
  }
}

const Login = ({ classes }) => (
  <div>
    <HomePage>
      <TextFields classes={classes} />
    </HomePage>
  </div>
)

Login.propTypes = {
  classes: PropTypes.object.isRequired,
}

TextFields.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Login)
