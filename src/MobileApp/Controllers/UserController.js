import User from '../../Models/User';

/**
 * test
 * @param req body
 * return JSON
 */
const test = async(req, res) => {
    res.status(200).json({ msg:"Welcome to our application" });
}

export default { test }