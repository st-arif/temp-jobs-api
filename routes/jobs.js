const express = require('express');
const router = express();

const { getAlljobs,
    getjob,
    createjob,
    updatejob,
    deletejob, } = require('../controllers/jobs');

router.route('/').post(createjob).get(getAlljobs)
router.route('/:id').get(getjob).delete(deletejob).patch(updatejob)

module.exports = router;