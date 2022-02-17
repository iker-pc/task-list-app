import React from 'react'
import { connect } from 'react-redux';
import { Container, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListAlt } from '@fortawesome/free-solid-svg-icons';

/** import server actions **/
import { getTaskList, addTaskList } from '../actions/task-list';

/** import redux actions **/
import { setSelectedTaskListByDate, setTasksLists } from '../redux/actions/tasks-lists-actions';
import { setLoadingState } from '../redux/actions/updating-actions';

import { monthNamesArray } from './constants/month-names';

class EmptyTaskList extends React.Component {

  constructor(props) {
    super(props);
  }

  createFirstList(){
    const { selectedDay, selectedMonth, selectedYear } = this.props;
    const selectedDate = new Date(selectedYear, selectedMonth, selectedDay);
    const emptyTaskList = {
      startDate: selectedDate,
      endDate: selectedDate,
      tasks: [],
    }
    this.props.setLoadingState(true, {...new Date()})
    addTaskList(emptyTaskList)
      .then((taskListData) => {
          const { startDate } = emptyTaskList;
          getTaskList(startDate.getMonth() + 1, startDate.getFullYear()).then(response => {
            this.props.setTasksLists(response);
            this.props.setSelectedTaskListByDate(startDate);
            this.props.setLoadingState(false, new Date());
          });
      })
      .catch((e) => {
          //handle error
      });
  }

  render(){
    const { selectedDay, selectedMonth, selectedYear } = this.props;
    return(
      <div className="mt-5">
          <Container>
            <div className="text-center">
              <FontAwesomeIcon icon={faListAlt} style={{ fontSize: '60px' }}/>
              <p className="mt-3">You don't have any task list yet for {selectedDay} {monthNamesArray[selectedMonth]} {selectedYear}</p>
              <Button color="primary" className="mt-4" onClick={() => this.createFirstList()}>¡Start a task list now!</Button>
            </div>
          </Container>
      </div>
    )
  }
}

const mapStateToProps = state => ({
    updatingDataLoading: state.misc.loading,
    updatingDataDate: state.misc.lastUpdatedDate,
    selectedDay: state.calendar.day,
    selectedMonth: state.calendar.month,
    selectedYear: state.calendar.year,
});

const mapDispatchToProps = {
  setSelectedTaskListByDate: setSelectedTaskListByDate,
  setTasksLists: setTasksLists,
  setLoadingState: setLoadingState,
};

export default connect(mapStateToProps, mapDispatchToProps)(EmptyTaskList);
