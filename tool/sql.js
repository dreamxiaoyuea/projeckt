const { MongoClient } = require('mongodb');
const connectUrl = 'mongodb://localhost:27017';
const sql = {
  // 插入数据
  insert: (database, collectionName, insertData) => {
// 	  MongoClient.connect(connectUrl, (err, client) => {
// 		if (err) throw err;
// 		const db = client.db('sh1811');
// 		const collection = db.collection('users');
// 		collection.insert({"username": "赵坤", "age": 24 }, (err) => {
// 			if (err) throw err;
// 			console.log('insert success');
// 			client.close();
// 		})
// 	  })  
// 	return new Promise((resolve, reject) => {
// 	  MongoClient.connect(connectUrl, (err, client) => {
// 		if (err) throw err;
// 		const db = client.db('sh1811');
// 		const collection = db.collection('users');
// 		collection.insert({"username": "赵坤", "age": 24 }, (err) => {
// 		  if (err) {
// 		    reject(err);	
// 		  } else {
// 			resolve();
// 		  }
// 		  client.close();
// 		})
// 	  })
// 	})
	return new Promise((resolve, reject) => {
	  MongoClient.connect(connectUrl, (err, client) => {
		if (err) throw err;
		const db = client.db(database);
		const collection = db.collection(collectionName);
		collection.insert(insertData, (err) => {
		  if (err) {
		    reject(err);	
		  } else {
			resolve();
		  }
		  client.close();
		})
	  })
	})
  },
  remove: (database, collectionName, removeData) => {
	return new Promise((resolve, reject) => {
	  MongoClient.connect(connectUrl, (err, client) => {
		  if (err) throw err;
		  const db = client.db(database);
		  const collection = db.collection(collectionName);
		  collection.remove(removeData, (err) => {
			if (err) {
			  reject(err);
			} else {
			  resolve();
			} 
			client.close();
		  })
	  })	
	})
  },
  update: (database, collectionName, updateType, whereData, updateData) => {
    return new Promise((resolve, reject) => {
	  MongoClient.connect(connectUrl, (err, client) => {
		  if (err) throw err;
		  const db = client.db(database);
		  const collection = db.collection(collectionName);
		  collection[updateType](whereData, updateData,(err) => {
			if (err) {
			  reject(err);
			} else {
			  resolve();
			} 
			client.close(); 
		  })
	  })  
    })
  },
  find: (database, collectionName, whereData) => {
	  return new Promise((resolve, reject) => {
			MongoClient.connect(connectUrl, (err, client) => {
				if (err) throw err;
				const db = client.db(database);
				const collection = db.collection(collectionName)
				collection.find(whereData).toArray((err, data) => {
					if (err) {
					reject(err);
					} else {
					resolve(data);
					} 
					client.close(); 
				})
			})    
	  })
	},
	distinct (database, collectionName, type) {
		return new Promise((resolve, reject) => {
			MongoClient.connect(connectUrl, (err, client) => {
				if (err) throw err;
				const db = client.db(database);
				const collection = db.collection(collectionName)
				collection.distinct(type, (err, data) => {
					if (err) throw err;
					resolve(data)
				})
			})    
	  })
	},
	sort (database, collectionName, sortData) {
		return new Promise((resolve, reject) => {
			MongoClient.connect(connectUrl, (err, client) => {
				if (err) throw err;
				const db = client.db(database);
				const collection = db.collection(collectionName)
				collection.find({}).sort(sortData).toArray((err, data) => {
					if (err) throw err;
					resolve(data)
				})
			})    
	  })
	}
};

module.exports = sql;
