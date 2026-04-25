module.exports=[64328,(a,b,c)=>{b.exports=a.x("mongoose-8b99e611e7552af3",()=>require("mongoose-8b99e611e7552af3"))},38305,(a,b,c)=>{let d=a.r(64328),e=null;b.exports=async function(){if(e&&1===d.connection.readyState)return e;let a=await d.connect(process.env.MONGODB_URI,{serverSelectionTimeoutMS:5e3});return e=a,a}},39595,(a,b,c)=>{let d=a.r(64328),e=new d.Schema({client:{type:d.Schema.Types.ObjectId,ref:"User"},clientName:String,rating:{type:Number,min:1,max:5},comment:String,createdAt:{type:Date,default:Date.now}}),f=new d.Schema({user:{type:d.Schema.Types.ObjectId,ref:"User",required:!0},name:{type:String,required:!0},email:{type:String,required:!0},phone:String,photo:{type:String,default:""},barRegistrationNumber:{type:String,required:!0,unique:!0},specializations:[String],experience:{type:Number,required:!0},experienceLevel:{type:String,enum:["junior","mid","senior"],default:"junior"},city:{type:String,required:!0},state:{type:String,required:!0},courts:[String],consultationFee:{type:Number,required:!0},bio:String,languages:[String],isVerified:{type:Boolean,default:!1},isBlocked:{type:Boolean,default:!1},isAvailable:{type:Boolean,default:!0},reviews:[e],averageRating:{type:Number,default:0},totalReviews:{type:Number,default:0},totalCases:{type:Number,default:0},totalEarnings:{type:Number,default:0},subscription:{type:String,enum:["free","basic","pro","elite"],default:"free"},subscriptionExpiry:Date,subscriptionFeatures:{name:String,featured:{type:Boolean,default:!1},priority:{type:Boolean,default:!1},maxBookings:{type:Number,default:5}},createdAt:{type:Date,default:Date.now}});f.methods.updateRating=function(){if(!this.reviews.length){this.averageRating=0;return}let a=this.reviews.reduce((a,b)=>a+b.rating,0);this.averageRating=Math.round(a/this.reviews.length*10)/10,this.totalReviews=this.reviews.length},b.exports=d.models.Lawyer||d.model("Lawyer",f)},95536,a=>{"use strict";var b=a.i(79168),c=a.i(27068),d=a.i(32759),e=a.i(59292),f=a.i(963),g=a.i(38305),h=a.i(39595);let i="https://justice-junction-app.vercel.app";async function j({res:a}){try{var b;await (0,g.default)();let c=(b=await h.default.find({},"_id").lean(),`<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>${i}</loc>
     </url>
     <url>
       <loc>${i}/search</loc>
     </url>
     <url>
       <loc>${i}/about</loc>
     </url>
     <url>
       <loc>${i}/pricing</loc>
     </url>
     <url>
       <loc>${i}/lawyer-plans</loc>
     </url>
     <url>
       <loc>${i}/disclaimer</loc>
     </url>
     <url>
       <loc>${i}/privacy-policy</loc>
     </url>
     <url>
       <loc>${i}/register</loc>
     </url>
     <url>
       <loc>${i}/login</loc>
     </url>
     ${b.map(({_id:a})=>`
       <url>
           <loc>${i}/lawyer/${a}</loc>
       </url>
     `).join("")}
   </urlset>
 `);return a.setHeader("Content-Type","text/xml"),a.write(c),a.end(),{props:{}}}catch(b){return console.error(b),a.statusCode=500,a.end(),{props:{}}}}a.s(["default",0,function(){},"getServerSideProps",0,j],38974);var k=a.i(38974),l=a.i(9193);let m=(0,d.hoist)(k,"default"),n=(0,d.hoist)(k,"getStaticProps"),o=(0,d.hoist)(k,"getStaticPaths"),p=(0,d.hoist)(k,"getServerSideProps"),q=(0,d.hoist)(k,"config"),r=(0,d.hoist)(k,"reportWebVitals"),s=(0,d.hoist)(k,"unstable_getStaticProps"),t=(0,d.hoist)(k,"unstable_getStaticPaths"),u=(0,d.hoist)(k,"unstable_getStaticParams"),v=(0,d.hoist)(k,"unstable_getServerProps"),w=(0,d.hoist)(k,"unstable_getServerSideProps"),x=new b.PagesRouteModule({definition:{kind:c.RouteKind.PAGES,page:"/sitemap.xml",pathname:"/sitemap.xml",bundlePath:"",filename:""},distDir:".next",relativeProjectDir:"",components:{App:f.default,Document:e.default},userland:k}),y=(0,l.getHandler)({srcPage:"/sitemap.xml",config:q,userland:k,routeModule:x,getStaticPaths:o,getStaticProps:n,getServerSideProps:p});a.s(["config",0,q,"default",0,m,"getServerSideProps",0,p,"getStaticPaths",0,o,"getStaticProps",0,n,"handler",0,y,"reportWebVitals",0,r,"routeModule",0,x,"unstable_getServerProps",0,v,"unstable_getServerSideProps",0,w,"unstable_getStaticParams",0,u,"unstable_getStaticPaths",0,t,"unstable_getStaticProps",0,s],95536)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__0qufv6u._.js.map