// models/Product.js

const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name for the product/exam.'],
    },
    subjectName: {
      type: String,
      required: [true, 'Please add a subject name.'],
    },
    subjectCode: {
      type: String,
      required: [true, 'Please add a subject code.'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price.'],
      min: [0, 'Price must be a positive number.'],
    },
    image: {
      type: String,
      required: [true, 'Please add an image URL.'],
      match: [
        /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))$/i,
        'Please enter a valid image URL.',
      ],
    },
    description: {
      type: String,
      required: [true, 'Please add a description.'],
    },
    type: {
      type: String,
      required: [true, 'Please select a product type.'],
      enum: ['certificate', 'notes', 'exam'],
      lowercase: true,
      trim: true,
    },
    pdfLink: {
      type: String,
      required: [true, 'Please add a PDF link.'],
      match: [/^(https?:\/\/.*\.(pdf))$/i, 'Please enter a valid PDF URL.'],
    },
    ratings: {
      type: Number,
      required: true,
      default: 0,
    },
    numberOfReviews: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Static method to calculate ratings and number of reviews
productSchema.statics.calculateRatings = async function (productId) {
  const Review = mongoose.model('Review');

  // Convert productId to ObjectId using 'new'
  const productObjectId = new mongoose.Types.ObjectId(productId);

  console.log('Calculating ratings for product:', productId);

  const result = await Review.aggregate([
    { $match: { product: productObjectId } },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  console.log('Aggregation result:', result);

  if (result.length > 0) {
    await this.findByIdAndUpdate(productId, {
      ratings: result[0].averageRating,
      numberOfReviews: result[0].totalReviews,
    });
  } else {
    await this.findByIdAndUpdate(productId, {
      ratings: 0,
      numberOfReviews: 0,
    });
  }
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;













// // models/Product.js

// const mongoose = require('mongoose');

// const productSchema = mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, 'Please add a name for the product/exam.'],
//     },
//     subjectName: {
//       type: String,
//       required: [true, 'Please add a subject name.'],
//     },
//     subjectCode: {
//       type: String,
//       required: [true, 'Please add a subject code.'],
//     },
//     price: {
//       type: Number,
//       required: [true, 'Please add a price.'],
//       min: [0, 'Price must be a positive number.'],
//     },
//     image: {
//       type: String,
//       required: [true, 'Please add an image URL.'],
//       match: [
//         /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))$/i,
//         'Please enter a valid image URL.',
//       ],
//     },
//     description: {
//       type: String,
//       required: [true, 'Please add a description.'],
//     },
//     type: {
//       type: String,
//       required: [true, 'Please select a product type.'],
//       enum: ['certificate', 'notes', 'exam'],
//       lowercase: true,
//       trim: true,
//     },
//     pdfLink: {
//       type: String,
//       required: [true, 'Please add a PDF link.'],
//       match: [
//         /^(https?:\/\/.*\.(pdf))$/i,
//         'Please enter a valid PDF URL.',
//       ],
//     },
//     ratings: {
//       type: Number,
//       required: true,
//       default: 0,
//     },
//     numberOfReviews: {
//       type: Number,
//       required: true,
//       default: 0,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Middleware to calculate ratings and numberOfReviews after a review is added/deleted
// // models/Product.js

// productSchema.statics.calculateRatings = async function (productId) {
//   const Review = mongoose.model('Review');

//   // Convert productId to ObjectId using 'new'
//   const productObjectId = new mongoose.Types.ObjectId(productId);

//   console.log('Calculating ratings for product:', productId);

//   const result = await Review.aggregate([
//     { $match: { product: productObjectId } },
//     {
//       $group: {
//         _id: '$product',
//         averageRating: { $avg: '$rating' },
//         totalReviews: { $sum: 1 },
//       },
//     },
//   ]);

//   console.log('Aggregation result:', result);

//   if (result.length > 0) {
//     await this.findByIdAndUpdate(productId, {
//       ratings: result[0].averageRating,
//       numberOfReviews: result[0].totalReviews,
//     });
//   } else {
//     await this.findByIdAndUpdate(productId, {
//       ratings: 0,
//       numberOfReviews: 0,
//     });
//   }
// };


// const Product = mongoose.model('Product', productSchema);

// module.exports = Product;












