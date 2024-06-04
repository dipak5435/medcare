const { response } = require('express');
const diagnosed = require('../Models/diagnosed');
const mailSender = require('../utils/mailSender')
const user = require('../Models/user')
// const drugRec=require('../mail/drugRec');

async function drugRecommendation(req, res) {
    try {
        const { fDrug, sDrug, tDrug } = req.body;

        if (!fDrug && !sDrug && !tDrug) {
            return res.status(400).json({ message: "Please recommend at least one drug" });
        }

        const { appId } = req.params;

        if (!appId || appId.length !== 24) {
            return res.status(400).json({ message: "Invalid Diagnosed ID" });
        }

        const updateDrug = async (drug) => {
            if (drug !== undefined) {
                await diagnosed.findByIdAndUpdate(appId, { $push: { medicines: drug } });
            }
        };

        await updateDrug(fDrug);
        await updateDrug(sDrug);
        await updateDrug(tDrug);

        let email;
        let uname;

        try {
            const diagnosedObj = await diagnosed.findById(appId);
            if (!diagnosedObj) {
                return res.status(404).json({ message: "Diagnosed ID not found" });
            }

            const uid = diagnosedObj.userId;
            const userObj = await user.findById(uid);

            if (!userObj) {
                return res.status(404).json({ message: "User not found" });
            }

            email = userObj.userEmail;
            uname = userObj.userName;
        } catch (err) {
            console.error("Error fetching diagnosed or user:", err);
            return res.status(500).json({ message: "Error fetching diagnosed or user" });
        }

        const drugs = `${uname}, Drugs are ${fDrug}, ${sDrug}, ${tDrug}`;

        try {
            const mailRes = await mailSender(email, "Drug Email", drugs);
            console.log("Email sent successfully:", mailRes.response);

            res.status(200).json({ message: "Medicine recommendation sent!" });
        } catch (error) {
            console.error("Error sending email:", error);
            res.status(500).json({ message: "Error sending email" });
        }
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: "Sorry! There was a server-side error" });
    }
}

module.exports = drugRecommendation;
