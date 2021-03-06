const {admin, db} = require('./admin');

module.exports = (req, resp, next) => {
    let idToken;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
        console.error('No token found');
        return resp.status(403).json({
            error: 'Unauthorized'
        });
    }

    admin.auth().verifyIdToken(idToken)
        .then(decodedToken => {
            req.user = decodedToken;
            return db.collection('users')
                .where('userId', '==', req.user.uid)
                .limit(1)
                .get();
        })
        .then(data => {
            req.user.handle = data.docs[0].data().handle;
            req.user.imageUrl = data.docs[0].data().imageUrl; // less db calls for comments
            return next();
        })
        .catch(err => {
            console.error('Error while decoding the token ', err);
            return resp.status(403).json(err);
        });
};