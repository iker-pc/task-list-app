import React from 'react';
import _JSXStyle from 'styled-jsx/style';
import DatePicker from 'reactstrap-date-picker';
import { connect } from 'react-redux';
import { Row, Col, FormGroup, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

/** import server actions **/
import { updateTaskList, deleteTaskList } from '../actions/task-list';

/** import redux actions **/
import { modifyTaskList, setSelectedTaskListByDate, setTasksLists } from '../redux/actions/tasks-lists-actions';
import { setLoadingState } from '../redux/actions/updating-actions';

/** import required components **/
import SelectedDateErrorModal from './modals/selected-date-error';

class TaskListDateRange extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      showSelectedDateError: false
    }
  }

  modifyTaskListDates(value, formattedValue, dateType){
    const selectedTaskList = { ...this.props.selectedTaskList };
    if(dateType === 'from') selectedTaskList.startDate = value;
    if(dateType === 'until') selectedTaskList.endDate = value;
    this.props.setLoadingState(true, {...new Date()})
    updateTaskList(selectedTaskList)
      .then((response) => {
          this.props.setLoadingState(false, new Date());
          this.props.modifyTaskList(selectedTaskList);
      })
      .catch((e) => {
          this.props.setLoadingState(false, new Date());
          this.showSelectedDateRangeErrorModal(true);
      });
  }

  showSelectedDateRangeErrorModal(show){
    this.setState({ showSelectedDateError: show });
  }

  deleteTaskList(){
    const selectedTaskList = { ...this.props.selectedTaskList };
    const { tasksLists, setTasksLists, setSelectedTaskListByDate } = this.props;
    deleteTaskList(selectedTaskList).then(response => {
        const remainingTaskList = tasksLists.filter((taskList) => { if(taskList.id !== selectedTaskList.id) return taskList });
        setTasksLists(remainingTaskList);
        setSelectedTaskListByDate(selectedTaskList.startDate);
    });
  }

  render(){
    const { selectedTaskList } = this.props;
    const { showSelectedDateError } = this.state;
    return(
      <div className="task-list-range-selector">
      <div className="card shadow">
        <Row>
            <Col xs="9">
                <div className="date-range-selector-card-body" style={{ borderLeft: `0.25rem solid ${selectedTaskList.color}` }}>
                  <div className="task-list-index" />
                  <div className="align-items-center ml-3">
                      <div className="text-lg mb-1 date-selector-col">Task list from &nbsp;
                        <FormGroup style={{ marginBottom: 0 }}>
                            <DatePicker
                              id="from-datepicker"
                              value={new Date(selectedTaskList.startDate).toISOString()}
                              size="sm"
                              maxDate={new Date(selectedTaskList.endDate).toISOString()}
                              onChange={(v,f) => this.modifyTaskListDates(v, f, 'from')}
                            />
                        </FormGroup>
                        &nbsp; to &nbsp;
                        <FormGroup style={{ marginBottom: 0 }}>
                            <DatePicker
                              id="until-datepicker"
                              value={new Date(selectedTaskList.endDate).toISOString()}
                              size="sm"
                              minDate={new Date(selectedTaskList.startDate).toISOString()}
                              onChange={(v,f) => this.modifyTaskListDates(v, f, 'until')}
                            />
                        </FormGroup>
                      </div>
                      <div className="task-quantity">{selectedTaskList.tasks.length} tasks</div>
                  </div>
                </div>
            </Col>
            <Col xs="3" style={{ paddingTop: '1.1rem', paddingRight: '1rem' }}>
              <Button color="danger" onClick={() => this.deleteTaskList()}>
              Delete task list &nbsp;
              <FontAwesomeIcon icon={faTrashAlt} />
              </Button>
            </Col>
            <SelectedDateErrorModal
              close={this.showSelectedDateRangeErrorModal.bind(this, false)}
              isOpen={showSelectedDateError}
            />
        </Row>
        </div>
        <style jsx>{`
          .date-selector-col {
            display: inline-flex;
          }
          .category-li {
            margin-bottom: 0.5rem
          }
          .task-list-range-selector {
            margin-bottom: 1rem
          }
          .task-quantity {
            color: #5a5c69;
            font-size: .8rem;
            font-weight: 700;
          }
          .date-range-selector-card-body {
            padding: .8rem;
            padding-left: 2.5rem;
          }
          .task-list-index {
            position: absolute;
            left: 6px;
            bottom: 1px;
            z-index: 5;
          }
      `}</style>
      </div>
    )
  }
}

const mapStateToProps = state => ({
    selectedTaskList: state.tasks.selectedTaskList,
    tasksLists: state.tasks.monthTasksLists,
});

const mapDispatchToProps = {
    modifyTaskList: modifyTaskList,
    setLoadingState: setLoadingState,
    setTasksLists: setTasksLists,
    setSelectedTaskListByDate: setSelectedTaskListByDate,
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskListDateRange);
