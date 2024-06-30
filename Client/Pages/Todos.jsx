import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { userContext } from '../components/App';
import '../css/Todos.css';


function Todos() {
  const { user } = useContext(userContext);
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [showAddTodoForm, setShowAddTodoForm] = useState(false);
  const [orderBy, setOrderBy] = useState('id');
  const [searchBy, setSearchBy] = useState('id');
  const [searchTerm, setSearchTerm] = useState('');
  const [originalTodos, setOriginalTodos] = useState('');
  const params = useParams()

  useEffect(() => {
    fetch(`http://localhost:3000/todos?userId=${params.id}`)
      .then((res) => res.json())
      .then((todos) => {
        setTodos(todos);
        setOriginalTodos(todos);
      })
      .catch((error) => console.error('Error fetching todos:', error));
  }, [params.id]);

  const handleOrderTodos = (category) => {
    let orderedTodos = [...todos]
    switch (category) {
      case 'title':
        orderedTodos.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'completed':
        orderedTodos.sort((a, b) => a.completed - b.completed);
        break;
      case 'random':
        orderedTodos = shuffleArray(orderedTodos);
        break;
      case 'id':
        orderedTodos.sort((a, b) => a.id - b.id);
        break;
      default:
        break;
    }
    setTodos(orderedTodos);
  }

  const handleSearchTodos = (category,searchTerm) => {
    
    const term = searchTerm.toLowerCase();

    if (term !== '') {
      let filteredTodos = originalTodos.filter((todo) => {
        switch (category) {
          case 'id':
            return todo.id.toString().startsWith(term);
          case 'title':
            return todo.title.toLowerCase().startsWith(term);
          case 'completed':
            return (term === 't' && todo.completed) || (term === 'f' && !todo.completed);
          default:
            return true;
        }
      });
      setTodos(filteredTodos);
    } else {
      setTodos(originalTodos);
    }

  }

  const handleAddTodoClick = () => {
    setShowAddTodoForm(true);
  };

  const handleSaveTodo = () => {
    fetch('http://localhost:3000/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,  
        title: newTodoTitle,
        completed: false
       
      }),
    })
      .then(response => response.json())
      .then(newTodo => {
        setTodos([...todos, newTodo]);
        setShowAddTodoForm(false);
        setNewTodoTitle('');
      })
      .catch(error => console.error('Error adding todo:', error));
  };

  const handleCancelAddTodo = () => {
    setShowAddTodoForm(false);
    setNewTodoTitle('');
  };

  const handleOrderChange = (e) => {
    setOrderBy(e.target.value);
    handleOrderTodos(e.target.value);
  };

  const handleSearchByChange = (e) => {
    // setTodos(originalTodos);
    setSearchBy(e.target.value);
    setSearchTerm('');
    handleSearchTodos(e.target.value,searchTerm);
  };

  const handleSearchTermChange = (e) => {
    // if (searchBy === 'id' && !/^\d+$/.test(input)) {
    //   alert('Please enter a valid number for ID.');
    //   return;
    // }

    // if (searchBy === 'completed' && !/^(true|false)$/.test(input.toLowerCase())) {
    //   alert('Please enter true or false for Completed.');
    //   return;
    // }
    setSearchTerm(e.target.value);
    handleSearchTodos(searchBy,e.target.value);
  };

  const tableHeader = (
    <tr>
      <th>ID</th>
      <th>Title</th>
      <th>Completed</th>
    </tr>
  );

  const todoRows = todos.map(todo => (
    <tr key={todo.id}>
      <td className='todo-id'>
        <Link to={`/home/users/${user.id}/todos/${todo.id}`} className='todo-link'>
          {todo.id}
        </Link>
      </td>
      <td className='todo-title'>
        {todo.title}
      </td>
      <td className='todo-completed'>
        <input className="check-box" type="checkbox" checked={todo.completed} readOnly />
      </td>
    </tr>

  ));

  return (
    <div className="todo-list-container">
      <h1>Your Todos</h1>
      <br/>
      <label className='order-by'>
        Order by:
        <select value={orderBy} onChange={handleOrderChange} className='select-category'>
          <option value="id">Id</option>
          <option value="completed">Completed</option>
          <option value="title">Title</option>
          <option value="random">Random</option>
        </select>
      </label>
      <br/>
      <label>
        Search by:
        <select value={searchBy} onChange={handleSearchByChange} className='select-category'>
          <option value="id">Id</option>
          <option value="title">Title</option>
          <option value="completed">Completed</option>
        </select>
      </label>
      <input
        type="text"
        placeholder={searchBy == 'completed' ? `Enter search term for completed  t-checked / f-not checked ` : `Enter search term for ${searchBy}`}
        value={searchTerm}
        onChange={handleSearchTermChange}
        className='input-search'
      />
       <br/>
      <button className='add-button' onClick={handleAddTodoClick}>Add Todo</button>
      <br/>
      {showAddTodoForm && (
        <div className="add-todo-form">
          <input
            type="text"
            placeholder="Enter Todo Title"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
          />
          <button onClick={handleSaveTodo}>Save</button>
          <button onClick={handleCancelAddTodo}>Cancel</button>
        </div>
      )}

      <table className="todo-table">
        <thead>{tableHeader}</thead>
        <tbody>{todoRows}</tbody>
      </table>
    </div>
  );
}

export default Todos;

const shuffleArray = (array) => {
  let currentIndex = array.length;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    const temp = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temp;
  }

  return array;
};