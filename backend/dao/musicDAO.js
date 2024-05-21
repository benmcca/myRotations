import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;
let music;

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
    let pipeline = [];

    if (filters && filters.any) {
      const anySubString = new RegExp(filters.any, "i");
      pipeline.push({
        $match: {
          $or: [
            { artistName: { $regex: anySubString } },
            { collectionCensoredName: { $regex: anySubString } },
            { trackName: { $regex: anySubString } },
          ],
        },
      });
    }

    if (filters && filters.genre) {
      pipeline.push({
        $match: {
          primaryGenreName: filters.genre,
        },
      });
    }

    // If genre filter is applied, sample random documents that match the genre
    if (filters && filters.genre) {
      pipeline.push({ $sample: { size: songsPerPage } });
    } else if (!filters || !filters.any) {
      // If no filters are applied, sample random documents
      pipeline.push({ $sample: { size: songsPerPage } });
    }

    let cursor;
    try {
      cursor = await music.aggregate([
        ...pipeline,
        { $skip: songsPerPage * page },
        { $limit: songsPerPage },
      ]);

      const songList = await cursor.toArray();

      let totalNumSongs;
      if (pipeline.length > 0) {
        const matchStage = pipeline.find((stage) => stage.$match);
        if (matchStage) {
          totalNumSongs = await music.countDocuments(matchStage.$match);
        } else {
          totalNumSongs = await music.countDocuments();
        }
      } else {
        // Count all documents if no filters
        totalNumSongs = await music.countDocuments();
      }

      return { songList, totalNumSongs };
    } catch (e) {
      console.error(`Unable to issue aggregate command, ${e}`);
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

  static async getGenres() {
    let genres = [];
    try {
      genres = await music.distinct("primaryGenreName");
      return genres;
    } catch (e) {
      console.error(`unable to get genres, ${e}`);
      return genres;
    }
  }
}
