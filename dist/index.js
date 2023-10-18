"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Todo = void 0;
const express_1 = __importDefault(require("express"));
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class Todo extends sequelize_1.Model {
}
exports.Todo = Todo;
const app = (0, express_1.default)();
const PORT = 8000;
const sequelize = new sequelize_1.Sequelize(`postgres://afnosuau:${process.env.DATABASE_URL}@stampy.db.elephantsql.com/afnosuau`, {
    dialect: 'postgres',
    protocol: 'postgres'
});
Todo.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    task: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    completed: {
        type: sequelize_1.DataTypes.BOOLEAN
    },
    notes: {
        type: sequelize_1.DataTypes.STRING
    },
}, {
    sequelize,
    tableName: 'todos',
    timestamps: false
});
app.use(express_1.default.json());
app.get('/alltodos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
        const todos = yield Todo.findAll();
        res.json(todos);
    }
    catch (err) {
        console.error("Error fetching todos:", err);
        res.status(500).send("Internal Server Error");
    }
}));
app.post('/todos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todo = yield Todo.create(req.body);
        res.json(todo);
    }
    catch (err) {
        console.log("Error creating a todo:", err);
        res.status(500).send("Internal Server Error");
    }
}));
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
