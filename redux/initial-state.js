const taskLists = {
  monthTasksLists: [],
  selectedTaskList: {},
}

const categories = {
  id: null,
  userId: null,
  categories: [],
}

const calendar = {
  day: (new Date()).getDate(),
  month: (new Date()).getMonth(),
  year: (new Date()).getFullYear()
}

const updating = {
  loading: false,
  lastUpdatedDate: null
}

export {
  taskLists,
  categories,
  calendar,
  updating,
}
