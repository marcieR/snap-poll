import React, { useState } from 'react';
import { Users, Eye, EyeOff, RotateCcw, Plus } from 'lucide-react';

export default function SnapPoll() {
  const [story, setStory] = useState('');
  const [voters, setVoters] = useState([]);
  const [newVoterName, setNewVoterName] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [view, setView] = useState('setup'); // 'setup', 'voting'

  const fibonacciPoints = ['0', '1', '2', '3', '5', '8', '13', '21', '?', '☕'];

  const addVoter = () => {
    if (newVoterName.trim()) {
      setVoters([...voters, { name: newVoterName.trim(), vote: null }]);
      setNewVoterName('');
    }
  };

  const startVoting = () => {
    if (story.trim() && voters.length > 0) {
      setView('voting');
    }
  };

  const vote = (voterIndex, value) => {
    const updated = [...voters];
    updated[voterIndex].vote = value;
    setVoters(updated);
  };

  const reset = () => {
    setVoters(voters.map(v => ({ ...v, vote: null })));
    setRevealed(false);
  };

  const newRound = () => {
    setStory('');
    setVoters([]);
    setRevealed(false);
    setView('setup');
  };

  const allVoted = voters.length > 0 && voters.every(v => v.vote !== null);
  
  const getVoteStats = () => {
    const votes = voters.filter(v => v.vote !== null && v.vote !== '?' && v.vote !== '☕').map(v => parseInt(v.vote));
    if (votes.length === 0) return null;
    
    const avg = votes.reduce((a, b) => a + b, 0) / votes.length;
    const sorted = [...votes].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const median = sorted.length % 2 === 0 
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2 
      : sorted[Math.floor(sorted.length / 2)];
    
    const counts = {};
    votes.forEach(v => counts[v] = (counts[v] || 0) + 1);
    const consensus = Object.keys(counts).length === 1;
    
    return { avg: avg.toFixed(1), min, max, median, consensus };
  };

  const stats = revealed ? getVoteStats() : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 mt-8">
          <h1 className="text-6xl font-black text-white mb-3 drop-shadow-lg">
            SnapPoll
          </h1>
          <p className="text-xl text-white/90 font-medium">Scrum Refinement Voting Tool</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Setup View */}
          {view === 'setup' && (
            <div className="p-8">
              <h2 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
                Setup Session
              </h2>

              {/* Story Input */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  User Story / Task
                </label>
                <textarea
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="Enter the user story or task to estimate..."
                  className="w-full px-4 py-3 border-3 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none text-lg resize-none"
                  rows="3"
                />
              </div>

              {/* Voters */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Team Members
                </label>
                
                {/* Add Voter */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newVoterName}
                    onChange={(e) => setNewVoterName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addVoter()}
                    placeholder="Enter name and press Enter"
                    className="flex-1 px-4 py-3 border-3 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  />
                  <button
                    onClick={addVoter}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                {/* Voter List */}
                {voters.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {voters.map((voter, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full font-semibold text-purple-700 flex items-center gap-2"
                      >
                        <Users size={16} />
                        {voter.name}
                        <button
                          onClick={() => setVoters(voters.filter((_, i) => i !== index))}
                          className="text-purple-500 hover:text-purple-700 font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={startVoting}
                disabled={!story.trim() || voters.length === 0}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Start Voting
              </button>
            </div>
          )}

          {/* Voting View */}
          {view === 'voting' && (
            <div className="p-8">
              {/* Story Display */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-4 border-purple-200 rounded-2xl p-6 mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Current Story:</h3>
                <p className="text-lg text-gray-700">{story}</p>
              </div>

              {/* Voting Cards */}
              <div className="grid grid-cols-5 gap-3 mb-6">
                {fibonacciPoints.map((point) => (
                  <div
                    key={point}
                    className="aspect-[3/4] bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg flex items-center justify-center text-white font-black text-4xl cursor-pointer hover:scale-105 transition-transform"
                  >
                    {point}
                  </div>
                ))}
              </div>

              {/* Voters Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {voters.map((voter, index) => (
                  <div key={index} className="border-3 border-purple-200 rounded-2xl p-4 bg-gradient-to-r from-purple-50 to-pink-50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-gray-800">{voter.name}</span>
                      {voter.vote !== null && (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Vote Display */}
                    <div className="mb-3">
                      {revealed ? (
                        <div className="text-center py-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl text-white font-black text-3xl">
                          {voter.vote || '—'}
                        </div>
                      ) : (
                        <div className="text-center py-4 bg-gray-200 rounded-xl">
                          {voter.vote !== null ? (
                            <div className="text-gray-600 font-bold">Voted ✓</div>
                          ) : (
                            <div className="text-gray-400">Waiting...</div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Vote Buttons */}
                    {!revealed && (
                      <div className="grid grid-cols-5 gap-1">
                        {fibonacciPoints.map((point) => (
                          <button
                            key={point}
                            onClick={() => vote(index, point)}
                            className={`aspect-square rounded-lg text-xs font-bold transition-all ${
                              voter.vote === point
                                ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white scale-110'
                                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                            }`}
                          >
                            {point}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Stats Panel */}
              {revealed && stats && (
                <div className={`border-4 rounded-2xl p-6 mb-6 ${
                  stats.consensus 
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300' 
                    : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300'
                }`}>
                  <div className="text-center mb-4">
                    <h3 className="text-2xl font-black mb-2">
                      {stats.consensus ? '🎉 Consensus Reached!' : '⚠️ No Consensus'}
                    </h3>
                    {stats.consensus && (
                      <div className="text-5xl font-black text-green-600">
                        {voters[0].vote}
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-sm font-semibold text-gray-600">Average</div>
                      <div className="text-2xl font-black text-purple-600">{stats.avg}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-600">Median</div>
                      <div className="text-2xl font-black text-pink-600">{stats.median}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-600">Min</div>
                      <div className="text-2xl font-black text-blue-600">{stats.min}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-600">Max</div>
                      <div className="text-2xl font-black text-orange-600">{stats.max}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                {!revealed ? (
                  <button
                    onClick={() => setRevealed(true)}
                    disabled={!allVoted}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    <Eye size={20} />
                    Reveal Votes {allVoted ? '' : `(${voters.filter(v => v.vote !== null).length}/${voters.length})`}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={reset}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-4 rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                    >
                      <RotateCcw size={20} />
                      Vote Again
                    </button>
                    <button
                      onClick={newRound}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold py-4 rounded-2xl hover:from-orange-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                    >
                      <Plus size={20} />
                      New Story
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-white/80">
          <p className="text-sm">Scrum Planning Made Simple ⚡</p>
        </div>
      </div>
    </div>
  );
}