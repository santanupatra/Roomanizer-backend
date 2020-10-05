import ContactUs from '../../Models/ContactUs';


/**
 * listAllRoom
 * return JSON
 */

const listAll= async(req, res) => {
    // if(req.query.keyword == null || req.query.page == null){
    //     return res.status(400).send({ack:1, message:"Parameter missing..."})
    // }
   try {
       let keyword = req.query.keyword;
       let limit = 10;
       let page = req.query.page;
       var skip = (limit*page);
       const list = await ContactUs.find({
         
           isDeleted: false,
         
           $or: [
               { name: { $regex: keyword, $options: 'm' } }
           ]
       })
       .skip(skip)
       .limit(limit)
       .sort({ createdDate: 'DESC' });
       const listAll = await ContactUs.find({
          
           isDeleted: false,
           $or: [
               { name: { $regex: keyword, $options: 'm' } },
               { email: { $regex: keyword, $options: 'm' } }
           ]
       }).countDocuments();
       const AllData = {
           'list': list,
           'count': listAll,
           'limit': limit
       };
       res.status(200).json({data: AllData});
   } catch (err) {
       console.log("Error => ",err.message);
       res.status(500).json({msg:"Something went wrong."});
   }


}
export default { listAll}