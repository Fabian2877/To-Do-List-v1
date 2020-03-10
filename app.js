const express = require("express"); 
const app = express(); 
const bodyParser = require("body-parser"); 
const mongoose = require("mongoose")
const _ = require("lodash")
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true} )
mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');


const itemsSchema = new mongoose.Schema({
    name: String
});

const item = mongoose.model("item", itemsSchema);

const item1 = new item({
    name: "Do Homework"
})

const item2 = new item({
    name: "Get Money"
})

const item3 = new item({
    name: "Go to the gym"
})

const defaultItems = [item1, item2, item3]

const listSchema = new mongoose.Schema({
    name: String, 
    items: [itemsSchema]
})

const list = mongoose.model('list', listSchema)










app.get('/', function(req, res) {


    item.find({} , function(err, items) {
                if(items.length === 0) {
                    item.insertMany(defaultItems, function(err) {
            if(err) {
                console.log("There was an error")
            } else {
                console.log("Success! All items have been added to the database")
            }
        });
        res.redirect('/')
    } else  {
        res.render('index', {listTitle: "Today", newItems: items});

    }


    })
  


})

app.get('/:anyID', function(req, res) {
    let routeID = req.params.anyID; 
    routeID = _.upperFirst(routeID)

    list.findOne({name: routeID}, function(err, foundList) {
        if(!err) {
            if(!foundList) {
                console.log("Doesn't Exist")
                const List = new list({
                    name: routeID, 
                    items: defaultItems
                })
                List.save()
                console.log("Successfully created a new list item")
                res.redirect(`/${routeID}`)
            
            } else {
                console.log("Exists!")
                res.render('index', {listTitle: foundList.name, newItems: foundList.items} )
            }
        }
        

    })
});

    // list.findOne({name: routeID}, function(err, results) {
    //     if(routeID === results.name) {
    //         res.render('index', {listTitle:`${routeID}`, newItems: results.items})
    //     } else {
            // const List = new list({
            //     name: routeID, 
            //     items: defaultItems
            // })
        
    //         List.save()
    //         res.redirect(`/${routeID}`)

    //     }



app.post('/', function(req, res) {
    let newItem = new item({
        name: req.body.item
    })
     if(req.body.list === 'Today') {
        item.insertMany(newItem)
        res.redirect("/")
     } else {
         list.findOne({name: req.body.list}, function(err, foundList) {
             if(!err) {
                 foundList.items.push(newItem)
                 foundList.save();
                 res.redirect(`/${req.body.list}`)
             }
          
         })
     }
})



app.post('/delete', function(req, res) {
    const itemID = req.body.checkbox
    const listName = req.body.listName

    if(listName === "Today") {
        item.findByIdAndRemove(itemID, function(err) {
            if(!err) {
                console.log("Successfully deleted checked item from the ITEM collection")
                res.redirect('/')
            }
        })
    } else {
        list.findOneAndUpdate({name: listName}, {$pull: {items: {_id: itemID}}}, function(err) {
            if(!err) {
                res.redirect(`/${listName}`)
                console.log("You have successfully deleted checked item from the LIST collection")
            
               
            }
        })
    }



})


app.get('/about', function(req, res) {
    res.render('about')
});







app.listen(3000, function(req, res) {
    console.log(`Server is now running on port: 3000`)
})