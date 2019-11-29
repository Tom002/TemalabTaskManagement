import React from "react";
import { ITask } from "../../app/models/ITask";
import { Card } from "semantic-ui-react";
import { observer } from "mobx-react";
import { Draggable } from "react-beautiful-dnd";
import Moment from "react-moment";

interface IProps {
  key: number;
  index: number;
  item: ITask;
}

const TaskPriorityCard: React.FC<IProps> = ({ item, key, index }) => {
  return (
    <Draggable draggableId={String(item.id)} index={index}>
      {provided => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Card>
            <Card.Content>
              {
                <a className={"right floated ui blue circular label big"}>
                  {item.order}
                </a>
              }
              <Card.Header>{item.title}</Card.Header>
              <Card.Meta>
                <Moment format="YYYY/MM/DD">{String(item.deadline)}</Moment>
              </Card.Meta>
              <Card.Description>{item.description}</Card.Description>
            </Card.Content>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default observer(TaskPriorityCard);
