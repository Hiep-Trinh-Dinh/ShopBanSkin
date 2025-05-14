const { uploadToCloudinary, uploadVideoToCloudinary } = require('../helpers/cloudinary-helper');
const Image = require('../models/Image');
const Product = require('../models/Product')

//create product controller
const createProduct = async (req, res) => {
    try {
        const { name, price, story, releaseDate } = req.body;
        
        const imageURL = req.files['image'][0].path;
        const videoURL = req.files['video'][0].path;
        
        //check product exist
        const product = await Product.findOne({name});
        if(product){
            return res.status(400).json({
                success: false,
                message: 'Product already exist ! Please try again !'
            })
        }
        
        const newProduct = new Product({
            name,
            image: imageURL,
            price,
            story,
            releaseDate,
            video: videoURL,
        })

        //check created product 
        if(!newProduct){
            return res.status(400).json({
                success: false,
                message: 'Product not created ! Please try again !'
            })
        }

        await newProduct.save()

        res.status(200).json({
            success: true,
            message: "Product created successfully",
            data: newProduct
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

//fetch all products controller
const fetchAllProducts = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 6;
      const skip = (page - 1) * limit;
  
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
      const searchTerm = req.query.searchTerm || '';
  
      const sortObject = {};
      sortObject[sortBy] = sortOrder;
  
      let query = { isDeleted: false };
      if (searchTerm) {
        query.name = { $regex: searchTerm, $options: 'i' };
      }
  
      const totalProducts = await Product.countDocuments(query);
      const totalPages = Math.ceil(totalProducts / limit);
  
      const products = await Product.find(query).sort(sortObject).skip(skip).limit(limit);
      if (!products) {
        return res.status(400).json({
          success: false,
          message: 'Products not found ! Please try again !'
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Products fetched successfully !',
        currentPage: page,
        totalPages: totalPages,
        totalProducts: totalProducts,
        data: products
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
//fetch detail product controller
const fetchDetailProduct = async (req, res) => {
    try {
        const id  = req.params.id;

        //check product exist
        const product = await Product.findById(id);
        if(!product){
            return res.status(400).json({
                success: false,
                message: 'Product not found ! Please try again !'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Product fetched successfully !',
            data: product
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

//edit product controller
const editProduct = async (req, res) => {
    try {
        const id  = req.params.id;
        const { name, price, story, releaseDate } = req.body;

        console.log(req.body);
        //check product exist
        const product = await Product.findById(id);
        if(!product){
            return res.status(400).json({
                success: false,
                message: 'Product not found ! Please try again !'
            })
        }

        // Prepare update data
        const updateData = {
            name,
            story,
            price,
            releaseDate
        };

        // If new image is uploaded, add it to update data
        if (req.file) {
            updateData.image = req.files['image'][0].path;
            updateData.video = req.files['video'][0].path;
        }

        //update product
        const updateProduct = await Product.findByIdAndUpdate(
            id,
            updateData,
            {new: true}
        )

        //check product update 
        if(!updateProduct){
            return res.status(400).json({
                success: false,
                message: 'Product not updated ! Please try again !'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Product updated successfully !',
            data: updateProduct
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

//delete product controller
const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;

        //check product exist
        const product = await Product.findById(id);
        if(!product){
            return res.status(400).json({
                success: false,
                message: 'Product not found ! Please try again !'
            })
        }

        //delete product
        product.isDeleted = true;
        await product.save();

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully !',
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

module.exports = {
    createProduct,
    fetchAllProducts,
    fetchDetailProduct,
    editProduct,
    deleteProduct
}
