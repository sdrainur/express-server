const db = require('../configs/sequelize.config')
const Feedback = db.Feedback

export const addFeedback = async (data) => {
    const feedbackFromDb = Feedback.findOne({
        where: {
            mentorId: data.mentorId,
            authorId: data.authorId
        },
    })
    if (!feedbackFromDb) {
        if (data.score > 1 && data.score < 5) {
            await Feedback.create({
                mentorId: data.mentorId,
                authorId: data.authorId,
                score: data.score,
                text: data.text
            })
            return true;
        }
        return false;
    }
    return false;
}