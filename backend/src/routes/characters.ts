import { Router, Request, Response } from 'express';
import axios from 'axios';
import https from 'https'; // <--- 1. הוספנו את זה
import { addToHistory } from '../store';

const router = Router();

// יצירת "סוכן" שעוקף את בדיקת האבטחה (פותר את ה-CERT_HAS_EXPIRED)
const agent = new https.Agent({  
    rejectUnauthorized: false
});

router.get('/', async (req: Request, res: Response) => {
    const query = req.query.search as string;

    if (!query) {
        res.status(400).json({ error: 'Search parameter is required' });
        return;
    }

    try {
        // הוספנו את ה-agent לבקשה
        const response = await axios.get(`https://swapi.dev/api/people/?search=${query}`, { 
            httpsAgent: agent 
        });
        
        const data = response.data;

        if (typeof addToHistory === 'function') {
             addToHistory(query, data.count);
        }

        const simplifiedResults = data.results.map((char: any) => ({
            name: char.name,
            height: char.height,
            birthYear: char.birth_year,
            gender: char.gender
        }));

        res.json({
            search: query,
            count: data.count,
            results: simplifiedResults
        });

    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'External API failure' });
    }
});

export default router;