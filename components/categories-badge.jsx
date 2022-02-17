import React from 'react'
import _JSXStyle from 'styled-jsx/style';
import { Badge, UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags } from '@fortawesome/free-solid-svg-icons';

class CategoriesBadge extends React.Component {

  render(){
    const { categories, taskIndex } = this.props;
    if(!categories || categories.length === 0) return null;
    return(
      <div className="categories-badge">
        <Badge id={`task-${taskIndex}-categories`} color="success" pill>{categories.length}&nbsp;
          <FontAwesomeIcon icon={faTags}/>
        </Badge>
        <UncontrolledPopover
          trigger="click"
          placement="bottom"
          target={`task-${taskIndex}-categories`}>
            <PopoverHeader>Categories</PopoverHeader>
            <PopoverBody>
              {categories.map((category) => <p className="category-li">{category}</p>)}
            </PopoverBody>
        </UncontrolledPopover>
        <style jsx>{`
          .categories-badge {
            cursor: pointer;
          }
          .category-li {
            margin-bottom: 0.5rem
          }
      `}</style>
      </div>
    )
  }
}

export default CategoriesBadge;
