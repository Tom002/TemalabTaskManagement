import React, { useContext } from 'react'
import { Grid } from 'semantic-ui-react'
import TaskStore from '../../app/stores/taskStore';
import { observer } from 'mobx-react-lite';
import {DragDropContext, Droppable, DropResult} from 'react-beautiful-dnd';
import TaskPriorityCard from './TaskPriorityCard';

const TaskPriority: React.FC = () => {

    const taskStore = useContext(TaskStore);
    const {tasksByOrder, taskPriorityChange, taskRegistry} = taskStore;
    
    const onDragEnd = (result: DropResult) => {
        const {destination, source, draggableId} = result;
        if(!destination){
            return;
        }
        if(
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }
        let task = taskRegistry.get(Number(draggableId));
        if(task) {
            taskPriorityChange(task, source.index, destination.index);
        }
    }

    return (
        <div>
            <Grid style={{marginTop: '4em', marginLeft: '2em'}}>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Grid.Column width={10}>
                        <Droppable droppableId={"priority"}>
                        {
                            provided => (
                                <div
                                    ref = {provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    
                                    {tasksByOrder.map((task,index) => <TaskPriorityCard key={task.id} item={task} index={index}/>)}
                                    {provided.placeholder}
                                </div>
                            )
                        }
                        </Droppable>
                    </Grid.Column>
                </DragDropContext>
            </Grid>
        </div>
    )
}

export default observer(TaskPriority)
