import React, { useContext, useState, FormEvent, useEffect } from 'react'
import { RouteComponentProps } from 'react-router';
import TaskStore from '../../app/stores/taskStore';
import { Grid, Form, Segment, Button } from 'semantic-ui-react';
import { IState } from '../../app/models/IState';
import { toast } from 'react-toastify';

const StateCreateForm : React.FC<RouteComponentProps> = ({history}) => {

    const taskStore = useContext(TaskStore);
    const {createState, stateRegistry, loadStates} = taskStore;

    useEffect(() => {
      console.log("Use effect");
      loadStates().then(() => {
        if(stateRegistry.size >= 4) {
          toast.error('You cant create more states, 4 is the maximum');
          history.push('/tasks')
        }
      })
    }, [loadStates,stateRegistry,history])

    const [state, setState] = useState<IState>({
        stateId: 0,
        name: ''
      });
    
    const handleInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.currentTarget;
        setState({...state, [name]: value});
    }

    const handleSubmit = () => {
        createState(state).then(() =>
        {
          history.push('/tasks');
          toast.success(`State named ${state.name} succesfully created`);
        });
    }
    
    return (
        <Grid>
        <Grid.Column width={10}>
          <Segment clearing style={{marginTop: '3.5em'}}>
            <Form onSubmit={handleSubmit}>
                <Form.Input maxLength="20" onChange={handleInputChange} name='name' placeholder='Title' value={state.name}/>
                <Button floated='right' positive type='submit' content='Submit'/>
                <Button onClick={() => {history.push('/tasks')}} floated='right' type='button' content='Cancel'/>
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    )
}

export default StateCreateForm
