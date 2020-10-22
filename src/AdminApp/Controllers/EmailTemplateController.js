import EmailTemplate from '../../Models/EmailTemplate';

/**
 * createTemplate
 * Here add Email Template
 * return JSON
 */
const createTemplate = async(req, res) => {
    if (req.body.emailSubject == null || req.body.emailContent == null) {
        return res.status(400).json({ msg:"Parameter missing..." });
    }
    try {
        let allData = req.body;
        const addData = new EmailTemplate(allData).save();
        res.status(200).json({ msg:"EmailTemplate added successfully" });
    } catch (err) {
        console.log('Error => ',err.message)
        res.status(500).json({ msg:"Something went wrong" });
    }
}
/**
 * listTemplate
 * Here get email details
 * return JSON
 */
const listTemplate = async(req, res) => {
    if(req.params.emailId == null) {
        return res.status(400).json({ msg:"Parameter missing..." });
    }
    try {
        const emailData = await EmailTemplate.findById({ _id: req.params.emailId });
        res.status(200).json({ data:emailData });
    } catch (err) {
        console.log('Error => ',err.message)
        res.status(500).json({ msg:"Something went wrong" });
    }
}

/**
 * updateTemplate
 * Here update email details
 * return JSON
 */
const updateTemplate = async(req, res) => {
    if(req.params.emailId == null) {
        return res.status(400).json({ msg:"Parameter missing..." });
    }
    try {
        const editData = await EmailTemplate.findByIdAndUpdate(
            { _id: req.params.emailId },
            {
                $set: {
                    emailSubject: req.body.emailSubject,
                    emailContent: req.body.emailContent,
                    isActive: req.body.isActive
                }
            });
        res.status(200).json({ msg:"Email template updated successfully" });
    } catch (err) {
        console.log('Error => ',err.message)
        res.status(500).json({ msg:"Something went wrong" });
    }
}

/**
 * listTemplates
 * Here get all Email Template
 * return JSON
 */
const listTemplates = async(req, res) => {
    try {
        let keyword = req.query.keyword;
        let limit = 10;
        let page = req.query.page;
        var skip = (limit*page);
        const list = await EmailTemplate.find({ 
            isDeleted: false,
            $or: [
                // { name: { $regex: keyword, $options: 'm' } },
                { emailSubject: { $regex: keyword, $options: 'm' } }
            ]
        })
        .skip(skip)
        .limit(limit)
        .sort({ createdDate: 'DESC' });
        const listAll = await EmailTemplate.find({
            isDeleted: false,
            $or: [
                // { name: { $regex: keyword, $options: 'm' } },
                { emailSubject: { $regex: keyword, $options: 'm' } }
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

/**
 * deleteTemplate
 * Here delete Email Template
 * return JSON
 */
const deleteTemplate = async(req, res) => {
    if(req.params.emailId == null){
        return res.status(400).json({ msg:"Parameter missing..." })
    }
    try {
        const updateData = await EmailTemplate.findByIdAndUpdate(
            { _id: req.params.emailId },
            {
                $set: {
                    isDeleted: true
                }
            });
        res.status(200).json({ msg:"Email template has been deleted" });
    } catch (err) {
        console.log('Error => ',err.message)
        res.status(500).json({ msg:"Something went wrong" });
    }
}
export default { createTemplate, listTemplate, updateTemplate, listTemplates, deleteTemplate };