import React, { Component } from 'react'
import Autosuggest from 'react-autosuggest'
import { DebounceInput } from 'react-debounce-input'

import { theme } from './theme'
import { Props, State, Suggestion } from './types'

export default class AutoSuggestion extends Component<Props, State> {
  constructor() {
    super()

    this.state = {
      list: [
        {
          name: 'C',
          value: 1972,
        },
        {
          name: 'Elm',
          value: 2012,
        },
        {
          name: 'Elma',
          value: 2012,
        },
        {
          name: 'Eelma',
          value: 2012,
        },
        {
          name: 'Eelmaa',
          value: 2012,
        },
        {
          name: 'Eelmaaa',
          value: 2012,
        },
        {
          name: 'Eelmaaaa',
          value: 2012,
        },
        {
          name: 'Eelmaaaaa',
          value: 2012,
        },
        {
          name: 'Eelmaaaaaa',
          value: 2012,
        },
      ],
      value: '',
      suggestions: [],
    }
  }

  // https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
  escapeRegexCharacters(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  // Teach Autosuggest how to calculate suggestions for any given input value.
  getSuggestions(value: string) {
    const escapedValue = this.escapeRegexCharacters(value.trim())

    if (escapedValue === '') {
      return []
    }

    const inputValue = value.trim().toLowerCase()
    const inputLength = inputValue.length

    return inputLength === 0
      ? []
      : this.state.list
          .filter(
            (lang) =>
              lang.name.toLowerCase().slice(0, inputLength) === inputValue
          )
          .slice(0, 5)
  }

  // When suggestion is clicked, Autosuggest needs to populate the input
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.
  getSuggestionValue(suggestion: Suggestion) {
    return suggestion.name
  }

  renderSuggestion(suggestion: Suggestion) {
    return (
      <div>
        {suggestion.name} - {suggestion.value}{' '}
      </div>
    )
  }

  renderInputComponent(inputProps) {
    return (
      <div>
        <DebounceInput {...inputProps} minLength={2} debounceTimeout={300} />
      </div>
    )
  }

  onChange = (event, { newValue }: { newValue: string }) => {
    this.setState({
      value: newValue,
    })
  }

  // Autosuggest will call this function every time you need to update suggestions.
  onSuggestionsFetchRequested = ({ value }: { value: string }) => {
    this.setState({
      suggestions: this.getSuggestions(value),
    })
  }

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    })
  }

  render() {
    const { value, suggestions } = this.state

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: this.props.placeholder,
      value,
      onChange: this.onChange,
    }

    return (
      <Autosuggest
        theme={theme}
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        renderInputComponent={this.renderInputComponent}
        inputProps={inputProps}
      />
    )
  }
}
