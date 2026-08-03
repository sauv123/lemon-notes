"use client";



import { useStudyStore } from "@/lib/store";

export function WeakTopicsList() {
  const savedKits = useStudyStore((state) => state.savedKits);
  
  // Extract all weak topics from quizzes
  const allWeakTopics = savedKits
    .filter(kit => kit.quizResults?.weakTopics)
    .flatMap(kit => kit.quizResults.weakTopics)
    // Remove duplicates
    .filter((value, index, self) => self.indexOf(value) === index)
    .map((topic, id) => ({ id, name: topic, isMastered: false }))
    .slice(0, 5); // Take top 5

  const topics = allWeakTopics;

  return (
    <ul className="space-y-3">
      {topics.map((topic) => (
        <li 
          key={topic.id} 
          className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors"
        >
          {topic.isMastered ? (
            <span className="material-symbols-rounded text-green-500 shrink-0">check_circle</span>
          ) : (
            <span className="material-symbols-rounded text-red-500 shrink-0">error</span>
          )}
          <span className={`text-sm ${topic.isMastered ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
            {topic.name}
          </span>
        </li>
      ))}
      {topics.length === 0 && (
        <li className="text-center text-muted-foreground py-4">
          No weak topics tracked yet. Keep studying!
        </li>
      )}
    </ul>
  );
}
