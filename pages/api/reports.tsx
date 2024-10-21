import clientPromise from "../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const client = await clientPromise;
        const db = client.db("sample_mflix");
        const reports = await db
            .collection("reports")
            .find({})
            .sort({ metacritic: -1 })
            .toArray();
        res.json(reports);
    } catch (e) {
        console.error(e);
    }
}