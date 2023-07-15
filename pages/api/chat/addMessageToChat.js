import { getSession } from "@auth0/nextjs-auth0"
import clientPromise from "lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    try {
        const {user} = await getSession(req, res);
        const client = await clientPromise;
        const db = await client.db("aiamelia");
        const {chatId, role, content} = req.body;
        const chat = await db.collection("Chats").findOneAndUpdate({
            _id: new ObjectId(chatId),
            userId: user.sub
        }, {
            spush: {
                messages: {
                    role,
                    content
                }
            }
        }, {
            returnDocument: "after"
        });
        res.status(200).json({
            chat: {
                ...chat.value,
                _id: chat.value._id.toString(),
            }
        })
    } catch (e) {
        res.status(500).json({message: "An erro occurred when adding a message to chat"})
    }
}