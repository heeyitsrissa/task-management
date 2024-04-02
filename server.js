const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');
const authRouter = require('./controllers/api/userRoutes');
const passport = require('passport');
const taskRoutes = require('./controllers/api/taskRoutes');

// const fs = require('fs').promises;

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

const hbs = exphbs.create({ helpers });

const sess = {
    secret: 'Super secret secret',
    cookie: {
        maxAge: 300000,
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
    },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};


app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Handlebar helper.
hbs.handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());



app.use(routes);
app.use('/', authRouter);

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('🔥🔥🔥!(ON)'));
});
