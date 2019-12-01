import React, { useState, FormEvent, useContext, useEffect } from "react";
import { ITask } from "../../app/models/ITask";
import {
  Segment,
  Form,
  Button,
  Dropdown,
  Grid,
  DropdownProps
} from "semantic-ui-react";
import { RouteComponentProps } from "react-router";
import TaskStore from "../../app/stores/taskStore";
import { observer } from "mobx-react-lite";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

interface DetailParams {
  id: string;
}

const TaskForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history
}) => {
  const taskStore = useContext(TaskStore);
  const {
    loadTask,
    editTask,
    statesForDropdown,
    loadStates
  } = taskStore;

  useEffect(() => {
    if (match.params.id) {
      let id = Number(match.params.id);
      if (isNaN(id)) {
        history.push("/notfound");
      } else {
        loadTask(id).then(task => {
          if (task) {
            setTask(task);
          }
        });
        loadStates();
      }
    }
  }, [loadTask,match.params.id, history]);

  const [task, setTask] = useState<ITask>({
    id: 0,
    title: "",
    description: "",
    deadline: new Date(),
    stateId: 0,
    order: 0
  });

  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setTask({ ...task, [name]: value });
  };

  const handleDropdownChange = (event: any, data: DropdownProps) => {
    console.log(task.stateId);
    if (data.value) {
      setTask({ ...task, ["stateId"]: Number(data.value) });
    }
  };

  const dateChange = (date: Date | null) => {
    if (date) {
      setTask({ ...task, ["deadline"]: date });
    }
  };

  const handleSubmit = () => {
    editTask(task).then(() => 
    {
      history.push(`/viewTask/${task.id}`)
    });
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing style={{ marginTop: "3.5em", marginLeft: "3em"  }}>
          <Form onSubmit={handleSubmit}>
            <Form.Input
              maxLength="50"
              required
              onChange={handleInputChange}
              name="title"
              placeholder="Title"
              value={task.title}
            />
            <Form.TextArea
              required
              maxLength="500"
              onChange={handleInputChange}
              name="description"
              placeholder="Description"
              value={task.description}
            />

            <br></br>

            <DatePicker
              required
              selected={task.deadline || new Date()}
              onChange={date => dateChange(date)}
              name="deadline"
            />
            <br></br>
            <br></br>
            <Dropdown
              required
              placeholder="State"
              selection
              options={statesForDropdown}
              value={task.stateId}
              onChange={handleDropdownChange}
            />
            <Button
              floated="right"
              positive
              type="submit"
              content="Submit"
            />
            <Button
              onClick={() => {
                history.push("/tasks");
              }}
              floated="right"
              type="button"
              content="Cancel"
            />
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(TaskForm);
