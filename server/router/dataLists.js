const db = require('../utils/dbHelper.js');
const apiResult = require('../utils/apiResult.js');
const ObjectID = require('mongodb').ObjectID;

let result;

function deleteAttr(data) {
  for (let i = 0; i < data.length; i++) {
    // delete data[i]._id
    delete data[i].CommodityCode
    delete data[i].SubTitle
    delete data[i].SmallPic
    delete data[i].shelfTime
    delete data[i].ShowOriginalPrice
    delete data[i].State
    delete data[i].qty
  }
  return data
}

module.exports = {
  getData(app) {
    app.post('/fruitsDatas', async (req, res) => {
      result = await db.select('goodsData', {});
      let data = deleteAttr(result.data)
      // console.log(data)
      res.send(result);
    })

    app.post('/meatDatas', async (req, res) => {
      result = await db.select('meat_goodsData', {});
      let data = deleteAttr(result.data)
      // console.log(data)
      res.send(result);
    })
    //查询商品
    let crud = async function (data, type) {
      let _data = JSON.parse(data);
      let typeSet;

      //先查询，再添加
      if (type === "meat") {
        typeSet = "meat_goodsData"
      } else if (type === "fruits") {
        typeSet = "goodsData";
      } else {
        res.send("type is Incorrect !");
      }
      let key;
      delete _data._id
      for (key in _data) {
        if (!_data[key]) {
          delete _data[key];
        }
        if (key === 'kind') {
          delete _data[key];
        }
      }
      let oldData = await db.select(typeSet, {
        CommodityId: _data.CommodityId
      });
      return oldData
    }
    //增
    app.post('/addData', async (req, res) => {
      let typeSet;
      //先查询，再添加
      if (req.body.type === "meat") {
        typeSet = "meat_goodsData"
      } else if (req.body.type === "fruits") {
        typeSet = "goodsData";
      } else {
        res.send("type is Incorrect !");
      }
      let result = await crud(req.body.addData, req.body.type)
      console.log(typeSet, result)
      if (!result.status) {
        let newData = JSON.parse(req.body.addData);
        if (newData.kind) {
          delete newData.kind
        }
        let add = await db.insert(typeSet, newData)
        console.log(add)
        if (add.status) {
          res.send(add)
        }
      }
      res.send(apiResult(false, '', 'goods is exist'))
    })
    //删
    app.post('/deleteData', async (req, res) => {
      let typeSet;
      let _id
      let deleted
      //先查询，再添加
      if (req.body.type === "meat") {
        typeSet = "meat_goodsData"
      } else if (req.body.type === "fruits") {
        typeSet = "goodsData";
      } else {
        res.send("type is Incorrect !");
      }
      if (!req.body.selectData) {
        _id = new ObjectID(req.body.id)

        let oldData = await db.select(typeSet, {
          '_id': _id
        });
        if (oldData.status) {

          let result = await db.delete(typeSet, {
            '_id': _id
          });

          res.send(result);
        }

      } else {
        let selectLists = JSON.parse(req.body.selectData)
        for (let key of selectLists) {
          _id = new ObjectID(key._id)

          let resSelect = await db.select(typeSet, {
            '_id': _id
          })

          if (resSelect.status) {
            deleted = await db.delete(typeSet, {
              '_id': _id
            })
c          }
        }
        res.send(deleted)

      }
      res.send(oldData);
    })
    //查
    app.post('/findData', async (req, res) => {
      let typeSet;
      //先查询，再添加
      if (req.body.type === "meat") {
        typeSet = "meat_goodsData"
      } else if (req.body.type === "fruits") {
        typeSet = "goodsData";
      } else {
        res.send("type is Incorrect !");
      }
      let name = req.body.searchName
      let result = await db.select(typeSet, {
        CommodityName: name
      })
      res.send(result)
    })
    //改
    app.post('/updateGoods', async (req, res) => {
      let _data = JSON.parse(req.body.updateData);
      let typeSet;
      //判断要查询那个集合
      if (req.body.type == "meat") {

        typeSet = "meat_goodsData";

      } else if (req.body.type == "fruits") {

        typeSet = "goodsData";

      } else {

        res.send("type is Incorrect !");
      }

      let key;
      delete _data._id
      for (key in _data) {
        if (!_data[key]) {
          delete _data[key];
        }

      }
      //console.log("updateGoods typeSet===>" + typeSet)

      let oldData = await db.select(typeSet, {
        CommodityId: _data.CommodityId
      });

      if (oldData.status) {

        // let dataset = oldData.data;
        let _id = new ObjectID(oldData.data[0]._id)
        //console.log("updateGoods _id===>" + _id)

        //     //更新商品数据
        let newData = await db.updata(typeSet, {
          _id
        }, _data);

        if (newData.status) {

          res.send(newData);
        }

      }

      res.send(oldData);
    })
  }
}
