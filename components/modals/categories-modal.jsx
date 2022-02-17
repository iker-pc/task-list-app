import React from 'react'
import _JSXStyle from 'styled-jsx/style';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter, CustomInput, Button, InputGroup, InputGroupAddon, Input, Spinner } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

/** import server actions **/
import { updateCategoriesList } from '../../actions/categories';

/** import redux actions **/
import { setCategories } from '../../redux/actions/categories-actions';

class TaskCategoriesModal extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      taskCategories: props.taskCategories || [],
      newCategory: null,
      updatingServer: false,
      categoryNameError: false,
    }
  }

  isCategoryChecked(category){
    const { taskCategories } = this.state;
    return (taskCategories.indexOf(category) > -1);
  }

  addOrRemoveTaskCategory(category){
    const taskCategories = [...this.state.taskCategories];
    const categoryIndex = taskCategories.indexOf(category);
    if(categoryIndex > -1){
      taskCategories.splice(categoryIndex, 1);
    }else{
      taskCategories.push(category);
    }
    this.setState({
      taskCategories
    });
  }

  addUserCategory(newCategory){
      const { categoriesInfo } = this.props;
      if (!categoriesInfo.categories.includes(newCategory)){
          const newUserCategories = [...categoriesInfo.categories, newCategory];
          this.setState({
            newCategory: null,
            updatingServer: true,
          }, () => {
            this.addOrRemoveTaskCategory(newCategory);
            const newCategoriesInfo = { ...categoriesInfo, categories: newUserCategories };
            this.props.updateUserCategories({ ...categoriesInfo, categories: newUserCategories });
            updateCategoriesList(newCategoriesInfo).then(() => this.setState({ updatingServer: false }));
          });

      } else {
        this.setState({ categoryNameError: true });
      }

  }

  setNewCategories(){
    const { taskCategories } = this.state;
    this.props.updateCategories(taskCategories);
    this.props.close();
  }

  modifyNewCategory(e){
    this.setState({
      newCategory: e.target.value,
      categoryNameError: false,
    })
  }

  removeCategory(categoryToRemove){
    const newCategoriesInfo = { ...this.props.categoriesInfo };
    const { updateUserCategories } = this.props;
    newCategoriesInfo.categories = newCategoriesInfo.categories.filter(category => { if(category !== categoryToRemove) return category });
    this.setState({
      updatingServer: true,
    }, () => {
      updateUserCategories(newCategoriesInfo);
      updateCategoriesList(newCategoriesInfo).then(() => this.setState({ updatingServer: false }));
    });
  }

  render(){
    const { isOpen, categoriesInfo } = this.props;
    const { newCategory, updatingServer, categoryNameError } = this.state;
    return (
    <div>
      <Modal isOpen={isOpen}>
        <ModalHeader>Categorias de la tarea { updatingServer && <Spinner size="sm" color="secondary" /> } </ModalHeader>
        <ModalBody>
          { categoriesInfo.categories.map((category, index) => {
            return (
              <div className="user-category-row" key={`user-category-${category}`}>
                <CustomInput
                  type="checkbox"
                  id={`user-category-${category}`}
                  checked={this.isCategoryChecked(category)}
                  onChange={() => this.addOrRemoveTaskCategory(category)}/>
                  { category }
                  <div className="text-danger ml-2 remove-category-button">
                    <FontAwesomeIcon icon={faTimesCircle} style={{ fontSize: '16px' }} onClick={() => this.removeCategory(category)}/>
                  </div>
              </div>
            )
          })}
          <div className="mt-3">
            <InputGroup>
                <Input
                  invalid={categoryNameError}
                  value={newCategory}
                  onChange={(e) => this.modifyNewCategory(e)}
                  placeholder="New category..."/>
                <InputGroupAddon addonType="append">
                  <Button
                    color="primary"
                    size="sm"
                    disabled={!newCategory}
                    onClick={() => this.addUserCategory(newCategory)}>
                      Add category
                  </Button>
                </InputGroupAddon>
            </InputGroup>
            <div
              style={{ visibility: !categoryNameError && 'hidden'}}
              className="category-name-feedback text-danger">
                A category with that name already exists
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" size="sm" onClick={() => this.setNewCategories()}>Confirm</Button>
          <Button color="secondary" size="sm" onClick={() => this.props.close()}>Go back</Button>
        </ModalFooter>
      </Modal>
      <style jsx>{`
        .user-category-row {
          display: -ms-flexbox;
          display: flex;
          -ms-flex-wrap: wrap;
          flex-wrap: wrap;
        }
        .category-name-feedback {
          display: block;
          margin-top: .25rem;
          font-size: 80%;
          font-weight: 400;
        }
        .user-category-row:hover > .remove-category-button {
          visibility: visible;
        }
        .remove-category-button {
          cursor: pointer;
          visibility: hidden;
        }
      `}</style>
    </div>
  );
  }
}

const mapStateToProps = state => ({
    categoriesInfo: state.categoriesInfo,
});

const mapDispatchToProps = {
    updateUserCategories: setCategories,
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskCategoriesModal);
