import clientPromise from "../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const client = await clientPromise;
        const db = client.db("sample_mflix");
        const alerts = await db
            .collection("alerts")
            .find({})
            .sort({ metacritic: -1 })
            .toArray();
        res.json(alerts);
    } catch (e) {
        console.error(e);
    }
}