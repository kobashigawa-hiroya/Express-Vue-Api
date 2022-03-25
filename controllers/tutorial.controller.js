const { response } = require("express");
const { get } = require("express/lib/response");
const db = require("../models");
const Tutorial = db.tutorials;
const Op = db.Sequelize.Op;
const getPagination = (page, size) => {
  const limit = size ? size :3;
  size 
  const offset = page ? page * limit :0 ;
  return { limit, offset};
}
const getPagingData = (data, page, limit)=> {
  const { count: totalItems, rows: tutorials } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  return { totalItems, tutorials, totalPages, currentPage };
};

// Create and Save a new Tutorial
exports.create = (req, res) => {
    console.log('create:::' + req.body.title);
  // Validate request
  if (!req.body.title) {
    //req.body.titleがあったら
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Tutorial
  const tutorial = {
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false
  };

  // Save Tutorial in the database
  Tutorial.create(tutorial)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });  
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    const { page, size, title } = req.query;
    console.log('findAll:::' + req.params.id);
    // const title = req.query.title;
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
    const { limit, offset } = getPagination(page, size);
    // const pageAsNumber = Number.parseInt(req.query.page);
    // const sizeAsNumber = Number.parseInt(req.query.size);

    // let page = 0;
    // if(!Number.isNaN(pageAsNumber))
    
  
    // const { page, size } = req.query;
    Tutorial.findAndCountAll({ 
      
      // limit: size,//１ページに表示する値数
      // offset: page,//0~番目までスキップしフェッチする
      where: condition, limit, offset })
    
      .then(data => {
        const response = getPagingData(data, page, limit)
        res.send(response);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tutorials."
        });
      });  
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
    console.log('findOne:::' + req.params.id);
    const id = req.params.id;

    Tutorial.findByPk(id)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find Tutorial with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Tutorial with id=" + id
        });
      });  
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
    console.log('update:::' + req.params.id);
    const id = req.params.id;

    Tutorial.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Tutorial was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Tutorial with id=" + id
        });
      });  
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
    console.log('delete:::' + req.params.id);
    const id = req.params.id;

    Tutorial.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Tutorial was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Tutorial with id=" + id
        });
      });  
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
    console.log('deleteAll:::' + req);
    Tutorial.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} Tutorials were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all tutorials."
          });
        });  
};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
    console.log('findAllPublished:::' + req);
    Tutorial.findAndCountAll({ where: { published: true },limit,offset })
    .then(data => {
      const response = getPagingData(data, page, limit)
      res.send(response);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });  
};