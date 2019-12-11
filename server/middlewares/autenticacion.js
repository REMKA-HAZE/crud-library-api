let verificaToken = (req, res, next) => {
    let token = req.get('token');

    console.log('entre al midd pero no te diste cuenta');
    next();
    /*    return res.status(200).json({
           token
       }); */
}
module.exports = {
    verificaToken
}