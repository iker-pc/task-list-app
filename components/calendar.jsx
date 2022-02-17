import React from 'react';

import _JSXStyle from 'styled-jsx/style';
import { connect } from 'react-redux';
import { Container, Row, Col, Button, Jumbotron, Progress } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

/** import server actions **/
import { getTaskList } from '../actions/task-list';

/** import redux actions **/
import { setSelectedTaskListByDate, setTasksLists } from '../redux/actions/tasks-lists-actions';
import { setCalendarDay, setCalendarMonth, setCalendarYear } from '../redux/actions/calendar-actions';

import { monthNamesArray } from './constants/month-names';

class Calendar extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      loadingMonthData: false,
    }
    this.weekDaysLetter = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  }

  async changeMonth(type){
    /**
      TODO: Refactor this code. It works but is fuzzy
    **/
    const { selectedMonth, selectedYear } = this.props
    let tasksListsInfo = [];

    if(type === 'prev'){
      if(selectedMonth === 0){
        tasksListsInfo = await getTaskList(monthNamesArray.length, selectedYear - 1);
        this.props.setCalendarMonth(monthNamesArray.length - 1);
        this.props.setCalendarYear(selectedYear - 1);
      }else{
        tasksListsInfo = await getTaskList(selectedMonth, selectedYear);
        this.props.setCalendarMonth(selectedMonth - 1);
      }
    }else if(type === 'next'){
      if(selectedMonth === monthNamesArray.length - 1){
        tasksListsInfo = await getTaskList(1, selectedYear + 1);
        this.props.setCalendarMonth(0);
        this.props.setCalendarYear(selectedYear + 1);
      }else {
        tasksListsInfo = await getTaskList(selectedMonth + 2, selectedYear);
        this.props.setCalendarMonth(selectedMonth + 1);
      }
    }
    this.props.setTasksLists(tasksListsInfo);
    this.setState({ loadingMonthData: false });
  }

  getDaysInMonth(month, year){
    const nextMonth = (month === 11) ? 0 : month + 1;
    //Day 0 is the last day in the previous month
    return (new Date(year, nextMonth, 0)).getDate();
  }

  getCalendarDaysBySelectedMonth(){
    const { selectedMonth, selectedYear } = this.props;
    const calendarDays = [];
    const weekLength = 7;

    const firstDayInSelectedMonth = new Date(selectedYear, selectedMonth, 1);
    const lastDayInSelectedMonth = new Date(selectedYear, selectedMonth, this.getDaysInMonth(selectedMonth, selectedYear));

    /* javascript getDay function returns 0-6 according to the week day,
      starting in Sunday and finishing in Saturday. Monday is 1
    */

    let auxDate = new Date(firstDayInSelectedMonth.getTime());
    if(firstDayInSelectedMonth.getDay() !== 1){
      for(let i = 0; i < weekLength; i++){
        auxDate.setDate(auxDate.getDate() - 1)
        calendarDays.unshift(new Date(auxDate.getTime()));
        if(auxDate.getDay() === 1) break;
      }
    }

    auxDate = new Date(firstDayInSelectedMonth.getTime());
    for(let i = 0; i < this.getDaysInMonth(selectedMonth, selectedYear) ; i++) {
      calendarDays.push(new Date(auxDate.getTime()));
      auxDate.setDate(auxDate.getDate() + 1);
    }

    auxDate = new Date(lastDayInSelectedMonth.getTime());
    if(lastDayInSelectedMonth.getDay() !== 0){
      for(let i = 0; i < weekLength; i++){
        auxDate.setDate(auxDate.getDate() + 1);
        calendarDays.push(new Date(auxDate.getTime()));
        if(auxDate.getDay() === 0) break;
      }
    }
    return calendarDays;
  }

  async selectTaskListByDate(selectedDate){
    const { selectedMonth, selectedYear } = this.props;

    if(selectedDate.getMonth() === selectedMonth){
      this.props.setSelectedTaskListByDate(selectedDate);
    } else {
      const tasksListsInfo = await getTaskList(selectedDate.getMonth() + 1, selectedDate.getFullYear());
      this.props.setTasksLists(tasksListsInfo);
      this.props.setSelectedTaskListByDate(selectedDate);
    }

    this.props.setCalendarDay(selectedDate.getDate());
    this.props.setCalendarMonth(selectedDate.getMonth());
    this.props.setCalendarYear(selectedDate.getFullYear());

    this.setState({ loadingMonthData: false });

  }

  render(){
    const { selectedDay, selectedMonth, selectedYear, monthTasksLists, selectedTaskList } = this.props;
    const  { loadingMonthData } = this.state;
    const today = new Date();
    const calendarDays = this.getCalendarDaysBySelectedMonth();

    return(
      <div>
        <Container>
          <Row>
            <Col className="col-month-selector" xs={{ size: 12 }}>
              <FontAwesomeIcon
                  className="arrow-prev"
                  icon={faChevronLeft}
                  onClick={ () => { this.setState({
                    loadingMonthData: true,
                  }, () => {
                    this.changeMonth('prev');
                  }) }}/>
              { loadingMonthData
                ? <Progress className="change-month-progress-bar" color="info" animated value={100} />
                : <span>{monthNamesArray[selectedMonth]} &nbsp; {selectedYear}</span>
              }
              <FontAwesomeIcon
                  className="arrow-next"
                  icon={faChevronRight}
                  onClick={() => { this.setState({
                    loadingMonthData: true,
                  }, () => {
                    this.changeMonth('next');
                  }) }}/>
            </Col>
          </Row>
        </Container>
        <div className="row th-aside-calendar-month px-4 mx-1 py-2">
            { this.weekDaysLetter.map((value, index) =>
              <li className="col-auto th-day mb-1" key={`calendar-day-header-day-${index}`}>
                <div className="card th-day-content py-0 mx-4">
                  <div className="text-center py-1 px-2">
                    <span className="text-xs font-weight-bold text-uppercase text-white">{value}</span>
                  </div>
                </div>
              </li>
            )}
            { calendarDays.map((dayDate, index) => {
              const taskListInDay = monthTasksLists.find(taskList => ((new Date(taskList.startDate) <= dayDate) && (dayDate <= new Date(taskList.endDate))));
              const isSelectedDay = (dayDate.getFullYear() === selectedYear
                            && dayDate.getMonth() === selectedMonth
                            && dayDate.getDate() === selectedDay);

              const dayInSelectedTaskList = selectedTaskList && (new Date(selectedTaskList.startDate) <= dayDate && dayDate < new Date(selectedTaskList.endDate));
              return(
                <li className="col-auto mb-1 calendar-day"
                    key={`calendar-${dayDate.getDate()}-${dayDate.getMonth()}-${dayDate.getFullYear()}`}
                    onClick={() => {
                      this.setState({
                        loadingMonthData: true,
                      }, () => {
                        this.selectTaskListByDate(dayDate);
                      }) }}>
                        <div
                          style={{
                            backgroundColor: taskListInDay ? (dayInSelectedTaskList) ? taskListInDay.color : `${taskListInDay.color}50` : '#FFFFFF50',
                            border: isSelectedDay ? '1px solid red' : 'none',
                            boxShadow: isSelectedDay ? '0px 0px 0px 2px red inset' : 'none',
                          }}
                          className="card bg-gray-300 h-100 py-0 mx-4">
                          <div className="card-body py-2 px-2">
                            <div className="row no-gutters align-items-center">
                              <div className="col-auto mr-2 text-center">
                                <div className="h6 mb-0 font-weight-bold text-gray-800">{dayDate.getDate()}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                </li>)
              })
            }

            { (selectedYear !== today.getFullYear() || selectedMonth !== today.getMonth())
              && <Container>
                <Row className="mt-2">
                  <Col xs="12">
                    <Button
                      color="primary"
                      size="sm"
                      block
                      onClick={() => this.selectTaskListByDate(today)}>
                        Go to current day
                    </Button>
                  </Col>
                </Row>
              </Container>
            }
            <style jsx global>{`
                .col-month-selector {
                  text-align: center;
                }
                .th-aside-calendar-month li {
                  width: 14.1%;
                  padding-right: 0.6%!important;
                  padding-left: 0 !important;
                  list-style: none;
                }
                .th-aside-calendar-month li.last {
                  padding-right: 0%!important;
                }
                .th-aside-calendar-month li .card {
                  margin: 0!important;
                }
                .th-aside-calendar-month li .h6 {
                  font-size: 0.8rem;
                }
                .th-day-content {
                  background-color: #d1d3e2;
                  border: none;
                }
                .th-aside-calendar-month li.th-day a, .th-aside-calendar-week li.th-day a {
                  border-bottom: 2px solid currentColor;
                }
                .calendar-day {
                  cursor: pointer;
                }
                .arrow-prev {
                  margin-right: 16px;
                  font-size: '20px';
                  cursor: 'pointer';
                }
                .arrow-next {
                  margin-left: 15px;
                  font-size: '20px';
                  cursor: 'pointer';
                }
                .change-month-progress-bar {
                  display: inline-flex;
                  width: 100px;
                }
          `}</style>

      </div>
    </div>
    )
  }
}

const mapStateToProps = state => ({
    selectedDay: state.calendar.day,
    selectedMonth: state.calendar.month,
    selectedYear: state.calendar.year,
    monthTasksLists: state.tasks.monthTasksLists,
    selectedTaskList: state.tasks.selectedTaskList,
});

const mapDispatchToProps = {
    setCalendarDay: setCalendarDay,
    setCalendarMonth: setCalendarMonth,
    setCalendarYear: setCalendarYear,
    setSelectedTaskListByDate: setSelectedTaskListByDate,
    setTasksLists: setTasksLists
};

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);
