const ProductModel = require('../models/product.model')

const productDisplay = (req, res) => {
    res.render("product")
}

const addProduct = (req, res) => {
    let form = new ProductModel(req.body);

    form.save()
        .then(() => {
            console.log("Product Added");
            // Only send ONE response
            return res.send({ status: true, message: "Product Added Successfully" });
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).send({ status: false, message: "Error Adding Product" });
        });
};

const fetchProduct = (req, res) => {
    ProductModel.find()
        .then((product) => {
            console.log(product);
            return res.render("allproducts", { allproducts: product });
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).send("Error fetching product");
        });
};

const deleteProduct = (req, res) => {
    ProductModel.findByIdAndDelete(req.params.id)
        .then(() => {
            console.log("Product Deleted");
            return res.redirect("/allproducts");
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).send("Error deleting product");
        });
};

const editProduct = (req, res) => {
    ProductModel.findById(req.params.id)
        .then((product) => {
            if (!product) return res.send("Product Not Found");
            return res.render("editproduct", { product });
        })
        .catch((err) => {
            console.log(err);
            return res.send("Error loading product");
        });
};

const updateProduct = (req, res) => {
    const { product_name, product_price, product_quantity } = req.body;

    ProductModel.findByIdAndUpdate(
        req.params.id,
        { product_name, product_price, product_quantity },
        { new: true }
    )
        .then(() => {
            console.log("Product Updated");
            return res.redirect("/allproducts");
        })
        .catch((err) => {
            console.log(err);
            return res.send("Error updating product");
        });
};

module.exports = {
    addProduct,
    fetchProduct,
    deleteProduct,
    editProduct,
    updateProduct,
    productDisplay
};
