import { SET_TASKS_LISTS, SET_SELECTED_TASK_LIST, MODIFY_TASK_LIST } from '../constants/task-lists';

export const setTasksLists = (tasksLists) => ({
   type: SET_TASKS_LISTS,
   tasksLists
});

export const setSelectedTaskListByDate = (selectedDate) => ({
   type: SET_SELECTED_TASK_LIST,
   selectedDate
});

export const modifyTaskList = (taskListData) => ({
  type: MODIFY_TASK_LIST,
  taskListData
})
