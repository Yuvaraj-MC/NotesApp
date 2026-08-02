const   handleLogout = async(req,res) =>{

    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(204) //no content
    res.clearCookie('jwt',{httpOnly:true, sameSite:'lax',secure:false})
    res.json({message:'Cookie cleared'})
}

module.exports = {handleLogout}