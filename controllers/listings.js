const Listing=require("../models/listing");


module.exports.index=async (req,res)=>{
   const allListings=await Listing.find({});
   res.render("listings/index.ejs",{allListings});
};


module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs")
};

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({path:"reviews",
    populate:{
    path:"author"
    }})
    .populate("owner");
    if(!listing){
      req.flash("error","Listing you requested for does not exist!.")
      res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};


module.exports.createListing = async (req, res) => {
  try {
    const { location } = req.body.listing;

    // Geocoding using Nominatim
    const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`, {
      headers: {
        'User-Agent': 'wanderlust-app (your@email.com)'
      }
    });
    const geoData = await geoResponse.json();

    if (!geoData.length) {
      req.flash("error", "Location could not be geocoded.");
      return res.redirect("/listings/new");
    }

    const lat = parseFloat(geoData[0].lat);
    const lon = parseFloat(geoData[0].lon);

    // Construct new listing
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    if (req.file) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
    }

    newListing.geometry = {
      type: "Point",
      coordinates: [lon, lat] // [longitude, latitude]
    };

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");

  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong while creating the listing.");
    res.redirect("/listings/new");
  }
};

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
     if(!listing){
      req.flash("error","Listing you requested for does not exist!.")
      res.redirect("/listings");
    }

    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250")
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};

module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    let listing=await  Listing.findByIdAndUpdate(id,{...req.body.listing});
    
    if(typeof req.file !== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }

    req.flash("success","Listing Updated!")
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    let deleteListing=await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
     req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};