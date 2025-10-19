// queries.js - MongoDB CRUD, Advanced Queries, Aggregations, and Indexing

//BASIC CRUD OPERATIONS

// Find all books in a specific genre
db.books.find({ genre: "Fiction" });

// Finding books published after a certain year 
db.books.find({ published_year: { $gt: 2000 } });

// Finding books by a specific author
db.books.find({ author: "George Orwell" }); 

// Updating the price of a specific book
db.books.updateOne(
  { title: "The Alchemist" },
  { $set: { price: 15.99 } }
);

// Deleting a book by its title
db.books.deleteOne({ title: "Moby Dick" });


// ADVANCED QUERIES

// Finding books that are both in stock and published after 2010
db.books.find({
  in_stock: true,
  published_year: { $gt: 2010 }
});

// Projection: returning only title, author, and price
db.books.find({}, { _id: 0, title: 1, author: 1, price: 1 });

// Sorting books by price ascending
db.books.find().sort({ price: 1 });

// Sorting books by price descending
db.books.find().sort({ price: -1 });

// Pagination: limit and skip (5 per page)
db.books.find().limit(5).skip(0); // Page 1
db.books.find().limit(5).skip(5); // Page 2


//  AGGREGATION PIPELINES 

// 1. Average price of books by genre
db.books.aggregate([ 
  {
    $group: {
      _id: "$genre",
      average_price: { $avg: "$price" },
      total_books: { $sum: 1 }
    }
  }
]);

// 2. Author with the most books 
db.books.aggregate([
  {
    $group: {
      _id: "$author",
      total_books: { $sum: 1 }
    }
  },
  { $sort: { total_books: -1 } },
  { $limit: 1 }
]);

// 3. Grouping books by publication decade and count them
db.books.aggregate([
  {
    $group: {
      _id: {
        decade: {
          $multiply: [
            { $floor: { $divide: ["$published_year", 10] } },
            10
          ]
        }
      },
      total_books: { $sum: 1 }
    }
  },
  { $sort: { "_id.decade": 1 } }
]);


// INDEXING 
// Creating index on title
db.books.createIndex({ title: 1 });

// Creating compound index on author and published_year
db.books.createIndex({ author: 1, published_year: -1 });

// Using explain() to demonstrate performance improvement
db.books.find({ title: "1984" }).explain("executionStats");
