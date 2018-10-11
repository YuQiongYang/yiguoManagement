const db = require('../utils/dbHelper.js');
const apiResult = require('../utils/apiResult.js');
let jwt = require('jsonwebtoken');
const ObjectID = require('mongodb').ObjectID;

let secret = 'yiguo';
let token;
let result;

let filter = (req, res, next) => {
  let token = req.headers['auth'];
  if (!token) {
    res.send(apiResult(false, {}, 'token err'))
  } else {
    jwt.verify(token, secret, (error, result) => {
      if (error) {
        //console.log("token====>" + error);
        res.send(apiResult(false, {}, error))
      } else {
        next()
      }
    })
  }
}

module.exports = {
  getData(app) {
    app.post('/admin', async (req, res) => {
      let _data = {
        username: req.body.username,
        password: req.body.password
      }

      let userData = await db.select('admin', _data);

      if (userData.status) {
        token = jwt.sign(_data, secret, {
          'expiresIn': 60 * 60 * 24 // 设置过期时间, 24 小时
        })

        res.send(apiResult(userData.status, {
          username: req.body.username
        }, token))

      } else {
        res.send(result)
      }
    })

    app.post('/userData', async (req, res) => {
      let _data = {
        username: req.body.username
      }
      let result = await db.select('admin', _data)
      if (result.status) {
        delete result.data[0].password
        res.send(apiResult(result.status, result.data))
      }
      res.send(apiResult(false, '', '查询无结果'))
    })

    app.post('/changePassword', async (req, res) => {
      let _data = JSON.parse(req.body.changePassword)

      let result = await db.select('admin', {
        username: _data.username
      })
      if (result.status) {
        if (result.data[0].password === _data.oldPassword) {
          delete _data.oldPassword
          let _id = new ObjectID(result.data[0]._id)
          let changePassword = await db.updata('admin', {
            _id
          }, _data);
          if (changePassword.status) {
            res.send(changePassword)
          }

        } else {
          res.send(apiResult(false, '', '当前密码错误'))
        }
      }
      res.send(result)
    })

    app.post('/changeData', async (req, res) => {
      let _data = JSON.parse(req.body.changeData)
      let result = await db.select('admin', {
        username: _data.username
      })
      console.log(result)
      if (result.status) {
        let _id = new ObjectID(result.data[0]._id)
        console.log(_id)
        let changeData = await db.updata('admin', {
          username:_data.username
        }, _data);
        
        res.send(changeData)
      }
      res.send(result)
    })
  }
}
