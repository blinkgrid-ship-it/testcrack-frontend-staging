const STORAGE_PREFIX = 'studymentor_quiz_draft_';

export const quizPersistence = {
  // Save a draft answer locally
  saveAnswer: (courseId: string, mcqId: string, answerId: string) => {
    const key = `${STORAGE_PREFIX}${courseId}`;
    const existing = JSON.parse(localStorage.getItem(key) || '{}');
    existing[mcqId] = {
      answerId,
      timestamp: new Date().toISOString(),
      synced: false
    };
    localStorage.setItem(key, JSON.stringify(existing));
  },

  // Retrieve a draft answer if the user refreshes
  getAnswer: (courseId: string, mcqId: string): string | null => {
    const key = `${STORAGE_PREFIX}${courseId}`;
    const data = JSON.parse(localStorage.getItem(key) || '{}');
    return data[mcqId]?.answerId || null;
  },

  // Call this when the backend successfully acknowledges the answer
  markSynced: (courseId: string, mcqId: string) => {
    const key = `${STORAGE_PREFIX}${courseId}`;
    const data = JSON.parse(localStorage.getItem(key) || '{}');
    if (data[mcqId]) {
      data[mcqId].synced = true;
      localStorage.setItem(key, JSON.stringify(data));
    }
  }
};