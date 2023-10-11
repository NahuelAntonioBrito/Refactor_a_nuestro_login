export const privateRoutes = ( req, res, next ) =>{
    if ( req.session.user ) return res.redirect('/profile')
    next()
}

export const publicRoutes = ( req, res, next ) =>{
    if ( !req.session.user ) return res.redirect('/')
    next()
}
