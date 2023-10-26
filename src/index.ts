import express from 'express';
import { Router, Request, Response } from 'express';
import { Sequelize, Model, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

export class Todo extends Model {}

const app = express();
const PORT = process.env.PORT || 8000;

const sequelize = new Sequelize(`postgres://afnosuau:${process.env.DATABASE_URL}@stampy.db.elephantsql.com/afnosuau`, {
  dialect: 'postgres',
  protocol: 'postgres'
});

Todo.init({
  id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
  },
  task: {
      type: DataTypes.STRING,
      allowNull: false
  },
  completed: {
    type: DataTypes.BOOLEAN
  },
  notes: {
      type: DataTypes.STRING
  },
}, {
  sequelize,
  tableName: 'todos',
  timestamps: false 
});

app.use(express.json());
app.use(cors())

// get all todos
app.get('/alltodos', async (req, res) => {
  try {
    const todos = await Todo.findAll();
    res.json(todos);
  } catch (err) {
    console.error("Error fetching todos:", err);
    res.status(500).send("Internal Server Error");
  }
});
// add todos
app.post('/todos', async (req, res) => {
  try {
    const todo = await Todo.create(req.body);
    res.json(todo);
  } catch (err) {
    console.log("Error creating a todo:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.delete(`/todos/:id`, async (req, res) => {
  const todoId = req.params.id;

  try {
    await Todo.destroy({
      where: {
        id: todoId
      }
    });
    res.status(200).send(`Todo with ID: ${todoId} deleted successfully.`);
  } catch (err) {
    console.log("Error deleting the todo:", err);
    res.status(500).send("Internal Server Error");
  }
});
app.put(`/todos/:id`, async (req, res) => {
  const todoId = req.params.id;
  const { completed } = req.body;
  if (typeof completed !== 'boolean') {
    return res.status(400).send('Invalid value for completed.');
  }
  try {
    const [updatedRowCount] = await Todo.update({
      completed: completed,
    }, {
      where: { id: todoId }
    });

    if (updatedRowCount === 0) {
      return res.status(404).send(`Todo with ID: ${todoId} not found.`);
    }

    res.status(200).send(`Todo with ID: ${todoId} updated successfully.`);
  } catch (err) {
    console.log("Error updating the todo:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
