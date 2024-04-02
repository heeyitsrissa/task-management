const { User } = require('../../models');

exports.registerUser = async (req, res) => {
    try {
        const userData = await User.create(req.body);

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.redirect('/');
        });
    } catch (err) {
        res.status(400).json(err);
    }
};

module.exports = exports;