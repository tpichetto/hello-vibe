import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

const initialColumns = {
  todo: {
    id: 'todo',
    title: 'To Do',
    tasks: [
      { id: 'task-1', content: 'Design the app' },
      { id: 'task-2', content: 'Set up React project' },
    ]
  },
  inProgress: {
    id: 'inProgress',
    title: 'In Progress',
    tasks: [
      { id: 'task-3', content: 'Build components' },
    ]
  },
  done: {
    id: 'done',
    title: 'Done',
    tasks: [
      { id: 'task-4', content: 'Initialize repo' },
    ]
  }
}

function App() {
  const [columns, setColumns] = useState(initialColumns)
  const [columnOrder, setColumnOrder] = useState(['todo', 'inProgress', 'done'])

  const onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result

    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    if (type === 'column') {
      const newColumnOrder = [...columnOrder]
      newColumnOrder.splice(source.index, 1)
      newColumnOrder.splice(destination.index, 0, draggableId)
      setColumnOrder(newColumnOrder)
      return
    }

    const start = columns[source.droppableId]
    const finish = columns[destination.droppableId]

    if (start === finish) {
      const newTasks = [...start.tasks]
      newTasks.splice(source.index, 1)
      newTasks.splice(destination.index, 0, start.tasks[source.index])

      const newColumn = {
        ...start,
        tasks: newTasks
      }

      setColumns({
        ...columns,
        [newColumn.id]: newColumn
      })
    } else {
      const startTasks = [...start.tasks]
      const [removed] = startTasks.splice(source.index, 1)
      const finishTasks = [...finish.tasks]
      finishTasks.splice(destination.index, 0, removed)

      setColumns({
        ...columns,
        [start.id]: { ...start, tasks: startTasks },
        [finish.id]: { ...finish, tasks: finishTasks }
      })
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Vibe Kanban</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={styles.board}>
          {columnOrder.map((columnId, index) => {
            const column = columns[columnId]
            const tasks = column.tasks

            return (
              <div key={column.id} style={styles.column}>
                <h3 style={styles.columnTitle}>{column.title}</h3>
                <Droppable droppableId={column.id} type="task">
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{
                        ...styles.taskList,
                        backgroundColor: snapshot.isDraggingOver ? '#e8e8e8' : '#f0f0f0',
                      }}
                    >
                      {tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...styles.task,
                                ...(snapshot.isDragging ? styles.taskDragging : {}),
                              }}
                            >
                              {task.content}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            )
          })}
        </div>
      </DragDropContext>
    </div>
  )
}

const styles = {
  container: {
    padding: '20px',
  },
  header: {
    color: 'white',
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  },
  board: {
    display: 'flex',
    gap: '20px',
    overflowX: 'auto',
    padding: '10px',
  },
  column: {
    minWidth: '280px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  columnTitle: {
    marginBottom: '16px',
    color: '#333',
    fontSize: '1.2rem',
    fontWeight: '600',
  },
  taskList: {
    minHeight: '100px',
    padding: '8px',
    borderRadius: '8px',
    transition: 'background-color 0.2s',
  },
  task: {
    padding: '12px',
    margin: '8px 0',
    backgroundColor: 'white',
    borderRadius: '6px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    cursor: 'grab',
    fontSize: '0.95rem',
    transition: 'all 0.2s',
  },
  taskDragging: {
    transform: 'rotate(3deg)',
    boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
    opacity: 0.9,
  },
}

export default App
