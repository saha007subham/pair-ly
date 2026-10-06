const { Schema, Model } = require("mongoose");

const connectionRequestSchema = new Schema(
  {
    fromUserId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  { timestamps: true },
);

const ConnectionRequestModel = new Model(
  "ConnectionRequest",
  connectionRequestSchema,
);

module.exports = ConnectionRequestModel;
