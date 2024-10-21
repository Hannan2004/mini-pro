import clientPromise from "../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const client = await clientPromise;
        const db = client.db("sample_mflix");
        const logs = await db
            .collection("logs")
            .find({})
            .sort({ metacritic: -1 })
            .limit(10)
            .toArray();
        res.json(logs);
    } catch (e) {
        console.error(e);
    }
}