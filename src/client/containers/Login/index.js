import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { TextField, Button } from 'material-ui'
import styled from 'styled-components'
import Done from 'material-ui-icons/Done'
// import LoginForm from './Login'
// import query from './TestComp.graphql'

import HomePage from 'components/pages/HomePage'

const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const styles = theme => ({
  root: {
    alignSelf: 'center',
    alignItems: 'center',
  },
  container: {
    display: 'flex',
    alignSelf: 'center',
    flexWrap: 'wrap',
    marginTop: '20%',
    marginLeft: '40%',
  },
  textField: {
    marginTop: '20px',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 250,
  },
  menu: {
    width: 250,
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
    name: '',
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    })
  }

  render() {
    const { classes } = this.props

    return (
      <div className={classes.place}>
        <form className={classes.container} noValidate autoComplete="off">
          <ColumnWrapper>
            <TextField
              id="email"
              label="E-Mail"
              className={classes.textField}
              value={this.state.mail}
              onChange={this.handleChange('email')}
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
              Login
              <Done className={classes.rightIcon} />
            </Button>
          </ColumnWrapper>
        </form>
      </div>
    )
  }
}

const Login = ({ classes }) => (
  <div>
    <HomePage>
      <TextFields classes={classes} />
      {/* <LoginForm></LoginForm> */}
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
