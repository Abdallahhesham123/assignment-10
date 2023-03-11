import mongoose from 'mongoose'
const connectDB = async () => {
    return await mongoose.connect(process.env.URL_DB)
    .then(result => {
        console.log(`DB connected Successfully on ,,,,,,,,,,,,,`);
    }).catch(err => console.log(`Fail to connect DB ,,,,,,,,,,,, ${err}`))
}

export default connectDB