let mongoose = null

module.exports = {
    setMongoose(m) {
        mongoose = m;
    },
    getMongoose() {
        return mongoose
    }
}