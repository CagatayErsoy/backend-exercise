import express from 'express';
import { Sequelize, Model, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export class Todo extends Model {}

const app = express();
const PORT = 8000;

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

app.get('/alltodos', async (req, res) => {
  try {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    const todos = await Todo.findAll();
    res.json(todos);
  } catch (err) {
    console.error("Error fetching todos:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post('/todos', async (req, res) => {
  try {
    const todo = await Todo.create(req.body);
    res.json(todo);
  } catch (err) {
    console.log("Error creating a todo:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
