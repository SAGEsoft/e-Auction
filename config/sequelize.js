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

    /* Adding auto completes */
    db['Auto_Complete'].bulkCreate([
      { title: 'Titanfall', url: 'http://www.titanfall.com/', description: 'Titanfall is a 2014 online multiplayer, first-person shooter video game developed by ' +
         'Respawn Entertainment. Players fight as free-running foot soldier "pilots" who can commandeer agile, mech-style exoskeleton "Titans" to complete ' +
         'team-based objectives on derelict and war-torn colonies at the Frontier fringe of space exploration as either the Interstellar Manufacturing Corporation ' +
         '(IMC) or the Militia.', image: 'http://www.digitaltrends.com/wp-content/uploads/2014/03/Titanfall-guide-header.jpg'},
      { title: 'Borderlands 2', url: 'http://www.borderlands2.com/', description: 'Borderlands 2 is an action role-playing first-person shooter video game, ' + 
         'developed by Gearbox Software. It allows players to complete a campaign consisting of central quests and optional side-missions as one of four ' +
         'treasure seekers, "Vault Hunters", on the planet Pandora. It also features lots of looting weapons and accessories, upgrading your character\'s skills, ' +
         'and hilarity.', image: 'http://thepgm.com/wp-content/uploads/2014/01/bl2.jpg'},
      { title: 'The Last of Us', url: 'http://www.thelastofus.playstation.com/', description: 'The Last of Us is an action-adventure survival horror video game ' +
         'developed by Naughty Dog. The player controls Joel escorting the young Ellie across a post-apocalyptic United States that has been ravaged by ' +
         'infection. The player uses firearms, improvised weapons and stealth techniques to defend against hostile bandits and zombie-like creatures infected ' +
         'by a mutated strain of the Cordyceps fungus.', image: 'http://cdn.fansided.com/wp-content/blogs.dir/229/files/2013/10/thelastofuswallpaper.png'},
      { title: 'The Elder Scrolls V: Skyrim', url: 'http://www.elderscrolls.com/skyrim', description: 'The Elder Scrolls V: Skyrim is an action role-playing video ' +
         'game developed by Bethesda Game Studios. Skyrim\'s main story revolves around the player character\'s efforts to defeat Alduin, a Dragon who is ' +
         'prophesied to destroy the world. Over the course of the game, the player completes quests and develops their character by improving their skills in a ' +
         'massive open world.', image: 'http://lifeasadigitalsalad.files.wordpress.com/2013/11/the_elder_scrolls_v_skyrim.jpg'},
      { title: 'Call of Duty: Ghosts', url: 'http://www.callofduty.com/ghosts', description: 'Call of Duty: Ghosts is a 2013 first-person shooter video game ' +
         'developed by Infinity Ward. It is set in an alternate timeline that follows the nuclear destruction of the Middle East. The oil-producing nations of South ' +
         'America form "the Federation" in response to the ensuing global economic crisis and quickly grow into a global superpower, swiftly invading and ' +
         'conquering Central America and the Caribbean.', image: 'http://highdesertdaily.com/wp-content/uploads/2014/02/Call-of-Duty-Ghosts2.jpg'},
      { title: 'Forza Motorsport 5', url: 'http://www.forzamotorsport.net/en-us/games/fm5', description: 'Forza Motorsport 5 is a racing video game developed ' +
         'by Turn 10 Studios. The game ships with 200 cars from over 50 manufacturers and 15 circuits, and features next-gen graphics and new "drivatars" ' +
         'which are AI likenesses of you that drive even while you aren\'t playing.', 
         image: 'http://compass.xboxlive.com/assets/b3/e5/b3e52cec-a534-4564-b782-0f64854d1732.jpg?n=LCE_announce_screen2.jpg'},
      { title: 'Marvel Vs. Capcom 3', url: 'http://www.marvelvscapcom3.com/us', description: 'Marvel vs. Capcom 3 is a crossover fighting game developed ' +
         'by Capcom. Doctor Doom has assembled the greatest villains of the Marvel Universe and has joined forces with Albert Wesker in order to unite their ' +
         'respective universes in an effort to conquer both. However, this course of action awakens Galactus who could potentially destroy both worlds. It is up ' +
         'to the heroes of the Marvel and Capcom universes to put a stop to Galactus before it is too late.',
         image: 'http://operationrainfall.com/wp-content/uploads/2013/12/Marvel-vs-Capcom-3.jpg'}
    ])
    
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
          { title: 'PlayStation 3', ParentId: consoleID},
          { title: 'PlayStation 4', ParentId: consoleID}
        ]).success(function() 
        {
          /* Insert next sub-categories (genres) */
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
          
        })
      });

      db['Category'].find({ where: {title: 'Nintendo'}}).success(function(cat) 
      {
        var consoleID = cat.dataValues.id;
        db['Category'].bulkCreate([
          { title: 'Wii', ParentId: consoleID},
          { title: 'Nintendo DS', ParentId: consoleID}
        ]).success(function() 
        {
          /* Insert next sub-categories (genres) */
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


    }).then(function() {
        /* Adding auction items */
        db['Item'].bulkCreate([
            { title: 'Titanfall', url: 'http://www.titanfall.com/', description: 'Titanfall is a 2014 online multiplayer, first-person shooter video game developed by ' +
               'Respawn Entertainment. Players fight as free-running foot soldier "pilots" who can commandeer agile, mech-style exoskeleton "Titans" to complete ' +
               'team-based objectives on derelict and war-torn colonies at the Frontier fringe of space exploration as either the Interstellar Manufacturing Corporation ' +
               '(IMC) or the Militia.', image: 'http://www.digitaltrends.com/wp-content/uploads/2014/03/Titanfall-guide-header.jpg', current_bid: 40, buy_it_now: 60,
               reserve_price: 45, console_id: 7, auction_ended: false, UserId: 1, AddressId: 2, CategoryId: 35},
            { title: 'Borderlands 2', url: 'http://www.borderlands2.com/', description: 'Borderlands 2 is an action role-playing first-person shooter video game, ' + 
               'developed by Gearbox Software. It allows players to complete a campaign consisting of central quests and optional side-missions as one of four ' +
               'treasure seekers, "Vault Hunters", on the planet Pandora. It also features lots of looting weapons and accessories, upgrading your character\'s skills, ' +
               'and hilarity.', image: 'http://thepgm.com/wp-content/uploads/2014/01/bl2.jpg', current_bid: 15, buy_it_now: 35, reserve_price: 25, console_id: 6,
               auction_ended: false, UserId: 2, AddressId: 3, CategoryId: 21},
            { title: 'The Last of Us', url: 'http://www.thelastofus.playstation.com/', description: 'The Last of Us is an action-adventure survival horror video game ' +
               'developed by Naughty Dog. The player controls Joel escorting the young Ellie across a post-apocalyptic United States that has been ravaged by ' +
               'infection. The player uses firearms, improvised weapons and stealth techniques to defend against hostile bandits and zombie-like creatures infected ' +
               'by a mutated strain of the Cordyceps fungus.', image: 'http://cdn.fansided.com/wp-content/blogs.dir/229/files/2013/10/thelastofuswallpaper.png',
               current_bid: 30, buy_it_now: 40, reserve_price: 35, console_id: 8, auction_ended: false, UserId: 3, AddressId: 6, CategoryId: 38},
            { title: 'The Elder Scrolls V: Skyrim', url: 'http://www.elderscrolls.com/skyrim', description: 'The Elder Scrolls V: Skyrim is an action role-playing video ' +
               'game developed by Bethesda Game Studios. Skyrim\'s main story revolves around the player character\'s efforts to defeat Alduin, a Dragon who is ' +
               'prophesied to destroy the world. Over the course of the game, the player completes quests and develops their character by improving their skills in a ' +
               'massive open world.', image: 'http://lifeasadigitalsalad.files.wordpress.com/2013/11/the_elder_scrolls_v_skyrim.jpg',
               current_bid: 5, buy_it_now: 20, reserve_price: 5, console_id: 8, auction_ended: false, UserId: 4, AddressId: 4, CategoryId: 41},
            { title: 'Marvel Vs. Capcom 3', url: 'http://www.marvelvscapcom3.com/us', description: 'Marvel vs. Capcom 3 is a crossover fighting game developed ' +
               'by Capcom. Doctor Doom has assembled the greatest villains of the Marvel Universe and has joined forces with Albert Wesker in order to unite their ' +
               'respective universes in an effort to conquer both. However, this course of action awakens Galactus who could potentially destroy both worlds. It is up ' +
               'to the heroes of the Marvel and Capcom universes to put a stop to Galactus before it is too late.',
               image: 'http://operationrainfall.com/wp-content/uploads/2013/12/Marvel-vs-Capcom-3.jpg',
               current_bid: 2, buy_it_now: 10, reserve_price: 5, console_id: 4, auction_ended: false, UserId: 5, AddressId: 1, CategoryId: 12}
        ])
        
        /* Adding trading items */
        db['TradeItem'].bulkCreate([
            { title: 'Titanfall', url: 'http://www.titanfall.com/', description: 'Titanfall is a 2014 online multiplayer, first-person shooter video game developed by ' +
               'Respawn Entertainment. Players fight as free-running foot soldier "pilots" who can commandeer agile, mech-style exoskeleton "Titans" to complete ' +
               'team-based objectives on derelict and war-torn colonies at the Frontier fringe of space exploration as either the Interstellar Manufacturing Corporation ' +
               '(IMC) or the Militia.', image: 'http://www.digitaltrends.com/wp-content/uploads/2014/03/Titanfall-guide-header.jpg',
               desired_item: 'Infamous: Second Son for PS4', console_id: 7, UserId: 1, AddressId: 2, CategoryId: 35},
            { title: 'Borderlands 2', url: 'http://www.borderlands2.com/', description: 'Borderlands 2 is an action role-playing first-person shooter video game, ' + 
               'developed by Gearbox Software. It allows players to complete a campaign consisting of central quests and optional side-missions as one of four ' +
               'treasure seekers, "Vault Hunters", on the planet Pandora. It also features lots of looting weapons and accessories, upgrading your character\'s skills, ' +
               'and hilarity.', image: 'http://thepgm.com/wp-content/uploads/2014/01/bl2.jpg',
               desired_item: 'Super Smash Bros. for Wii', console_id: 6, UserId: 2, AddressId: 3, CategoryId: 21},
            { title: 'The Last of Us', url: 'http://www.thelastofus.playstation.com/', description: 'The Last of Us is an action-adventure survival horror video game ' +
               'developed by Naughty Dog. The player controls Joel escorting the young Ellie across a post-apocalyptic United States that has been ravaged by ' +
               'infection. The player uses firearms, improvised weapons and stealth techniques to defend against hostile bandits and zombie-like creatures infected ' +
               'by a mutated strain of the Cordyceps fungus.', image: 'http://cdn.fansided.com/wp-content/blogs.dir/229/files/2013/10/thelastofuswallpaper.png',
               desired_item: 'Call of Duty: World at War for Xbox 360', console_id: 8, UserId: 3, AddressId: 6, CategoryId: 38},
            { title: 'The Elder Scrolls V: Skyrim', url: 'http://www.elderscrolls.com/skyrim', description: 'The Elder Scrolls V: Skyrim is an action role-playing video ' +
               'game developed by Bethesda Game Studios. Skyrim\'s main story revolves around the player character\'s efforts to defeat Alduin, a Dragon who is ' +
               'prophesied to destroy the world. Over the course of the game, the player completes quests and develops their character by improving their skills in a ' +
               'massive open world.', image: 'http://lifeasadigitalsalad.files.wordpress.com/2013/11/the_elder_scrolls_v_skyrim.jpg',
               desired_item: 'Assassin\'s Creed IV: Black Flag for PS3', console_id: 8, UserId: 4, AddressId: 4, CategoryId: 41},
            { title: 'Marvel Vs. Capcom 3', url: 'http://www.marvelvscapcom3.com/us', description: 'Marvel vs. Capcom 3 is a crossover fighting game developed ' +
               'by Capcom. Doctor Doom has assembled the greatest villains of the Marvel Universe and has joined forces with Albert Wesker in order to unite their ' +
               'respective universes in an effort to conquer both. However, this course of action awakens Galactus who could potentially destroy both worlds. It is up ' +
               'to the heroes of the Marvel and Capcom universes to put a stop to Galactus before it is too late.',
               image: 'http://operationrainfall.com/wp-content/uploads/2013/12/Marvel-vs-Capcom-3.jpg',
               desired_item: 'Halo 4 for Xbox 360', console_id: 4, UserId: 5, AddressId: 1, CategoryId: 12}
        ])
    });

    /* Insert starting demo users */
    var user = db.User.build({name: 'Alexander Anderson', email: 'skalex_989@hotmail.com', phone: '814-555-1234', username: 'aanderson', user_type: 'Individual', birth_date: "06-01-1992 00:00:00", gender: 'Male', income: 100000});

    user.salt = user.makeSalt();
    user.hashedPassword = user.encryptPassword('password', user.salt);
    user.save().success(function(){console.log('User Alexander Anderson created.')}).error(function(err){console.log('User creation failed.')});

    /* Adding addresses for this user */
    db['Address'].bulkCreate([
      { street: '123 Street', city: 'State College', state: 'PA', zip: '12345', UserId: 1},
      { street: '21 Jump Street', city: 'State College', state: 'PA', zip: '12345', UserId: 1 }
    ])

    /*  another demo user */
    var user2 = db.User.build({name: 'Alexis Anderson', email: 'skalex989@gmail.com', phone: '814-555-4321', username: 'skalex', user_type: 'Individual', birth_date: "05-01-1993 00:00:00", gender: 'Female', income: 90000});

    user2.salt = user2.makeSalt();
    user2.hashedPassword = user2.encryptPassword('password', user2.salt);
    user2.save().success(function(){console.log('User Alexis Anderson created.')}).error(function(err){console.log('User creation failed.')});

    /* Adding addresses for this user */
    db['Address'].bulkCreate([
      { street: '78 Ave', city: 'State College', state: 'PA', zip: '12345', UserId: 2}
    ])
    
    /*  another demo user */
    var user3 = db.User.build({name: 'Kunal Saddi', email: 'ksaddi@gmail.com', phone: '814-555-1432', username: 'ksaddi', user_type: 'Individual', birth_date: "04-01-1994 00:00:00", gender: 'Male', income: 80000});

    user3.salt = user3.makeSalt();
    user3.hashedPassword = user3.encryptPassword('password', user3.salt);
    user3.save().success(function(){console.log('User Kunal Saddi created.')}).error(function(err){console.log('User creation failed.')});

    /* Adding addresses for this user */
    db['Address'].bulkCreate([
      { street: '456 Drive', city: 'State College', state: 'PA', zip: '12345', UserId: 3 }
    ])
    
    /*  another demo user */
    var user4 = db.User.build({name: 'Marius Espejo', email: 'mespejo@gmail.com', phone: '814-555-3214', username: 'mespejo', user_type: 'Individual', birth_date: "03-01-1995 00:00:00", gender: 'Male', income: 70000});

    user4.salt = user4.makeSalt();
    user4.hashedPassword = user4.encryptPassword('password', user4.salt);
    user4.save().success(function(){console.log('User Marius Espejo created.')}).error(function(err){console.log('User creation failed.')});

    /* Adding addresses for this user */
    db['Address'].bulkCreate([
      { street: '56 Drive', city: 'State College', state: 'PA', zip: '12345', UserId: 4 }
    ])
    
    /*  another demo user */
    var user5 = db.User.build({name: 'Brandon Gift', email: 'bgift@gmail.com', phone: '814-555-3412', username: 'bgift', user_type: 'Individual', birth_date: "02-01-1996 00:00:00", gender: 'Male', income: 60000});

    user5.salt = user2.makeSalt();
    user5.hashedPassword = user5.encryptPassword('password', user5.salt);
    user5.save().success(function(){console.log('User Brandon Gift created.')}).error(function(err){console.log('User creation failed.')});

    /* Adding addresses for this user */
    db['Address'].bulkCreate([
      { street: '348 Blue Course', city: 'State College', state: 'PA', zip: '12345', UserId: 5 }
    ])
    
  });

// assign the sequelize variables to the db object and returning the db. 
module.exports = _.extend(
{
  sequelize: sequelize,
  Sequelize: Sequelize
}, db);