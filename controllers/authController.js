const bcrypt = require('bcryptjs');
const PrismaClient = require('@prisma/client').PrismaClient;
const prisma = new PrismaClient();


exports.getRegister = (_, res) => {
    res.render('auth/register', { title: 'Register' });  //view
};


exports.postRegister = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return res.status(400).render('auth/register', {
                title: 'Register',
                error: 'Email already in use.'
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: { name, email, password: hashedPassword }
        });

        res.redirect('/auth/login');
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('An error occurred during registration');
    }

};

exports.getLogin = (req, res) => {
    res.render('auth/login', { title: 'Login' });
};


exports.postLogin = async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(401).render('auth/login', {
            title: 'Login',
            error: 'Email Not Found.'
        });
    }

    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user.id;
        // req.session.name = user.name;
        // req.session.email = user.email;
        // req.session.js = "JS";
        return res.redirect('/');
    }
    res.redirect('/auth/login');
};


exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};