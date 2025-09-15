import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DrawingCanvas from '../components/DrawingCanvas';
import { baseUrl } from '../Urls';

const PracticeCanvasPage = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/question/${questionId}`, { credentials: 'include' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load question');
        setQuestion(data.question || data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [questionId]);

  return (
    <div className="answer-page">
      <Navbar />
    </div>
  );
};

export default PracticeCanvasPage;


