import React from 'react';
import Link from 'next/link';
import _JSXStyle from 'styled-jsx/style';
import { connect } from 'react-redux';
import { Container, Row, Col, Button } from 'reactstrap';

/** import auth service **/
import auth0 from '../services/auth0';

/** import required components **/
import withUserInfo from '../components/hoc/with-user-info';

import Header from '../components/header';
import TaskList from '../components/task-list';
import Calendar from '../components/calendar';
import ShortCuts from '../components/shortcuts';
import EmptyTaskList from '../components/empty-task-list';

class TasksLists extends React.Component {

  render(){
    const { authInfo, selectedTaskList } = this.props;
    return(
      <div className="main-page-container">
        <Header authInfo={authInfo} />
        <div className="main-content">
          <div className="calendar-container">
            <Calendar />
            <ShortCuts />
          </div>
          <div className="task-list-container">
            { (!selectedTaskList)
              ? <EmptyTaskList/>
              : <TaskList key={`task-list-${selectedTaskList.id}`}/>
            }
          </div>
        </div>
        <style jsx>{`
          .main-page-container {
            min-width: 1200px;
            height: 100vh;
            overflow-y: hidden;
          }
          .main-content {
            display: flex;
            flex-wrap: wrap;
            height: calc(100% - 72px)
          }
          .calendar-container {
            flex: 0 0 25%;
            max-width: 25%;
            background-color: #DDDFEB;
            padding-top: 1rem;
            height: 100%;
            overflow-y: scroll;
          }
          .task-list-container {
            flex: 0 0 75%;
            max-width: 75%;
            padding-top: 0.5rem;
            height: 100%;
            overflow-y: scroll;
          }
      `}</style>
      </div>
    );
  }
}

const mapStateToProps = state => ({
    selectedTaskList: state.tasks.selectedTaskList,
});

export default connect(mapStateToProps)(withUserInfo(TasksLists));
