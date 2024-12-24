const InterestCategory = require("../model/interest-category-model");
const {error, success} = require('../helper/api-response')
exports.getCategories = async (req, res) => {
    try {
      // Fetch all categories from the database
      const categories = await InterestCategory.findAll();
  
      // Check if categories were found
      if (categories.length === 0) {
        return res.status(404).json(
            success("No categories found", { data: [] }, res.statusCode)
        );
      }
  
      // Respond with the list of categories
      return res.status(200).json(
        success("Categories fetched successfully", { data: categories }, res.statusCode)
      );
    } catch (error) {
      console.error('Error fetching categories:', error);
      return res.status(500).json(
        error('Internal server error', res.statusCode)
      );
    }
  };
