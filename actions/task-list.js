import axiosConfig from './axios-config';
import { DEMO_FLAG_NAME } from '../demo/test-env-name';
import { getRandomId } from '../demo/utils/generate-random-id';
import { taskListsInfo } from '../demo/initial-tasks-lists-info';

const baseMsPath = '/task-list/';
const msCompletePath = `${process.env.ms.tasks.path}${baseMsPath}`;

const taskLists = [];
const findTaskListIndexById = (id) => taskLists.findIndex(taskList => taskList.id === id);

export const getTaskList = (month, year) => {
  if(process.env.APP_ENV === DEMO_FLAG_NAME) return Promise.resolve(taskListsInfo);
  return axiosConfig.get(`${msCompletePath}`, {
    params: {
      month,
      year
    }
  }).then(response => {
    return response.data
  });
}

export const addTaskList = (newTaskListData) => {
  if(process.env.APP_ENV === DEMO_FLAG_NAME) {
    newTaskListData.id = getRandomId();
    return Promise.resolve(taskListsInfo.push(newTaskListData));
  }
  return axiosConfig.post(msCompletePath, newTaskListData).then(response => response.data);
}

export const updateTaskList = (updatedTaskListData) => {
  if(process.env.APP_ENV === DEMO_FLAG_NAME) {
    const taskListIndex = findTaskListIndexById(updatedTaskListData.id);
    taskListsInfo[taskListIndex] = updatedTaskListData;
    return Promise.resolve(taskLists[taskListIndex]);
  }
  return axiosConfig.put(msCompletePath, updatedTaskListData).then(response => response.data);
}

export const deleteTaskList = (taskListToDelete) => {
  if(process.env.APP_ENV === DEMO_FLAG_NAME) {
    const taskListIndex = findTaskListIndexById(taskListToDelete.id);
    taskListsInfo.splice(taskListIndex, 1);
    return Promise.resolve();
  }
  return axiosConfig.delete(msCompletePath, { data: taskListToDelete }).then(response => response.data);
}
