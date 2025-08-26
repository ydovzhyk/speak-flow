import { db } from '@/utils/firebase/firebase-сonfig';
import { Timestamp } from 'firebase-admin/firestore';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const fabricData = req.body;

    if (!fabricData?.id) {
      return res.status(400).json({ error: 'Fabric ID is required' });
    }

    const dataToSave = {
      ...fabricData,
      project: 'pink-skirt',
      createdAt: Timestamp.now(),
    };

    await db.collection('fabrics').doc(fabricData.id).set(dataToSave);

    return res
      .status(200)
      .json({ message: 'Fabric successfully saved to Firestore' });
  } catch (error) {
    console.error('❌ Error saving fabric:', error);
    return res
      .status(500)
      .json({ error: 'Failed to save fabric to Firestore' });
  }
}
