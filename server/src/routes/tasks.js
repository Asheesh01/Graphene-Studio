const { Router } = require('express');
const {
  getAllTasks,
  createTask,
  updateTask,
  toggleTask,
  reorderTasks,
  deleteTask,
} = require('../controllers/taskController');

const router = Router();

// NOTE: /reorder must be declared before /:id routes to prevent
// Express matching the literal string "reorder" as a dynamic :id param.
router.patch('/reorder', reorderTasks);

router.get('/',        getAllTasks);
router.post('/',       createTask);
router.put('/:id',     updateTask);
router.patch('/:id/toggle', toggleTask);
router.delete('/:id',  deleteTask);

module.exports = router;
