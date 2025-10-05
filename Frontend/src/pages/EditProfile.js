import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../Urls';
import { useToast } from '../components/ToastProvider';

const EditProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoSuccessMessage, setPhotoSuccessMessage] = useState('');
  const toast = useToast();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/user/current`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setNewName(data.user.full_name);
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    if (e.target.id === 'currentPassword') {
      setCurrentPassword(e.target.value);
    } else {
      setNewPassword(e.target.value);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${baseUrl}/api/user/edit-name/${user.id}/${newName}`, {
        method: 'PATCH',
        credentials: 'include',
      });

      if (!response.ok) {
        setErrorMessage('Failed to update name.');
      } else {
        setSuccessMessage('Name updated successfully!');
      }
    } catch (error) {
      console.error('Error updating name:', error);
      setErrorMessage('Error updating name.');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (currentPassword && newPassword) {
      try {
        const response = await fetch(`${baseUrl}/api/user/${user.id}/update-password`, {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        });

        if (!response.ok) {
          setErrorMessage('Failed to update password.');
        } else {
          setSuccessMessage('Password updated successfully!');
          setCurrentPassword('');
          setNewPassword('');
        }
      } catch (error) {
        console.error('Error updating password:', error);
        setErrorMessage('Error updating password.');
      }
    } else {
      setErrorMessage('Please fill in all fields for password update.');
    }
  };

  const handlePhotoSubmit = async (e) => {
    e.preventDefault();
    setPhotoSuccessMessage('');
    setErrorMessage('');

    if (!profilePhoto) {
      setErrorMessage('Please select a photo to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('profilePhoto', profilePhoto);

    try {
      const response = await fetch(`${baseUrl}/api/user/${user.id}/update-photo`, {
        method: 'PATCH',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        setErrorMessage(`Failed to update profile photo: ${response.status} ${errorText}`);
        return;
      }

      setPhotoSuccessMessage('Profile photo updated successfully!');
      toast.success('Profile photo updated successfully!');
      setProfilePhoto(null);
    } catch (error) {
      console.error('Error updating profile photo:', error);
      setErrorMessage('Error updating profile photo. Please check your network connection or try again later.');
      toast.error('Error updating profile photo. Please try again later.');
    }
  };

  const handleRemovePhoto = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${baseUrl}/api/user/${user.id}/remove-photo`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to remove photo');
      setPhotoSuccessMessage('Profile photo removed successfully!');
      toast.success('Profile photo removed successfully!');
      setUser((prev) => ({ ...prev, profile_photo: null }));
    } catch (err) {
      console.error('Error removing profile photo:', err);
      setErrorMessage('Failed to remove profile photo.');
      toast.error('Failed to remove profile photo.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>

    home section
    
    </>
  );
};

export default EditProfile;
