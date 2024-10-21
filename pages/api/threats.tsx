import clientPromise from "../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const client = await clientPromise;
        const db = client.db("sample_mflix");
        const threats = await db
            .collection("threats")
            .find({})
            .sort({ metacritic: -1 })
            .limit(10)
            .toArray();
        res.json(threats);
    } catch (e) {
        console.error(e);
    }
}