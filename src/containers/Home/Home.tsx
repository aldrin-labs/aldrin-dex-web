import * as React from 'react'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggableProvidedDraggableProps,
  DropResult,
} from 'react-beautiful-dnd'

interface Props {}

interface State {
  items: any[]
}

export default class Home extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      items: [
        { id: 'item-0', height: '754px' },
        { id: 'item-1', height: '460px' },
        { id: 'item-2', height: '278px' },
        { id: 'item-3', height: '474px' },
        { id: 'item-4', height: '474px' },
      ],
    }
  }

  reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
  }

  getItemStyle = (
    isDragging: boolean,
    draggableProps: DraggableProvidedDraggableProps
  ) => ({
    userSelect: 'none',
    height: '100%',
    breakInside: 'avoid',

    backgroundColor: isDragging ? 'lightgreen' : 'grey',

    ...draggableProps.style,
  })

  getListStyle = (isDraggingOver: boolean) => ({
    columnCount: 2,
    width: '100%',
  })

  onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }

    const items = this.reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    )

    this.setState({
      items,
    })
  }

  render() {
    return (
      <div style={{ display: 'flex' }}>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={this.getListStyle(snapshot.isDraggingOver)}
              >
                {this.state.items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        style={{
                          width: item.width,
                          height: item.height,
                          margin: '8px',
                        }}
                      >
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={this.getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps
                          )}
                        >
                          {item.id}
                        </div>
                        {provided.placeholder}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    )
  }
}
