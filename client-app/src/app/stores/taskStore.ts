import { observable, configure, action, runInAction, computed } from "mobx";
import { ITask } from "../models/ITask";
import agent from "../api/agent";
import { IState } from "../models/IState";
import { SyntheticEvent } from "react";
import { isUndefined } from "util";
import { createContext } from "react";
import { DropdownItemProps } from "semantic-ui-react";
import { toast } from "react-toastify";

configure({ enforceActions: "always" });

class TaskStore {
  @observable taskRegistry = new Map<number, ITask>();
  @observable stateRegistry = new Map<number, IState>();

  @computed get tasksByOrder() {
    return Array.from(this.taskRegistry.values()).sort((a, b) =>
      a.order > b.order ? 1 : b.order > a.order ? -1 : 0
    );
  }

  @computed get statesForDropdown(): DropdownItemProps[] {
    return Array.from(this.stateRegistry.values()).map(a => ({
      key: a.stateId,
      text: a.name,
      value: a.stateId
    }));
  }

  @computed get newItemOrder() {
    let orders = Array.from(this.taskRegistry.values()).map(a => a.order);
    return Math.max(...orders) + 1;
  }

  @action taskPriorityChange = (
    movedItem: ITask,
    oldIndex: number,
    newIndex: number
  ) => {
    this.taskRegistry.set(movedItem.id, {
      ...movedItem,
      ["order"]: newIndex + 1
    });
    let updateItem: ITask | undefined = this.taskRegistry.get(movedItem.id);
    if (updateItem) {
      this.editTask(updateItem);
    }
    if (oldIndex > newIndex) {
      for (const task of this.taskRegistry.values()) {
        if (
          task.order - 1 >= newIndex &&
          task.order - 1 < oldIndex &&
          task.id !== movedItem.id
        ) {
          this.taskRegistry.set(task.id, {
            ...task,
            ["order"]: task.order + 1
          });
        }
      }
    } else if (newIndex > oldIndex) {
      for (const task of this.taskRegistry.values()) {
        if (
          task.order - 1 <= newIndex &&
          task.order - 1 > oldIndex &&
          task.id !== movedItem.id
        ) {
          this.taskRegistry.set(task.id, {
            ...task,
            ["order"]: task.order - 1
          });
        }
      }
    }
  };

  @action loadTasks = async () => {
    console.log("Load tasks");
    try {
      const tasks = await agent.Tasks.list();
      runInAction("loading tasks", () => {
        tasks.forEach(task => {
          this.taskRegistry.set(task.id, task);
        });
      });
    } catch (error) {
      runInAction("loading tasks error", () => {
        console.log(error);
      });
    }
  };

  @action loadStates = async () => {
    console.log("Load states");
    try {
      const states = await agent.States.list();
      runInAction("loading states", () => {
        states.forEach(state => {
          this.stateRegistry.set(state.stateId, state);
        });
      });
    } catch (error) {
      runInAction("loading states error", () => {
        console.log(error);
      });
    }
  };

  @action createState = async (state: IState) => {
    try {
      let response: IState = await agent.States.create(state);
      let createdId = response.stateId;
      runInAction("creating state", () => {
        state.stateId = createdId;
        this.stateRegistry.set(createdId, state);
        toast.success(`State name ${state.name} created succesfuly`);
      });
    } catch (error) {
      runInAction("creating task error", () => {
        console.log(error);
        toast.error("Problem creating state");
      });
    }
  };

  @action deleteState = async (stateId: number) => {
    try {
      await agent.States.delete(stateId);
      let tasksWithState = Array.from(this.taskRegistry.values()).filter(
        a => a.stateId === stateId
      );
      for (const task of tasksWithState) {
        this.taskRegistry.delete(task.id);
      }
      runInAction("deleting status", () => {
        this.stateRegistry.delete(stateId);
      });
      toast.warn(`State successfuly deleted`);
    } catch (error) {
      runInAction("deleting state error", () => {
        console.log(error);
        toast.error("Problem deleting state");
      });
    }
  };

  @action createTask = async (task: ITask) => {
    try {
      let created: ITask = await agent.Tasks.create(task);
      let createdId = created.id;
      runInAction("creating task", () => {
        task.id = createdId;
        task.order = created.order;
        this.taskRegistry.set(createdId, task);
        toast.success(`Task named ${task.title} created successfuly`);
      });
    } catch (error) {
      runInAction("creating task error", () => {
        console.log(error);
        toast.error("Problem creating task");
      });
    }
  };

  @action editTask = async (task: ITask) => {
    try {
      let response = await agent.Tasks.update(task);
      let updatedTask = task;
      runInAction("edit task", () => {
        this.taskRegistry.set(updatedTask.id, updatedTask);
        toast.info("Task edit successful");
      });
    } catch (error) {
      runInAction("edit task error", () => {
        console.log(error);
        toast.error("Problem editing task");
      });
    }
  };

  @action deleteTask = async (id: number) => {
    try {
      let taskToDelete = this.taskRegistry.get(id);
      if (!isUndefined(taskToDelete)) {
        await agent.Tasks.delete(id);
        runInAction("delete task", () => {
          this.taskRegistry.delete(id);
          let keys: number[] = Array.from(this.taskRegistry.keys());
          for (let key of keys) {
            let element = this.taskRegistry.get(key);
            if (element && element.order > taskToDelete!.order) {
              element.order--;
              this.taskRegistry.set(key, element);
            }
          }
        });
        toast.warn(`Task deleted successfuly`);
      }
    } catch (error) {
        runInAction("error deleting task", () => {
            toast.error("error deleting task");
        })
    }
  };

  @action loadTask = async (id: number) => {
    console.log("Load task");
    let task: ITask | undefined = this.taskRegistry.get(id);
    console.log("Task from registry");
    console.log(task);
    if (task) {
      task.deadline = new Date(task.deadline);
      return task;
    } else {
      console.log("Task from was undef");
      try {
        task = await agent.Tasks.details(id);
        if (task) {
          task.deadline = new Date(task.deadline);
          return task;
        }
      } catch (error) {
        runInAction("error getting single task", () => {
          toast.error("Problem loading task");
        });
      }
    }
  };
}

export default createContext(new TaskStore());
