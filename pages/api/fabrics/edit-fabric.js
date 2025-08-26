import { db } from '@/utils/firebase/firebase-сonfig';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const fabricData = req.body;

    if (!fabricData?.id) {
      return res.status(400).json({ error: 'Fabric ID is required' });
    }

    const { id, ...fieldsToUpdate } = fabricData;

    await db.collection('fabrics').doc(id).update(fieldsToUpdate);

    return res.status(200).json({ message: 'Fabric successfully updated' });
  } catch (error) {
    console.error('❌ Error updating fabric:', error);
    return res
      .status(500)
      .json({ error: 'Failed to update fabric in Firestore' });
  }
}
