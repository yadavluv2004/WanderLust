const express= require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const ejsMate=require("ejs-mate");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, 'public')));
const MONGO_URL='mongodb://127.0.0.1:27017/wanderLust';

async function main(){
    await mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log("connection with database");
}).catch((err)=>{
console.log(err);
});

app.get("/",(req,res)=>{
    res.send("hi I am root");
});

//index route
app.get("/listings",async(req,res)=>{
    const alllisting=await Listing.find({});
    res.render("./listings/index.ejs",{alllisting});
});
//new
app.get("/listings/new",(req,res)=>{
    res.render("./listings/new.ejs");
    });

//show route
app.get("/listings/:id",async(req,res)=>{
  let {id}=req.params;
  const listing=await Listing.findById(id);
    res.render("./listings/show.ejs",{listing});
});

//create route
app.post("/listings", async (req, res) => {
    try {
        const newListing = new Listing(req.body.listing);
        newListing.image = {url: req.body.listing.image, filename: "listingimage"};
        await newListing.save();
        res.redirect("/listings");
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while saving the listing.");
    }
});
//edit listing
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    let editlisting=await Listing.findById(id);
    res.render("./listings/edit.ejs",{editlisting});
});

//update route
app.put("/listings/:id",async(req,res)=>{
    if (req.body.listing.image) {
        req.body.listing.image = {
            url: req.body.listing.image, 
            filename: "listingimage" 
        };
    }
   let {id}=req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect(`/listings/${id}`); 
});

//delete route
app.delete("/listings/:id",async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");

})
app.listen(8080,()=>{
    console.log("listening on port 8080");
})