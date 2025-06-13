
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const filePath = path.join(process.cwd(), 'public', 'data.json');

  if (req.method === 'GET') {
    try {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      res.status(200).json(JSON.parse(fileContents));
    } catch (error) {
      res.status(500).json({ error: 'Fehler beim Laden der Daten.' });
    }
  } else if (req.method === 'POST') {
    const newData = req.body;
    try {
      fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
      res.status(200).json({ status: 'OK' });
    } catch (error) {
      res.status(500).json({ error: 'Fehler beim Speichern.' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
