// Benjamin McCabe
// 3/1/2024
// IT302 - 002
// Phase 2 Assignment
// bsm25@njit.edu
import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId
let music

export default class MusicDAO {
  static async injectDB(conn) {
    if (music) {
      return;
    }
    try {
      music = await conn.db(process.env.MUSIC_NS).collection("music_bsm25");
    } catch (e) {
      console.error(`unable to connect in MusicDAO: ${e}`);
    }
  }
  // The parameters in here are default parameters. The value will change if a value is passed.
  static async getMusic({ filters = null, page = 0, songsPerPage = 20 } = {}) {
    let query = {};
    if (filters && filters.any) {
      const anySubString = new RegExp(filters.any, "i");
      query = {
        $or: [
          { trackName: { $regex: anySubString } },
          { collectionCensoredName: { $regex: anySubString } },
          { artistName: { $regex: anySubString } },
        ],
      };
    }

    let cursor;
    try {
      cursor = await music
        .find(query)
        .limit(songsPerPage)
        .skip(songsPerPage * page);
      const songList = await cursor.toArray();
      const totalNumSongs = await music.countDocuments(query);
      return { songList, totalNumSongs };
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      console.error(e);
      return { songList: [], totalNumSongs: 0 };
    }
  }

  static async getSongById(id) {
    try {
      return await music
        .aggregate([
          {
            $match: {
              _id: new ObjectId(id),
            },
          },
          {
            $lookup: {
              from: "comments_bsm25",
              localField: "_id",
              foreignField: "songId",
              as: "comments",
            },
          },
        ])
        .next();
    } catch (e) {
      console.error(`something went wrong in getSongById: ${e}`);
      throw e;
    }
  }
}