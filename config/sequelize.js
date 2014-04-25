var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize-mysql').sequelize;
var _         = require('lodash');
var config    = require('./config');
var db        = {};

console.log('Initializing Sequelize');

// create your instance of sequelize
var sequelize = new Sequelize(config.db.name, config.db.username, config.db.password, {
  dialect: 'mysql',
  storage: config.db.storage
});

// loop through all files in models directory ignoring hidden files and this file
fs.readdirSync(config.modelsDir)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js')
  })
  // import model files and save model names
  .forEach(function(file) {
    console.log('Loading model file ' + file);
    var model = sequelize.import(path.join(config.modelsDir, file));
    db[model.name] = model;
  })

// invoke associations on each of the models
Object.keys(db).forEach(function(modelName) {
  if (db[modelName].options.hasOwnProperty('associate')) {
    db[modelName].options.associate(db)
  }
});


// Synchronizing any model changes with database. 
// WARNING: this will DROP your database everytime you re-run your application

sequelize
  .sync({force: true})
  .complete(function(err)
  {
    if(err) console.log("An error occured %j",err);
    else console.log("Database dropped and synchronized");

      /* Insert  Main Categories */
    db['Category'].bulkCreate([
      { title: 'Microsoft'},
      { title: 'Sony' },
      { title: 'Nintendo' }
    ]).success(function()
    {
      /* Insert next sub-categories (consoles) */
      db['Category'].find({ where: {title: 'Microsoft'}}).success(function(cat) 
      {
        var consoleID = cat.dataValues.id;
        db['Category'].bulkCreate([
          { title: 'Xbox', ParentId: consoleID},
          { title: 'Xbox 360', ParentId: consoleID},
          { title: 'Xbox One', ParentId: consoleID}
        ]).success(function() 
        {
          /* Insert next sub-categories (genres) */
          db['Category'].find({ where: {title: 'Xbox 360'}}).success(function(cat) 
          {
            var consoleID = cat.dataValues.id;
            db['Category'].bulkCreate([
              { title: 'Action', ParentId: consoleID},
              { title: 'Casual', ParentId: consoleID},
              { title: 'Fighting', ParentId: consoleID},
              { title: 'Roleplaying', ParentId: consoleID},
              { title: 'Shooter', ParentId: consoleID},
              { title: 'Sports', ParentId: consoleID},
              { title: 'Strategy', ParentId: consoleID }
            ])
          })

          db['Category'].find({ where: {title: 'Xbox'}}).success(function(cat) 
          {
            var consoleID = cat.dataValues.id;
            db['Category'].bulkCreate([
              { title: 'Action', ParentId: consoleID},
              { title: 'Casual', ParentId: consoleID},
              { title: 'Fighting', ParentId: consoleID},
              { title: 'Roleplaying', ParentId: consoleID},
              { title: 'Shooter', ParentId: consoleID},
              { title: 'Sports', ParentId: consoleID},
              { title: 'Strategy', ParentId: consoleID }
            ])
          })

          db['Category'].find({ where: {title: 'Xbox One'}}).success(function(cat) 
          {
            var consoleID = cat.dataValues.id;
            db['Category'].bulkCreate([
              { title: 'Action', ParentId: consoleID},
              { title: 'Casual', ParentId: consoleID},
              { title: 'Fighting', ParentId: consoleID},
              { title: 'Roleplaying', ParentId: consoleID},
              { title: 'Shooter', ParentId: consoleID},
              { title: 'Sports', ParentId: consoleID},
              { title: 'Strategy', ParentId: consoleID }
            ])
          })
        })
      });

      db['Category'].find({ where: {title: 'Sony'}}).success(function(cat) 
      {
        var consoleID = cat.dataValues.id;
        db['Category'].bulkCreate([
          { title: 'PlayStation', ParentId: consoleID},
          { title: 'PlayStation 2', ParentId: consoleID},
          { title: 'PlayStation 3', ParentId: consoleID},
          { title: 'PlayStation 4', ParentId: consoleID},
          { title: 'PSP', ParentId: consoleID}
        ]).success(function() 
        {
          /* Insert next sub-categories (genres) */
          db['Category'].find({ where: {title: 'Playstation'}}).success(function(cat) 
          {
            var consoleID = cat.dataValues.id;
            db['Category'].bulkCreate([
              { title: 'Action', ParentId: consoleID},
              { title: 'Casual', ParentId: consoleID},
              { title: 'Fighting', ParentId: consoleID},
              { title: 'Roleplaying', ParentId: consoleID},
              { title: 'Shooter', ParentId: consoleID},
              { title: 'Sports', ParentId: consoleID},
              { title: 'Strategy', ParentId: consoleID }
            ])
          })

          db['Category'].find({ where: {title: 'Playstation 2'}}).success(function(cat) 
          {
            var consoleID = cat.dataValues.id;
            db['Category'].bulkCreate([
              { title: 'Action', ParentId: consoleID},
              { title: 'Casual', ParentId: consoleID},
              { title: 'Fighting', ParentId: consoleID},
              { title: 'Roleplaying', ParentId: consoleID},
              { title: 'Shooter', ParentId: consoleID},
              { title: 'Sports', ParentId: consoleID},
              { title: 'Strategy', ParentId: consoleID }
            ])
          })

          db['Category'].find({ where: {title: 'Playstation 3'}}).success(function(cat) 
          {
            var consoleID = cat.dataValues.id;
            db['Category'].bulkCreate([
              { title: 'Action', ParentId: consoleID},
              { title: 'Casual', ParentId: consoleID},
              { title: 'Fighting', ParentId: consoleID},
              { title: 'Roleplaying', ParentId: consoleID},
              { title: 'Shooter', ParentId: consoleID},
              { title: 'Sports', ParentId: consoleID},
              { title: 'Strategy', ParentId: consoleID }
            ])
          })
          db['Category'].find({ where: {title: 'Playstation 4'}}).success(function(cat) 
          {
            var consoleID = cat.dataValues.id;
            db['Category'].bulkCreate([
              { title: 'Action', ParentId: consoleID},
              { title: 'Casual', ParentId: consoleID},
              { title: 'Fighting', ParentId: consoleID},
              { title: 'Roleplaying', ParentId: consoleID},
              { title: 'Shooter', ParentId: consoleID},
              { title: 'Sports', ParentId: consoleID},
              { title: 'Strategy', ParentId: consoleID }
            ])
          })
          db['Category'].find({ where: {title: 'PSP'}}).success(function(cat) 
            {
            var consoleID = cat.dataValues.id;
            db['Category'].bulkCreate([
              { title: 'Action', ParentId: consoleID},
              { title: 'Casual', ParentId: consoleID},
              { title: 'Fighting', ParentId: consoleID},
              { title: 'Roleplaying', ParentId: consoleID},
              { title: 'Shooter', ParentId: consoleID},
              { title: 'Sports', ParentId: consoleID},
              { title: 'Strategy', ParentId: consoleID }
            ])
          })
        })
      });

      db['Category'].find({ where: {title: 'Nintendo'}}).success(function(cat) 
      {
        var consoleID = cat.dataValues.id;
        db['Category'].bulkCreate([
          { title: 'Nintendo 64', ParentId: consoleID},
          { title: 'Gamecube', ParentId: consoleID},
          { title: 'Wii', ParentId: consoleID},
          { title: 'Game Boy', ParentId: consoleID},
          { title: 'Nintendo DS', ParentId: consoleID}
        ]).success(function() 
        {
          /* Insert next sub-categories (genres) */
          db['Category'].find({ where: {title: 'Nintendo 64'}}).success(function(cat) 
          {
            var consoleID = cat.dataValues.id;
            db['Category'].bulkCreate([
              { title: 'Action', ParentId: consoleID},
              { title: 'Casual', ParentId: consoleID},
              { title: 'Fighting', ParentId: consoleID},
              { title: 'Roleplaying', ParentId: consoleID},
              { title: 'Shooter', ParentId: consoleID},
              { title: 'Sports', ParentId: consoleID},
              { title: 'Strategy', ParentId: consoleID }
            ])
          })

          db['Category'].find({ where: {title: 'Gamecube'}}).success(function(cat) 
          {
            var consoleID = cat.dataValues.id;
            db['Category'].bulkCreate([
              { title: 'Action', ParentId: consoleID},
              { title: 'Casual', ParentId: consoleID},
              { title: 'Fighting', ParentId: consoleID},
              { title: 'Roleplaying', ParentId: consoleID},
              { title: 'Shooter', ParentId: consoleID},
              { title: 'Sports', ParentId: consoleID},
              { title: 'Strategy', ParentId: consoleID }
            ])
          })
          db['Category'].find({ where: {title: 'Wii'}}).success(function(cat) 
          {
            var consoleID = cat.dataValues.id;
            db['Category'].bulkCreate([
              { title: 'Action', ParentId: consoleID},
              { title: 'Casual', ParentId: consoleID},
              { title: 'Fighting', ParentId: consoleID},
              { title: 'Roleplaying', ParentId: consoleID},
              { title: 'Shooter', ParentId: consoleID},
              { title: 'Sports', ParentId: consoleID},
              { title: 'Strategy', ParentId: consoleID }
            ])
          })
          db['Category'].find({ where: {title: 'Game Boy'}}).success(function(cat) 
          {
            var consoleID = cat.dataValues.id;
            db['Category'].bulkCreate([
              { title: 'Action', ParentId: consoleID},
              { title: 'Casual', ParentId: consoleID},
              { title: 'Fighting', ParentId: consoleID},
              { title: 'Roleplaying', ParentId: consoleID},
              { title: 'Shooter', ParentId: consoleID},
              { title: 'Sports', ParentId: consoleID},
              { title: 'Strategy', ParentId: consoleID }
            ])
          })
          db['Category'].find({ where: {title: 'Nintendo DS'}}).success(function(cat) 
          {
            var consoleID = cat.dataValues.id;
            db['Category'].bulkCreate([
              { title: 'Action', ParentId: consoleID },
              { title: 'Casual', ParentId: consoleID },
              { title: 'Fighting', ParentId: consoleID },
              { title: 'Roleplaying', ParentId: consoleID },
              { title: 'Shooter', ParentId: consoleID },
              { title: 'Sports', ParentId: consoleID },
              { title: 'Strategy', ParentId: consoleID }
            ])
          })
        })
      });
      
      db['Category'].findAll().success(function(categories) 
      {
        console.log('Categories insert successful.') // ... in order to get the array of category objects
      })


    });

    // Insert starting demo users
    var user = db.User.build({name: 'm', email: 'm', username: 'm', user_type: 'Individual'});

    user.salt = user.makeSalt();
    user.hashedPassword = user.encryptPassword('m', user.salt);
    user.save().success(function(){console.log('User m created.')}).error(function(err){console.log('User creation failed.')});

    var user2 = db.User.build({name: 'b', email: 'b', username: 'b', user_type: 'Individual'});

    user2.salt = user2.makeSalt();
    user2.hashedPassword = user2.encryptPassword('b', user2.salt);
    user2.save().success(function(){console.log('User b created.')}).error(function(err){console.log('User creation failed.')});
 
  });

// assign the sequelize variables to the db object and returning the db. 
module.exports = _.extend(
{
  sequelize: sequelize,
  Sequelize: Sequelize
}, db);