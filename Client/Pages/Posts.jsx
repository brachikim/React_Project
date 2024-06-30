import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { userContext } from '../components/App';
import '../css/Posts.css';

function Posts() {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(userContext);
  const [searchBy, setSearchBy] = useState('id');
  const [searchTerm, setSearchTerm] = useState('');
  const [originalPosts, setOriginalPosts] = useState('');
  const [notFoundShow, setNotFoundShow] = useState(false);
  const [newPostData, setNewPostData] = useState({
    title: '',
    body: ''
  });
  const [showAddPostForm, setShowAddPostForm] = useState(false);

  const params = useParams()

  useEffect(() => {
    fetch(`http://localhost:3000/posts?userId=${params.id}`)
      .then((res) => res.json())
      .then((posts) => {
        setPosts(posts);
        setOriginalPosts(posts);
      })
      .catch((error) => console.error('Error fetching posts:', error));
  }, [params.id]);

  const handleSearchPosts = (category, searchTerm) => {

    const term = searchTerm.toLowerCase();

    if (term !== '') {
      let filteredPosts = originalPosts.filter((post) => {
        switch (category) {
          case 'id':
            return post.id.toString().startsWith(term);
          case 'title':
            return post.title.toLowerCase().startsWith(term);
          default:
            return true;
        }
      });
      if (filteredPosts == '') {
        setNotFoundShow(true);
      }
      else {
        setNotFoundShow(false);
      }
      setPosts(filteredPosts);
    } else {
      setPosts(originalPosts);
    }

  }

  const handleAddPostClick = () => {
    setShowAddPostForm(true);
  };

  const handleSavePost = () => {
    fetch('http://localhost:3000/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId:user.id,
        title: newPostData.title,
        body: newPostData.body
      }),
    })
      .then(response => response.json())
      .then(newPost => {
        setPosts([...posts, newPost]);
        setShowAddPostForm(false);
        setNewPostData('');
      })
      .catch(error => console.error('Error adding post:', error));
  };

  const handleCancelAddPost = () => {
    setShowAddPostForm(false);
    setNewPostData('');
  };

  const handleSearchByChange = (e) => {
    setSearchBy(e.target.value);
    setSearchTerm('');
    handleSearchPosts(e.target.value, searchTerm);
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
    handleSearchPosts(searchBy, e.target.value);
  };

  const handlePostDataChange = (e) => {
    const { name, value } = e.target;
    setNewPostData(prevState => ({ ...prevState, [name]: value }));
};

  const postsElements = posts.map(post => (
    <div key={post.id} className="post-tile">
      <Link to={`/home/users/${user.id}/posts/${post.id}`}>
        <div className="post-info">
          <h3>{post.id}</h3>
          <p>{post.title}</p>
        </div>
      </Link>
    </div>
  ))

  return (
    <div className="post-list-container">
      <h1>Your Posts</h1>
      <label>
        Search by:
        <select value={searchBy} onChange={handleSearchByChange} className='select-category'>
          <option value="id">Id</option>
          <option value="title">Title</option>
        </select>
      </label>
      <input
        type="text"
        placeholder={`Enter search term for ${searchBy}`}
        value={searchTerm}
        onChange={handleSearchTermChange}
        className='input-search'
      />
      <br/>
      <button className='add-button' onClick={handleAddPostClick}>Add Todo</button>
      {showAddPostForm && (
        <div className="add-todo-form">
          <input
            type="text"
            placeholder="Enter Post Title"
            name="title"
            value={newPostData.title}
            onChange={handlePostDataChange}
          />
          <input
            type="text"
            placeholder="Enter Post Body"
            name="body"
            value={newPostData.body}
            onChange={handlePostDataChange}
          />
          <button onClick={handleSavePost}>Save</button>
          <button onClick={handleCancelAddPost}>Cancel</button>
        </div>
      )}
      <div className="post-list">
        {postsElements}
      </div>
      {notFoundShow && (<h2>
        {`${searchBy} ${searchTerm} does not exist`}
      </h2>)}
    </div>
  )
}

export default Posts