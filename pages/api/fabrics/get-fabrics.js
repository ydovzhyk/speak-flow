// /pages/api/get-fabrics.js

import { db } from '@/utils/firebase/firebase-сonfig';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const fabricsRef = db.collection('fabrics').orderBy('createdAt', 'desc');

    const snapshot = await fabricsRef.get();

    const allFabrics = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({
      allFabrics,
    });
  } catch (error) {
    console.error('❌ Error fetching fabrics:', error);
    return res.status(500).json({ error: 'Failed to fetch fabrics' });
  }
}
