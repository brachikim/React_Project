import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userContext } from '../components/App';
import '../css/Post.css';

function Post() {
  const [post, setPost] = useState([]);
  const [formData, setFormData] = useState({ userId: '', id: '', title: '', body: '' });
  const [showComments, setShowComments] = useState(false);
  const [commentData, setCommentData] = useState({ postId: '', id: '', name: '', email: '', body: '' });
  const [comments, setComments] = useState([]);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const { user } = useContext(userContext);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3000/posts/${params.id}`)
      .then(res => res.json())
      .then(data => setPost(data))
  }, [params.id]);

  //זה מה שגורם לכך שעל המסך יוצגו הפרטים של מי/ה שלחצתי
  useEffect(() => {
    if (post) {
      setFormData({
        userId: user.id,
        id: post.id,
        title: post.title,
        body: post.body
      });
    }
  }, [post]);

  useEffect(() => {
    if (post) {
      fetch(`http://localhost:3000/comments?postId=${params.id}`)
        .then(res => res.json())
        .then(comments => setComments(comments))
        .catch(error => console.error('Error fetching comments:', error));
    }
  }, [params.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleInputCommentChange = (e) => {
    const { name, value } = e.target;
    setCommentData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleDeletePost = () => {
    fetch(`http://localhost:3000/posts/${params.id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          navigate(`/home/users/${user.id}/posts`);
        } else {
          console.error('Error deleting post:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Error deleting post:', error.message);
      });
  };

  const handleUpdatePost = () => {
    fetch(`http://localhost:3000/posts/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...post,
        ...formData,
      }),
    })
      .then(response => {
        if (response.ok) {
          navigate(`/home/users/${user.id}/posts`);
        } else {
          console.error('Error updating post:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Error updating post:', error.message);
      });
  };

  const handleCommentsPost = () => {
    setShowComments(true);
  }

  const handleAddComment = () => {
    fetch('http://localhost:3000/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postId: post.id,
        name: commentData.name,
        email: commentData.email,
        body: commentData.body
      }),
    })
      .then(response => response.json())
      .then(newComment => {
        setComments([...comments, newComment]);
        setCommentData('');
      })
      .catch(error => console.error('Error adding comment:', error));
  }

  const handleUpdateComment = (comment) => {
    setCommentData(comment);
    setUpdateModalOpen(true);
  };

  const handleDeleteComment = (commentId) => {
    fetch(`http://localhost:3000/comments/${commentId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          const updatedComments = comments.filter(comment => comment.id !== commentId);
          setComments(updatedComments);
          setUpdateModalOpen(false);
        } else {
          console.error('Error deleting comment:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Error deleting comment:', error.message);
      });
  };
  

  const handleCancelUpdate = () => {
    setUpdateModalOpen(false);
  };

  const handleSaveUpdate = () => {
    fetch(`http://localhost:3000/comments/${commentData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentData),
    })
      .then(response => {
        if (response.ok) {
          const updatedComments = comments.map(comment => {
            return comment.id === commentData.id ? commentData : comment;
          });
          setComments(updatedComments);
          setUpdateModalOpen(false);
        } else {
          console.error('Error updating comment:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Error updating comment:', error.message);
      });
  };
  
  
  return (
    <>
      {post ? (
        <>
          <div className="post-detail-container">
            <div className="post-detail">
              <label className='post-id'>User id:</label>
              <label className='post-id-data'> {formData.userId}</label>
              <br />
              <label className='post-id'>Id:</label>
              <label className='post-id-data'> {formData.id}</label>
              <br />
              <label className='label-post'>
                Title:
              </label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} />

              <br />
              <label className='label-post'>
                Body:
              </label>
              <textarea name="body" value={formData.body} onChange={handleInputChange} rows={6} cols={51} />

              <br />
              <div className='post-div'>
                <button className='post-button' onClick={handleUpdatePost}>Update</button>
                <button className='post-button' onClick={handleDeletePost}>Delete</button>
              </div>
              <button className='comments-button' onClick={handleCommentsPost}>Comments</button>
            </div>
          </div>
          {showComments && (
            <div className='form-comment' >
              <input className='input-comment' placeholder='Email' type="email" name="email" value={commentData.email} onChange={handleInputCommentChange} />
              <input className='input-comment' placeholder='Name' type="text" name="name" value={commentData.name} onChange={handleInputCommentChange} />
              <textarea name="body" placeholder='Comment' value={commentData.body} onChange={handleInputCommentChange} rows={6} cols={75} />
              <br />
              <button className='button-comment' onClick={handleAddComment}>Send</button>
              <br />
              <div className='comments-section'>
                <ul>
                  {comments.map(comment => (
                    <li key={comment.id} className='comment-container' style={{ border: `1px solid ${comment.email === user.email ? 'rgb(29, 207, 148)' : 'lightgray'}` }}>
                      <div className='comment-header' style={{ backgroundColor: comment.email === user.email ? ' rgb(29, 207, 148)' : 'rgb(127, 205, 179)', alignSelf: comment.email === user.email ? 'flex-end' : 'flex-start' }}>
                        {comment.email}
                      </div>
                      <div className='comment-body'>
                        <strong>{comment.name}</strong>
                        <br />
                        {comment.body}
                      </div>
                      {comment.email === user.email && (
                        <div className='comment-actions'>
                          <button className='comment-action' onClick={() => handleUpdateComment(comment)}>Update</button>
                          <button className='comment-action' onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                        </div>
                      )}
                    </li>



                  ))}

                  {isUpdateModalOpen && (
                    <div className='update-comment-modal'>
                      <div className='modal-content'>
                      <label>Post id: {commentData.postId}</label>
                      <label>Id: {commentData.id}</label>
                        <label>Email: {commentData.email}</label>
                        <br />
                        <label>Name: </label>
                        <input type="text" name="name" value={commentData.name} onChange={handleInputCommentChange} />
                        <br />
                        <label>Body: </label>
                        <textarea
                          name="body"
                          value={commentData.body}
                          onChange={handleInputCommentChange}
                          rows={6}
                          cols={75}
                        />
                        <br />
                        <button className='button-comment' onClick={handleSaveUpdate}>Save Comment</button>
                        <button className='button-comment' onClick={handleCancelUpdate}>Cancel</button>
                      </div>
                    </div>
                  )}
                </ul>
              </div>
            </div>
          )}

        </>
      ) : (
        <h2>Loading...</h2>
      )}
    </>
  )
}

export default Post