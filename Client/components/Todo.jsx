import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userContext } from '../components/App';
import '../css/Todo.css';

function Todo() {
    const [todo, setTodo] = useState(null);
    const [formData, setFormData] = useState({ id: '', title: '', completed: false, userId: '' });
    const { user } = useContext(userContext);
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:3000/todos/${params.id}`)
            .then(res => res.json())
            .then(data => setTodo(data))
    }, [params.id]);

//זה מה שגורם לכך שעל המסך יוצגו הפרטים של מי/ה שלחצתי
    useEffect(() => {
        if (todo) {
            setFormData({
                id: todo.id,
                title: todo.title,
                completed: todo.completed
            });
        }
    }, [todo]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const inputValue = type === 'checkbox' ? checked : value;

        setFormData(prevState => ({ ...prevState, [name]: inputValue }));
    };

    const handleDeleteTodo = () => {
        fetch(`http://localhost:3000/todos/${params.id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    navigate(`/home/users/${user.id}/todos`);
                } else {
                    console.error('Error deleting todo:', response.statusText);
                }
            })
            .catch(error => {
                console.error('Error deleting todo:', error.message);
            });
    };

    const handleUpdateTodo = () => {
        fetch(`http://localhost:3000/todos/${params.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...todo,  
                ...formData, 
            }),
        })
            .then(response => {
                if (response.ok) {
                    navigate(`/home/users/${user.id}/todos`);
                } else {
                    console.error('Error updating todo:', response.statusText);
                }
            })
            .catch(error => {
                console.error('Error updating todo:', error.message);
            });
    };
    

    return (
        <div className="todo-detail-container">
            {todo ? (
                <div className="todo-detail">
                    <label>
                        Id:
                        <input type="text" name="id" value={formData.id} onChange={handleInputChange} readOnly />
                    </label>
                    <br />
                    <label>
                        Title:
                        <input type="text" name="title" value={formData.title} onChange={handleInputChange} />
                    </label>
                    <br />
                    <label className="todo-label">
                        Completed:
                        <input className="todo-checkbox" type="checkbox" name="completed" checked={formData.completed} onChange={handleInputChange} />
                    </label>
                    <button onClick={handleUpdateTodo}>Update</button>
                    <button onClick={handleDeleteTodo}>Delete</button>
                </div>
            ) : (
                <h2>Loading...</h2>
            )}
        </div>
    );
}

export default Todo;
