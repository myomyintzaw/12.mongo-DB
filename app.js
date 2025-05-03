const express = require('express');
const app = express();
const path = require('path')
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const authRoutes = require('./routes/authRoute');
const postRoutes = require('./routes/postsRoute');
const indexRoutes = require('./routes/indexRoute');
const authMiddleware = require('./middlewares/authMiddleware');

require('dotenv').config();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));    //for photo img and css,js
app.use(session({
    secret: 'gddfsjwttew', 
    // secret: 'hello-mongo-prisma',      

    resave: false,       //at the time email or password  changing to save (true/false)
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname,'public')));

// app.use(session({secret:process.env.SECRET,resave:false,saveUninitialized:true}))

app.use(expressLayouts)

app.use((req, res, next) => {
    res.locals.userId = req.session.userId;  //important
    // res.locals.name = req.session.name;      //important
    // res.locals.email = req.session.email;    //important
    next();
});

app.use("/", indexRoutes);
app.use("/auth", authRoutes);
app.use("/posts", authMiddleware, postRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));


