import mongoose from 'mongoose';

const createObjectID = () => mongoose.Types.ObjectId().toHexString();

export default createObjectID;
