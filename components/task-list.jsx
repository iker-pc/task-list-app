import React from 'react';
import _JSXStyle from 'styled-jsx/style';
import { connect } from 'react-redux';
import { Input, CustomInput, Button, Jumbotron } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmile, faTimes } from '@fortawesome/free-solid-svg-icons';

/** import server actions **/
import { updateTaskList } from '../actions/task-list';

/** import redux actions **/
import { setLoadingState } from '../redux/actions/updating-actions';
import { modifyTaskList } from '../redux/actions/tasks-lists-actions';

/** import required components **/
import TaskListDateRange from './task-list-date-range';
import CategoriesBadge from './categories-badge';
import TaskActions from './task-actions';

class TaskList extends React.Component {

  constructor(props){
    super(props);
    this.newTaskStructure = {
      title: '',
      description: '',
      completed: false,
    };
    this.newSubTaskDataStructure = {
      title: '',
      completed: false,
    };
    this._updateTaskList = null;
    this._resizeTextAreas = this.resizeTextAreas.bind(this);
  }

  componentDidMount(){
    this.resizeTextAreas();
    window.addEventListener('resize', this._resizeTextAreas);
  }

  componentWillUnmount(){
    window.removeEventListener('resize', this._resizeTextAreas);
  }

  resizeTextAreas(){
    const textAreas = document.getElementsByTagName('textarea');
    Array.from(textAreas).forEach(function (elem) {
      this.resizeTextAreaHeight(elem);
    }, this);
  }

  resizeTextAreaHeight(elem){
    elem.style.height = "";
    elem.style.height = elem.scrollHeight + "px";
  }

  liveUpdateTaskList(newTaskListData){
    if(this._updateTaskList) clearTimeout(this._updateTaskList);
    this.props.setLoadingState(true, {...new Date()});
    this.props.modifyTaskList(newTaskListData);
    this._updateTaskList = setTimeout(() =>  {
      updateTaskList(newTaskListData).then((result) => {
        this.props.setLoadingState(false, new Date());
      });
    }, 500);
    return Promise.resolve();
  }


  // TASK Actions: add, modify, check/uncheck, delete, add category, make sub-task //

  async addTask(e, newTaskIndex){
    e.preventDefault();
    const newTaskListData = { ...this.props.selectedTaskList };
    newTaskListData.tasks.splice(newTaskIndex, 0, {...this.newTaskStructure} );
    await this.liveUpdateTaskList(newTaskListData);
    document.getElementById(`task-${newTaskIndex}-content-editable`).focus();
  }

  async modifiyTaskStatement(e, taskIndex){
    const newStatement = e.target.value;
    const newTaskListData = {...this.props.selectedTaskList};
    newTaskListData.tasks.forEach((task, index) => {
      if(taskIndex === index) task.title = newStatement;
    });
    await this.liveUpdateTaskList(newTaskListData);
  }

  async modifiyTaskState(taskIndex){
    const newTaskListData = {...this.props.selectedTaskList};
    newTaskListData.tasks.forEach((task, index) => {
      if(taskIndex === index) task.completed = !task.completed;
    });
    if(Array.isArray(newTaskListData.tasks[taskIndex].subTasks)){
      for(let i = 0; i < newTaskListData.tasks[taskIndex].subTasks.length; i++){
        newTaskListData.tasks[taskIndex].subTasks[i].completed = newTaskListData.tasks[taskIndex].completed;
      }
    }
    await this.liveUpdateTaskList(newTaskListData);
  }

  async deleteTask(taskIndex){
      const newTaskListData = {...this.props.selectedTaskList};
      newTaskListData.tasks.splice(taskIndex, 1);
      await this.liveUpdateTaskList(newTaskListData);
  }

  async modifyTaskCategories(taskIndex, newCategories){
      const newTaskListData = {...this.props.selectedTaskList};
      newTaskListData.tasks.forEach((task, index) => {
        if(taskIndex === index) task.categories = newCategories;
      });
      await this.liveUpdateTaskList(newTaskListData);
  }

  async makeSubTask(taskIndex){
    const newTaskListData = {...this.props.selectedTaskList};
    const prevTaskIndex = (taskIndex - 1);
    if(Array.isArray(newTaskListData.tasks[prevTaskIndex].subTasks)){
      newTaskListData.tasks[prevTaskIndex].subTasks.push(
        {
          title: newTaskListData.tasks[taskIndex].title,
          completed: newTaskListData.tasks[taskIndex].completed
        }
      );
    } else {
      newTaskListData.tasks[prevTaskIndex].subTasks = [
        {
          title: newTaskListData.tasks[taskIndex].title,
          completed: newTaskListData.tasks[taskIndex].completed
        }
      ];
    }
    newTaskListData.tasks.splice(taskIndex, 1);
    await this.liveUpdateTaskList(newTaskListData);
    const subTasksLength = newTaskListData.tasks[prevTaskIndex].subTasks.length;
    document.getElementById(`task-${prevTaskIndex}-sub-task-${subTasksLength - 1}-content-editable`).focus();
  }

  //////////////////////////////////////////////////////////////////////////////




  /////////// SUB-TASKS Actions: add, modify, check/uncheck, delete ////////////

  async addSubTask(e, taskIndex, newSubTaskIndex){
    e.preventDefault();
    const newTaskListData = {...this.props.selectedTaskList};
    newTaskListData.tasks[taskIndex].subTasks.splice(newSubTaskIndex, 0, {...this.newSubTaskDataStructure});
    await this.liveUpdateTaskList(newTaskListData);
    document.getElementById(`task-${taskIndex}-sub-task-${newSubTaskIndex}-content-editable`).focus();
  }

  async modifySubTaskStatement(e, taskIndex, subTaskIndex) {
    const newStatement = e.target.value;
    const newTaskListData = {...this.props.selectedTaskList};
    if(Array.isArray(newTaskListData.tasks[taskIndex]['subTasks'])){
      newTaskListData.tasks[taskIndex]['subTasks'][subTaskIndex].title = newStatement;
    }
    await this.liveUpdateTaskList(newTaskListData);
  }

  async modifySubTaskState(taskIndex, subTaskIndex) {
    const newTaskListData = {...this.props.selectedTaskList};
    newTaskListData.tasks.forEach((task, i) => {
      if(taskIndex === i){
        if(Array.isArray(task.subTasks)){
          const subTasksData = [...task.subTasks];
          let completedSubTasks = 0;
          const updatedSubTasksData = subTasksData.map((subTask, j) => {
            if(subTaskIndex === j) {
              if(!subTask.completed) completedSubTasks++;
              return { ...subTask, completed: !subTask.completed }
            } else {
              if(subTask.completed) completedSubTasks++;
              return subTask;
            }
          })
          task.subTasks = updatedSubTasksData;
          task.completed = (updatedSubTasksData.length === completedSubTasks);
        }
      }
    });
    await this.liveUpdateTaskList(newTaskListData);
  }

  async deleteSubTask(taskIndex, subTaskIndex) {
    const newTaskListData = {...this.props.selectedTaskList};
    newTaskListData.tasks[taskIndex].subTasks.splice(subTaskIndex, 1);
    await this.liveUpdateTaskList(newTaskListData);
  }

  async makeTask(taskIndex, subTaskIndex) {
    const newTaskListData = {...this.props.selectedTaskList};
    const newTaskIndex = taskIndex + 1;
    newTaskListData.tasks.splice(newTaskIndex, 0, newTaskListData.tasks[taskIndex].subTasks[subTaskIndex]);
    newTaskListData.tasks[taskIndex].subTasks.splice(subTaskIndex, 1);
    await this.liveUpdateTaskList(newTaskListData);
    document.getElementById(`task-${newTaskIndex}-content-editable`).focus();
  }

  //////////////////////////////////////////////////////////////////////////////
  setCursorPosition(elem, pos){
    if(pos > 0){
      elem.focus();
      elem.selectionStart = pos;
      elem.selectionEnd = pos;
    }else{
      elem.focus();
    }
  }
  //////////////////////////////////////////////////////////////////////////////

  keyEvents = (e, taskIndex, type, subTaskIndex) => {

    const keyCode = e.keyCode || e.which;

    /* If user press "enter" key the cursor must be moved from the selected task/sub-tasks
    to the next task/sub-task (If it exists) */
    if((!e.ctrlKey && keyCode === 13) || e.keyCode === 40){
        e.preventDefault();
        const nextSubTaskIndex = (type === 'task') ? 0 : (type === 'sub-task') && (subTaskIndex + 1);
        const nextSubTask = document.getElementById(`task-${taskIndex}-sub-task-${nextSubTaskIndex}-content-editable`);
        if(nextSubTask) {
          this.setCursorPosition(nextSubTask, nextSubTask.value.length);
        } else {
          const newTaskIndex = taskIndex + 1;
          const nextTask = document.getElementById(`task-${newTaskIndex}-content-editable`);
          if(nextTask) this.setCursorPosition(nextTask, nextTask.value.length);
        }
    }

    /* If user press "ctrl + enter":
        1 - If cursor is placed in a task, a new must be created below it.
        2 - If cursor is placed in a sub-task, a new sub-task must be created below it.
     */
    if(e.ctrlKey && keyCode === 13){
      e.preventDefault();
      if(type === 'task') this.addTask(e, taskIndex + 1);
      if(type === 'sub-task') this.addSubTask(e, taskIndex, subTaskIndex + 1);

    }

    /* If user presses arrow keys it must be navigate through next/previous
    task/sub-task */
    if(keyCode === 38) {
      e.preventDefault();
      if(type === 'task') {
          const previousTaskIndex = taskIndex - 1;
          const previousTask = document.getElementById(`task-${previousTaskIndex}-content-editable`);
          if(previousTask) {
            const subTasksFromPreviousTask = previousTask.parentElement.parentElement.parentElement.querySelectorAll('textarea:last-child');
            if(subTasksFromPreviousTask.length > 0) {
                const lastSubTaskFromPreviousTask = subTasksFromPreviousTask[subTasksFromPreviousTask.length - 1];
                this.setCursorPosition(lastSubTaskFromPreviousTask, lastSubTaskFromPreviousTask.value.length);
            } else {
                this.setCursorPosition(previousTask, previousTask.value.length);
            }
          }
      }
      if(type === 'sub-task') {
          const previousSubTaskIndex = subTaskIndex - 1;
          const previousSubTask = document.getElementById(`task-${taskIndex}-sub-task-${previousSubTaskIndex}-content-editable`);
          if(previousSubTask) {
            this.setCursorPosition(previousSubTask, previousSubTask.value.length);
          } else {
            const actualTask = document.getElementById(`task-${taskIndex}-content-editable`);
            if(actualTask) this.setCursorPosition(actualTask, actualTask.value.length);
          }
      }
    }

    //If user press "delete" key and the task statement is empty
    if(keyCode === 8 && e.target.value === ''){
      e.preventDefault();
      if(type === 'task') {
        const previousTaskIndex = taskIndex - 1;
        const previousTask = document.getElementById(`task-${previousTaskIndex}-content-editable`);
        if(previousTask) {
            const subTasksFromPreviousTask = previousTask.parentElement.parentElement.parentElement.querySelectorAll('textarea:last-child');
            if(subTasksFromPreviousTask.length > 0) {
                const lastSubTaskFromPreviousTask = subTasksFromPreviousTask[subTasksFromPreviousTask.length - 1];
                this.setCursorPosition(lastSubTaskFromPreviousTask, lastSubTaskFromPreviousTask.value.length);
            } else {
                this.setCursorPosition(previousTask, previousTask.value.length);
            }
        }
        this.deleteTask(taskIndex);
      }
      if(type === 'sub-task') {
        const previousSubTaskIndex = subTaskIndex - 1;
        if(previousSubTaskIndex < 0){
          const actualTask = document.getElementById(`task-${taskIndex}-content-editable`);
          this.setCursorPosition(actualTask, actualTask.value.length);
        } else {
          const previousSubTask = document.getElementById(`task-${taskIndex}-sub-task-${previousSubTaskIndex}-content-editable`);
          this.setCursorPosition(previousSubTask, previousSubTask.value.length);
        }
        this.deleteSubTask(taskIndex, subTaskIndex);
      }
    }

    // If user presses "shift + tab" when cursor is in a sub-task, it will be transformed
    // in a task
    if(e.shiftKey && keyCode === 9 && type === 'sub-task') {
      e.preventDefault();
      this.makeTask(taskIndex, subTaskIndex);
    }

    // If user presses "tab" when cursor is in a task, it will be transformed to sub-task
    if(!e.shiftKey && keyCode === 9 && type === 'task'){
      e.preventDefault();
      if(taskIndex > 0) this.makeSubTask(taskIndex);
    }

  }

  render(){
    const { selectedTaskList } = this.props;
    return(
      <div className="selected-task-list-container">
        <TaskListDateRange />
        { selectedTaskList.tasks.length > 0
          ? <div>
            { selectedTaskList.tasks.map((task, index) => {
                return (
                  <div className="task-container">
                    <div
                      className="task-row"
                      key={`tasklist-${selectedTaskList.id}-task-${index}`}>
                      <div className="task-col-check">
                        <CustomInput
                          type="checkbox"
                          id={`tasklist-${selectedTaskList.id}-task-${index}`}
                          checked={task.title === '' ? false : task.completed}
                          disabled={task.title === ''}
                          onChange={() => this.modifiyTaskState(index)}/>
                      </div>
                      <div className="task-col-textarea">
                          <Input type="textarea"
                            id={`task-${index}-content-editable`}
                            className="task-textarea"
                            rows="1"
                            style={{ resize: "none", overflow: "hidden" }}
                            data-task-input={`task-${index}-input`}
                            onChange={(e) => this.modifiyTaskStatement(e, index)}
                            onKeyDown={(e) => this.keyEvents(e, index, 'task')}
                            onKeyUp={(e) => this.resizeTextAreaHeight(e.target)}
                            value={task.title} />
                      </div>
                      <div className="task-col-tags">
                          <CategoriesBadge categories={task.categories} taskIndex={index}/>
                      </div>
                      <div className="task-col-actions">
                        <TaskActions
                          taskCategories={task.categories}
                          taskIndex={index}
                          deleteTask={this.deleteTask.bind(this)}
                          updateTaskCategories={this.modifyTaskCategories.bind(this)} />
                      </div>
                    </div>
                    { (task.subTasks)
                        && task.subTasks.map((subTask, subTaskIndex) => {
                          return(
                            <div
                              className="sub-task-row"
                              key={`tasklist-${selectedTaskList.id}-sub-task-${subTaskIndex}`}>
                              <div className="sub-task-col-check">
                                &#8212;&#8211;
                                <CustomInput
                                  type="checkbox"
                                  id={`tasklist-task-${index}-sub-task-${subTaskIndex}`}
                                  checked={subTask.title === '' ? false : subTask.completed}
                                  disabled={subTask.title === ''}
                                  onChange={(e) => this.modifySubTaskState(index, subTaskIndex)}/>
                              </div>
                              <div className="sub-task-col-textarea">
                                  <Input type="textarea"
                                    id={`task-${index}-sub-task-${subTaskIndex}-content-editable`}
                                    className="task-textarea"
                                    rows="1"
                                    style={{ resize: "none", overflow: "hidden" }}
                                    data-task-input={`task-${index}-sub-task-${subTaskIndex}-input`}
                                    onChange={(e) => this.modifySubTaskStatement(e, index, subTaskIndex)}
                                    onKeyDown={(e) => this.keyEvents(e, index, 'sub-task', subTaskIndex)}
                                    onKeyUp={(e) => this.resizeTextAreaHeight(e.target)}
                                    value={subTask.title} />
                              </div>
                              <div className="sub-task-col-actions">
                                <FontAwesomeIcon icon={faTimes} style={{ fontSize: '16px' }} onClick={() => this.deleteSubTask(index, subTaskIndex)}/>
                              </div>
                            </div>
                          )
                        })
                      }
                      <hr className="task-container-separator"/>
                  </div>
                  )
              }
            )}
            <p className="add-new-task">
              <a href="#" onClick={e => this.addTask(e, selectedTaskList.tasks.length)}>Add task...</a>
            </p>
          </div>
          : <Jumbotron align="center" fluid>
              <h3>There is no task in this list</h3>
              <p><FontAwesomeIcon icon={faSmile} style={{ fontSize: '50px' }}/></p>
              <Button onClick={e => this.addTask(e, 0)} color="primary" size="sm">Start right now!</Button>
          </Jumbotron>
        }
        <style jsx global>{`
          .selected-task-list-container {
            margin: 20px;
          }
          .task-container {
            margin-top: 0.5rem;
          }
          .task-container:first-of-type {
            margin-top: 1.5rem;
          }
          .task-row {
            display: flex;
            -ms-flex-wrap: wrap;
            flex-wrap: wrap;
          }
          .task-row:hover, .sub-task-row:hover {
            background-color: #eaecf4;
          }
          .task-row:hover > .task-col-actions {
            visibility: visible;
            position: relative;
            right: 0rem;
          }
          .task-col-check {
            width: 2.5%;
          }
          .task-col-textarea {
            width: 87%;
            position: relative;
          }
          .task-textarea {
            background-color: transparent;
            border: none;
            padding: 0px 5px;
          }
          .task-textarea:focus {
            background-color: transparent;
          }
          .task-col-tags {
            width: 8%;
            text-align: end;
          }
          .task-col-actions {
            width: 2%;
            visibility: hidden;
            cursor: pointer;
          }
          .sub-task-row {
            display: -ms-flexbox;
            display: flex;
            -ms-flex-wrap: wrap;
            flex-wrap: wrap;
          }
          .sub-task-row:hover > .sub-task-col-actions {
            visibility: visible;
            position: relative;
            right: 0rem;
          }
          .sub-task-col-check {
            margin-left: 7px;
            width: 5%;
            display: inline-flex;
            border-left: 1px solid black;
          }
          .sub-task-col-textarea {
            width: 85%;
            padding-left: 4px;
          }
          .sub-task-col-actions{
            width: 5%;
            text-align: right;
            padding-right: 1%;
            visibility: hidden;
            cursor: pointer;
            align-items: flex-end;
          }
          .task-container .sub-task-row:last-of-type {
            margin-bottom: 1rem;
          }
          .task-container .sub-task-row:nth-child(2) {
            padding-top: 4px;
          }
          .task-container .sub-task-row:last-of-type .sub-task-col-check {
            border-image: linear-gradient(to bottom, black 0px, black 13px, transparent 13px);
            border-image-slice: 1
          }
          .task-container-separator{
            margin-top: 6px;
            margin-bottom: 0rem !important;
          }
          .add-new-task {
            margin-top: 0.8rem;
            margin-left: 1rem;
            margin-bottom: 4rem;
          }
      `}</style>
      </div>
    )
  }
}

const mapStateToProps = state => ({
    selectedTaskList: state.tasks.selectedTaskList,
});

const mapDispatchToProps = {
    setLoadingState: setLoadingState,
    modifyTaskList: modifyTaskList
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);
