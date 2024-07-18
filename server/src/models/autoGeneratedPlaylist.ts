import { Model, model, models, ObjectId, Schema } from "mongoose";

interface AutoPlaylistDocument {
  title: string;
  items: ObjectId[];
}

const playlistSchema = new Schema<AutoPlaylistDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Audio",
      },
    ],
  },
  { timestamps: true }
);

const AutoGeneratedPlaylist = models.AutoGeneratedPlaylist || model("AutoGeneratedPlaylist", playlistSchema);

export default AutoGeneratedPlaylist as Model<AutoPlaylistDocument>;