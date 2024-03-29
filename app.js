const express = require("express");

const app = express();
const bodyparser = require("body-parser");

const port = process.env.PORT || 3200;

const orders = [];

// middleware

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));

app.post("/new_order", (req, res) => {
	const order = req.body;
	console.log(order);
	if (order.food_name && order.customer_name && order.food_quantity) {
		orders.push({
			...order,

			id: `${orders.length + 1}`,

			date: Date.now().toString()
		});

		res.status(200).json({
			message: "Order created successfully"
		});
	} else {
		res.status(401).json({
			message: "Invalid Order creation"
		});
	}
});

app.get("/get_orders", (req, res) => {
	res.status(200).send(orders);
});

app.patch("/order/:id", (req, res) => {
	const order_id = req.params.id;

	const order_update = req.body;

	for (let order of orders) {
		if (order.id === order_id) {
			if (order_update.food_name != null || undefined)
				order.food_name = order_update.food_name;

			if (order_update.food_quantity != null || undefined)
				order.food_quantity = order_update.food_quantity;

			if (order_update.customer_name != null || undefined)
				order.customer_name = order_update.customer_name;

			return res
				.status(200)
				.json({message: "Updated Succesfully", data: order});
		}
	}

	res.status(404).json({message: "Invalid Order Id"});
});

app.delete("/order/:id", (req, res) => {
	const order_id = req.params.id;

	for (let order of orders) {
		if (order.id === order_id) {
			orders.splice(orders.indexOf(order), 1);

			return res.status(200).json({
				message: "Deleted Successfully"
			});
		}
	}

	res.status(404).json({message: "Invalid Order Id"});
});

app.listen(port, () => {
	console.log(`running at port ${port}`);
});
