const History = require('../models/History')

//create history controller
const createHistory = async (req, res) => {
    try {
        const { content , userId } = req.body;

        //check user exist
        if(!userId){
            return res.status(400).json({
                success: false,
                message: 'User not found ! Please try again !'
            })
        }

        const newHistory = new History({
            user: userId,
            content: content
        })

        //check created product 
        if(!newHistory){
            return res.status(400).json({
                success: false,
                message: 'History not created ! Please try again !'
            })
        }

        await newHistory.save()

        res.status(200).json({
            success: true,
            message: "History created successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

//fetch all histories controller
const fetchAllHistory = async (req, res) => {
    try {

        const userId = req.params.id;

        const limit = parseInt(req.query.limit) || 6;

        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    
        const sortObject = {};
        sortObject[sortBy] = sortOrder;

        const histories = await History.find({user: userId}).sort(sortObject).limit(limit);
        if(!posts){
            return res.status(400).json({
                success: false,
                message: 'Histories not found ! Please try again !'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Histories fetched successfully !',
            data: histories
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

//delete history controller
const deleteHistory = async (req, res) => {
    try {
        const { id } = req.params.id;

        //check history exist
        const history = await History.findById(id);
        if(!product){
            return res.status(400).json({
                success: false,
                message: 'History not found ! Please try again !'
            })
        }

        //delete history
        await History.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'History deleted successfully !',
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
    createHistory,
    fetchAllHistory,
    deleteHistory
}
