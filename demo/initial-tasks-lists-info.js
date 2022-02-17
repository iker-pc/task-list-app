import { getRandomId } from './utils/generate-random-id';

const today = new Date();
const millisecondsInADay = 24 * 60 * 60 * 1000;

export const taskListsInfo = [
  {
    id: getRandomId(),
    startDate: new Date(today.getTime() - millisecondsInADay),
    endDate: new Date(today.getTime() +  (6 * millisecondsInADay)),
    tasks: [
      {
        title: "Task example",
        description: "",
        completed: false,
        categories: ["Job", "University"],
      },
      {
        title: "Completed task example",
        description: "",
        completed: true,
        categories: ["Job"],
      },
      {
        title: "Task with associated subtasks example",
        description: "",
        completed: true,
        categories: [],
        subTasks: [
          {
            title: "Uncompleted subtask",
            completed: false,
          },
          {
            title: "Completed subtask",
            completed: true,
          }
        ]
      }
    ]
  },
  {
    id: getRandomId(),
    startDate: new Date(today.getTime() +  (10 * millisecondsInADay)),
    endDate: new Date(today.getTime() +  (13 * millisecondsInADay)),
    tasks: [
      {
        title: "Task example",
        description: "",
        completed: false,
        categories: ["Job", "University"],
      },
      {
        title: "Completed task example",
        description: "",
        completed: true,
        categories: ["Job"],
      },
      {
        title: "Task with associated subtasks example",
        description: "",
        completed: true,
        categories: [],
        subTasks: [
          {
            title: "Uncompleted subtask",
            completed: false,
          },
          {
            title: "Completed subtask",
            completed: true,
          }
        ]
      }
    ]
  },
]
