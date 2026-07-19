// require("dotenv").config();

// const express = require("express");
// const app = express();

// const bodyParser = require("body-parser");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const path = require("path");

// // ROUTES
// const productRoute = require("./product/product.route.js");

// const salesRoute = require("./vender/sales.route.js");
// const billRoute = require("./bill/bill.route.js");
// const paymentRoute = require("./payment/payment.route.js");

// const stateRoute = require("./admin/state.route.js");
// const cityRoute = require("./admin/city.route.js");
// const productCatgRoute = require("./admin/productcatg.route.js");

// const inventoryRoutes = require("./product/inventory.route.js");

// const venderRoute = require("./vender/vender.route.js");
// const customerRoute = require("./customer/customer.route.js");

// const orderRoute = require("./order/order.route.js");

// // MIDDLEWARE
// app.use(cors());

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// // STATIC
// app.use(
//   "/customer-images",
//   express.static(path.join(__dirname, "customer/rahulimage"))
// );

// // ROUTES USE
// app.use("/product", productRoute);

// app.use("/sales", salesRoute);

// app.use("/bill", billRoute);

// app.use("/payment", paymentRoute);

// app.use("/state", stateRoute);

// app.use("/city", cityRoute);

// app.use("/productcatg", productCatgRoute);

// app.use("/inventory", inventoryRoutes);

// app.use("/vender", venderRoute);

// app.use("/customer", customerRoute);

// app.use("/order", orderRoute);

// // TEST API
// app.get("/", (req, res) => {
//   res.send("API working fine");
// });

// // DATABASE
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("✅ DB connected");
//   })
//   .catch((err) => {
//     console.log("❌ DB Error:", err);
//   });

// // SERVER
// const PORT = process.env.PORT || 9292;

// // app.listen(PORT, () => {
// //   console.log(`🚀 Server running on port ${PORT}`);
// // });
// app.get("/", (req, res) => {
//   res.send("API Running");
// });

// module.exports = app;

require("dotenv").config();

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const emailRouter = require("./emailactivation");
// ROUTES
const productRoute = require("./product/product.route.js");

const salesRoute = require("./vender/sales.route.js");

const billRoute = require("./bill/bill.route.js");

const paymentRoute = require("./payment/payment.route.js");

const stateRoute = require("./admin/state.route.js");

const cityRoute = require("./admin/city.route.js");

const productCatgRoute = require("./admin/productcatg.route.js");

const inventoryRoutes = require("./product/inventory.route.js");

const venderRoute = require("./vender/vender.route.js");

const customerRoute = require("./customer/customer.route.js");

const orderRoute = require("./order/order.route.js");

const addressRoute = require("./address/address.route");

const dashboardRoute = require(
  "./dashboard/dashboard.route"
);
const newsletterRoute = require("./newsletter.route");


// ================= MIDDLEWARE =================
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://project-frontend-grrf.vercel.app"
    ],
     methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS"
    ],
    credentials: true,
  })
);


app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

// ================= ROUTES =================

app.use("/product", productRoute);

app.use("/sales", salesRoute);

app.use("/bill", billRoute);

app.use("/payment", paymentRoute);

app.use("/state", stateRoute);

app.use("/city", cityRoute);

app.use("/productcatg", productCatgRoute);

app.use("/inventory", inventoryRoutes);

app.use("/vender", venderRoute);

app.use("/customer", customerRoute);

app.use("/order", orderRoute);
app.use("/email", emailRouter);

app.use("/dashboard", dashboardRoute);
app.use("/address", addressRoute);


app.use("/newsletter", newsletterRoute);

// ================= TEST ROUTE =================

app.get("/", (req, res) => {
  res.send("✅ API Running Successfully");


});

// ================= DATABASE =================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.log("❌ MongoDB Error:", err);
  });

// ================= SERVER =================

const PORT = process.env.PORT || 9292;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });
module.exports = app;