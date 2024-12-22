import { DataTypes, Sequelize } from 'sequelize'

console.log('DB url ', process.env.DATABASE)
console.log('Current Directory:', process.cwd())

const sequelize = new Sequelize('ecommerce', 'learning', 'l3arn', {
  host: 'localhost',
  dialect: 'mysql',
  logging: console.log,
})

export const Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'customer',
  },
})

export const Employee = sequelize.define('Employee', {
  username: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'employee',
  },
})

sequelize
  .authenticate()
  .then(() => console.log('Database connected'))
  .catch((err) => console.log(err))
