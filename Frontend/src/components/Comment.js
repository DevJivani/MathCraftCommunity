import React from 'react';
import ProfilePhoto from './ProfilePhoto';
import './Comment.css'; 

const Comment = ({ username, content, createdAt, userProfilePhoto }) => {
  return (
    <div className="comment-card">
      <div className="comment-header">
        <ProfilePhoto 
          profilePhoto={userProfilePhoto}
          alt={`${username}'s profile`}
          className="comment-profile-photo"
          size="small"
          showInitials={true}
          userName={username}
        />
        <div className="comment-meta">
          <p className="comment-author">By: {username}</p>
          <p className="comment-date">Posted on: {new Date(createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <p className="comment-content">{content}</p>
    </div>
  );
};

export default Comment;
