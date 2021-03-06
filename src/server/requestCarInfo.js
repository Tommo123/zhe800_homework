const express = require('express');
let router = express.Router();
const bodyParser = require('body-parser');
const {responseSuccess, responseError, responseTokenInvalid} = require('./validate');
const {connect, find} = require('./mongoDB');
const {decryptToken, judgeToken} = require('./crypto');

router.post('/requestCarInfo', bodyParser.json(), async (request, response) => {
    let database = null;
    let query = {
        mobile: decryptToken({token: request.headers.authorization}).mobile,
    };

    //超时判断
    if (!judgeToken({token: request.headers.authorization})) {
        response.send(responseTokenInvalid());
        return;
    }

    try {
        database = await connect();

        //用户注册判断
        let result = await find({
            collection: database.db('zhe800').collection('user'),
            query: {
                mobile: query.mobile,
                register: '1'
            }
        });
        if (result.length !== 1) {
            response.send(responseTokenInvalid());
            return;
        }

        result = await find({collection: database.db('zhe800').collection('car'), query: {mobile: query.mobile}});
        response.send({...responseSuccess(), ...{list: result}});
    } catch (error) {
        response.send({...responseError(), ...{message: error.description}});
    } finally {
        database.close();
    }
});

module.exports = router;
