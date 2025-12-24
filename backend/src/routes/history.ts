import { Router } from 'express';
import { searchHistory, deleteFromHistory } from '../store'; // הוספנו ייבוא

const router = Router();

// קבלת ההיסטוריה
router.get('/', (req, res) => {
    res.json(searchHistory.slice().reverse());
});

// דרישה 56-57: מחיקת פריט מההיסטוריה
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id); // המרת הטקסט למספר
    deleteFromHistory(id);
    res.json({ success: true });
});

export default router;