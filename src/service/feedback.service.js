const db = require('../configs/sequelize.config')
const Feedback = db.Feedback

const addFeedback = async (data) => {
    const feedbackFromDb = await Feedback.findOne({
        where: {
            mentorId: data.mentorId,
            authorId: data.authorId
        },
        raw: true
    })
    if (!feedbackFromDb) {
        if (data.score >= 1 && data.score <= 5) {
            try {
                await Feedback.create({
                    mentorId: data.mentorId,
                    authorId: data.authorId,
                    score: data.score,
                    text: data.text
                })
            } catch (e) {
                console.log(e)
                return false
            }
            return true;
        }
        return false;
    }
    return false;
}

const getMentorFeedbacks = async (mentorId) => {
    const feedbacks = await Feedback.findAll({
        where: {
            mentorId: mentorId
        },
        attributes: ['id', 'authorId', 'text', 'score', 'createdAt'],
        raw: true
    })
    let totalScore = 0
    let count = 0
    feedbacks.forEach(feedback => {
        totalScore += feedback.score
        count++;
    })
    return {
        totalScore: totalScore / count,
        feedbacks: feedbacks
    }
}

const deleteFeedback = async (data) => {
    try {
        await Feedback.destroy({
            where: {
                id: data.id,
                authorId: data.authorId
            }

        })
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    addFeedback,
    getMentorFeedbacks,
    deleteFeedback
}