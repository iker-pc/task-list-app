import React from 'react';
import _JSXStyle from 'styled-jsx/style';
import { Popover, PopoverHeader, PopoverBody, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

/** import required components **/
import TaskCategoriesModal from './modals/categories-modal';

class TaskActions extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      categoriesModal: false,
      actionPopoverOpen: false
    }
  }

  togglePopover(){
    this.setState({
      actionPopoverOpen: !this.state.actionPopoverOpen
    })
  }

  showCategoriesModal(show){
    this.setState({
      categoriesModal: show,
      actionPopoverOpen: false
     })
  }

  updateCategories(newCategories){
    const { taskIndex } = this.props;
    this.props.updateTaskCategories(taskIndex, newCategories);
  }

  render(){
    const { taskIndex, taskCategories, deleteTask } = this.props;
    const { categoriesModal, actionPopoverOpen } = this.state;
    return(
      <div className="task-actions text-right">
        <FontAwesomeIcon icon={faEllipsisV} id={`task-${taskIndex}-actions`} onClick={() => this.togglePopover()}/>
        <Popover
          trigger="click"
          placement="bottom"
          target={`task-${taskIndex}-actions`}
          isOpen={actionPopoverOpen}>
            <PopoverHeader>Actions</PopoverHeader>
            <PopoverBody>
              <Button color="primary" size="sm" block onClick={() => this.showCategoriesModal(true)}>Add category</Button>
              <Button color="primary" size="sm" block onClick={() => { this.togglePopover(); deleteTask(taskIndex); }}>Delete task</Button>
            </PopoverBody>
        </Popover>
        <TaskCategoriesModal
          close={this.showCategoriesModal.bind(this, false)}
          isOpen={categoriesModal}
          taskCategories={taskCategories}
          updateCategories={this.updateCategories.bind(this)}/>
        <style jsx>{`
          .task-actions {
            cursor: pointer;
          }
      `}</style>
      </div>
    )
  }
}

export default TaskActions;
