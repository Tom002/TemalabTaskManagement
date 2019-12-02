import React, { useContext, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import TaskStore from "../../app/stores/taskStore";
import { observer } from "mobx-react-lite";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import TaskPriorityCard from "./TaskPriorityCard";

const TaskPriority: React.FC = () => {
  const taskStore = useContext(TaskStore);
  const { tasksByOrder, taskPriorityChange, taskRegistry, loadTasks } = taskStore;

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    let task = taskRegistry.get(Number(draggableId));
    if (task) {
      taskPriorityChange(task, source.index, destination.index);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [loadTasks])

  return (
    <div>
      <Grid style={{ marginTop: "3.5em", marginLeft: "3em" }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Grid.Column width={10}>
            <Droppable droppableId={"priority"}>
              {provided => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {tasksByOrder.map((task, index) => (
                    <TaskPriorityCard key={task.id} item={task} index={index} />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Grid.Column>
        </DragDropContext>
      </Grid>
    </div>
  );
};

export default observer(TaskPriority);
