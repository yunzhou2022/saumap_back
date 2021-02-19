const mongoose = require("mongoose");
const APIError = require("../helpers/APIError");

const LocationSchema = mongoose.Schema({
  name: String,
  lat_x: String,
  lng_y: String,
  tags: Array,
  introduce: String,
  comments: Array,
  imgs: Array,
  bgm: Array,
  favor: Number,
  type:String, //'lujing' | 'jingdian'
  neighbors:[{name:String,lat_x:String,lng_y:String}],
});

const LocationTemplate = {
  name: "景点",
  lat_x: "",
  lng_y: "",
  tags: [],
  introduce: "",
  comments: ['真不戳','哇偶，amazing！！！'],
  imgs: [],
  bgm: [],
  favor: 0,
  type:'jingdian',
  neighbors:[{name:'南11',lat_x:'11,12',lng_y:'12,21'}],
};
// 译者注：注意了， method 是给 document 用的
// kittySchema.methods.speak = function () {
//   var greeting = this.name
//     ? "Meow name is " + this.name
//     : "I don't have a name";
//   console.log(greeting);build
// };

/**
 * Statics
 */
LocationSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of location.
   * @returns {Promise<Location, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((location) => {
        if (location) {
          return location;
        }
        const err = new APIError("No such user exists!", httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List locations in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of locations to be skipped.
   * @param {number} limit - Limit number of locations to be returned.
   * @returns {Promise<Location[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },
};

const Location = mongoose.model("Location", LocationSchema);

module.exports = { Location, LocationTemplate };
