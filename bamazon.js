var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password:"root",
	database:"bamazon"
})

connection.connect(function(err){
	if(err) throw err;

	console.log("connection successfull");
	makeTable();
})

var makeTable =  function(){
	connection.query("SELECT * FROM products;", function(err, res){
		for (var i = 0; i< res.length; i++) {
			console.log(res[i].itemid+" || "+res[i].productname
				+" || "+
				res[i].department
				+" || "+
				res[i].price
				+" || "+
				res[i].stock+"\n");
	//	console.log(res);
		}
	promptCustomer(res);

	})
}

var promptCustomer = function(res){
		inquirer.prompt([
		{
			type:'input',
			name: 'choice',
			message: "What would you like to purchase? [Quit  with Q]"
		}
		]).then(function(ans){
			var correct = false;
			if(ans.choice.toUpperCase()== 'Q'){
				process.exit();
			}
			for(var i=0; i<res.length; i++){
				if(res[i].productname == ans.choice){
					correct = true;
					var product = ans.choice;
					var id = i;
					inquirer.prompt([{
						type:"input",
						name:"quantity",
						message:"How many would you like to buy",
						validate: function(value){
						if (isNaN(value)==false)
						{
							return true;
						}
						else{ return false;}
					}
					}]).then(function(ans){
						//console.log(ans);
						if((res[id].stock-ans.quantity)>0)
						{
							connection.query("UPDATE products SET stock='"+(res[id].stock-ans.quantity)+"'WHERE productname='"+product+"'", 
								function(err,res2){
									console.log('product bought!');
									makeTable();
								})
						}else{
							console.log('not a valid selection');
							promptCustomer(res);
						}
					})
				}
			}

			if(i==res.length && correct==false){
				console.log('not a valid selection');
				promptCustomer(res);
			}
		})

}
