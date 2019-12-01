import React, { useState, useContext, useEffect } from "react";
import { ITask } from "../../app/models/ITask";
import {
  Segment,
  Button,
  Grid,
  Label,
  Item
} from "semantic-ui-react";
import { RouteComponentProps } from "react-router";
import TaskStore from "../../app/stores/taskStore";
import { observer } from "mobx-react-lite";
import "react-datepicker/dist/react-datepicker.css";
import Moment from "react-moment";
import styled from "styled-components";

interface DetailParams {
  id: string;
}

const DescriptionContainer = styled.div`
word-wrap: break-word
`;

const TaskDetails: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history
}) => {
  const taskStore = useContext(TaskStore);
  const {
    loadTask,
    loadStates,
    stateRegistry
  } = taskStore;

  useEffect(() => {
    if (match.params.id) {
      let id = Number(match.params.id);
      if (isNaN(id)) {
        history.push("/notfound");
      } else {
        loadTask(id).then(task => {
            if(task){
                setTask(task);
                loadStates().then(() => {
                    let state = stateRegistry.get(task.stateId);
                    if(state){
                        setStateName(state.name);
                    }
                })
            }
        })
      }
    }
  }, [loadTask, match.params.id, history]);

  const [stateName, setStateName] = useState<String>("");

  const [task, setTask] = useState<ITask>({
    id: 0,
    title: "",
    description: "",
    deadline: new Date(),
    stateId: 0,
    order: 0
  });


  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing style={{ marginTop: "3.5em", marginLeft:"3em" }}>
          <Item>
            <Item.Content>
                <Item.Header as='h1'>{task.title}</Item.Header>
                <div className="ui divider"></div>
                <Item.Meta as='h2'>Description</Item.Meta>
                <Item.Description>
                    <DescriptionContainer>
                    {task.description}
                    </DescriptionContainer>
                </Item.Description>
                <br></br>
                <div className="ui divider"></div>
                <strong>Deadline: </strong>
                <Moment format="YYYY/MM/DD">{String(task.deadline)}</Moment>
                <br></br>
                <br></br>
                <Label size="huge" color='teal'>
                        {stateName}
                </Label>
            </Item.Content>
        </Item>
            
            <Button
              onClick={() => {
                history.push(`/manageTask/${task.id}`);
              }}
              floated="right"
              positive
              type="submit"
              content="Edit"
            />
            <Button
              onClick={() => {
                history.push("/tasks");
              }}
              floated="right"
              type="button"
              content="Cancel"
            />
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(TaskDetails);
