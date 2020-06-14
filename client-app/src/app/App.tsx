import React, { Fragment,  useEffect, useContext } from 'react';
import './App.css';
import NavBar from '../features/nav/NavBar';
import TasksGrid from '../features/task/TasksGrid';
import { Route, Switch } from 'react-router-dom';
import HomePage from '../features/home/HomePage';
import TaskStore from '../app/stores/taskStore';
import CreateForm from '../features/task/CreateForm';
import EditForm from '../features/task/EditForm';
import TaskPriority from '../features/task/TaskPriority';
import StateCreateForm from '../features/state/StateCreateForm';
import NotFound from '../features/NotFound';
import {ToastContainer} from 'react-toastify';
import TaskDetails from '../features/task/TaskDetails';

const App: React.FC = () => {

  return (
    <Fragment>
      <ToastContainer position='bottom-right' />
      <NavBar/>
      <Switch>
        <Route exact path="/" component={HomePage}/>
        <Route 
          exact
          path="/tasks"
          component ={TasksGrid}
        />
        <Route
          path={"/createTask/"}
          component={CreateForm}
        />
        <Route
          path={"/manageTask/:id"}
          component={EditForm}
        />
        <Route
          path={"/viewTask/:id"}
          component={TaskDetails}
        />
        <Route
          path={'/tasks/priority'}
          component={TaskPriority}
        />
        <Route
          path={'/createState'}
          component={StateCreateForm}
        />
        <Route component={NotFound}/>
      </Switch>
    </Fragment>
  );
}

export default App;
