import { Router } from 'express'
const router = Router()

/* GET all users. */
router.get('/', function (req, res) {
  res.send('Fetched all users')
})

/* POST a user. */
router.post('/', function (req, res) {
  res.send('Created a user')
})

/* PATCH a user. */
router.patch('/', function (req, res) {
  res.send('Updated a user')
})

/* DELETE a user. */
router.delete('/', function (req, res) {
  res.send('Deleted a user')
})

export default router
