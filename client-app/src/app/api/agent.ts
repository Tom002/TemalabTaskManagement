import axios, { AxiosResponse } from 'axios';
import { ITask } from '../models/ITask';
import { IState } from '../models/IState';
import { toast } from 'react-toastify';
import {history} from '../../index';

//axios.defaults.baseURL = 'https://my-json-server.typicode.com/Tom002/Temalab';

axios.defaults.baseURL = 'http://localhost:52126/api';

axios.interceptors.response.use(undefined, error => {
    const {status} = error.response;
    if(status === 404) {
        history.push('/tasks');
    }
})


const responseBody = (response: AxiosResponse) => response.data;

const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    del: (url: string) => axios.delete(url).then(responseBody)
}

const Tasks = {
    list: (): Promise<ITask[]> => requests.get('/todos'),
    details: (id: number): Promise<ITask> => requests.get(`/todos/${id}`),
    create: (task: ITask): Promise<ITask> => requests.post('/todos', task),
    update: (task: ITask): Promise<void> => requests.put(`/todos/${task.id}`, task),
    delete: (id: number) => requests.del(`/todos/${id}`)
}

const States = {
    list: (): Promise<IState[]> => requests.get('/states'),
    details: (id: number): Promise<IState> => requests.get(`/states/${id}`),
    create: (task: IState): Promise<IState> => requests.post('/states', task),
    delete: (id: number) => requests.del(`/states/${id}`)
}

export default {
    Tasks,
    States
}



