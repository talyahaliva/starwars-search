// נגדיר איך נראית רשומה בהיסטוריה
export interface SearchRecord {
  id: number;
  term: string;
  count: number;
  createdAt: string;
}

// זה המערך שיחזיק את כל החיפושים (ה"דאטה בייס" שלנו בזיכרון)
export const searchHistory: SearchRecord[] = [];

// פונקציה להוספת חיפוש חדש
export const addToHistory = (term: string, count: number) => {
  const newRecord: SearchRecord = {
    id: searchHistory.length + 1,
    term,
    count,
    createdAt: new Date().toISOString()
  };
  // מוסיפים את הרשומה החדשה לרשימה
  searchHistory.push(newRecord);
};
// פונקציה למחיקת פריט לפי מזהה
export const deleteFromHistory = (id: number) => {
  const index = searchHistory.findIndex(item => item.id === id);
  if (index !== -1) {
    searchHistory.splice(index, 1); // מוחק את האיבר מהמערך
    return true;
  }
  return false;
};