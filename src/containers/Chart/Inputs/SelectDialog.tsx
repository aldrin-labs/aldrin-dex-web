import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  Input,
  MenuItem,
  FormControl,
  Select,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
})

class DialogSelect extends React.Component {
  state = {
    open: false,
    age: '',
  }

  handleChange = (name) => (event) => {
    this.setState({ [name]: Number(event.target.value) })
  }

  handleClickOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  render() {
    const { classes } = this.props

    return (
      <div>
        <Button onClick={this.handleClickOpen}>Add Currency</Button>
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          open={this.state.open}
          onClose={this.handleClose}
        >
          <DialogTitle>Fill the form</DialogTitle>
          <DialogContent>
            <form className={classes.container}>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="age-native-simple">Age</InputLabel>
                <Select
                  value={this.state.age}
                  onChange={this.handleChange('age')}
                  input={<Input id="CRYPTOCURRENCY" />}
                >
                  <option value="" />
                  <option value={10}>Ten</option>
                  <option value={20}>Twenty</option>
                  <option value={30}>Thirty</option>
                </Select>
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="age-simple">Age</InputLabel>
                <Select
                  value={this.state.age}
                  onChange={this.handleChange('age')}
                  input={<Input id="age-simple" />}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleClose} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default withStyles(styles)(DialogSelect)
