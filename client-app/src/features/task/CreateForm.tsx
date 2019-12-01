import React, { useContext, useState, FormEvent, useEffect } from "react";
import TaksStore from "../../app/stores/taskStore";
import { ITask } from "../../app/models/ITask";
import { RouteComponentProps } from "react-router";
import {
  Segment,
  Form,
  Button,
  Dropdown,
  DropdownProps,
  Grid,
} from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";

const CreateForm: React.FC<RouteComponentProps> = ({ history }) => {
  const taskStore = useContext(TaksStore);
  const { createTask, statesForDropdown, newItemOrder, loadStates } = taskStore;

  const [task, setTask] = useState<ITask>({
    id: 0,
    title: "",
    description: "",
    deadline: new Date(),
    stateId: 0,
    order: 0
  });

  const handleFormSubmit = () => {
    task.order = newItemOrder;
    createTask(task).then(() => 
    {
      history.push('/tasks')
      toast.success(`Task named ${task.title.slice(0, 15)}${task.title.length > 15 ? '...': ''} succesfully created`);
    });
  };

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
      console.log(task);
    }
  };

  useEffect(() => {
    loadStates();
  }, [loadStates])

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing style={{ marginTop: "3.5em" }}>
        <Form onSubmit={handleFormSubmit}>
                <Form.Input maxLength="50" required onChange={handleInputChange} name='title' placeholder='Title' value={task.title} />
                <Form.TextArea maxLength="500" required  onChange={handleInputChange} name='description' placeholder='Description' value={task.description}/>
                <DatePicker required  name='deadline' selected={task.deadline || new Date()} onChange={date => dateChange(date)}/>
                <br></br>
                <br></br>
                <Dropdown required placeholder="State" name='stateId' selection options={statesForDropdown} value={task.stateId} onChange={handleDropdownChange}/>
                <Button floated='right' positive type='submit' content='Submit'/>
                <Button onClick={() => {history.push('/tasks')}} floated='right' type='button' content='Cancel'/>
            </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};
export default observer(CreateForm);
