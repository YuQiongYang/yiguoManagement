const db = require('../utils/dbHelper.js');
const apiResult = require('../utils/apiResult.js');

let result;

module.exports = {
	getData(app){
		app.post('/allKinds',async (req,res)=>{
				result = await db.select('allKinds',{});
				res.send(result);
		})
	}
}