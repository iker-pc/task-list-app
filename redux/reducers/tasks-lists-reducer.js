import { SET_TASKS_LISTS, SET_SELECTED_TASK_LIST, MODIFY_TASK_LIST } from '../constants/task-lists';
import { taskLists as initialState } from '../initial-state';

const taskListColors = ['#FF0000', '#FFFF00', '#008000', '#0000FF', '#FF00FF', '#A52A2A'];

const tasksListsReducer = (state = { ...initialState }, action) => {
    const { monthTasksLists } = state;
    switch (action.type) {
        case SET_TASKS_LISTS:
            let colorIndex = 0;
            const taskListsWithColors = action.tasksLists.map((taskList) => {
                colorIndex = (colorIndex < taskListColors.length) ? (colorIndex + 1) : 0;
                return { ...taskList, color: taskListColors[colorIndex]}
            });
            return { ...state, monthTasksLists: taskListsWithColors }

        case SET_SELECTED_TASK_LIST:
            const selectedTaskList = monthTasksLists.find(taskList => ((new Date(taskList.startDate) <= action.selectedDate) && (action.selectedDate <= new Date(taskList.endDate))));
            return { ...state, selectedTaskList }

        case MODIFY_TASK_LIST:
            const newTasksLists = monthTasksLists.map((taskList) => {
              if(action.taskListData.id === taskList.id) return action.taskListData;
              return taskList;
            });
            return {
              ...state,
              selectedTaskList: action.taskListData,
              monthTasksLists: newTasksLists,
            }

        default:
            return state;
    }
};

export default tasksListsReducer;
