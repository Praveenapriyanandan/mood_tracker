import React from 'react';

const MoodSelector = ({ onMoodSelect }) => {
  const moods = {
    mood_swings: { emoji: "😕", label: "Mood Swings" },
    irritated: { emoji: "😠", label: "Irritated" },
    sad: { emoji: "😢", label: "Sad" },
    anxious: { emoji: "😟", label: "Anxious" },
    depressed: { emoji: "😞", label: "Depressed" },
    guilty: { emoji: "😔", label: "Guilty" },
    obsessive_thoughts: { emoji: "🌀", label: "Obsessive Thoughts" },
    stressed: { emoji: "😖", label: "Stressed" },
    angry: { emoji: "😡", label: "Angry" }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-center mb-6">How are you feeling today?</h2>
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(moods).map(([key, value]) => (
          <button
            key={key}
            onClick={() => onMoodSelect(key)}
            className="p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors duration-200"
          >
            <div className="text-2xl mb-2">{value.emoji}</div>
            <div className="text-sm">{value.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;
