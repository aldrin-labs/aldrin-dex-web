import * as React from 'react'
import { createPortal } from 'react-dom'
import { Draggable } from 'react-beautiful-dnd'

interface Props {
  children?: any
  id?: number
}

interface State {}

export default class DragPortal extends React.Component<Props, State> {
  _dragEl: HTMLElement

  constructor(props: Props) {
    super(props)

    this._dragEl = document.getElementById('app-draggable')
  }

  optionalPortal = (styles, element) => {
    if (this._dragEl) {
      return createPortal(element, this._dragEl)
    }
    return element
  }

  render() {
    const { children, id } = this.props

    return (
      <Draggable draggableId={id} index={id}>
        {provided => {
          const {
            draggableProps,
            innerRef,
            dragHandleProps,
            placeholder,
          } = provided

          return (
            <div
              style={{
                width: '500px',
                height: '200px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div
                ref={innerRef}
                style={{
                  ...draggableProps.style,
                  width: '100%',
                  height: '80%',
                  color: '#fff',
                  display: 'flex',
                  margin: 'auto 0',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'darkblue',
                }}
                {...dragHandleProps}
              >
                {children}
              </div>
              {placeholder}
            </div>
          )
        }}
      </Draggable>
    )
  }
}
