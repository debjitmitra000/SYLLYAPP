import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaClipboard } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { server } from '../constants/config';
import { ImSpinner2 } from 'react-icons/im';

const Home = () => {
  const [subject, setSubject] = useState('');
  const [syllabus, setSyllabus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const MAX_CHARS = 1500;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (syllabus.length > MAX_CHARS) {
      setError(`Text exceeds ${MAX_CHARS} characters limit`);
      return;
    }
    
    if (!syllabus.trim() || !subject.trim()) {
      setError('Please fill in both fields');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${server}/api/v1/test/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, syllabus }),
      });

      const data = await response.json();
      setLoading(false);

      localStorage.setItem('resultsData', JSON.stringify(data));

      navigate('/results');
    } catch (error) {
      setLoading(false);
      setError('Something went wrong. Please try again.');
      console.error('Error fetching results:', error);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.length > MAX_CHARS) {
        setError(`Pasted text exceeds ${MAX_CHARS} characters limit`);
        setSyllabus(text.slice(0, MAX_CHARS));
      } else {
        setError('');
        setSyllabus(text);
      }
    } catch (error) {
      console.error('Failed to read clipboard:', error);
      setError('Failed to paste from clipboard');
    }
  };

  const handleTextareaChange = (e) => {
    const text = e.target.value;
    if (text.length > MAX_CHARS) {
      setError(`Text exceeds ${MAX_CHARS} characters limit`);
    } else {
      setError('');
    }
    setSyllabus(text);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {loading && (
        <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm z-50 flex items-center justify-center">
          <motion.div 
            className="bg-gray-800 p-8 rounded-xl shadow-xl flex flex-col items-center gap-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <ImSpinner2 className="text-5xl text-purple-500 animate-spin" />
            <div className="space-y-2 text-center">
              <h3 className="text-xl font-semibold text-white">Analyzing Your Syllabus</h3>
              <p className="text-gray-400">Please wait while we process your content...</p>
            </div>
            <motion.div 
              className="w-48 h-1 bg-gray-700 rounded-full overflow-hidden mt-2"
            >
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      )}

      <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm fixed w-full top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold animate-shine">SYLLYAPP</h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center px-4 min-h-screen">
        <div className="w-full max-w-2xl space-y-6 text-center mt-20">
          <motion.h1
            className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            AI-Powered Syllabus Analyzer
          </motion.h1>

          <div className="relative w-[80%] mx-auto">
            <motion.textarea
              className={`w-full p-4 bg-gray-800 border rounded-lg text-white outline-none focus:ring-2 focus:ring-purple-500 ${
                error && syllabus.length > MAX_CHARS ? 'border-red-500' : 'border-purple-500/50'
              }`}
              rows="7"
              placeholder="Enter syllabus here..."
              value={syllabus}
              onChange={handleTextareaChange}
              onPaste={(e) => {
                const pastedText = e.clipboardData.getData('text');
                if (pastedText.length > MAX_CHARS) {
                  setError(`Pasted text exceeds ${MAX_CHARS} characters limit`);
                  setSyllabus(pastedText.slice(0, MAX_CHARS));
                } else {
                  setError('');
                  setSyllabus(pastedText);
                }
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            />
            <motion.button
              className="absolute top-2 right-2 p-2 text-gray-400 hover:text-purple-500 transition-colors"
              onClick={handlePaste}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Paste from clipboard"
            >
              <FaClipboard className="text-xl" />
            </motion.button>
            <div className="flex justify-between items-center mt-2">
              <span className={`text-sm ${
                syllabus.length > MAX_CHARS ? 'text-red-400' : 'text-gray-400'
              }`}>
                {syllabus.length}/{MAX_CHARS} characters
              </span>
              {error && <span className="text-sm text-red-400">{error}</span>}
            </div>
          </div>

          <motion.input
            className="w-[80%] p-3 bg-gray-800 border border-purple-500/50 rounded-lg text-white outline-none focus:ring-2 focus:ring-purple-500"
            type="text"
            placeholder="Enter subject name..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          />

          <div className="flex justify-center">
            <motion.button
              className={`w-[80%] flex items-center justify-center gap-2 p-3 bg-gradient-to-r ${
                syllabus.length > MAX_CHARS 
                  ? 'from-gray-500 to-gray-600 cursor-not-allowed' 
                  : 'from-blue-500 to-purple-600'
              } text-white font-semibold rounded-lg shadow-lg`}
              onClick={handleSubmit}
              whileHover={{ scale: syllabus.length <= MAX_CHARS ? 1.05 : 1 }}
              whileTap={{ scale: syllabus.length <= MAX_CHARS ? 0.95 : 1 }}
              disabled={loading || syllabus.length > MAX_CHARS}
            >
              {loading ? <ImSpinner2 className="animate-spin" /> : <FaRocket />} Submit
            </motion.button>
          </div>
        </div>
      </div>

      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
};

export default Home;