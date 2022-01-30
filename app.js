let fs = require(`fs`)
let express = require('express');
let app = express();

let productRouter = express.Router()
let urlencodedParser = express.urlencoded({ extended: false })
let fileName = process.argv[2];

app.get('/', function (req, res) {
  let file = fs.readFileSync("db.txt", "utf-8")
  res.send(file)
})

app.get('/about', function (req, res) {
  let file = fs.readFileSync("aboutMe.txt", "utf-8")
  res.send(file)
})

productRouter.get("/", function (req, res) {
  res.sendFile(__dirname + "/pages/products.html")

})
productRouter.post("/", urlencodedParser, function (req, res) {
  let newProduct = {
    name: req.body.product_name,
    price: +req.body.product_price
  }

  console.log(newProduct)
  let productsArray = JSON.parse(fs.readFileSync("db.txt", "utf-8"))
  productsArray.push(newProduct)

  fs.writeFileSync(fileName, JSON.stringify(productsArray))

  res.send("ok");
})
productRouter.get("/:name/", function (req, res) {
  let productName = req.params[`name`];

  let productsArray = JSON.parse(fs.readFileSync(fileName, "utf-8"));

  for (let i = 0; i < productsArray.length; i++) {
    if (productsArray[i].name === productName) {
      res.send(productsArray[i])
      break;
    }
  }
})
app.use('/products', productRouter)

app.listen(8080)