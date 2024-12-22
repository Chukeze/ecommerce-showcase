import { DataTypes, Sequelize } from 'sequelize'


const sequelize = new Sequelize('ecommerce', 'learning', 'l3arn', {
  host: 'localhost',
  dialect: 'mysql',
  logging: console.log,
})

sequelize
  .authenticate()
  .then(() => console.log('Database connected'))
  .catch((err) => console.log(err))

sequelize
  .sync({ force: false }) // Set force to true if you want to recreate the tables
  .then(() => console.log('Database synchronized'))
  .catch((err) => console.error('Error synchronizing database:', err))


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

