import { Router } from "express";
import passport from "passport";
const router = Router()

router.post('/register', passport.authenticate('register', {failureRedirect: '/session/failRegister'}), async(req, res) => {
    res.redirect('/')
})

router.get('/failRegister', (req, res) => res.send({ error: 'Passport register Failed'}))

router.post('/login', passport.authenticate('login', {failureRedirect: '/session/failLogin'}), async(req, res) => {
    if(!req.user){
        return res.status(400).send({ status:'error', error:'Invalid credentials'})
    }
    
    if(req.user.email === 'adminCoder@coder.com'){
        req.session.role = 'admin';
    } else {
        req.session.role = 'user';
    }

    req.session.user = {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        age: req.user.age,
        role: req.session.role
    }

    res.redirect('/products')
})

router.get('/failLogin', (req, res) => res.send({ error: 'Passport login Failed'}))

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err){
            console.log(err)
            res.status(500).render('errors/base', {error: err})
        } else res.redirect('/')
    })
})

router.get('/github', passport.authenticate('github', { scope: ['user: email']}), (reqe, res) => {

})

router.get('/githubcallback', passport.authenticate('github' , { failureRedirect: '/login'}), async( req, res) => {
    console.log('Callback: ', req.user )
    req.session.user = req.user
    res.redirect('/products')
})

export default router