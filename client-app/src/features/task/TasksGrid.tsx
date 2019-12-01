import React, { useContext, useEffect } from "react";
import {Card, Button, Icon } from "semantic-ui-react";
import TaskCard from "./TaskCard";
import TaskStore from "../../app/stores/taskStore";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";

const Container = styled.div`
  margin-top: 4em;
  display: flex;
`;

const ColumnContainer = styled.div`
    margin: 8px;
    display: inline-block;
    alignItems: 'center',
    justifyContent: 'space-between',
    flex-direction: column;
`;

const TaskList = styled.div`
    margin: 8px;  
    padding: 8px;
    transition: background-color: 0.2s ease;
    flex-grow: 1;
    min-height: 242.55px;
`;

const getColor = (isDragging: Boolean) => {
  if (isDragging) {
    return "skyblue";
  }
  return "white";
};

const TasksGrid: React.FC = () => {
  const taskStore = useContext(TaskStore);
  const {
    stateRegistry,
    tasksByOrder,
    deleteState,
    taskRegistry,
    loadTasks,
    loadStates,
    editTask
  } = taskStore;

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableId) {
      return;
    }
    let task = taskRegistry.get(Number(draggableId));
    if (task) {
      editTask({ ...task, ["stateId"]: Number(destination.droppableId) });
    }
  };

  useEffect(() => {
    loadTasks();
    loadStates();

  }, [loadTasks, loadStates])

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Container>
        {Array.from(stateRegistry.values()).map(state => (
          <ColumnContainer key={state.stateId}>
            <Droppable droppableId={String(state.stateId)}>
              {(provided, snapshot) => (
                <TaskList
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{ backgroundColor: getColor(snapshot.isDraggingOver) }}
                >
                  <Card>
                    <Card.Content>
                      <Card.Header>
                        {state.name}
                        <Button
                          color="red"
                          basic
                          className={"right floated mini"}
                          onClick={() => deleteState(state.stateId)}
                        >
                          Delete
                        </Button>
                      </Card.Header>
                    </Card.Content>
                  </Card>
                  {tasksByOrder
                    .filter(a => a.stateId === state.stateId)
                    .map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  {provided.placeholder}
                </TaskList>
              )}
            </Droppable>
          </ColumnContainer>
        ))}
      </Container>
    </DragDropContext>
  );
};

export default observer(TasksGrid);
