import React from 'react'
import _JSXStyle from 'styled-jsx/style';
import { Container } from 'reactstrap';

class ShortCuts extends React.Component {

  render(){
    return(
      <div className="mt-3 ml-3">
        <Container>
            <h5 className="short-cuts-title"><b>Short Cuts:</b></h5>
            <hr className="title-separator"/>
            <dl>
                <dt><b>Arrow keys (&#8679;, &#8681;):</b></dt>
                <dd>Navigate through tasks and subtasks.</dd>
            </dl>
            <dl>
                <dt><b>Enter(&#8626;):</b></dt>
                <dd>Jump to next task or subtask</dd>
            </dl>
            <dl>
                <dt><b>Ctrl + Enter(&#8626;):</b></dt>
                <dd>Add new task or subtask</dd>
            </dl>
            <dl>
                <dt><b>Tab (&#8677;):</b></dt>
                <dd>Turn a task into a subtask of the task placed immediately above it.</dd>
            </dl>
            <dl>
                <dt><b>Shift + Tab (&#8676;):</b></dt>
                <dd>Turn a subtask into a task</dd>
            </dl>
        </Container>
        <style jsx>{`
          .title-separator {
            margin-top: 0px;
            margin-bottom: 10px;
          }
          .short-cuts-title {
            margin-bottom: 3px;
          }
      `}</style>
      </div>
    )
  }
}

export default ShortCuts;
